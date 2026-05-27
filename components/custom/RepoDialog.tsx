import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button } from "../ui/button"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { UserDetailContext } from "@/context/UserDetailContext"

 export type Repo={
  id:number;
  name:string;
  full_name:string;
  owner:string;
  private_:boolean;
  updated_at:string;
  description:string;
  html_url:string;
  default_branch:string;
  language:string;
}


function RepoDialog({ setRefreshPage }: { setRefreshPage: (value: boolean) => void }){
const [selectedRepo,setSelectedRepo]=useState<Repo |null>(null)
  const [repoList, setRepoList]=useState<Repo[]>([]);
    const[searchTerm,setSearchTerm]=useState('');
  const{userDetail}=useContext(UserDetailContext) ; 
    const [isOpen,setIsOpen]=useState(false);
  const GetRepoList=async()=>{
        const result=await axios.get('/api/github/repos')
        console.log(result);
        setRepoList(result.data);
    }
    useEffect(()=>{
        GetRepoList();
    },[])

    const filteredRepoList=useMemo(()=>{
      const q=searchTerm.toLowerCase().trim();
      if(!q)return repoList;
      return repoList.filter(r=>
        r.full_name.toLowerCase().includes(q) 
      )
},[searchTerm,repoList])
const SaveRepoToDB= async()=>{
 if(!selectedRepo) return; 
const result=await axios.post('/api/user-repo',{
repoId:selectedRepo.id,
name:selectedRepo.name,
full_name:selectedRepo.full_name,
html_url:selectedRepo.html_url,
private_:selectedRepo.private_,
description:selectedRepo.description,
userId:userDetail?.id,
owner:selectedRepo.owner,
updatedAt:selectedRepo.updated_at,
language:selectedRepo.language,
defaultBranch:selectedRepo.default_branch,



});
console.log(result.data);
setIsOpen(false);
setRefreshPage(true);



}

  return (
    <Dialog open={isOpen} onOpenChange={(open)=>setIsOpen(open)}>
  <DialogTrigger asChild>
    <Button>+ Add Repo</Button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Repository</DialogTitle>
      <DialogDescription>
        Search and select one of your github repositories
      </DialogDescription>
    </DialogHeader>

    <div>
      {/* Repo List */}
      <Input placeholder="Search repos by name." className="mb-4" onChange={(event)=>setSearchTerm(event.target.value)}/>
         <ul className="max-h-60 overflow-y-auto border rounded-xl mt-4">
  {filteredRepoList.map((repo) => (
    <li
      key={repo.id}
      className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
        selectedRepo?.id === repo.id ? "bg-gray-100" : ""
      }`}
      onClick={() => setSelectedRepo(repo)}
    >
      {repo.full_name}
    </li>
  ))}
</ul> 

    </div>

    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>

      <Button onClick={()=>SaveRepoToDB()}>Add</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default RepoDialog