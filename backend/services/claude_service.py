import anthropic
import re
from config import settings
from models.request import GenerateRequest, Framework


SYSTEM_PROMPT = """You are a senior SDET engineer specializing in REST API automation testing.

Your job is to generate complete, production-ready test code based on the API specification provided.

Output rules:
- Return ONLY raw code — no markdown fences, no explanation, no prose
- Never wrap output in backticks
- The code must be immediately runnable
- Use realistic, meaningful test data — not placeholder strings like "test123"
- Every test function must be independent and self-contained
- Add a short docstring or inline comment per test explaining its intent
- Minimum 8 test functions

For Pytest (Python):
- Import pytest and requests at the top
- Define BASE_URL as a module-level constant
- Define headers as a module-level dict
- Name tests with descriptive snake_case: test_create_user_returns_201
- Use assert statements with meaningful failure context
- Include a pytest.fixture for reusable setup where appropriate

For Cypress (JavaScript):
- Use describe/it blocks with cy.request()
- Define baseUrl and defaultHeaders as top-level constants
- Use expect() for assertions
- Include beforeEach where appropriate for shared setup"""


def _build_user_prompt(req: GenerateRequest) -> str:
    framework_label = (
        "Pytest (Python + requests)" if req.framework == Framework.pytest
        else "Cypress (JavaScript + cy.request)"
    )

    category_descriptions = {
        "happy_path": "Happy Path — successful requests with valid data",
        "edge_cases": "Edge Cases — empty strings, null values, missing fields, oversized payloads, duplicate entries",
        "auth_failures": "Auth Failures — missing token, malformed token, expired token, wrong permissions",
        "schema_validation": "Schema Validation — verify response keys exist, correct types, no unexpected null fields",
    }

    selected = [category_descriptions[c] for c in req.categories]
    categories_text = "\n".join(f"- {d}" for d in selected)

    headers_str = str(req.headers) if req.headers else '{"Content-Type": "application/json"}'
    body_str = str(req.body) if req.body else "{}"

    return f"""Generate {framework_label} tests for the following API endpoint.

Endpoint:
  Method:  {req.method.value}
  URL:     {req.url}
  Headers: {headers_str}
  Body:    {body_str}

Test categories to cover:
{categories_text}

Requirements:
- At least 8 distinct test functions
- Use the exact URL and headers provided
- Cover all categories listed above
- Include a module-level docstring describing the test suite
"""


def _count_tests(code: str, framework: str) -> int:
    if framework == "pytest":
        return len(re.findall(r"^def test_", code, re.MULTILINE))
    else:
        return len(re.findall(r"\bit\(", code))


def _strip_markdown(code: str) -> str:
    code = re.sub(r"^```[\w]*\n?", "", code, flags=re.MULTILINE)
    code = re.sub(r"```$", "", code, flags=re.MULTILINE)
    return code.strip()


def generate_tests(req: GenerateRequest) -> tuple[str, int]:
    try:
        client = anthropic.Anthropic(
            api_key=settings.anthropic_api_key,
            base_url=settings.anthropic_base_url,
        )

        message = client.messages.create(
            model=settings.claude_model,
            max_tokens=settings.max_tokens,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": _build_user_prompt(req),
                }
            ],
        )

        raw = "".join(
            block.text for block in message.content if hasattr(block, "text")
        )

        code = _strip_markdown(raw)
        count = _count_tests(code, req.framework.value)

        return code, count

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise Exception(f"AI service error: {e}")