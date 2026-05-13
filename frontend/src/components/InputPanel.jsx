import React from "react";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const CATEGORIES = [
  { id: "happy_path", label: "Happy Path" },
  { id: "edge_cases", label: "Edge Cases" },
  { id: "auth_failures", label: "Auth Failures" },
  { id: "schema_validation", label: "Schema Validation" },
];

function CheckIcon() {
  return (
    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function InputPanel({ form, onField, onToggleCategory, onGenerate, loading }) {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
        <div className="w-7 h-7 rounded-md bg-stone-50 flex items-center justify-center text-sm">📝</div>
        <span className="text-[13px] font-semibold text-stone-800">API Configuration</span>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Method + URL */}
        <div>
          <label className="block text-[11.5px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">
            Endpoint
          </label>
          <div className="flex gap-2">
            <select
              value={form.method}
              onChange={(e) => onField("method", e.target.value)}
              className="w-24 px-2.5 py-2 text-[12.5px] font-semibold bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 cursor-pointer appearance-none text-center"
            >
              {HTTP_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <input
              type="text"
              value={form.url}
              onChange={(e) => onField("url", e.target.value)}
              placeholder="https://api.example.com/users"
              className="flex-1 px-3 py-2 text-[13px] bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 placeholder:text-stone-300 font-mono"
            />
          </div>
        </div>

        {/* Headers */}
        <div>
          <label className="block text-[11.5px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">
            Request Headers (JSON)
          </label>
          <textarea
            value={form.headers}
            onChange={(e) => onField("headers", e.target.value)}
            rows={3}
            placeholder={'{\n  "Content-Type": "application/json"\n}'}
            className="w-full px-3 py-2.5 text-[12px] font-mono leading-relaxed bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 resize-y placeholder:text-stone-300"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-[11.5px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">
            Request Body (JSON)
          </label>
          <textarea
            value={form.body}
            onChange={(e) => onField("body", e.target.value)}
            rows={4}
            placeholder={'{\n  "key": "value"\n}'}
            className="w-full px-3 py-2.5 text-[12px] font-mono leading-relaxed bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 resize-y placeholder:text-stone-300"
          />
        </div>

        {/* Framework */}
        <div>
          <label className="block text-[11.5px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">
            Framework
          </label>
          <div className="grid grid-cols-2 gap-1 bg-stone-50 border border-stone-200 rounded-md p-1">
            {[["pytest", "🐍 Pytest"], ["cypress", "🌲 Cypress"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => onField("framework", val)}
                className={`py-1.5 text-[12.5px] font-medium rounded transition-all ${
                  form.framework === val
                    ? "bg-white text-stone-900 shadow-card"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-[11.5px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">
            Test Categories
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(({ id, label }) => {
              const active = form.categories.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => onToggleCategory(id)}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-md transition-all text-left ${
                    active
                      ? "border-stone-900 bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      active ? "bg-stone-900 border-stone-900" : "border-1.5 border-stone-300 bg-white"
                    } border`}
                  >
                    {active && <CheckIcon />}
                  </div>
                  <span className={`text-[12px] font-medium ${active ? "text-stone-800" : "text-stone-500"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 text-[14px] font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-700 transition-all hover:-translate-y-px hover:shadow-float disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Spinner />
              Generating...
            </>
          ) : (
            <>
              <PlayIcon />
              Generate Tests
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3l14 9-14 9V3z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
