#!/home/olk/local/python/bin/python3

import io
import sys
import config

from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from wsgiref.handlers import CGIHandler

from mongo import slack,client

app = Flask(__name__)

CORS(app)

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def delete_id(ret, objects, key):
    for object in objects:
        del object["_id"]
        ret[object[key]] = object
    return ret


def get_bots_from_mongo():
    bots = slack.bots.find()
    ret = {}
    ret = delete_id(ret, bots, "bot_id")
    return ret


def get_users_from_mongo():
    users = slack.users.find()
    ret = {}
    ret = delete_id(ret, users, "id")
    return ret


def get_channels_from_mongo():
    channels = slack.channels.find()
    ret = {}
    ret = delete_id(ret, channels, "id")
    return ret


def messages(params):
    limit = params.get("limit", 100)
    ts_direction = 1 if params.get("min_ts") else -1
    condition = {
        "hidden": {'$ne': True}
    }
    if params.get("min_ts"):
        condition["ts"] = {'$gte': params["min_ts"]}
    if params.get("max_ts"):
        condition["ts"] = {'$lte': params["max_ts"]}
    if params.get("channel"):
        condition["channel"] = params["channel"]
    if params.get("search"):
        condition['$or'] = [
            # normal message
            {"text": {"$regex": ".*{}.*".format(params["search"])}},
            # bot message
            {
                "attachments": {
                    '$elemMatch': {"$regex": ".*{}.*".format(params["search"])}
                },
                "subtype": 'bot_message'
            }
        ]
    has_more_message = slack.messages.count_documents(
        condition) > limit
    all_messages = slack.messages.find(condition).sort("ts", ts_direction)
    return_messages = list(all_messages.limit(limit))
    if ts_direction == -1:
        return_messages = return_messages[::-1]
    for i in range(len(return_messages)):
        del return_messages[i]["_id"]
    return return_messages, has_more_message

@app.route("/")
def index():
    return "Hello"

@app.route("/a")
def index2():
    return "Helloa"


@ app.route('/bots.json')
def get_bots():
    bots = get_bots_from_mongo()
    return jsonify(bots)


@ app.route('/users.json')
def get_users():
    users = get_users_from_mongo()
    return jsonify(users)


@ app.route('/channels.json')
def get_channels():
    channels = get_channels_from_mongo()
    return jsonify(channels)


@ app.route('/ims.json')
def get_ims():
    return jsonify({})


@ app.route('/messages/<string:channel>.json', methods=["POST"])
def get_messages_chnnel(channel):
    max_ts = request.form.get("max_ts")
    min_ts = request.form.get("min_ts")
    params = {}
    if max_ts:
        params["max_ts"] = max_ts
    if min_ts:
        params["min_ts"] = min_ts
    if channel != "all":
        params["channel"] = channel
    all_messages, has_more_message = messages(params)
    all_messages = [message for message in all_messages if message["ts"]
                    != max_ts and message["ts"] != min_ts]
    ret = {
        "messages": all_messages,
        "has_more_message": has_more_message
    }
    return jsonify(ret)


@ app.route('/around_messages/<string:channel>.json', methods=["POST"])
def get_around_messages(channel):
    past_messages, has_more_past_message = messages({"channel": channel,
                                                     "max_ts": request.form.get("ts"),
                                                     "limit": 50}
                                                    )
    future_messages, has_more_future_message = messages({"channel": channel,
                                                         "min_ts": request.form.get("ts"),
                                                         "limit": 50}
                                                        )
    all_messages = (past_messages + future_messages)

    def get_unique_list(seq):
        seen = []
        return [x for x in seq if x["ts"] not in seen and not seen.append(x["ts"])]

    all_messages = get_unique_list(all_messages)
    ret = {
        "messages": all_messages,
        "has_more_past_message": has_more_past_message,
        "has_more_future_message": has_more_future_message
    }
    return jsonify(ret)


@ app.route('/search', methods=["POST"])
def search():
    all_messages, has_more_message = messages({
        "search": request.form.get("word"),
        "max_ts": request.form.get("max_ts"),
        "min_ts": request.form.get("min_ts")})
    # all_messages = all_messages.select { | m | m[:ts] != params[:max_ts] & & m[:ts] != params[:min_ts] }

    all_messages = [x for x in all_messages if x["ts"] != request.form.get(
        "max_ts") and x["ts"] != request.form.get("min_ts")]

    ret = {
        "messages": all_messages,
        "has_more_message": has_more_message
    }
    return jsonify(ret)


@ app.route('/time', methods=["POST"])
def time():
    past_messages, has_more_past_message = messages({
        "max_ts": request.form.get("ts"),
        "limit": 50}
    )
    future_messages, has_more_future_message = messages({
        "min_ts": request.form.get("ts"),
        "limit": 50}
    )
    all_messages = (past_messages + future_messages)

    def get_unique_list(seq):
        seen = []
        return [x for x in seq if x["ts"] not in seen and not seen.append(x["ts"])]

    all_messages = get_unique_list(all_messages)
    ret = {
        "messages": all_messages,
        "has_more_past_message": has_more_past_message,
        "has_more_future_message": has_more_future_message
    }
    return jsonify(ret)


@ app.route("/team.json")
def get_team():
    team = {
        'name': config.workspace_name,
        "domain": config.workspace_domain
    }
    return jsonify(team)


# app.run()
CGIHandler().run(app)

client.close()


# https://qiita.com/ninoko1995/items/8b01fd02bada3a2fa794