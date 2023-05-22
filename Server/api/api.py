from api.routes_services import RouteServices
from api.data_models import UpdateCassetteRequest
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
    """Get cassette of device"""
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
    """Update cassette"""
    return route_service.update_cassette(cassette_id, adminKey, request_body.cassette)


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
