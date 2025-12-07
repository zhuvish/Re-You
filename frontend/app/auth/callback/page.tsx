"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"


export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem("devmemory_token", token)
      console.log("Token saved to localStorage")
      
      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      console.error("No token found in URL")
      router.push("/")
    }
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Authenticating...</h1>
        <p>Please wait while we log you in.</p>
      </div>
    </div>
  )
}
