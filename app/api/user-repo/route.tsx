import {db} from "@/db"
import {NextRequest, NextResponse} from "next/server";
import {repositories} from "@/db/schema"
import { eq } from "drizzle-orm";
export async function POST(req:NextRequest){
   const {repoId,userId,name,full_name,owner,html_url,private_,defaultBranch,updatedAt,language,description}=await req.json();
   const result=await db.insert(repositories).values({
 repoId,
 userId,
 name,
 fullName:full_name,
 owner,
 htmlUrl:html_url,
 language,
 description,
 private:private_? 1: 0,
 defaultBranch: defaultBranch,
}).returning();
   return NextResponse.json(result[0])
    
}

export async function GET(req:NextRequest){
   const {searchParams}=new URL(req.url)
   const userId=searchParams.get("userId");

   if (!userId || userId === 'undefined') {
      return NextResponse.json([]);
   }

   const result=await db.select().from(repositories).where(eq(repositories.userId, Number(userId)));
   return NextResponse.json(result)
}