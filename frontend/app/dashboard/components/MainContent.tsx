import { User as UserIcon, Send, Loader2, BookOpen, History } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

type TabId = "chat" | "repos" | "history"

interface MainContentProps {
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  messages: Message[]
  input: string
  setInput: (v: string) => void
  isSending: boolean
  handleSend: () => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  formatTime: (d?: Date) => string
}

export default function MainContent({
  activeTab,
  setActiveTab,
  messages,
  input,
  setInput,
  isSending,
  handleSend,
  messagesEndRef,
  inputRef,
  formatTime
}: MainContentProps) {
  const sendOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="flex-1 flex flex-col bg-gradient-to-b from-black to-slate-950/70">
      {/* Header inside main */}
      <div className="px-8 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-4">
          {/* Logo on the left */}
          <div className="flex items-center gap-3">
            <img
              src="/brain-1.png"
              alt="DevMemory"
              width={36}
              height={36}
              className="rounded-md"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Your Developer Brain
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Ask questions about your code, across all indexed repositories.
              </p>
            </div>
          </div>
          
          {/* Spacer to push BookOpen to the right */}
          <div className="flex-1"></div>
          
          {/* BookOpen icon on the right */}
          <BookOpen className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1">
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="max-w-lg space-y-4">
                    <img
                      src="/brain-1.png"
                      alt="DevMemory"
                      width={120}
                      height={120}
                      className="mx-auto mb-2"
                    />
                    <h3 className="text-xl font-semibold">Ask anything about your code</h3>
                    <p className="text-slate-400 text-sm">
                      For example:
                    </p>
                    <div className="space-y-2 text-sm">
                      {[
                        "How does login work in my projects?",
                        "Show payment validation logic",
                        "Where do I handle JWT tokens?",
                      ].map((ex) => (
                        <button
                          key={ex}
                          onClick={() => setInput(ex)}
                          className="w-full text-left px-4 py-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition"
                        >
                          “{ex}”
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-cyan-600 to-blue-600"
                            : "bg-slate-900 border border-slate-800"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <UserIcon className="w-4 h-4" />
                        ) : (
                          <img
                            src="/brain-1.png"
                            alt="DevMemory"
                            width={18}
                            height={18}
                            className="rounded"
                          />
                        )}
                      </div>
                      <div className={`max-w-2xl ${msg.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30"
                              : "bg-slate-900/70 border border-slate-800"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.timestamp && (
                          <p className="text-[10px] text-slate-500 mt-1 px-1">
                            {formatTime(msg.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-800/60 px-8 py-4 bg-black/90">
              <div className="max-w-3xl mx-auto flex gap-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={sendOnEnter}
                  placeholder='Ask something like: "How is authentication implemented?"'
                  className="flex-1 bg-slate-900/70 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  disabled={isSending}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-medium flex items-center gap-2 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "repos" && (
          <div className="h-full p-8 text-sm text-slate-300">
            <h2 className="text-xl font-semibold mb-4">Repositories</h2>
            <p className="text-slate-400">
              This section will show your real GitHub repositories, indexing status, and
              allow you to select which repos are included in DevMemory.
            </p>
          </div>
        )}

        {activeTab === "history" && (
          <div className="h-full p-8 flex items-center justify-center text-center text-sm text-slate-300">
            <div>
              <History className="w-10 h-10 mx-auto mb-4 text-slate-600" />
              <p className="font-medium mb-2">Chat history coming soon</p>
              <p className="text-slate-500 mb-4">
                You&apos;ll be able to revisit old conversations and pin important answers here.
              </p>
              <button
                onClick={() => setActiveTab("chat")}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-medium hover:from-cyan-400 hover:to-blue-400 transition"
              >
                Back to chat
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}