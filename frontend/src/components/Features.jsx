import React from "react";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant generation",
    desc: "Paste your endpoint and get a complete test suite in seconds. No scaffolding, no configuration.",
  },
  {
    icon: "🧪",
    title: "Full coverage",
    desc: "Happy paths, edge cases, auth failures, and schema validation — all generated from a single API spec.",
  },
  {
    icon: "📦",
    title: "Copy or download",
    desc: "One-click copy or download as .py or .js. Tests are paste-and-run ready with zero cleanup needed.",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-card transition-shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-50 flex items-center justify-center text-xl mb-3">
              {icon}
            </div>
            <div className="text-[13px] font-semibold text-stone-800 mb-1.5">{title}</div>
            <div className="text-[12.5px] text-stone-500 leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
