"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-muted/40">
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                    <Link className="flex items-center gap-2 font-semibold" href="/admin">
                        <span className="">Celeste Admin</span>
                    </Link>
                    <nav className="ml-auto flex gap-4 sm:gap-6">
                        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin">
                            Dashboard
                        </Link>
                        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin/requests">
                            Requests
                        </Link>
                        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin/settings">
                            Settings
                        </Link>
                        <Button
                            variant="ghost"
                            className="h-auto p-0 text-sm font-medium hover:underline underline-offset-4"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            Sign Out
                        </Button>
                    </nav>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
            </div>
        </div>
    )
}
