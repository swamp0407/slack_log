from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

import config
from logger import logger
from mongo import slack

client = WebClient(token=config.API_TOKEN)


# メンバーを取得して追加する。もし同じidの人がいたら更新。
# botだった場合はbot_idをfieldに追加してbotsの一蘭に追加


def get_members():
    return client.users_list()["members"]


def get_channels(cursor=None):
    res = client.conversations_list(cursor=cursor)
    return res["channels"], res["metadata"]["next_cursor"]


def get_channel_members(channelId):
    return client.conversations_members(channel=channelId)


def get_channel_messages(channelId, limit=1000):
    return client.conversations_history(
        channel=channelId, limit=limit)["messages"]


def get_replies(channelId, ts):
    return client.conversations_replies(
        channel=channelId, ts=ts)

# メンバーを取得して更新
# botだったらbotsにもいれる


def update_members():
    members = get_members()
    for member in members:
        update = slack.users.find_one_and_replace(
            {"id": member["id"]}, member, upsert=True)
        if member["is_bot"]:
            member["bot_id"] = member['profile']['bot_id']
            slack.bots.find_one_and_replace(
                {"id": member["id"]}, member, upsert=True)


# チャンネルを新たに取得して更新(アーカイブ済みのは取得されないと思うけど分からない)
# 各チャンネルのメンバー一覧のfieldを追加
# 各チャンネルのメッセージ一覧を(1000個まで)取得
# もしfilesのfieldがあったら元のメッセージのupload_urlsをfieldに追加(元のファイルを消したときに対応できてないかもしれない)
# スレッドの場合はthread_tsのfieldがあるからあった場合はスレッドを取得し上と同様にupload_urls を処理


def retain_files(newmessage, oldmessage, ts):
    if newmessage.get("files"):
        oldmessage = slack.messages.find_one({"ts": ts})
        if oldmessage and oldmessage.get("upload_files"):
            newmessage["upload_files"] = oldmessage["upload_files"]
    return newmessage


def update_channel(channel):
    try:
        channelId = channel["id"]
        update = slack.channels.find_one_and_replace(
            {"id": channelId}, channel, upsert=True)

        members = get_channel_members(channelId)
        update = slack.channels.update_one(
            {"id": channelId}, {"$set": {"members": members.data["members"]}})
        messages = get_channel_messages(channelId, limit=1000)
        update_messages(messages, channelId)
    except SlackApiError as e:
        logger.error("Error creating conversation: {}".format(e))


def update_channels(channels):
    for channel in channels:
        update_channel(channel)


def update_message(message, channelId):
    message["channel"] = channelId
    ts = message["ts"]
    if message.get("files"):
        oldmessage = slack.messages.find_one({"ts": ts})
        message = retain_files(message, oldmessage, ts)
    update = slack.messages.find_one_and_replace(
        {"ts": ts}, message, upsert=True)
    if message.get("thread_ts") and message.get("reply_count"):
        replies = get_replies(channelId, message["thread_ts"])
        update_replies(replies.data["messages"], channelId)


def update_messages(messages, channelId):
    for message in messages:
        update_message(message, channelId)


def update_reply(reply, channelId):
    reply["channel"] = channelId
    ts = reply["ts"]
    if reply.get("files"):
        oldreply = slack.messages.find_one({"ts": ts})
        reply = retain_files(reply, oldreply, ts)
    update = slack.messages.find_one_and_replace(
        {"ts": ts}, reply, upsert=True)


def update_replies(replies, channelId):
    for reply in replies:
        update_reply(reply, channelId)


if __name__ == '__main__':
    logger.debug("message_logging start")
    update_members()
    channels, cursor = get_channels()
    while cursor != "":
        update_channels(channels)
        channels, cursor = get_channels(cursor=cursor)
    update_channels(channels)

    print(config.API_TOKEN)
    logger.debug("message_logging end")
