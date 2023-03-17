import config
from logger import logger
from mongo import slack
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

client = WebClient(token=config.API_TOKEN)


# メンバーを取得して追加する。もし同じidの人がいたら更新。
# botだった場合はbot_idをfieldに追加してbotsの一蘭に追加


def get_members():
    return client.users_list()["members"]


def get_emojis():
    return client.emoji_list()["emoji"]

def get_channels(cursor=None):
    res = client.conversations_list(cursor=cursor)
    return res["channels"], res["response_metadata"]["next_cursor"]


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

def update_emojis():
    emojis = get_emojis()
    for name,url in emojis.items():
        update = slack.emojis.find_one_and_replace(
            {"name": name}, {"name": name, "url": url}, upsert=True)


def denormalize_message(message):
    reactoins_after = []
    if message.get("reactions"):
        reactions = message["reactions"]
        for reaction in reactions:
            if reaction.get("user"):
                reactoins_after.append(
                    [{"name":reaction["name"] ,
                       "user":reaction["user"]}]
                )
            elif reaction.get("users"):
                for user in reaction["users"]:
                    reactoins_after.append(
                        [{"name":reaction["name"],
                           "user":user}]
                    )
        message["reactions"] = reactoins_after
    return message

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
        update = slack.channels.find_one_and_replace({"id": channelId}, channel, upsert=True)
        members = get_channel_members(channelId)
        update = slack.channels.update_one({"id": channelId}, {"$set": {"members": members.data["members"]}})
        messages = get_channel_messages(channelId, limit=1000)
        update_messages(messages, channelId)
    except SlackApiError as e:
        logger.error("Error creating conversation: {}".format(e))


def update_channels(channels):
    for channel in channels:
        update_channel(channel)

def insert_message(message, channelId):
    message["channel"] = channelId
    ts = message["ts"]
    message = denormalize_message(message)
    update = slack.messages.update_one(
            {"id": ts}, {"$set": message})

def update_message(message, channelId):
    insert_message(message, channelId)
    if message.get("thread_ts") and message.get("reply_count"):
        replies = get_replies(channelId, message["thread_ts"])
        update_reply_messages(replies.data["messages"], channelId)

def update_messages(messages, channelId):
    for message in messages:
        update_message(message, channelId)

def update_reply_messages(reply_messages, channelId):
    for reply_message in reply_messages:
        insert_message(reply_message, channelId)

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
