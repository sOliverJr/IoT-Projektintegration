from pprint import pprint
import requests
from dotenv import load_dotenv
import os

load_dotenv()


def get_device_cassette(device_id, device_hash):
    headers = {
        "device_id": device_id,
        "device_hash": device_hash
    }
    return requests.get(os.getenv('PROTOCOL') + "://" + os.getenv('BACKEND_URL') + ":" + os.getenv('API_PORT') + "/cassette", headers=headers).json()


# pprint(get_device_cassette('device_1', 'fade29668f8d2aa09932593c91e59fe57b900d14653c535222894375d00ab4ce'))
# pprint(get_device_cassette('device_2', '9138dec9ce6eda05ca6e019763d2d2c0adeebc25136a0302617ba18bcad099b2'))
