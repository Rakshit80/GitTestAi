"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Settings } from "lucide-react"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import { TestCase } from "./UserRepoList"
import axios from "axios"

type Props = {
  testCase?: TestCase
  setReload:any
}

function TestCaseSettingDialog({ testCase,setReload }: Props) {
  const [formTestCase, setFormTestCase] = useState({
    title: testCase?.title || "",
    description: testCase?.description || "",
    targetRoute: testCase?.targetRoute || "",
    expectedResult: testCase?.expectedResult || "",
  })

  const handleInputChange = (fieldName: string, value: string) => {
    setFormTestCase((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const updateCase =async () => {
   const result=await axios.post("/api/test-cases/settings",{
    ...formTestCase,
    testcaseId:testCase?.id
   })
   console.log(result.data)
   setReload(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Testing Requirements</DialogTitle>
          <DialogDescription>
            Modifying these parameters automatically clears pre-generated test cases.
          </DialogDescription>
        </DialogHeader>

        <div>
          {/* TITLE */}
          <div className="mt-1">
            <label className="text-gray-500">TEST TITLE</label>
            <Input
              value={formTestCase.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Test Title"
              className="mt-1"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-5">
            <label className="text-gray-500">DESCRIPTION/ACTION</label>
            <Textarea
              value={formTestCase.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description"
              className="mt-1"
            />
          </div>

          {/* TARGET ROUTE */}
          <div className="mt-5">
            <label className="text-gray-500">TARGET ROUTE/PATH</label>
            <Input
              value={formTestCase.targetRoute}
              onChange={(e) => handleInputChange("targetRoute", e.target.value)}
              placeholder="Target Route"
              className="mt-1"
            />
          </div>

          {/* EXPECTED RESULT */}
          <div className="mt-5">
            <label className="text-gray-500">EXPECTED RESULT</label>
            <Textarea
              value={formTestCase.expectedResult}
              onChange={(e) =>
                handleInputChange("expectedResult", e.target.value)
              }
              placeholder="Expected Result"
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={updateCase}>Update Case</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TestCaseSettingDialog