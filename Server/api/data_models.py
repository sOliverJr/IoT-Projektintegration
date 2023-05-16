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
