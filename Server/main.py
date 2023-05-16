from fastapi import FastAPI
from api.data_models import *
from api.routes_services import RouteServices

backend = FastAPI()
route_service = RouteServices()


@backend.get('/ping')
async def ping():
    return route_service.ping()


@backend.get('/auth_device')
async def auth_device(auth_request: AuthRequest):
    return route_service.auth_device(auth_request)


@backend.put('/change_cassette')
async def change_cassette(auth_request: ChangeCassetteRequest):
    return route_service.change_cassette(auth_request)
