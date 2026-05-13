from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional, List
from enum import Enum


class HttpMethod(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    DELETE = "DELETE"


class Framework(str, Enum):
    pytest = "pytest"
    cypress = "cypress"


class Category(str, Enum):
    happy_path = "happy_path"
    edge_cases = "edge_cases"
    auth_failures = "auth_failures"
    schema_validation = "schema_validation"


class GenerateRequest(BaseModel):
    method: HttpMethod
    url: str
    headers: Optional[dict] = None
    body: Optional[dict] = None
    framework: Framework
    categories: List[Category]

    @field_validator("categories")
    @classmethod
    def categories_not_empty(cls, v):
        if not v:
            raise ValueError("At least one test category is required")
        return v

    @field_validator("url")
    @classmethod
    def url_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("URL is required")
        return v.strip()
