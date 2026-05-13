import React from "react";

const MOCK_CODE = `import pytest
import requests

BASE_URL = "https://api.example.com/users"
HEADERS = {"Content-Type": "application/json", "Authorization": "Bearer token"}

def test_create_user_returns_201():
    """Happy path — valid payload creates user."""
    resp = requests.post(BASE_URL, json={"name": "Alice", "email": "alice@ex.com"}, headers=HEADERS)
    assert resp.status_code == 201
    assert "id" in resp.json()

def test_missing_email_returns_422():
    """Edge case — required field absent."""
    resp = requests.post(BASE_URL, json={"name": "Alice"}, headers=HEADERS)
    assert resp.status_code == 422

def test_no_auth_token_returns_401():
    """Auth failure — missing authorization header."""
    resp = requests.post(BASE_URL, json={"name": "Alice", "email": "a@b.com"})
    assert resp.status_code == 401`;

const TAG_STYLES = {
  "Happy Path": "bg-green-50 text-green-700",
  "Edge Case": "bg-amber-50 text-amber-700",
  "Auth Failure": "bg-red-50 text-red-700",
  "Schema": "bg-blue-50 text-blue-700",
};

export default function Hero({ onGenerate }) {
  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Left */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-3 py-1 text-[11.5px] font-medium text-stone-500 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          AI-Powered API Testing
        </div>

        <h1 className="font-serif text-[52px] leading-[1.06] tracking-tight text-stone-900 mb-5">
          Generate <em className="text-stone-400 not-italic font-serif-italic">production-ready</em>{" "}
          API tests with AI
        </h1>

        <p className="text-[15px] leading-relaxed text-stone-500 max-w-[440px] mb-8">
          Skip the boilerplate. Describe your endpoint and get a complete Pytest
          or Cypress test suite in seconds — happy paths, edge cases, auth
          failures, and schema validation included.
        </p>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onGenerate}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-700 transition-all hover:-translate-y-px hover:shadow-float"
          >
            Generate Tests ↗
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-medium text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
          >
            View GitHub
          </a>
        </div>

        <div className="flex gap-8 mt-10 pt-8 border-t border-stone-200">
          {[["6+", "Test categories"], ["2", "Frameworks"], ["∞", "Endpoints"]].map(([n, l]) => (
            <div key={l}>
              <div className="text-[22px] font-semibold tracking-tight text-stone-900">{n}</div>
              <div className="text-[11.5px] text-stone-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — floating preview */}
      <div className="hidden lg:block relative h-[400px]">
        <div className="absolute inset-0 bottom-14 bg-white border border-stone-200 rounded-2xl shadow-float overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-stone-100">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="ml-3 text-[11px] text-stone-400 font-mono">test_users_api.py</span>
          </div>

          {/* Progress bar */}
          <div className="mx-4 mt-3 mb-3">
            <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-stone-900 rounded-full w-[72%]" style={{ animation: "none" }} />
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 px-4 mb-4 flex-wrap">
            {Object.entries(TAG_STYLES).map(([label, cls]) => (
              <span key={label} className={`text-[10.5px] font-medium px-2 py-0.5 rounded ${cls}`}>
                {label}
              </span>
            ))}
          </div>

          {/* Code preview */}
          <pre className="px-4 text-[11.5px] font-mono leading-relaxed text-stone-600 overflow-hidden">
            {MOCK_CODE.split("\n").slice(0, 12).map((line, i) => (
              <div key={i} className="whitespace-pre">{line || " "}</div>
            ))}
          </pre>
        </div>

        {/* Float card */}
        <div className="absolute bottom-0 left-8 right-0 bg-white border border-stone-200 rounded-xl shadow-float px-4 py-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <div>
            <div className="text-[12px] font-semibold text-stone-900">12 tests generated</div>
            <div className="text-[11px] text-stone-400">Pytest · 1.2s</div>
          </div>
          <div className="ml-auto flex gap-1">
            {["bg-green-400", "bg-green-400", "bg-amber-400"].map((c, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full ${c}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
