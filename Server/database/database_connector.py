import pymongo


class DeviceHandler:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:5001/")
        self.backend_db = self.client["BACKEND_DB"]
        self.device_collection = self.backend_db['devices']
        self.cassette_collection = self.backend_db['cassettes']

    def test_connection(self):
        return self.client.list_database_names()

    def add_device(self, item):
        query = {'device_id': item['device_id']}
        if self.device_collection.find_one(query, {'_id': 0}) is None:
            self.device_collection.insert_one(item)
            return 'Device added successfully'
        else:
            return 'Device-ID already exists'

    def auth_app(self, device_id, device_pwd):
        query = {'device_id': device_id}
        device = self.device_collection.find_one(query, {'_id': 0})
        if device is None:
            return False, 'No device with that ID'
        elif device['device_pwd'] == device_pwd:
            return True, device['device_hash']
        else:
            return False, 'ID and password do not match'

    def change_device_cassette(self, cassette_id, device_id, device_hash):
        query = {'device_id': device_id}
        device = self.device_collection.find_one(query, {'_id': 0})
        if device is None:
            return 'No device with that ID'
        elif device['device_hash'] == device_hash:
            if self.cassette_exists(cassette_id) and not self.cassette_already_allocated(cassette_id):
                device['device_cassette'] = cassette_id
                updated_device = {"$set": device}
                self.device_collection.update_one(query, updated_device)
                return True
            else:
                return 'Cassette does not exist or is already used by different device'
        else:
            return 'ID and hash do not match'

    def cassette_exists(self, cassette_id):
        """Tests if cassette exists"""
        query = {'cassette_id': cassette_id}
        if self.cassette_collection.find_one(query, {'_id': 0}) is None:
            return False
        else:
            return True

    def cassette_already_allocated(self, cassette_id):
        """Tests if cassette is already used by device"""
        query = {'device_cassette': cassette_id}
        if self.device_collection.find_one(query, {'_id': 0}) is None:
            return False
        else:
            return True


class CassetteHandler:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:5001/")
        self.backend_db = self.client["BACKEND_DB"]
        self.cassette_collection = self.backend_db['cassettes']

    def test_connection(self):
        return self.client.list_database_names()

    def add_cassette(self, item):
        query = {'cassette_id': item['cassette_id']}
        if self.cassette_collection.find_one(query, {'_id': 0}) is None:
            self.cassette_collection.insert_one(item)
            return 'Cassette added successfully'
        else:
            return 'Cassette-ID already exists'

    def update_cassette(self, cassette_id, new_cassette):
        query = {'cassette_id': cassette_id}
        cassette = self.cassette_collection.find_one(query, {'_id': 0})
        if cassette is None:
            return 'No device with that ID'
        else:
            updated_cassette = {"$set": new_cassette}
            self.cassette_collection.update_one(query, updated_cassette)
            return True
