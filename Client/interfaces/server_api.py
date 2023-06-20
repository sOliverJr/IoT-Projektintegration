from pprint import pprint
import requests
from dotenv import load_dotenv
import os


load_dotenv()


def get_device_cassette(device_id, device_hash):
    headers = {
        "deviceHash": device_hash
    }
    return requests.get(os.getenv('PROTOCOL') + "://" + os.getenv('BACKEND_URL') + ":" + os.getenv('API_PORT') + "/cassette/" + device_id, headers=headers).json()


def post_intake_message(device_id, device_hash, intake_should_time, intake_is_time, time_stamp):
    headers = {
        "deviceHash": device_hash
    }
    body = {
        "shouldTime": intake_should_time,
        "isTime": intake_is_time,
        "timeStamp": time_stamp
    }
    return requests.post(os.getenv('PROTOCOL') + "://" + os.getenv('BACKEND_URL') + ":" + os.getenv('API_PORT') + "/message/" + device_id, headers=headers, json=body).json()


# pprint(get_device_cassette('device_1', 'fade29668f8d2aa09932593c91e59fe57b900d14653c535222894375d00ab4ce'))
# pprint(get_device_cassette('device_2', '9138dec9ce6eda05ca6e019763d2d2c0adeebc25136a0302617ba18bcad099b2'))
# pprint(post_intake_message('device_1', 'fade29668f8d2aa09932593c91e59fe57b900d14653c535222894375d00ab4ce', 1200, 1300, 19062023))
