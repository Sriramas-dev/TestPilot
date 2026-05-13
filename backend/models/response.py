from pydantic import BaseModel
from datetime import datetime


class GenerateResponse(BaseModel):
    tests: str
    test_count: int
    framework: str
    generated_at: str


class ErrorResponse(BaseModel):
    detail: str
