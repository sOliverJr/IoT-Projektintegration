from database.database_connector import *
from hash.sha256 import *

app_handler = AppHandler()

device = {
    'device_id': '1',
    'device_pwd': 'pwd',
    'device_hash': 'hash',
    'device_cassette': None
}

test_device = {
    'device_id': '1',
    'device_pwd': 'pwd',
    'device_hash': 'hash',
    'device_cassette': None
}

# app_handler.add_device(device)
# print(app_handler.auth_app(test_device['device_id'], test_device['device_pwd']))
# print(app_handler.change_device_cassette('cassette_1', test_device['device_id'], test_device['device_hash']))
# print(hash_sha256_string('anderer Test'))

