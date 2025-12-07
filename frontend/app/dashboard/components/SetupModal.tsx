"use client"

import { useState, useEffect } from "react"
import { Loader2, Github, Check, X } from "lucide-react"

type Repo = {
  id: number
  name: string
  full_name: string
  private?: boolean
  description?: string
}

type SetupModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function SetupModal({ isOpen, onClose, onSuccess }: SetupModalProps) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const fetchRepos = async () => {
      const token = localStorage.getItem("devmemory_token")
      if (!token) return

      try {
        setLoading(true)
        setError(null)
        
        const res = await fetch("http://localhost:8000/repos/github", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch repos: HTTP ${res.status}`)
        }

        const data = await res.json()
        
        if (Array.isArray(data)) {
          setRepos(data)
        } else {
          console.error("Expected array but got:", data)
          setRepos([])
          setError("Invalid response from server")
        }
      } catch (err: any) {
        console.error("Error fetching repos:", err)
        setError(err.message || "Failed to load repositories")
        setRepos([])
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [isOpen])

  const toggleRepo = (fullName: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(fullName) ? next.delete(fullName) : next.add(fullName)
      return next
    })
  }

  const handleContinue = async () => {
    if (selected.size === 0) return
    setSubmitting(true)
    setError(null)

    const token = localStorage.getItem("devmemory_token")

    try {
      const res = await fetch("http://localhost:8000/setup/complete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repositories: Array.from(selected),
        }),
      })

      if (!res.ok) {
        throw new Error(`Failed to save repositories: HTTP ${res.status}`)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Error saving repositories:", err)
      setError(err.message || "Failed to save selections")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold">Select Repositories</h2>
            <p className="text-slate-400 mt-1">
              Choose which repositories DevMemory should index.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-4" />
              <p className="text-slate-300">Loading your repositories from GitHub...</p>
            </div>
          ) : repos.length === 0 ? (
            <div className="text-center py-12">
              <Github className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No repositories found</h3>
              <p className="text-slate-400">
                {error ? error : "You don't have any repositories on GitHub, or there was an error loading them."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {repos.map(repo => (
                <button
                  key={repo.id}
                  onClick={() => toggleRepo(repo.full_name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition text-left
                    ${selected.has(repo.full_name)
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"}
                  `}
                >
                  <div className="flex-shrink-0">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{repo.full_name}</span>
                      {repo.private && (
                        <span className="px-2 py-0.5 text-xs bg-slate-800 rounded border border-slate-700">
                          Private
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-slate-400 truncate">{repo.description}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {selected.has(repo.full_name) && (
                      <Check className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              {selected.size > 0 ? (
                <span>
                  <span className="text-cyan-400 font-medium">{selected.size}</span> repository{selected.size > 1 ? 'ies' : ''} selected
                </span>
              ) : (
                "Select at least one repository to continue"
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={selected.size === 0 || submitting || loading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 hover:from-cyan-400 hover:to-blue-400 transition"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  `Continue with ${selected.size} repos`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}