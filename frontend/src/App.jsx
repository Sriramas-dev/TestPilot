import React, { useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import Footer from "./components/Footer";
import { useGenerator } from "./hooks/useGenerator";

export default function App() {
  const generatorRef = useRef(null);

  const { form, updateField, toggleCategory, generate, result, status, error } =
    useGenerator();

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Subtle grid background */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onGenerate={scrollToGenerator} />

        <main className="flex-1">
          <Hero onGenerate={scrollToGenerator} />
          <Features />

          {/* Generator Section */}
          <section
            ref={generatorRef}
            id="generator"
            className="max-w-7xl mx-auto px-6 pb-24"
          >
            <div className="text-center mb-12">
              <h2 className="font-serif text-[38px] tracking-tight text-stone-900 mb-3">
                Generate API Tests
              </h2>
              <p className="text-[15px] text-stone-500">
                Describe your endpoint and get a complete, runnable test suite
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <InputPanel
                form={form}
                onField={updateField}
                onToggleCategory={toggleCategory}
                onGenerate={generate}
                loading={status === "loading"}
              />
              <OutputPanel
                status={status}
                result={result}
                error={error}
                formUrl={form.url}
                framework={form.framework}
              />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
