import { useState, useRef, useEffect } from "react"
import { 
  Github, 
  Plus, 
  FolderOpen, 
  Sparkles, 
  History, 
  Settings, 
  LogOut, 
  ChevronDown,
  Search 
} from "lucide-react"

type MeResponse = {
  id: number
  username: string
  avatar: string
}

type TabId = "chat" | "repos" | "history"

interface SidebarProps {
  user: MeResponse
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  startNewChat: () => void
  logout: () => void
}

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  startNewChat,
  logout
}: SidebarProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const SidebarTab = ({
    label,
    icon: Icon,
    active,
    onClick,
  }: {
    label: string
    icon: any
    active: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition ${
        active
          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/40"
          : "text-slate-400 hover:text-white hover:bg-slate-900/70"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )

  return (
    <aside className="w-72 border-r border-slate-800/60 p-6 flex flex-col bg-black/80 relative">
      {/* User with dropdown */}
      <div className="relative mb-8" ref={userDropdownRef}>
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-900/60 transition group"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.username}
              className="rounded-full border border-cyan-500/40"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold truncate">{user.username}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Github className="w-3 h-3" />
              <span>GitHub connected</span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown menu */}
        {showUserDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => {
                setShowUserDropdown(false)
                alert("Settings would open here")
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-900 transition text-left"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-500/10 text-red-400 hover:text-red-300 transition text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-col gap-2">
          <SidebarTab
            label="Chat"
            icon={Sparkles}
            active={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
          />
          <SidebarTab
            label="Repositories"
            icon={FolderOpen}
            active={activeTab === "repos"}
            onClick={() => setActiveTab("repos")}
          />
          <SidebarTab
            label="History"
            icon={History}
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <button
          onClick={startNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-sm font-medium hover:from-cyan-500 hover:to-blue-500 transition"
        >
          <Plus className="w-4 h-4" />
          New chat
        </button>
        <button
          onClick={() => alert("Repo indexing flow will go here")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs hover:border-cyan-500/40 transition"
        >
          <Search className="w-4 h-4" />
          Index repositories
        </button>
      </div>

      {/* Spacer to push content up */}
      <div className="flex-1"></div>

      {/* Status indicator */}
      <div className="pt-4 border-t border-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>System ready</span>
        </div>
      </div>
    </aside>
  )
}