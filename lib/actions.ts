"use server"

// Note: Authentication is handled client-side in app/login/page.tsx
// This server action is kept for compatibility but authentication
// should be done using the client-side signIn from "next-auth/react"

export async function authenticate(prevState: string | undefined, formData: FormData) {
    // Server-side authentication with NextAuth v4 requires client-side handling
    // Please use the login page at /login for authentication
    return "Please use the login page for authentication."
}
