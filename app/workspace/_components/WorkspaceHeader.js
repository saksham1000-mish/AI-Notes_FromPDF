import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'

function WorkspaceHeader({fileName}){
        const {fileId}=useParams();
    return (
        <div className='p-4 flex justify-between shadow-md'>
            <Image src={'/logo.svg'} alt='logo' width={140} height={100}/>
            <h2 className='font-semibold'>{fileName}</h2>
            <div className='flex gap-2 items-center'>
                <Button>Save</Button>
                <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-12 h-12 border-2 border-gray-300 shadow-lg", // Larger avatar with border
                          userButtonPopoverCard: "bg-white shadow-xl p-4 rounded-lg", // Stylish dropdown
                          userPreview: "text-gray-900 font-semibold", // Name & email styles
                          userButtonTrigger: "hover:opacity-80 transition duration-200", // Hover effect
                        },
                      }}
                    />
            </div>
            

        </div>
    )
}

export default WorkspaceHeader