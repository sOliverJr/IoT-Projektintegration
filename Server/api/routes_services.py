from database.database_connector import DeviceHandler, CassetteHandler, MessageHandler, UserHandler
from fastapi import HTTPException
from dotenv import load_dotenv
import os


class RouteServices:
    def __init__(self):
        self.device_db_handler = DeviceHandler()
        self.cassette_db_handler = CassetteHandler()
        self.message_db_handler = MessageHandler()
        self.user_db_handler = UserHandler()
        load_dotenv()

    @staticmethod
    def ping():
        print('You just got pinged!')
        return 'Pong'

    def auth_device(self, device_id, device_pwd):
        """Returns Auth-Hash if request is valid"""
        server_response_status_ok, server_response_content = self.device_db_handler.auth_app(device_id, device_pwd)
        if not server_response_status_ok:
            raise HTTPException(status_code=404, detail=server_response_content)
        else:
            return server_response_content

    def cassette_exists(self, cassette_id, admin_key):
        if admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        server_response_status_ok, server_response_content = self.cassette_db_handler.get_cassette(cassette_id)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def get_device_cassette(self, device_id, device_hash):
        server_response_status_ok, server_response_content = self.device_db_handler.get_device_cassette(device_id, device_hash)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def change_device_cassette(self, device_id, device_hash, cassette_id):
        server_response_status_ok, server_response_content = self.device_db_handler.change_device_cassette(cassette_id, device_id, device_hash)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def change_device_user(self, admin_key, device_id, user_name):
        if admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        server_response_status_ok, server_response_content = self.device_db_handler.change_device_user(device_id, user_name)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def update_cassette(self, cassette_id, admin_key, user_name, new_cassette):
        if admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        server_response_status_ok, server_response_content = self.cassette_db_handler.update_cassette(cassette_id, user_name, new_cassette)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def post_intake(self, device_id, device_hash, should_time, is_time):
        server_response_status_ok, server_response_content = self.device_db_handler.get_device_user(device_id, device_hash)
        if server_response_status_ok:
            message = {
                'user': server_response_content,
                'device': device_id,
                'should_time': should_time,
                'is_time': is_time
            }
            self.message_db_handler.post_intake(message)
            return 'Success'
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def get_all_user_messages(self, admin_key, user_name):
        if admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        return self.message_db_handler.get_all_user_messages(user_name)

    def get_all_users(self, admin_key):
        if admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        server_response_content = self.user_db_handler.get_all_users()
        response = []
        for user in server_response_content:
            response.append(user['user_name'])
        return response

    def create_user(self, admin_key, user_name):
        if admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        server_response_status_ok, server_response_content = self.user_db_handler.create_user(user_name)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)
