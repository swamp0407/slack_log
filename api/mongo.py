from pymongo import MongoClient

import config

MONGO_URL = config.MONGO_URL


client = MongoClient(MONGO_URL)
slack = client.slack


def update_collenction_one(collection, filter, update):
    collection.update_one(filter, update)


if __name__ == '__main__':
    slack = client.slack
    messages = slack.messages.find()
    a = ["a", "i", "u"]
    slack.bots.update_one(
        {"name": "slackanonymous"}, {"$set": {"google_drive_urls": a}})
