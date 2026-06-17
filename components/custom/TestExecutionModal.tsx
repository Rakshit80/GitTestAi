"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TestCase } from "./UserRepoList";
import {
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Terminal,
  ExternalLink,
  Globe,
  Code,
  RefreshCw,
  PlayCircle,
  ChevronRight,
  Sparkles,
  Database,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  testCases: TestCase[];
  repository: any; // Connected repository config
};

type RunResult = {
  testCaseId: number;
  status: "idle" | "generating" | "running" | "passed" | "failed";
  logs: string[];
  error?: string;
  sessionId?: string;
  sessionUrl?: string;
  browserbaseScript?: string;
};

export default function TestExecutionModal({
  isOpen,
  onClose,
  testCases,
  repository,
}: Props) {
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<Record<number, RunResult>>({});
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  // Advanced Options states
  const [executionMode, setExecutionMode] = useState<"cache" | "generate">("cache");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  // Initialize states when testCases change or modal opens
  useEffect(() => {
    if (isOpen && !wasOpenRef.current && testCases.length > 0) {
      wasOpenRef.current = true;
      const initial: Record<number, RunResult> = {};
      testCases.forEach((tc) => {
        const tcStatus = (tc as any).status;
        const tcLogs = (tc as any).logs;
        const hasPreviousLogs = Array.isArray(tcLogs) && tcLogs.length > 0;

        initial[tc.id] = {
          testCaseId: tc.id,
          status: (tcStatus === "passed" || tcStatus === "failed") ? tcStatus : "idle",
          logs: hasPreviousLogs ? tcLogs : ["Waiting to run..."],
          browserbaseScript: tc.browserbaseScript || undefined,
          sessionId: (tc as any).sessionId || (tc as any).session_id || undefined,
          sessionUrl: (tc as any).sessionUrl || (tc as any).session_url || undefined,
        };
      });
      setResults(initial);
      setSelectedDetailId(testCases[0].id);
      setCurrentIdx(-1);
      setIsExecuting(false);
      setCustomPrompt("");

      // Prefill with repository's saved website URL if available
      setBaseUrl(repository?.targetDomain || repository?.websiteUrl || "http://localhost:3000");

      // Auto-detect if any selected testcase doesn't have a cached script.
      // If even one doesn't have a script, default to "generate" mode.
      const hasMissingScript = testCases.some(tc => !tc.browserbaseScript);
      setExecutionMode(hasMissingScript ? "generate" : "cache");
    } else if (!isOpen) {
      wasOpenRef.current = false;
    }
  }, [isOpen, testCases, repository]);

  // Auto-scroll logs to bottom without scrolling parent containers
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [results, selectedDetailId]);

  const runTest = async (index: number) => {
    const currentTestCase = testCases[index];
    const tcId = currentTestCase.id;

    setSelectedDetailId(tcId);

    const isRegenerating = executionMode === "generate" || !results[tcId]?.browserbaseScript;

    setResults((prev) => ({
      ...prev,
      [tcId]: {
        ...prev[tcId],
        status: isRegenerating ? "generating" : "running",
        logs: [
          isRegenerating
            ? "[SYSTEM] Connecting to AI agent to analyze files and generate script..."
            : "[SYSTEM] Found pre-generated script cached in database, preparing execution...",
        ],
      },
    }));

    try {
      const res = await axios.post("/api/test-cases/run", {
        testCaseId: tcId,
        baseUrl: baseUrl.trim(),
        mode: executionMode,
        customPrompt: customPrompt.trim(),
      });

      const data = res.data;

      if (data.credits !== undefined) {
        setUserDetail((prev: any) => ({
          ...prev,
          credits: data.credits,
        }));
      }

      setResults((prev) => ({
        ...prev,
        [tcId]: {
          testCaseId: tcId,
          status: data.status,
          logs: data.logs || [],
          browserbaseScript: data.browserbaseScript,
          sessionId: data.sessionId,
          sessionUrl: data.sessionUrl,
          error: data.error,
        },
      }));
      return data.status === "passed";
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || "Execution failed";

      const data = err.response?.data;
      if (data && data.credits !== undefined) {
        setUserDetail((prev: any) => ({
          ...prev,
          credits: data.credits,
        }));
      }

      setResults((prev) => ({
        ...prev,
        [tcId]: {
          ...prev[tcId],
          status: "failed",
          error: errMsg,
          logs: [...(prev[tcId]?.logs || []), `[SYSTEM ERROR] ${errMsg}`],
        },
      }));
      return false;
    }
  };

  const startExecution = async () => {
    setIsExecuting(true);
    for (let i = 0; i < testCases.length; i++) {
      const currentTestCase = testCases[i];
      const tcId = currentTestCase.id;
      const isRegenerating = executionMode === "generate" || !results[tcId]?.browserbaseScript;
      const cost = isRegenerating ? 10 : 5;
      const currentCredits = userDetail?.credits ?? 0;

      if (currentCredits < cost) {
        setSelectedDetailId(tcId);
        setResults((prev) => ({
          ...prev,
          [tcId]: {
            ...prev[tcId],
            status: "failed",
            error: "Insufficient credits",
            logs: [
              `[SYSTEM ERROR] Insufficient credits. This test case requires ${cost} credits, but you only have ${currentCredits}.`,
              `Please upgrade / renew your subscription to get more credits.`,
            ],
          },
        }));
        break; // Halt execution queue
      }

      setCurrentIdx(i);
      const passed = await runTest(i);
      // If execution was stopped manually, break loop
      if (currentIdx === -2) break;
    }
    setIsExecuting(false);
    setCurrentIdx(-1);
  };

  const stopExecution = () => {
    setIsExecuting(false);
    setCurrentIdx(-2); // Special value to cancel loop
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSelectedResult = selectedDetailId ? results[selectedDetailId] : null;
  const currentSelectedTestCase = testCases.find((tc) => tc.id === selectedDetailId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-5xl w-full p-6 bg-white rounded-2xl shadow-2xl border overflow-hidden"
        style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <DialogHeader className="border-b pb-4 flex flex-row items-center justify-between shrink-0">
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PlayCircle className="h-6 w-6 text-primary" />
              Browserbase Cloud Test Runner
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Run automation scripts completely in the cloud using Browserbase headless infrastructure.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Target Configuration Header */}
        <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-200/80 gap-3 shrink-0">
          
          {/* Credit Alert Banner */}
          {userDetail && userDetail.credits < 10 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Out of credits!</strong> You have <strong>{userDetail.credits}</strong> credits left. You need at least 10 credits to run tests.
                </span>
              </div>
              <Button
                size="sm"
                className="h-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg px-3 border-0"
                onClick={() => {
                  onClose();
                  router.push("/pricing");
                }}
              >
                Upgrade / Renew
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-primary" /> TARGET WEBSITE URL
              </label>
              <Input
                placeholder="e.g. http://localhost:3000"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                disabled={isExecuting}
                className="bg-white border-gray-300 font-mono text-sm shadow-xs h-10"
              />
            </div>
            <div className="flex gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOptions(!showOptions)}
                className={`h-10 px-4 font-medium text-sm gap-1.5 transition-colors border-gray-300 ${
                  showOptions ? "bg-gray-100" : ""
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Execution Options
                {showOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {isExecuting ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={stopExecution}
                  className="h-10 px-5 font-semibold text-sm gap-1.5"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Stop Execution
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={startExecution}
                  disabled={userDetail && userDetail.credits < 5}
                  className="h-10 px-5 font-semibold text-sm gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Start Execution
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Options Slidedown */}
          {showOptions && (
            <div className="border-t pt-3 mt-1 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-primary" /> Script Execution Mode
                </label>
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setExecutionMode("cache")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
                      executionMode === "cache"
                        ? "bg-primary text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Use Cached Script (Fast)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExecutionMode("generate")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                      executionMode === "generate"
                        ? "bg-primary text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    Force Regenerate (AI)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Custom AI Instructions
                </label>
                <Input
                  placeholder="e.g. Type test details in input fields, click submit..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="bg-white border-gray-300 text-xs shadow-xs h-9"
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Interface Layout */}
        <div className="flex-1 min-h-0 flex gap-4">
          {/* Left Column: Test Case list */}
          <div className="w-1/3 border rounded-xl overflow-y-auto bg-gray-50 p-3 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 py-1">
              EXECUTION QUEUE ({testCases.length})
            </h3>
            {testCases.map((tc, index) => {
              const res = results[tc.id];
              const isSelected = selectedDetailId === tc.id;
              const isCurrent = currentIdx === index;

              return (
                <button
                  key={tc.id}
                  onClick={() => setSelectedDetailId(tc.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-white border-primary shadow-xs ring-1 ring-primary/20"
                      : "bg-white hover:bg-gray-100/50 border-gray-200"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs text-gray-900 truncate">
                      {tc.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {tc.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isCurrent && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    )}

                    {res?.status === "idle" && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal text-gray-500 bg-gray-100/50 border-gray-200">
                        Queued
                      </Badge>
                    )}
                    {res?.status === "generating" && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-medium text-amber-600 bg-amber-50 border-amber-200 flex items-center gap-1">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" /> AI
                      </Badge>
                    )}
                    {res?.status === "running" && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-medium text-blue-600 bg-blue-50 border-blue-200 flex items-center gap-1">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" /> Running
                      </Badge>
                    )}
                    {res?.status === "passed" && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" /> Passed
                      </Badge>
                    )}
                    {res?.status === "failed" && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-rose-700 bg-rose-50 border-rose-200 flex items-center gap-0.5">
                        <XCircle className="h-3 w-3 text-rose-600 shrink-0" /> Failed
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Execution logs, code, Browserbase Session details */}
          <div className="flex-1 border rounded-xl flex flex-col bg-white overflow-hidden">
            {currentSelectedTestCase && currentSelectedResult ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Panel Header */}
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {currentSelectedTestCase.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Expected: <span className="text-gray-600 italic">{currentSelectedTestCase.expectedResult}</span>
                    </p>
                  </div>

                  {currentSelectedResult.sessionUrl && (
                    <a
                      href={currentSelectedResult.sessionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors bg-white shadow-xs"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Watch Recording
                    </a>
                  )}
                </div>

                {/* Panel Content (Terminal Logs / Playwright Code Tabs) */}
                <div className="flex-1 min-h-0 flex flex-col p-4 gap-3">
                  <div className="flex-1 flex flex-col min-h-[300px] bg-gray-950 rounded-xl overflow-hidden shadow-inner relative">
                    <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-gray-800 shrink-0">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="h-3.5 w-3.5 text-green-500" /> Console Terminal Output
                      </span>
                    </div>

                    <div 
                      ref={terminalRef}
                      className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-emerald-400 space-y-1"
                    >
                      {currentSelectedResult.logs.map((log, idx) => {
                        let color = "text-emerald-400";
                        if (log.startsWith("[SYSTEM]")) color = "text-blue-400 font-semibold";
                        if (log.startsWith("[SYSTEM ERROR]") || log.startsWith("[ERROR]")) color = "text-rose-400";
                        if (log.startsWith("[WARN]")) color = "text-amber-400";
                        if (log.startsWith("[BROWSER]")) color = "text-purple-400";

                        return (
                          <div key={idx} className={color}>
                            {log}
                          </div>
                        );
                      })}
                      {currentSelectedResult.status === "running" && (
                        <div className="text-blue-400 flex items-center gap-1.5 mt-1 font-semibold">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Execution in progress...
                        </div>
                      )}
                      {currentSelectedResult.status === "generating" && (
                        <div className="text-amber-400 flex items-center gap-1.5 mt-1 font-semibold">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> AI is generating automation code...
                        </div>
                      )}
                      <div className="h-6" />
                    </div>
                  </div>

                  {/* Generated Script Panel */}
                  {currentSelectedResult.browserbaseScript && (
                    <div className="h-1/4 flex flex-col border rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <div className="flex items-center justify-between bg-gray-100 px-3.5 py-1.5 border-b shrink-0">
                        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Code className="h-3.5 w-3.5 text-primary" /> Playwright Script Body
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(currentSelectedResult.browserbaseScript || "")}
                          className="h-7 px-2 text-xs text-gray-500 hover:text-gray-900"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 mr-1 text-green-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" /> Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                      <pre className="flex-1 p-3 overflow-y-auto text-[10px] font-mono text-gray-800 bg-white">
                        {currentSelectedResult.browserbaseScript}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Close & Refresh Button */}
                <div className="p-3 bg-gray-50 border-t flex justify-end shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="font-semibold text-xs border-gray-300 h-9"
                  >
                    Close & Refresh Status
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-3">
                <AlertCircle className="h-12 w-12 text-gray-300" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">No Test Selected</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
                    Select a test case from the queue on the left to inspect its logs and scripts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
