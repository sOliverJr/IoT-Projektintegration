from api.routes_services import RouteServices
from api.data_models import *
from fastapi import FastAPI
import uvicorn
from dotenv import load_dotenv
import os

backend = FastAPI()
route_service = RouteServices()
load_dotenv()


@backend.get('/ping')
async def ping():
    return route_service.ping()


@backend.get('/auth_device')
async def auth_device(request: AuthRequest):
    """Authenticate"""
    return route_service.auth_device(request)


@backend.put('/cassette')
async def change_cassette(request: ChangeCassetteRequest):
    """Change device cassette"""
    return route_service.change_cassette(request)


@backend.get('/cassette')
async def get_device_cassette(request: GetCassetteRequest):
    """Get cassette of device"""
    return route_service.get_device_cassette(request)


@backend.patch('/cassette')
async def update_cassette(request: UpdateCassetteRequest):
    """Update cassette"""
    return route_service.update_cassette(request)


def start_api():
    uvicorn.run(backend, host="localhost", port=int(os.getenv('BACKEND_PORT')))


if __name__ == "__main__":
    start_api()
