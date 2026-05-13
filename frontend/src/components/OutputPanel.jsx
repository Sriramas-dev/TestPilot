import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { copyToClipboard, downloadFile, slugifyUrl } from "../lib/utils";

const LOADING_MESSAGES = [
  "Analyzing your API endpoint...",
  "Identifying test scenarios...",
  "Writing test functions...",
  "Adding assertions and validations...",
  "Formatting output...",
];

export default function OutputPanel({ status, result, error, formUrl, framework }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (status !== "loading") return;
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [status]);

  const handleCopy = async () => {
    if (!result?.tests) return;
    await copyToClipboard(result.tests);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.tests) return;
    const ext = framework === "pytest" ? "py" : "js";
    const slug = slugifyUrl(formUrl || "endpoint");
    downloadFile(result.tests, `test_${slug}.${ext}`);
  };

  const language = framework === "pytest" ? "python" : "javascript";

  return (
    <div className="bg-white border border-stone-200 rounded-3xl shadow-card overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
        <div className="w-7 h-7 rounded-md bg-stone-50 flex items-center justify-center text-sm">⚡</div>
        <span className="text-[13px] font-semibold text-stone-800">Generated Tests</span>
        {result && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
              ✓ {result.test_count} tests
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {result.framework === "pytest" ? "Pytest" : "Cypress"}
            </span>
          </div>
        )}
      </div>

      {/* States */}
      {status === "idle" && (
        <div className="flex flex-col items-center justify-center flex-1 py-20 px-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <div className="text-[14px] font-semibold text-stone-700 mb-1.5">Ready to generate</div>
          <div className="text-[13px] text-stone-400">Configure your endpoint and click Generate Tests</div>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center flex-1 py-20 gap-4">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
          <div className="text-[13px] text-stone-400 animate-pulse">{LOADING_MESSAGES[msgIdx]}</div>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center flex-1 py-16 px-8 gap-4">
          <div className="text-3xl">⚠️</div>
          <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center max-w-sm">
            {error}
          </div>
          <div className="text-[12px] text-stone-400">Check your inputs and try again</div>
        </div>
      )}

      {status === "success" && result && (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-stone-100 flex-wrap">
            <div className="text-[11px] text-stone-400">
              Generated {new Date(result.generated_at).toLocaleTimeString()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-stone-600 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-stone-600 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors"
              >
                Download .{framework === "pytest" ? "py" : "js"}
              </button>
            </div>
          </div>

          {/* Code */}
          <div className="overflow-auto max-h-[560px] code-scrollbar code-block">
            <SyntaxHighlighter
              language={language}
              style={oneLight}
              customStyle={{
                margin: 0,
                padding: "20px",
                background: "#FAFAF8",
                fontSize: "12.5px",
                lineHeight: "1.7",
                fontFamily: '"DM Mono", monospace',
              }}
              showLineNumbers
              lineNumberStyle={{
                color: "#C8C7C1",
                minWidth: "2.5em",
                paddingRight: "1em",
                userSelect: "none",
              }}
            >
              {result.tests}
            </SyntaxHighlighter>
          </div>
        </>
      )}
    </div>
  );
}
