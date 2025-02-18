"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/header";
import { PdfViewerModal } from "@/components/pdf-viewer-model";

interface Message {
  role: string;
  content:
    | string
    | { type: string; text?: string; image_url?: { url: string } }[];
  sources?: number[];
}

// Replace this with your actual PDF URL
const SOLIX_PDF_URL = "https://solix-chatbot.vercel.app/manual.pdf";

export default function ChatHistory() {
  const params = useParams();
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/chat-history?option=${params.option}&id=${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data = await response.json();
        setChatHistory(data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError("Failed to load chat history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [params.option, params.id]);

  const getPageTitle = () => {
    switch (params.option) {
      case "namami-gange":
        return "Namami Gange Chat";
      case "citizen-reporting":
        return "Citizen Report Chat";
      default:
        return "Chat History";
    }
  };

  const openPdfAtPage = (pageNumber: number) => {
    setCurrentPdfPage(pageNumber);
    setIsPdfModalOpen(true);
  };

  return (
    <div>
      <Header
        title={getPageTitle()}
        showBackButton
        backUrl={`/chat/${params.option}`}
      />
      <div className="container mx-auto p-4 max-w-4xl">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-4 max-w-[85%] ${
                    message.role === "user" ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <div className="font-medium mb-1 text-sm text-gray-600">
                    {message.role === "user" ? "User" : "Assistant"}
                  </div>
                  {typeof message.content === "string" ? (
                    message.role === "assistant" ? (
                      <>
                        <ReactMarkdown
                          className="prose prose-sm max-w-none"
                          components={{
                            p: ({ ...props }) => (
                              <p className="text-gray-800" {...props} />
                            ),
                            h1: ({ ...props }) => (
                              <h1 className="text-xl font-bold" {...props} />
                            ),
                            h2: ({ ...props }) => (
                              <h2 className="text-lg font-bold" {...props} />
                            ),
                            code: ({ ...props }) => (
                              <code
                                className="bg-gray-100 rounded px-1"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        {message.role === "assistant" &&
                          message.sources &&
                          message.sources.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Sources:{" "}
                              {message.sources.map((source, index) => (
                                <span key={index}>
                                  <button
                                    onClick={() => openPdfAtPage(source)}
                                    className="text-[#E31837] hover:underline"
                                  >
                                    Page {source}
                                  </button>
                                  {index < message.sources!.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))}
                            </div>
                          )}
                      </>
                    ) : (
                      <p className="text-gray-800">{message.content}</p>
                    )
                  ) : (
                    <div className="space-y-2">
                      {message.content.map((content, contentIndex) => (
                        <div key={contentIndex}>
                          {content.type === "text" &&
                            (message.role === "assistant" ? (
                              <>
                                <ReactMarkdown
                                  className="prose prose-sm max-w-none"
                                  components={{
                                    p: ({ ...props }) => (
                                      <p className="text-gray-800" {...props} />
                                    ),
                                    h1: ({ ...props }) => (
                                      <h1
                                        className="text-xl font-bold"
                                        {...props}
                                      />
                                    ),
                                    h2: ({ ...props }) => (
                                      <h2
                                        className="text-lg font-bold"
                                        {...props}
                                      />
                                    ),
                                    code: ({ ...props }) => (
                                      <code
                                        className="bg-gray-100 rounded px-1"
                                        {...props}
                                      />
                                    ),
                                  }}
                                >
                                  {content.text || ""}
                                </ReactMarkdown>
                              </>
                            ) : (
                              <p className="text-gray-800">{content.text}</p>
                            ))}
                          {content.type === "image_url" &&
                            content.image_url && (
                              <img
                                src={
                                  content.image_url.url || "/placeholder.svg"
                                }
                                alt="Image"
                                className="max-w-full mt-2 rounded"
                              />
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={SOLIX_PDF_URL}
        pageNumber={currentPdfPage}
      />
    </div>
  );
}
