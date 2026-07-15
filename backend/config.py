from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    anthropic_api_key: str
    anthropic_base_url: str = "https://capi.aerolink.lat/"

    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    claude_model: str = "claude-sonnet-5"
    max_tokens: int = 4096

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
