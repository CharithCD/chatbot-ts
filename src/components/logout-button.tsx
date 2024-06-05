'use client'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react'
const LogoutButton = () => {
    const router = useRouter();
    const logout = () => {
        const response = fetch("/api/auth/logout");
        response.then((res) => {
            if (res.status === 200) {
                router.push("/login");
            }
        });
    }
    return (
        <Button className="ml-auto flex-1 sm:max-w-2: sm:flex-initial" onClick={logout}>
            Logout
        </Button>
    )
}

export default LogoutButton