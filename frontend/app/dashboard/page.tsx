"use client"

import { useEffect, useState } from "react"

type MeResponse = {
  id: number
  username: string
  avatar: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("devmemory_token")

    console.log("Full token:", token)
    console.log("Token length:", token?.length)

    // Test the token manually
  if (token) {
    fetch(`http://localhost:8000/debug/token?token=${token}`)
      .then(res => res.json())
      .then(data => console.log("Token debug:", data))
  }
  
    if (!token) {
      setError("No token found in localStorage")
      setLoading(false)
      return
    }

    console.log("Token found:", token.substring(0, 20) + "...") // Log first 20 chars

    fetch("http://localhost:8000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log("Response status:", res.status)
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`HTTP ${res.status}: ${errorText}`)
        }
        return res.json()
      })
      .then(data => {
        console.log("User data:", data)
        setUser(data)
        setError(null)
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!user) return <p>No user data</p>

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user.username}</h1>
      <img
        src={user.avatar}
        alt={user.username}
        className="w-16 h-16 rounded-full"
      />
    </main>
  )
}