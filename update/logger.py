from logging import getLogger, StreamHandler, DEBUG, Formatter
from logging.handlers import RotatingFileHandler
import os

if not os.path.exists("log"):
    os.mkdir("log")
formatter = Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger = getLogger("mongo")
streamhandler = StreamHandler()
streamhandler.setLevel(DEBUG)
streamhandler.setFormatter(formatter)
filehandler = RotatingFileHandler(
    "log/log.txt", maxBytes=100000, backupCount=10)
filehandler.setLevel(DEBUG)
filehandler.setFormatter(formatter)
logger.setLevel(DEBUG)
logger.addHandler(filehandler)
logger.addHandler(streamhandler)
logger.propagate = False

logger.debug('hello')
