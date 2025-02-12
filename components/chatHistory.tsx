'use client'

import { useEffect, useState } from 'react'

interface Message {
  role: string;
  content: string | { type: string; text?: string; image_url?: { url: string } }[];
}

interface ChatHistoryProps {
  option: string;
}

export default function ChatHistory({ option }: ChatHistoryProps) {
  const [chatHistory, setChatHistory] = useState<Message[]>([])

  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await fetch(`/api/chat-history?option=${option}`)
      const data = await response.json()
      setChatHistory(data.messages)
    }

    fetchChatHistory()
  }, [option])

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Chat History</h2>
      {chatHistory.map((message, index) => (
        <div key={index} className="mb-2">
          <strong>{message.role}: </strong>
          {typeof message.content === 'string' ? (
            message.content
          ) : (
            message.content.map((content, contentIndex) => (
              <div key={contentIndex}>
                {content.type === 'text' && content.text}
                {content.type === 'image_url' && content.image_url && (
                  <img src={content.image_url.url || "/placeholder.svg"} alt="Image" className="max-w-xs mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  )
}