from fastapi import FastAPI, HTTPException
from typing import Optional
from pydantic import BaseModel
from api.routes_services import RouteServices

backend = FastAPI()
route_service = RouteServices()


class AuthRequest(BaseModel):
    device_id: str
    device_pwd: str
    # optional_param: Optional[str] = None


@backend.get('/ping')
async def ping():
    return route_service.ping()


@backend.get('/auth_device')
async def auth_device(auth_request: AuthRequest):
    """Returns Auth-Hash if request is valid"""
    server_response_status_ok, server_response_content = route_service.auth_device(auth_request)
    if not server_response_status_ok:
        raise HTTPException(status_code=404, detail=server_response_content)
    else:
        return server_response_content

