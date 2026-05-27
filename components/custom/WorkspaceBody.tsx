"use client"
import React, { useContext, useState, useEffect } from "react"
import Image from "next/image"
import { UserDetailContext } from "@/context/UserDetailContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "../ui/card"
import EmptyWorkspace from "./EmptyWorkspace"
import { useRouter } from "next/navigation"
import axios from "axios"
import RepoDialog, { Repo } from "./RepoDialog"
import UserRepoList from "./UserRepoList"

 export type UserRepo={
  id:number;
  name:string;
  fullName:string;
  owner:string;
  htmlUrl:string;
  language:string;
  defaultBranch:string;
  description:string;
  private:boolean;
  updatedAt:string;
repoId:number;
userId:number;
targetDomain?:string;
gloablInstruction?:string;
 
}
function WorkspaceBody() {
  const { userDetail } = useContext(UserDetailContext)
 const[userRepoList,setUserRepoList]=useState<UserRepo[]>([]);
 const router=useRouter();
 const [token,setToken]=useState('');
 useEffect(()=>{
  GetGithubUserToken();
  
 },[])
useEffect(() => {
  userDetail && GetUserAddedRepoList();
}, [userDetail])

 const GetGithubUserToken=async()=>{
    const result=await axios.get('/api/github/token');
    console.log(result.data.token)
    setToken(result.data.token);
 }

 const OnAddRepo=async()=>{
  router.push('/api/github');
 }

 const GetUserAddedRepoList=async()=>{
    const result = await axios.get(`/api/user-repo?userId=${userDetail?.id}`);
    console.log(result.data)
    setUserRepoList(result.data);
 }

  return (
    <div className="p-6">
      
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-3xl">Workspace</h2>

        <h2 className="text-blue-800 px-3 py-1 bg-blue-100 rounded-lg text-sm">
          Remaining Credit: {userDetail?.credits ?? 0}
        </h2>
      </div>

      {/* Github Connect Card */}
      <Card className="mt-6 flex justify-between items-center border rounded-xl p-5 shadow-sm">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          <Image
            src="/github.png"
            alt="github"
            width={40}
            height={40}
          />
          <h2 className="text-lg font-medium">
            Connect GitHub & Add Repository
          </h2>
        </div>

        {/* Right */}
        <div>
       {!token? <Button className="px-4 py-2" onClick={OnAddRepo}>
          Setup
        </Button>
        :<RepoDialog setRefreshPage={(refresh:boolean)=>GetUserAddedRepoList()}/>
      }

        </div>
      </Card>

       {!userRepoList? <Card className='mt-10'>
        <CardContent>
           
        <EmptyWorkspace/>
        </CardContent>

      </Card>:
       <UserRepoList repoList={userRepoList} setReload={()=>GetUserAddedRepoList()}/>}

    </div>
  )
}

export default WorkspaceBody