import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-[12.5px] text-stone-400">
          Test<span className="font-serif-italic text-stone-500 text-[13px]">Pilot</span>
          {" — "}API test generation platform
        </div>
        <div className="text-[12px] text-stone-300">SDET Portfolio · 2025</div>
      </div>
    </footer>
  );
}
