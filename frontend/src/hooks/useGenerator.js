import { useState, useCallback } from "react";
import { generateTests } from "../lib/api";
import { safeParseJson } from "../lib/utils";

const INITIAL_FORM = {
  method: "POST",
  url: "https://api.example.com/users",
  headers: '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer <token>"\n}',
  body: '{\n  "name": "Alice",\n  "email": "alice@example.com",\n  "role": "user"\n}',
  framework: "pytest",
  categories: ["happy_path", "edge_cases", "auth_failures", "schema_validation"],
};

export function useGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleCategory = useCallback((cat) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  }, []);

  const validate = () => {
    if (!form.url.trim()) return "Endpoint URL is required.";
    if (form.categories.length === 0) return "Select at least one test category.";

    const [, headersErr] = safeParseJson(form.headers);
    if (form.headers.trim() && headersErr) return `Invalid headers JSON: ${headersErr}`;

    const [, bodyErr] = safeParseJson(form.body);
    if (form.body.trim() && bodyErr) return `Invalid body JSON: ${bodyErr}`;

    return null;
  };

  const generate = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    const [parsedHeaders] = safeParseJson(form.headers);
    const [parsedBody] = safeParseJson(form.body);

    try {
      const data = await generateTests({
        method: form.method,
        url: form.url.trim(),
        headers: parsedHeaders,
        body: parsedBody,
        framework: form.framework,
        categories: form.categories,
      });

      setResult(data);
      setStatus("success");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "An unexpected error occurred.";
      setError(msg);
      setStatus("error");
    }
  }, [form]);

  return { form, updateField, toggleCategory, generate, result, status, error };
}
