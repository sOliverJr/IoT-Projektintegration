from fastapi import FastAPI
from api.data_models import *
from api.routes_services import RouteServices

backend = FastAPI()
route_service = RouteServices()


@backend.get('/ping')
async def ping():
    return route_service.ping()


@backend.get('/auth_device')
async def auth_device(request: AuthRequest):
    return route_service.auth_device(request)


@backend.put('/change_cassette')
async def change_cassette(request: ChangeCassetteRequest):
    return route_service.change_cassette(request)


@backend.get('/get_current_cassette')
async def get_device_cassette(request: GetCassetteRequest):
    return route_service.get_device_cassette(request)
