from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import anthropic

from models.request import GenerateRequest
from models.response import GenerateResponse
from services.claude_service import generate_tests

router = APIRouter()


@router.post("/generate-tests", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    try:
        code, test_count = generate_tests(req)
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid API key. Check your ANTHROPIC_API_KEY.")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limit reached. Please wait a moment and try again.")
    except anthropic.APITimeoutError:
        raise HTTPException(status_code=504, detail="Request to AI service timed out. Try again.")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

    return GenerateResponse(
        tests=code,
        test_count=test_count,
        framework=req.framework.value,
        generated_at=datetime.now(timezone.utc).isoformat(),
    )
