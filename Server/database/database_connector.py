import pymongo


class AppHandler:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:5001/")
        self.backend_db = self.client["BACKEND_DB"]
        self.user_collection = self.backend_db['devices']

    def test_connection(self):
        print(self.client.list_database_names())

    def add_device(self, item):
        self.user_collection.insert_one(item)

    def auth_app(self, device_id, device_pwd):
        query = {'device_id': device_id}
        device = self.user_collection.find_one(query, {'_id': 0})
        if device is None:
            return 'No device with that ID'
        elif device['device_pwd'] == device_pwd:
            return device['device_hash']
        else:
            return 'ID and password do not match'

    def change_device_cassette(self, cassette_id, device_id, device_hash):
        query = {'device_id': device_id}
        device = self.user_collection.find_one(query, {'_id': 0})
        if device is None:
            return 'No device with that ID'
        elif device['device_hash'] == device_hash:
            device['device_cassette'] = cassette_id
            updated_device = {"$set": device}
            self.user_collection.update_one(query, updated_device)
            return True
        else:
            return 'ID and hash do not match'
