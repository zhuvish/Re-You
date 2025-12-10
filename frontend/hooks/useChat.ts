"use client";

import { useState } from "react";
import {
  listChatSessions,
  createChatSession,
  sendChatMessage,
  getChatSession,
  type ChatSession,
} from "@/lib/chatApi";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

export function useChat(user: any) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  const loadSessions = async (token: string) => {
    const sessions = await listChatSessions(token);
    setChatSessions(sessions);
  };

  const startNewChat = async () => {
    if (!user) return;

    const token = localStorage.getItem("devmemory_token");
    if (!token) return;

    try {
      const session = await createChatSession(
        token,
        `Chat with ${user.username}`
      );

      if (session) {
        setCurrentSessionId(session.id);
        await loadSessions(token);
      }

      setMessages([
        {
          role: "assistant",
          content: `New chat started. What do you want to explore in your code today, ${user.username}?`,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Failed to create chat session", err);
    }
  };

  const openSession = async (sessionId: number) => {
    const token = localStorage.getItem("devmemory_token");
    if (!token) return;

    try {
      const data = await getChatSession(sessionId, token);
      if (!data) return;

      setCurrentSessionId(data.id);
      setMessages(
        data.messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.created_at ? new Date(m.created_at) : undefined,
        }))
      );
    } catch (err) {
      console.error("Failed to open session", err);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (isSending) return;

    const token = localStorage.getItem("devmemory_token");
    if (!token) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: new Date() },
    ]);

    setIsSending(true);
    try {
      const response = await sendChatMessage(
        token,
        text,
        currentSessionId || undefined
      );

      if (response?.session_id && !currentSessionId) {
        setCurrentSessionId(response.session_id);
        await loadSessions(token);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response?.answer || "No answer returned.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Backend unavailable." },
      ]);
    }
    setIsSending(false);
  };

  return {
    messages,
    setMessages,
    isSending,
    sendMessage,
    chatSessions,
    loadSessions,
    startNewChat,
    openSession,
    currentSessionId,
  };
}