"use client";

import { useEffect, useState } from "react";

export function useDashboardData() {
  const [user, setUser] = useState<any | null>(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRepoSetup, setShowRepoSetup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("devmemory_token");
    if (!token) {
      setError("No session found. Please log in again.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to load user.");

        const data = await res.json();
        setUser(data);
        setRepos(data.repositories || []);

        if (data.needs_setup) setShowRepoSetup(true);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    user,
    setUser,
    repos,
    setRepos,
    loading,
    error,
    showRepoSetup,
    setShowRepoSetup,
  };
}