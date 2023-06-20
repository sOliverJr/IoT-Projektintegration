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
    einnahmeFrequenz: int
    einnahmeUhrzeiten: list
    username: str
    comment: str
    title: str


class UpdateCassetteRequest(BaseModel):
    cassette: Cassette


class IntakeMessage(BaseModel):
    shouldTime: int
    isTime: int
    timeStamp: int


class User(BaseModel):
    user_name: str

