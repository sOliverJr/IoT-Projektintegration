from database.database_connector import *
from hash.sha256 import *


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

print(device_handler.add_device(device))


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

print(cassette_handler.add_cassette(cassette))
