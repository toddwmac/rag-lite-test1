'use client';

import { useChat } from 'ai/react';
import { Send, Bot, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          RAG-Lite Notebook
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                <Bot className="w-12 h-12 opacity-20" />
                <p>Ask anything about your documents in the /data folder.</p>
              </div>
            )}
            {messages.map((m: any) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 opacity-70 text-xs font-bold uppercase tracking-wider">
                    {m.role === 'user' ? (
                      <><User className="w-3 h-3" /> You</>
                    ) : (
                      <><Bot className="w-3 h-3" /> Claude</>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border p-4 rounded-2xl rounded-tl-none shadow-sm animate-pulse flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t">
            <form
              onSubmit={handleSubmit}
              className="max-w-4xl mx-auto relative flex items-center"
            >
              <input
                className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                value={input}
                placeholder="Ask a question..."
                onChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={isLoading || !input?.trim()}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
