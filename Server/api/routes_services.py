from database.database_connector import DeviceHandler, CassetteHandler
from fastapi import HTTPException
from dotenv import load_dotenv
import os


class RouteServices:
    def __init__(self):
        self.device_db_handler = DeviceHandler()
        self.cassette_db_handler = CassetteHandler()
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

    def change_cassette(self, device_id, device_hash, cassette_id):
        server_response_status_ok, server_response_content = self.device_db_handler.change_device_cassette(cassette_id, device_id, device_hash)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def update_cassette(self, cassette_id, admin_key, new_cassette):
        if admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        server_response_status_ok, server_response_content = self.cassette_db_handler.update_cassette(cassette_id, new_cassette)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

