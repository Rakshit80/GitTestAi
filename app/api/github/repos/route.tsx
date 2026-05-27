import { NextResponse } from "next/server";
import { cookies } from "next/headers"; 

export const dynamic = 'force-dynamic';

export async function GET(){
    const cookiesStore=await cookies();
    const token=cookiesStore.get('gh_token')?.value;
    if(!token){
        return new NextResponse(JSON.stringify({error:'Token not found'}),{status:401})

    }
    console.log('Using token type:', token.substring(0, 4));
    const allRepo=[];
    let page=1;
    while(true){
        const res=await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}`,{
            cache: 'no-store',
            headers:{
                Authorization: `Bearer ${token}`,
                Accept:'application/vnd.github+json',
                'User-Agent': 'ai-testing-agent-n'
            }
        })
  if (!res.ok) {
     const errorText = await res.text();
     console.error('GitHub API error:', errorText);
     return NextResponse.json({ error: 'GitHub API error', details: errorText }, { status: res.status });
  }
  const repos=await res.json();
  if(!repos || !repos.length){
    break;
  }
  allRepo.push(...repos);
  page++

    }
  return NextResponse.json(
  allRepo.map((r) => ({
    id: r.id,
    name: r.full_name,
    full_name: r.full_name,
    private_: r.private,
    html_url: r.html_url,
    description: r.description,
    updated_at: r.updated_at,
    language: r.language,
    default_branch: r.default_branch,
    owner:r.owner.login,
  }))
);



}