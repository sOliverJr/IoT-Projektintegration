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


class Cassette(BaseModel):
    einnahme_frequenz: int
    einnahme_uhrzeiten: list
    user_name: str


class UpdateCassetteRequest(BaseModel):
    cassette: Cassette


class IntakeMessage(BaseModel):
    should_time: int
    is_time: int


class User(BaseModel):
    user_name: str

