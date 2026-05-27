"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  ArrowLeft, 
  Code, 
  Coins, 
  Sparkles, 
  Cpu, 
  Database, 
  Info, 
  Terminal, 
  Settings, 
  Check
} from "lucide-react";

export default function DocumentationPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Platform Overview", icon: <BookOpen className="h-4 w-4" /> },
    { id: "setup", label: "Getting Started", icon: <Settings className="h-4 w-4" /> },
    { id: "ai", label: "AI Script Generation", icon: <Cpu className="h-4 w-4" /> },
    { id: "runner", label: "Cloud Test Runner", icon: <Terminal className="h-4 w-4" /> },
    { id: "credits", label: "Credits & Billing", icon: <Coins className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Background glow graphics */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center relative z-10">
        <button
          onClick={() => router.push("/workspace")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">Developer Docs</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-1 space-y-2">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Documentation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Version 1.0.0 (Beta)</p>
          </div>
          <nav className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeSection === sec.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }`}
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm min-h-[60vh] transition-all">
          
          {/* Section: Overview */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
                GitTest AI Platform Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                GitTest AI is an autonomous, AI-driven end-to-end testing pipeline for modern web applications. By interfacing directly with your repository, we eliminate the need to write fragile, manually coded test scripts.
              </p>
              
              <div className="border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-r-lg">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">How it works:</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  We look at your component codebase structure, identify logical routes, synthesize potential testing flows with Gemini AI, translate those flows into executable Playwright Javascript scripts, and execute them on Browserbase headless cloud browsers in parallel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                  <Cpu className="h-6 w-6 text-emerald-500 mb-2" />
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">AI Code Analysis</h4>
                  <p className="text-xs text-slate-500 mt-1">Automatic selector detection and path mapping.</p>
                </div>
                <div className="p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                  <Code className="h-6 w-6 text-blue-500 mb-2" />
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Playwright Output</h4>
                  <p className="text-xs text-slate-500 mt-1">Standard Playwright script outputs you can copy-paste.</p>
                </div>
                <div className="p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                  <Database className="h-6 w-6 text-purple-500 mb-2" />
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Cloud Browsers</h4>
                  <p className="text-xs text-slate-500 mt-1">Zero local browser instances or Docker grids.</p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Getting Started */}
          {activeSection === "setup" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
                Getting Started in 2 Minutes
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Set up automated end-to-end tests for your repository in four simple steps:
              </p>

              <ol className="space-y-6 list-none p-0 m-0">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">1</span>
                  <div>
                    <h4 className="font-bold text-base">Connect your GitHub</h4>
                    <p className="text-sm text-slate-500 mt-1">Authorize GitHub access via our secure OAuth panel and choose the repository you want to test.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">2</span>
                  <div>
                    <h4 className="font-bold text-base">Verify Target Website URL</h4>
                    <p className="text-sm text-slate-500 mt-1">Input the URL where your application is running (e.g. `http://localhost:3000` or a Vercel staging deployment link).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">3</span>
                  <div>
                    <h4 className="font-bold text-base">Synthesize AI Test Cases</h4>
                    <p className="text-sm text-slate-500 mt-1">Click "Generate Test Cases". Gemini will crawl the project directories to map elements and output a queue of functional testing scenarios.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">4</span>
                  <div>
                    <h4 className="font-bold text-base">Execute Tests in Cloud</h4>
                    <p className="text-sm text-slate-500 mt-1">Open the runner and click "Start Execution". Watch real-time terminal outputs and review the execution video replay once finished.</p>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* Section: AI Script Generation */}
          {activeSection === "ai" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
                AI Script Generation Logic
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Our platform utilizes Google's **Gemini 3.1 Flash Lite** model to translate files and requirements into Playwright code. 
              </p>

              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">How the code generation stays resilient:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Tag Matching:</strong> Caches raw DOM source code context to extract precise placeholders, button labels, and input selectors.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Lenient Assertions:</strong> Asserts visibility and presence in a case-insensitive, relaxed format to avoid test fragility due to minor text shifts.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Custom Runtime Prompts:</strong> You can append custom text instructions (like `Fill fake billing info, click next`) to override the AI's standard automation flow.</span>
                  </li>
                </ul>
              </div>

              <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`// Sample Generated Script Structure
await page.goto('http://localhost:3000/auth/login');
await page.getByPlaceholder('Email').fill('user@example.com');
await page.getByRole('button', { name: 'Login' }).click();
const text = await page.innerText('body');
assert(text.includes('Welcome back'), 'Login failed');`}
              </pre>
            </div>
          )}

          {/* Section: Cloud Test Runner */}
          {activeSection === "runner" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
                Browserbase Headless Runner
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                To guarantee zero-infrastructure overhead, all Playwright scripts are executed remotely on **Browserbase** cloud browser instances.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Terminal Streaming</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Browser console outputs, system messages, and Playwright execution errors are piped and rendered directly in the live runner console.
                  </p>
                </div>
                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Video Recordings & Replays</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Every session generates an inspector link containing full video recordings, network requests waterfall, and console logs.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Because tests execute in remote environments, local URLs (like `http://localhost:3000`) require your local development server to be up and accessible via tunnel or normal local host routing.
                </span>
              </div>
            </div>
          )}

          {/* Section: Credits & Billing */}
          {activeSection === "credits" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
                Credits and Plan Limits
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                The platform utilizes a consumption-based credit system. Credits determine the volume of automated browser tests you can run.
              </p>

              {/* Cost rules table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 font-semibold">Action</th>
                      <th className="p-3 font-semibold">Credit Cost</th>
                      <th className="p-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <td className="p-3 font-semibold flex items-center gap-1.5"><Code className="h-4 w-4 text-emerald-500" /> Cached Run</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">5 Credits</td>
                      <td className="p-3 text-slate-500 text-xs">Run a pre-generated cached script on Browserbase immediately.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-amber-500" /> AI Run</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">10 Credits</td>
                      <td className="p-3 text-slate-500 text-xs">Call Gemini to analyze code, regenerate the script, and then execute on Browserbase.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tiers overview */}
              <div className="space-y-4">
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">Subscription Plans</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300">Free Trial</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Given **1,000 credits** upon registration (approx. 100 E2E tests). Limits repositories connected to 1.
                    </p>
                  </div>
                  <div className="p-5 border-2 border-blue-500 rounded-xl relative">
                    <span className="absolute top-2 right-2 text-[9px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium</span>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Pro Plan</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Given **10,000 monthly credits** (approx. 1,000 test runs per month). Unlocks unlimited repositories and custom global configurations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund system note */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Refund Safety:</strong> If an execution crashes due to a structural network issue or API timeout (not an assertion failure on your application), the credit cost is **automatically refunded** back to your balance immediately.
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
