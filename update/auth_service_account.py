from googleapiclient.discovery import build
from google.oauth2 import service_account
# from googleapiclient.http import MediaFileUpload
from googleapiclient.http import MediaIoBaseUpload
import os
import config
SCOPES = ['https://www.googleapis.com/auth/drive']
SHARE_FOLDER_ID = config.SHARE_FOLDER_ID
DEFAULT_CHUNK_SIZE = 100 * 1024 * 1024

MAX_URI_LENGTH = 2048

MAX_BATCH_LIMIT = 1000

DEFAULT_HTTP_TIMEOUT_SEC = 60
base = os.path.dirname(__file__)
filepath = "secret/smiling-castle-329613-d8b3c7dc9929.json"
filepath = os.path.join(base, filepath)


def get_authenticated_service():
    sa_creds = service_account.Credentials.from_service_account_file(filepath)
    scoped_creds = sa_creds.with_scopes(SCOPES)
    return build('drive', 'v3', credentials=scoped_creds)


class MediaFileUpload(MediaIoBaseUpload):
    """A MediaUpload for a file.

    Construct a MediaFileUpload and pass as the media_body parameter of the
    method. For example, if we had a service that allowed uploading images:

      media = MediaFileUpload('cow.png', mimetype='image/png',
        chunksize=1024*1024, resumable=True)
      farm.animals().insert(
          id='cow',
          name='cow.png',
          media_body=media).execute()

    Depending on the platform you are working on, you may pass -1 as the
    chunksize, which indicates that the entire file should be uploaded in a single
    request. If the underlying platform supports streams, such as Python 2.6 or
    later, then this can be very efficient as it avoids multiple connections, and
    also avoids loading the entire file into memory before sending it. Note that
    Google App Engine has a 5MB limit on request size, so you should never set
    your chunksize larger than 5MB, or to -1.
    """

    def __init__(
            self, filename,  mimetype, fd=None,
            chunksize=DEFAULT_CHUNK_SIZE, resumable=False):
        """Constructor.

        Args:
          filename: string, Name of the file.
          mimetype: string, Mime-type of the file. If None then a mime-type will be
            guessed from the file extension.
          chunksize: int, File will be uploaded in chunks of this many bytes. Only
            used if resumable=True. Pass in a value of -1 if the file is to be
            uploaded in a single chunk. Note that Google App Engine has a 5MB limit
            on request size, so you should never set your chunksize larger than 5MB,
            or to -1.
          resumable: bool, True if this is a resumable upload. False means upload
            in a single request.
        """
        self._filename = filename
        self._fd = fd
        if self._fd is None:
            self._fd = os.open(self._filename, "rb")

        super(MediaFileUpload, self).__init__(
            self._fd, mimetype, chunksize=chunksize, resumable=resumable
        )

    def __del__(self):
        if self._fd:
            self._fd.close()


def list_drive_files(service, **kwargs):
    results = service.files().list(**kwargs).execute()
    return results


def upload_file(service, local_file, fd=None, remote_folder_id='root',
                mimetype='text/plain'):
    media = MediaFileUpload(local_file, mimetype=mimetype, fd=fd)
    file = service.files().create(body={'name': os.path.basename(local_file),
                                        'parents': [remote_folder_id]},
                                  media_body=media,
                                  fields='id').execute()
    print(f'File ID: {file.get("id")}')
    return file


# 指定フォルダにファイルをアップロード
def get_drive_folder_id(service, folder_path):
    """指定パスフォルダのfileIdを取得"""
    parent_id = 'root'
    for name in folder_path:
        res = list_drive_files(service,
                               q=f"'{parent_id}' in parents and "
                               "mimeType = 'application/vnd.google-apps.folder' and "
                               f"name = '{name}'")
        if 'files' not in res or len(res['files']) < 1:
            return None
        parent_id = res['files'][0]['id']

    return parent_id


if __name__ == "__main__":
    service = get_authenticated_service()

    response = service.files().list(
        supportsAllDrives=True,
        includeItemsFromAllDrives=True,
        q=f"parents in '{SHARE_FOLDER_ID}' and trashed = false",
        fields="nextPageToken, files(id, name)").execute()
    for file in response.get('files', []):
        print(f"Found file: {file.get('name')} ({file.get('id')})")
    SHARE_FOLDER_ID = get_drive_folder_id(service, ["test"])
    media = MediaFileUpload("./auth.py")
    file = service.files().create(body={'name': "auth.py",
                                        'parents': [SHARE_FOLDER_ID]},
                                  media_body=media,
                                  fields='id').execute()
