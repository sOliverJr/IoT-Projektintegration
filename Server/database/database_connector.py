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
        """Changes the cassette of device in the database"""
        query = {'device_id': device_id}
        device = self.device_collection.find_one(query, {'_id': 0})
        if device is None:
            return False, 'No device with that ID'
        elif device['device_hash'] == device_hash:
            if self._cassette_exists(cassette_id) and not self._cassette_already_allocated(cassette_id):
                if self._cassette_user_and_device_user_match(cassette_id, device['device_user']):
                    device['device_cassette'] = cassette_id
                    updated_device = {"$set": device}
                    self.device_collection.update_one(query, updated_device)
                    return True, 'Success'
                else:
                    return False, 'Device-user and cassette-user do not match'
            else:
                return False, 'Cassette does not exist or is already used by different device'
        else:
            return False, 'ID and hash do not match'

    def _cassette_exists(self, cassette_id):
        """Tests if cassette exists"""
        query = {'cassette_id': cassette_id}
        if self.cassette_collection.find_one(query, {'_id': 0}) is None:
            return False
        else:
            return True

    def _cassette_already_allocated(self, cassette_id):
        """Tests if cassette is already used by device"""
        query = {'device_cassette': cassette_id}
        if self.device_collection.find_one(query, {'_id': 0}) is None:
            return False
        else:
            return True

    def _cassette_user_and_device_user_match(self, cassette_id, device_user_name):
        """Tests if cassette-user and device_user match"""
        query = {'cassette_id': cassette_id}
        if self.cassette_collection.find_one(query, {'_id': 0})['user_name'] == device_user_name:
            return True
        else:
            return False

    def get_device_cassette(self, device_id, device_hash):
        """Returns cassette object of device"""
        query = {'device_id': device_id}
        device = self.device_collection.find_one(query, {'_id': 0})
        if device is None:
            return False, 'No device with that ID'
        elif device['device_hash'] != device_hash:      # Authenticate request
            return False, 'Device ID and hash do not match'
        elif device['device_cassette'] is None:
            return False, 'Device does not have an assigned cassette'
        else:
            query = {'cassette_id': device['device_cassette']}
            cassette = self.cassette_collection.find_one(query, {'_id': 0})
            if cassette is None:
                return False, 'Cassette does not exist'
            else:
                return True, cassette

    def get_device_user(self, device_id, device_hash):
        query = {'device_id': device_id}
        device = self.device_collection.find_one(query, {'_id': 0})
        if device is None:
            return False, 'No device with that ID'
        elif device['device_hash'] != device_hash:      # Authenticate request
            return False, 'Device ID and hash do not match'
        elif device['device_user'] is None:
            return False, 'Device does not have an assigned user'
        else:
            return True, device['device_user']


class CassetteHandler:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:5001/")
        self.backend_db = self.client["BACKEND_DB"]
        self.cassette_collection = self.backend_db['cassettes']
        self.user_collection = self.backend_db['users']
        self.user_handler = UserHandler()

    def test_connection(self):
        return self.client.list_database_names()

    def add_cassette(self, item):
        query = {'cassette_id': item['cassette_id']}
        if self.cassette_collection.find_one(query, {'_id': 0}) is None:
            self.cassette_collection.insert_one(item)
            return 'Cassette added successfully'
        else:
            return 'Cassette-ID already exists'

    def update_cassette(self, cassette_id, user_name, new_cassette):
        query = {'cassette_id': cassette_id}
        cassette = self.cassette_collection.find_one(query, {'_id': 0})
        user = self.user_collection.find_one({'user_name': user_name}, {'_id': 0})
        if cassette is None:
            return False, 'No cassette with that ID'
        if user is None:
            self.user_handler.create_user(user_name)

        updated_cassette = {"$set": new_cassette}
        self.cassette_collection.update_one(query, updated_cassette)
        return True, new_cassette

    def get_cassette(self, cassette_id):
        query = {'cassette_id': cassette_id}
        cassette = self.cassette_collection.find_one(query, {'_id': 0})
        if cassette is None:
            return False, 'No cassette with that ID'
        else:
            return True, 'Cassette with that ID exists'


class MessageHandler:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:5001/")
        self.backend_db = self.client["BACKEND_DB"]
        self.message_collection = self.backend_db['messages']

    def post_intake(self, item):
        """Posts intake-message"""
        self.message_collection.insert_one(item)
        return 'Post added successfully'

    def get_all_user_messages(self, user_id):
        query = {'user': user_id}
        messages = list(self.message_collection.find(query, {'_id': 0}))
        if len(messages) == 0:
            return 'No messages for that user'
        else:
            return messages


class UserHandler:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:5001/")
        self.backend_db = self.client["BACKEND_DB"]
        self.user_collection = self.backend_db['users']

    def create_user(self, user_name):
        """Posts intake-message"""
        query = {'user_name': user_name}
        if self.user_collection.find_one(query, {'_id': 0}) is None:
            self.user_collection.insert_one({'user_name': user_name})
            return True, 'User added successfully'
        else:
            return False, 'User already exists'

    def get_all_users(self):
        return list(self.user_collection.find({}, {'_id': 0}))
