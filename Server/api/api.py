from api.routes_services import RouteServices
from api.data_models import UpdateCassetteRequest, IntakeMessage, User
from fastapi import FastAPI, Header, Request
import uvicorn
from dotenv import load_dotenv
import os

backend = FastAPI()
route_service = RouteServices()
load_dotenv()


@backend.get('/ping')
async def ping():
    return route_service.ping()


@backend.get('/auth_device/{device_id}')
async def auth_device(device_id, request: Request):
    """Authenticate"""
    return route_service.auth_device(device_id, request.headers.get('device_pwd'))


@backend.get('/cassette_exists/{cassette_id}')
async def cassette_exists(cassette_id, request: Request):
    """Tests if cassette exists"""
    return route_service.cassette_exists(cassette_id, request.headers.get('adminKey'))


@backend.get('/cassette/{device_id}')
async def get_device_cassette(device_id, request: Request):
    """Get cassette of device"""
    return route_service.get_device_cassette(device_id, request.headers.get('device_hash'))


@backend.put('/cassette/{device_id}')
async def change_cassette(device_id, request: Request):
    """Change device cassette"""
    return route_service.change_cassette(device_id, request.headers.get('device_hash'), request.headers.get('cassette_id'))


@backend.patch('/cassette/{cassette_id}')
async def update_cassette(cassette_id, request_body: UpdateCassetteRequest, adminKey: str = Header(None)):
    # adminKey-parameter without '_' because of http-header restrictions
    """Update cassette and creates user if it does not exist yet"""
    return route_service.update_cassette(cassette_id, adminKey, request_body.cassette.user_name, dict(request_body.cassette))


@backend.post('/message/{device_id}')
async def post_intake(device_id, request_body: IntakeMessage, deviceHash: str = Header(None)):
    # deviceHash-parameter without '_' because of http-header restrictions
    """Posts intake message"""
    return route_service.post_intake(device_id, deviceHash, request_body.should_time, request_body.is_time)


@backend.get('/user')
async def get_all_users(adminKey: str = Header(None)):
    # adminKey-parameter without '_' because of http-header restrictions
    """Returns all users"""
    return route_service.get_all_users(adminKey)


@backend.post('/user')
async def create_user(request_body: User, adminKey: str = Header(None)):
    # adminKey-parameter without '_' because of http-header restrictions
    """Creates user"""
    return route_service.create_user(adminKey, request_body.user_name)


# @backend.post('/example')
# # Request: Body, header = Value of Header-field named 'header'
# async def auth_device(request: AuthRequest, header: str = Header(None)):
#     """Authenticate"""
#     print(header)
#     return route_service.auth_device(request)


def start_api():
    uvicorn.run(backend, host="localhost", port=int(os.getenv('BACKEND_PORT')))


if __name__ == "__main__":
    start_api()
