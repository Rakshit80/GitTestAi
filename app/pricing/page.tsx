"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { PricingTable } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Zap } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function PricingPage() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Background glow graphics */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="max-w-5xl mx-auto mb-10 flex justify-between items-center relative z-10">
        <Button
          variant="ghost"
          onClick={() => router.push("/workspace")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspace
        </Button>

        {userDetail && (
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs">
            <Zap className="h-3.5 w-3.5 fill-blue-700" />
            Remaining Credits: {userDetail.credits}
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Pricing Tiers
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-950 font-serif">
          Upgrade Your Test Automation
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Choose the right plan to scale your E2E pipelines. Get 10,000 monthly credits instantly and unlock unlimited connected repositories.
        </p>
      </div>

      {/* Clerk Pricing Table Container (Full Width to allow space for checkout sidebar) */}
      <div className="w-full mb-12">
        <PricingTable />
      </div>
    </div>
  );
}