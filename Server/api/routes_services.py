from database.database_connector import DeviceHandler, CassetteHandler
from api.data_models import AuthRequest, ChangeCassetteRequest, GetCassetteRequest, UpdateCassetteRequest
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

    def auth_device(self, auth_request: AuthRequest):
        """Returns Auth-Hash if request is valid"""
        server_response_status_ok, server_response_content = self.device_db_handler.auth_app(auth_request.device_id, auth_request.device_pwd)
        if not server_response_status_ok:
            raise HTTPException(status_code=404, detail=server_response_content)
        else:
            return server_response_content

    def change_cassette(self, request: ChangeCassetteRequest):
        server_response_status_ok, server_response_content = self.device_db_handler.change_device_cassette(request.cassette_id, request.device_id, request.device_hash)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def get_device_cassette(self, request: GetCassetteRequest):
        server_response_status_ok, server_response_content = self.device_db_handler.get_device_cassette(request.device_id, request.device_hash)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

    def update_cassette(self, request: UpdateCassetteRequest):
        if request.admin_key != os.getenv('ADMIN_KEY'):
            raise HTTPException(status_code=404, detail='Invalid admin key')
        server_response_status_ok, server_response_content = self.cassette_db_handler.update_cassette(request.cassette_id, request.cassette)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)

