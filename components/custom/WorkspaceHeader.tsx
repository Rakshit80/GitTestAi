import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

function WorkspaceHeader() {
  return (
    <div className='flex items-center justify-between w-full px-6 py-3'>
      
      {/* Logo */}
      <Image 
        src="/logo.svg" 
        alt="logo" 
        width={120} 
        height={40}
        className='object-contain'
      />

      {/* Menu */}
      <ul className='flex gap-10 text-[16px] font-medium'>
        <li className='hover:text-blue-600 cursor-pointer'>
          <Link href="/workspace">Workspace</Link>
        </li>
        <li className='hover:text-blue-600 cursor-pointer'>
          <Link href="/pricing">Pricing</Link>
        </li>
        <li className='hover:text-blue-600 cursor-pointer'>
          <Link href="/workspace/documentation">Documentation</Link>
        </li>
      </ul>

      {/* User Button (placeholder) */}

      <UserButton/>

    </div>
  )
}

export default WorkspaceHeader