from database.database_connector import DeviceHandler
from api.data_models import AuthRequest, ChangeCassetteRequest
from fastapi import HTTPException


class RouteServices:
    def __init__(self):
        self.device_db_handler = DeviceHandler()
        self.test = 1

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

    def get_device_cassette(self, device_id):
        server_response_status_ok, server_response_content = self.device_db_handler.get_device_cassette(device_id)
        if server_response_status_ok:
            return server_response_content
        else:
            raise HTTPException(status_code=404, detail=server_response_content)