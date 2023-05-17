from fastapi import FastAPI
from api.data_models import *
from api.routes_services import RouteServices
import uvicorn
import os
from dotenv import load_dotenv

backend = FastAPI()
route_service = RouteServices()


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


if __name__ == "__main__":
    uvicorn.run(backend, host="localhost", port=int(os.getenv('BACKEND_PORT')))
