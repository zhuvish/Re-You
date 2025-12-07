"use client"

import Image from "next/image"
import { Reveal } from "@/components/Reveal"
import { StepCard } from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-slate-100">

      {/* NAVBAR */}
      <header className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
          <span className="text-xl font-semibold">Re:You</span>

          <nav className="flex gap-6 text-sm text-slate-300">
            <a className="hover:text-white transition">Docs</a>
            <a className="hover:text-white transition">Register</a>
            <a className="hover:text-white transition">GitHub</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-8 pt-28 pb-36">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-8">
              Your AI-Powered <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Developer Brain
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mb-10">
              Re:You helps you instantly recall past implementations,
              search your entire codebase by meaning, and understand
              how features were built — even months later.
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => {
                  window.location.href = "http://localhost:8000/auth/github/login"
                }}
              >
                Sign in with GitHub
              </Button>

              <Button
                size="lg"
                className="bg-white/90 text-black hover:bg-white"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-cyan-400/25 to-blue-500/25 blur-3xl rounded-full" />

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/brain-1.png"
              alt="Re:You Brain"
              width={360}
              height={360}
              className="relative z-10"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: "Semantic Code Search",
              desc: "Find features even if you don’t remember function names or files."
            },
            {
              title: "Contextual Q&A",
              desc: "Ask how a feature works and get code, commits, and explanations."
            },
            {
              title: "Developer Memory",
              desc: "Reuse logic across projects and reduce re-implementation."
            }
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-7 hover:-translate-y-1 transition-transform"
            >
              <h3 className="font-semibold mb-3">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto pb-24">
        <Reveal>
          <h2 className="text-3xl font-bold mb-10">
            How DevMemory Understands Your Code
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10">
          <Reveal delay={0.1}>
            <StepCard
              title="Index"
              desc="We parse functions, classes, commits, and docs into structured chunks."
            />
          </Reveal>

          <Reveal delay={0.2}>
            <StepCard
              title="Embed"
              desc="Each chunk is converted into semantic embeddings using code-aware models."
            />
          </Reveal>

          <Reveal delay={0.3}>
            <StepCard
              title="Retrieve"
              desc="Hybrid search finds the most relevant snippets across all repositories."
            />
          </Reveal>
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="bg-slate-900/40 py-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl font-bold mb-8">
              Ask Questions the Way You Think
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-slate-400 text-lg max-w-3xl mb-12">
              No more remembering function names, files, or directories.
              DevMemory understands intent.
            </p>
          </Reveal>

          <div className="space-y-4 text-slate-300 font-mono">
            <Reveal delay={0.2}>➜ How does login work?</Reveal>
            <Reveal delay={0.25}>➜ Where is payment validation implemented?</Reveal>
            <Reveal delay={0.3}>➜ Show commits related to onboarding</Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 mt-24">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col sm:flex-row gap-6 sm:gap-0 items-center justify-between text-sm text-slate-400">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Re:You</span>
            <span className="text-slate-500">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-200 transition">Docs</a>
            <a href="#" className="hover:text-slate-200 transition">GitHub</a>
            <a href="#" className="hover:text-slate-200 transition">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
