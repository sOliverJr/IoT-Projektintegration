from database.database_connector import DeviceHandler
from pydantic import BaseModel
from fastapi import HTTPException


class AuthRequest(BaseModel):
    device_id: str
    device_pwd: str


class RouteServices:
    def __init__(self):
        self.device_db_handler = DeviceHandler()
        self.test = 1

    @staticmethod
    def ping():
        print('You just got pinged!')
        return 'Pong'

    def auth_device(self, auth_request: AuthRequest):
        return self.device_db_handler.auth_app(auth_request.device_id, auth_request.device_pwd)
