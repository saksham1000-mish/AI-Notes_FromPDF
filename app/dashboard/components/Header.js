import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Header(){
    return(
        <div className='flex justify-end p-5 shadow-sm'>
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
    )
}

export default Header