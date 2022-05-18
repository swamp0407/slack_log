from pymongo import MongoClient

import config

MONGO_URL = config.MONGO_URL


client = MongoClient(MONGO_URL)
slack = client.slack


def update_collenction_one(collection, filter, update):
    collection.update_one(filter, update)


def delete_collection_fileds(collection, update):
    """
    update = {"$unset": {"google_drive_urls": "","file_url":""}}
    collection = slack.messages
    delete_collection_fileds(collection,update)
    """
    collection.update_many({}, update)


def find_one(collection, filter):
    """
    oldmessage = slack.messages.find_one({"ts": message["ts"]})
    """
    return collection.find_one(filter)


def find_and_replace(collection, filter, update):
    """
    update = slack.users.find_one_and_replace(
        {"id": member["id"]}, member, upsert=True)
        upsert = True なければ追加
    """
    collection.find_one_and_replace(filter, update, upsert=True)


if __name__ == '__main__':
    slack = client.slack
    messages = slack.messages.find()
    a = ["a", "i", "u"]
    slack.bots.update_one(
        {"name": "slackanonymous"}, {"$set": {"google_drive_urls": a}})
