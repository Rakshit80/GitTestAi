"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Settings2 } from "lucide-react";
import { UserRepo } from "./WorkspaceBody";
import axios from "axios";

type props={
 repo:UserRepo
 setReload:()=>void;
}
function RepoSettings({repo,setReload}:props) {
  const [isOpen,setIsOpen]=useState(false);
  const [repoSettings,setRepoSettings]=React.useState({
    targetDomain:repo?.targetDomain||'',
    gloablInstruction:repo?.gloablInstruction||'',
  })


  const handleSaveSettigns=async()=>{
    const result=await axios.post('/api/user-repo/settings',{  
      repoId:repo.repoId,
      targetDomain:repoSettings.targetDomain,
      globalInstruction:repoSettings.gloablInstruction,
    });
    console.log(result?.data);
    setIsOpen(false);
    setReload();

  }
  return (
    <Dialog open={isOpen} onOpenChange={(open)=>setIsOpen(open)}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings2 className="h-4 w-4 mr-1" />
          Project Config
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Settings2 className="text-primary" />
            Project/Repo Settings
          </DialogTitle>

          <DialogDescription>
            Configure project-level defaults used during script generation and execution.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="mt-4">
          {/* App URL */}
          <div>
            <label className="text-gray-500">
              APP URL / DEFAULT WEBSITE
            </label>

            <Input value={repoSettings?.targetDomain}
            onChange={(e)=>setRepoSettings({...repoSettings,targetDomain:e.target.value})}
              placeholder="App url / Domain"
              className="mt-1"
            />

            <p className="text-xs text-gray-400">
              The target address where automated headless browsers will connect and run test cases.
            </p>
          </div>

          {/* Global Instructions */}
          <div className="mt-4">
            <label className="text-gray-500">
              GLOBAL TEST INSTRUCTIONS
            </label>

            <Textarea value={repoSettings?.gloablInstruction}
            
              onChange={(e)=>setRepoSettings({...repoSettings,gloablInstruction:e.target.value})}
              placeholder="Instructions"
              className="mt-1"
            />

            <p className="text-xs text-gray-400">
              Include any authentication or teardown instructions. These are automatically appended to prompts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          <Button onClick={handleSaveSettigns}>Save Config</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RepoSettings;