from database.database_connector import *
from hash.sha256 import *
from datetime import datetime
import time

# ------------------ Devices ------------------ #
device_handler = DeviceHandler()

device_id = 'device_1'
device_pwd = 'pwd'
device_hash = hash_sha256_string(device_id + device_pwd)
device_cassette = None

device = {
    'device_id': device_id,
    'device_pwd': device_pwd,
    'device_hash': device_hash,
    'device_cassette': device_cassette
}

# ------------------ Cassettes ------------------ #
cassette_handler = CassetteHandler()

cassette_id = 'cassette_1'
einnahme_frequenz = 1
einnahme_uhrzeiten = [800, 1230, 1890]

cassette = {
    'cassette_id': cassette_id,
    'einnahme_frequenz': einnahme_frequenz,
    'einnahme_uhrzeiten': einnahme_uhrzeiten
}

# print(cassette_handler.add_cassette(cassette))
# print(device_handler.add_device(device))

# print(device_handler.auth_app(test_device['device_id'], test_device['device_pwd']))
# print(device_handler.change_device_cassette('cassette_1', test_device['device_id'], test_device['device_hash']))
# print(hash_sha256_string('anderer Test'))

# print(device_handler.change_device_cassette('cassette_1', device_id, device_hash))

time_past = datetime.now()
time.sleep(5)
time_now = datetime.now()

delta_time = time_now - time_past
print(delta_time.seconds)
print(delta_time.seconds / 60)
print(int(delta_time.seconds / 60))
