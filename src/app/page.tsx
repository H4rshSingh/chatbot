// src/app/page.tsx
"use client";

import { useState } from "react";
import ChatInput from "@/components/ui/ChatInput";
import MessageWindow from "@/components/ui/MessageWindow";
import SettingsModal from "@/components/ui/SettingsModal";
import { ChatHistory, ChatSettings, Message, MessageRole } from "@/types";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [history, setHistory] = useState<ChatHistory>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    temperature: 1,
    model: "gemini-1.5-flash",
    systemInstruction: "you are a helpful assistant",
  });

  const handleSend = async (message: string) => {
    const newUserMessage: Message = {
      role: "user" as MessageRole,
      parts: [{ text: message }],
    };

    const updatedHistory = [...history, newUserMessage];
    setHistory(updatedHistory);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: message,
          history: updatedHistory,
          settings: settings,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("AI Error:", data.error);
        return;
      }

      const aiMessage: Message = {
        role: "model" as MessageRole,
        parts: [{ text: data.response }],
      };

      setHistory([...updatedHistory, aiMessage]);
    } catch (error) {
      console.error("Request Failed:", error);
    }
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleSaveSettings = (newSettings: ChatSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="flex flex-col  pb-32">
      <div className="fixed w-full flex items-center justify-center h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
        {/* Home button */}
        <button
          className="absolute left-4 text-white hover:text-gray-200 cursor-pointer"
          onClick={() => router.push("http://localhost:3000/")}
          aria-label="Home"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7m-7 7v8a2 2 0 002 2h3m10-10l-2-2m0 0l-7-7m7 7v8a2 2 0 01-2 2h-3"
              />
            </svg>
            <span className="ml-1 text-lg">Home</span>
          </div>
        </button>

        QueryAI by CivicDesk
      </div>
      <div className="flex-1 pt-20  pb-3 overflow-y-auto max-w-lg mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-center text-2xl font-bold mb-4">Welcome to QueryAI</h1>
          <p className="text-center text-gray-600 mb-4">
            Your AI assistant is ready to help you!
          </p>
        </div>
      </div>
      <MessageWindow history={history} />

      {/* <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
        currentSettings={settings}
      /> */}
      <ChatInput onSend={handleSend} onOpenSettings={handleOpenSettings} />
    </div>
  );
}
