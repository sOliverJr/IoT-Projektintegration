from pydantic import BaseModel
from typing import Optional


class AuthRequest(BaseModel):
    device_id: str
    device_pwd: str
    # optional_param: Optional[str] = None


class ChangeCassetteRequest(BaseModel):
    device_id: str
    device_hash: str
    cassette_id: str


class GetCassetteRequest(BaseModel):
    device_id: str
    device_hash: str


class UpdateCassetteRequest(BaseModel):
    # admin_key: str
    # cassette_id: str
    cassette: dict
