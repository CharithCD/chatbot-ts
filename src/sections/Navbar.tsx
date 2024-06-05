'use client'

import React from 'react'
import { Menu, MessageSquareCode, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const menuItems = [
    // {
    //   name: 'Home',
    //   href: '#',
    // },
    // {
    //   name: 'About',
    //   href: '#',
    // },
    // {
    //     name: 'Contact',
    //     href: '/login',
    // },
    {
        name: 'Buy me a Coffee',
        href: 'https://buymeacoffee.com/damruwan',
    },
]

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <header className="relative z-10 max-w-screen-xl px-12 mx-auto mt-4 md:mt-0 lg:px-0 p-4">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className='flex gap-2 align-middle'>
                        <MessageSquareCode className='w-6 h-6 text-primary' />
                        <span className="font-bold text-primary">QueryMate</span>
                    </div>


                    <div className="flex gap-2 items-center md:gap-4">
                        {menuItems.map((item) => (
                            item.name === 'Buy me a Coffee' ?
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target='_blank'
                                    className="hidden md:flex hover:underline"
                                >
                                    {item.name}
                                </a>
                                :
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="hidden md:flex hover:underline"
                                >
                                    {item.name}
                                </a>
                        ))}
                        <Button asChild>
                            <Link href={'/login'}>Login</Link>
                        </Button>
                        <div className="lg:hidden">
                            <Menu onClick={toggleMenu} className="text-primary h-6 w-6 cursor-pointer" />
                        </div>
                    </div>




                    {isMenuOpen && (
                        <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
                            <div className="divide-y-2 divide-gray-50 rounded-lg bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="px-5 pb-6 pt-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary px-3 font-bold">Query Mate</span>
                                        <div className="-mr-2">
                                            <button
                                                type="button"
                                                onClick={toggleMenu}
                                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                            >
                                                <span className="sr-only">Close menu</span>
                                                <X className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <nav className="grid gap-y-4">
                                            {menuItems.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="-m-3 flex items-center rounded-md p-3 text-sm "
                                                >
                                                    <span className="ml-3 text-base">
                                                        {item.name}
                                                    </span>
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                    {/* <Button asChild className='mt-6 mx-3'>
                                        <Link href={'/login'}>Login</Link>
                                    </Button> */}
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </header>
        </>
    )
}
