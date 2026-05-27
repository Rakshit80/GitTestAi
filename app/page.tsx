"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  Check, 
  Play, 
  Terminal as TerminalIcon, 
  RefreshCw, 
  Sparkles 
} from "lucide-react";

// === INLINE CUSTOM SVG ICONS TO PREVENT LINT/VERSION ERRORS ===

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ChromeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const GitBranchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const CpuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const ActivityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// Terminal Typing Lines
const terminalLines = [
  { text: "$ gittest connect --repo github.com/acme/checkout-app", type: "input" },
  { text: "⎔ Cloning repository...", type: "info" },
  { text: "✓ 3 routes detected · 42 components mapped", type: "success" },
  { text: "✦ Generating test cases with AI...", type: "info" },
  { text: "✓ 214 test scenarios synthesized", type: "success" },
  { text: "⚙ Launching Playwright cloud runner...", type: "info" },
  { text: "⚡ Running 214 tests across Chrome, Firefox & WebKit...", type: "info" },
  { text: "✓ 211 passed · 3 failed · done in 38s", type: "success-bold" }
];

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  // Terminal typing animation state
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentText, setCurrentText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Restart animation every 15 seconds
  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const line = terminalLines[visibleLines];
      if (line.type === "input") {
        setIsTyping(true);
        if (charIndex < line.text.length) {
          const timeout = setTimeout(() => {
            setCurrentText((prev) => prev + line.text[charIndex]);
            setCharIndex((prev) => prev + 1);
          }, 40);
          return () => clearTimeout(timeout);
        } else {
          setIsTyping(false);
          const timeout = setTimeout(() => {
            setVisibleLines((prev) => prev + 1);
            setCharIndex(0);
            setCurrentText("");
          }, 600);
          return () => clearTimeout(timeout);
        }
      } else {
        const timeout = setTimeout(() => {
          setVisibleLines((prev) => prev + 1);
        }, 800);
        return () => clearTimeout(timeout);
      }
    } else {
      // Loop reset
      const timeout = setTimeout(() => {
        setVisibleLines(0);
        setCurrentText("");
        setCharIndex(0);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines, charIndex]);

  // Animated progress bars for feature section
  const [barsAnimated, setBarsAnimated] = useState(false);
  useEffect(() => {
    setBarsAnimated(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Dynamic light glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/70 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/70 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="GitTest AI Logo" 
              width={140} 
              height={36} 
              className="object-contain dark:brightness-110"
              priority
            />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How it works</Link>
            <Link href="#pipeline" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pipeline</Link>
          </nav>

          {/* CTA / Auth Actions */}
          <div className="flex items-center gap-4">
            {isLoaded && (
              <>
                {!isSignedIn ? (
                  <>
                    <Link href="/workspace" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer">
                      Sign in
                    </Link>
                    <Link href="/workspace" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer">
                      <GithubIcon className="w-4 h-4" />
                      Connect GitHub
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/workspace" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer">
                      Go to Workspace
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                    <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800" } }} />
                  </>
                )}
              </>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
        
        {/* Powered By Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Powered by AI + Playwright — now in beta</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl mx-auto leading-[1.1] mb-6">
          Connect repo. <br className="md:hidden" />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">AI tests it.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Connect your GitHub repository, let our AI generate a complete end-to-end Playwright test suite, and watch cloud browsers execute them in parallel—all in minutes.
        </p>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/workspace" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer">
              <GithubIcon className="w-5 h-5" />
              {isLoaded && isSignedIn ? "Go to Workspace" : "Connect GitHub repo"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Small checklist info */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Works with Next.js / React</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Playwright cloud execution included</span>
        </div>

        {/* Terminal Widget */}
        <div className="mt-20 max-w-3xl mx-auto rounded-xl border border-slate-200 bg-slate-900 text-left shadow-2xl overflow-hidden dark:border-slate-800">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80">
            <div className="flex gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 block" />
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 block" />
              <span className="w-3.5 h-3.5 rounded-full bg-green-500/80 block" />
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <TerminalIcon className="w-3.5 h-3.5" /> gittest — bash
            </span>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm leading-relaxed min-h-[300px] bg-slate-950 text-slate-300 select-none overflow-x-auto">
            {terminalLines.slice(0, visibleLines).map((line, idx) => (
              <div key={idx} className="mb-2">
                {line.type === "input" && (
                  <span className="text-emerald-400 font-bold">{line.text}</span>
                )}
                {line.type === "info" && (
                  <span className="text-slate-400">{line.text}</span>
                )}
                {line.type === "success" && (
                  <span className="text-emerald-500 font-semibold">{line.text}</span>
                )}
                {line.type === "success-bold" && (
                  <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 inline-block mt-1">{line.text}</span>
                )}
              </div>
            ))}
            {/* Animated current line (input row only) */}
            {isTyping && visibleLines < terminalLines.length && terminalLines[visibleLines].type === "input" && (
              <div className="mb-2">
                <span className="text-emerald-400 font-bold">{currentText}</span>
                <span className="w-2 h-4 bg-emerald-400 inline-block animate-pulse ml-0.5 align-middle" />
              </div>
            )}
            {/* Static flashing cursor when typing is complete/paused */}
            {!isTyping && visibleLines < terminalLines.length && (
              <div className="w-2 h-4 bg-slate-500 inline-block animate-pulse align-middle" />
            )}
          </div>
        </div>

      </section>

      {/* Features Detail Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200/40 dark:border-slate-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Details */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-4">
              Execution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-slate-900 dark:text-slate-50 mb-6 leading-tight">
              Real browsers. <br />Zero infrastructure.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              We leverage cloud browsers to execute headless instances. Your test scenarios run in fully authentic, remote browser environments with zero Selenium grids to manage, no Docker configurations to write, and no slow local systems.
            </p>

            <ul className="space-y-4">
              {[
                "Parallel execution across Chrome, Firefox & WebKit",
                "Full session replay with detailed logs and timelines",
                "Real device emulation & responsive layout testing",
                "Automatic screenshot capture and page dumps on failure"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Progress Dashboard Visual */}
          <div className="relative p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-xl dark:border-slate-800/80 dark:bg-slate-950/50 backdrop-blur-sm">
            <div className="absolute top-2 right-4 flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-time runner
            </div>
            
            <div className="space-y-6 pt-4">
              {/* Progress 1 */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-800 dark:text-slate-200">checkout flow</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">✓ 48 <span className="text-red-500">X 2</span></span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-[2000ms] ease-out"
                    style={{ width: barsAnimated ? "95%" : "0%" }}
                  />
                </div>
              </div>

              {/* Progress 2 */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-800 dark:text-slate-200">auth routes</span>
                  <span className="text-emerald-600 dark:text-emerald-400">✓ 31</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-[2000ms] ease-out delay-100"
                    style={{ width: barsAnimated ? "100%" : "0%" }}
                  />
                </div>
              </div>

              {/* Progress 3 */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-800 dark:text-slate-200">product pages</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">✓ 62 <span className="text-red-500">X 5</span></span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-[2000ms] ease-out delay-200"
                    style={{ width: barsAnimated ? "88%" : "0%" }}
                  />
                </div>
              </div>

              {/* Progress 4 */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-800 dark:text-slate-200">cart & payment</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">✓ 29 <span className="text-red-500">X 1</span></span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-[2000ms] ease-out delay-300"
                    style={{ width: barsAnimated ? "98%" : "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom status stats */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>ACTIVE RUN: #2429</span>
              <span>CONCURRENCY: 6X</span>
              <span>SUCCESS RATE: 96.2%</span>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works / 4-Step Process Section */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-4">
            Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            Zero to tested in four steps
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Our autonomous pipeline makes end-to-end testing plug-and-play. No manual scripting, no brittle setups.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Connect GitHub repo",
              desc: "Authorize GitHub and select your repository. GitTest AI maps your application route structure, reading directories and components automatically.",
              icon: <GitBranchIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            },
            {
              step: "02",
              title: "AI generates test cases",
              desc: "Our LLM model analyzes components, paths, and user flows to synthesize an exhaustive suite of testing scenarios (E2E journeys, inputs, and edge cases).",
              icon: <CpuIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            },
            {
              step: "03",
              title: "Run tests in the cloud",
              desc: "Tests run inside high-speed cloud browsers via Playwright. Everything scales in parallel with automatic mock servers and zero local configuration.",
              icon: <LayersIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            },
            {
              step: "04",
              title: "Review & auto-heal",
              desc: "Receive structured logs, video recordings, and screenshots. If UI updates occur, AI auto-heals selectors to prevent tests from breaking.",
              icon: <ActivityIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl hover:shadow-lg hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-xs font-bold font-mono text-slate-300 dark:text-slate-700 tracking-wider">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-3">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Everything in One Pipeline Section */}
      <section id="pipeline" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200/40 dark:border-slate-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Everything in one pipeline
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              From your first commit to a passing test suite—no custom DevOps script, no fragile selectors, and no flaky runs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "GitHub Integration",
                desc: "Connect any public or private repository in one click. We securely clone, analyze your file systems, routes, and layout structures.",
                icon: <GithubIcon className="w-5 h-5 text-emerald-500" />
              },
              {
                title: "AI Test Generation",
                desc: "Our model translates code into logical flow charts and synthesizes end-to-end user flows in natural language before compiling to Playwright code.",
                icon: <CpuIcon className="w-5 h-5 text-teal-500" />
              },
              {
                title: "Playwright Core execution",
                desc: "Execute authentic browser environments natively. No headless simulators; tests run inside real Chrome, Firefox, and WebKit cloud instances.",
                icon: <ChromeIcon className="w-5 h-5 text-blue-500" />
              },
              {
                title: "Session Video Recordings",
                desc: "Every single test run is recorded. Scroll, click, and interact frame-by-frame on failed tests to trace the exact point of failure.",
                icon: <VideoIcon className="w-5 h-5 text-purple-500" />
              },
              {
                title: "Auto-Healing Locators",
                desc: "Tired of broken CSS or XPath queries? When page markups change, the model adapts dynamically to restore functional testing selectors.",
                icon: <RefreshCw className="w-5 h-5 text-emerald-500" />
              },
              {
                title: "Actionable AI Reports",
                desc: "Get crystal-clear root-cause explanations of crashes, layout errors, and HTTP blocks along with suggested patches to copy-paste directly.",
                icon: <BarChartIcon className="w-5 h-5 text-teal-500" />
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200/40 dark:bg-slate-900 dark:border-slate-800">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{item.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 relative overflow-hidden bg-slate-900 text-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <ZapIcon className="w-10 h-10 text-emerald-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Ready to automate your test suite?</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Connect your first repository and let GitTest AI synthesize and execute tests in less than two minutes.
          </p>

          <Link href="/workspace">
            <button className="flex items-center gap-2 px-8 py-4 text-base font-bold bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all mx-auto cursor-pointer text-white">
              <GithubIcon className="w-5 h-5" />
              {isLoaded && isSignedIn ? "Go to Workspace Dashboard" : "Connect GitHub & Start"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="GitTest AI Logo" 
              width={120} 
              height={30} 
              className="object-contain dark:brightness-110"
            />
          </div>

          <div className="flex gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link href="#features" className="hover:text-slate-950 dark:hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-slate-950 dark:hover:text-white transition-colors">How it works</Link>
            <Link href="#pipeline" className="hover:text-slate-950 dark:hover:text-white transition-colors">Pipeline</Link>
            <Link href="/workspace/documentation" className="hover:text-slate-950 dark:hover:text-white transition-colors">Documentation</Link>
          </div>

          <span className="text-xs text-slate-400 dark:text-slate-600">
            © {new Date().getFullYear()} GitTest AI. All rights reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}
