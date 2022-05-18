import requests

import io
from mongo import update_collenction_one, slack
from logger import logger
import config
from auth_service_account import get_authenticated_service, upload_file, get_drive_folder_id
import io,sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def download_file(url, headers=None):
    r = requests.post(url, headers=headers)
    return r.content


def readbytes(url):
    f = io.BytesIO()
    f.write(download_file(url, headers))
    f.seek(0)
    return f

logger.debug("upload_file start")


API_TOKEN = config.API_TOKEN
headers = {
    'Authorization': 'Bearer ' + API_TOKEN
}
service = get_authenticated_service()
# upload_folder_id = get_drive_folder_id(service, ['SlackFileLogs'])
upload_folder_id = "1EmjqPT_N4Ia62wDN5CIrHgeZfCjO01QR"


def get_allmessages(collections):
    return collections.find()


messages = get_allmessages(slack.messages)

for message in messages:
    if message.get("files") and not message.get("upload_files"):
        files = message["files"]
        upload_files = []
        for file in files:
            if file.get("url_private"):
                try:
                    title = file.get("title")
                    mimetype = file.get("mimetype")
                    url = file.get("url_private")
                    fd = readbytes(url)
                    file_uploaded = upload_file(
                        service, title, fd=fd,
                        remote_folder_id=upload_folder_id, mimetype=mimetype)
    #                 service.files().create(body={'name': "auth.py",
    # #                                     'parents': [SHARE_FOLDER_ID]},
    # #                               media_body=media,
    # #                               fields='id').execute()
                    id = file_uploaded.get("id")
                    upload_url = f"https://drive.google.com/uc?id={id}"
                    print(title, upload_url)
                    upload_file_data = {
                        "title": title,
                        "mimetype": mimetype,
                        "url": upload_url,
                    }
                    upload_files.append(upload_file_data)

                except Exception as e:
                    logger.debug(
                        "file have not title or mimetype or url error = ", e)
        id = message["_id"]
        filter = {"_id": id}
        update = {"$set": {"upload_files": upload_files}}
        update_collenction_one(slack.messages, filter, update)

logger.debug("upload_file end")


if __name__ == "__main__":
    # url = ""
    # readbytes(url)
    pass
