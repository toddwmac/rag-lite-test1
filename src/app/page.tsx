'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState, useRef } from 'react';

export default function Chat() {
  // Use a local state for the input to avoid "undefined" or "read-only" hook issues
  const [localInput, setLocalInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize the hook
  const chat = useChat({
    onError: (err) => {
      console.error('CRITICAL_SDK_ERROR:', err);
    }
  });

  // Safe destructuring with fallbacks
  const messages = chat.messages || [];
  const isLoading = chat.isLoading || false;
  const error = chat.error;
  const append = chat.append;
  const handleSubmit = chat.handleSubmit;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll logic for the output area
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Robust submission handler
  const onFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const text = localInput.trim();
    if (!text || isLoading) return;

    console.log('--- SUBMISSION_START ---');
    console.log('Payload:', text);

    try {
      // Priority 1: Try useChat's internal handleSubmit if it's available
      if (typeof handleSubmit === 'function' && e) {
        console.log('Mode: handleSubmit');
        // We temporarily sync the hook's input state so handleSubmit can pick it up
        if (typeof chat.setInput === 'function') chat.setInput(text);
        
        // Use a timeout to let state settle if needed, but standard handleSubmit is usually fine
        handleSubmit(e);
        setLocalInput('');
      } 
      // Priority 2: Fallback to direct append() which is often more stable
      else if (typeof append === 'function') {
        console.log('Mode: append');
        await append({
          content: text,
          role: 'user',
        });
        setLocalInput('');
      } 
      else {
        console.error('FATAL: No submission method (handleSubmit or append) found in useChat');
      }
    } catch (err) {
      console.error('SUBMISSION_FAILED:', err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-white text-black font-mono overflow-hidden selection:bg-black selection:text-white">
      
      {/* 1. DATA_OUTPUT (Top 40%) */}
      <div 
        className="h-[40vh] overflow-y-auto border-b-4 border-black bg-gray-50 p-6 md:p-12 scroll-smooth"
        ref={scrollRef}
      >
        <div className="max-w-3xl mx-auto space-y-12">
          {messages.length === 0 ? (
            <div className="py-20 text-center opacity-20">
              <div className="text-4xl font-black italic tracking-tighter">STREAMS_INACTIVE</div>
              <div className="text-[10px] font-bold mt-2 uppercase tracking-[0.4em]">Initialize system with query</div>
            </div>
          ) : (
            <div className="space-y-16">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] font-black mb-2 opacity-40 uppercase tracking-widest">
                    {m.role === 'user' ? '[USER_TX]' : '[CLAUDE_RX]'}
                  </div>
                  <div className={`p-6 text-xl md:text-2xl border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-[85%] ${
                    m.role === 'user' ? 'bg-black text-white font-bold' : 'bg-white text-black'
                  }`}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center gap-6 py-8">
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-black animate-ping"></div>
                <div className="w-4 h-4 bg-black animate-ping [animation-delay:0.2s]"></div>
              </div>
              <span className="text-sm font-black uppercase tracking-[0.5em]">Processing...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-600 text-white p-6 border-4 border-black font-black uppercase shadow-[10px_10px_0px_0px_rgba(220,38,38,0.3)]">
              ERROR_DETECTED: {error.message}
            </div>
          )}
        </div>
      </div>

      {/* 2. COMMAND_CENTRE (Middle 40%) */}
      <div className="h-[40vh] flex flex-col items-center justify-center px-6 bg-white border-b-4 border-black relative">
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex justify-center">
             <span className="bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em]">Input Console</span>
          </div>
          
          <form 
            onSubmit={onFormSubmit}
            className="flex flex-col border-[8px] border-black bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
          >
            <div className="flex flex-col md:flex-row">
              <input
                autoFocus
                className="flex-1 p-8 text-2xl md:text-4xl font-black outline-none bg-transparent placeholder:text-gray-200"
                value={localInput}
                placeholder="PROMPT_HERE"
                onChange={(e) => setLocalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onFormSubmit();
                  }
                }}
              />
              <button
                type="submit"
                className="bg-black text-white px-12 py-8 font-black text-3xl hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 border-l-0 md:border-l-[8px] border-black"
                disabled={isLoading || !localInput.trim()}
              >
                SUBMIT
              </button>
            </div>
          </form>

          <div className="mt-12 flex justify-between text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
            <div>NETWORK: 127.0.0.1</div>
            <div>AUTH: CLAUDE_HAIKU_STABLE</div>
            <div>STATUS: LNK_READY</div>
          </div>
        </div>
      </div>

      {/* 3. BUFFER_ZONE (Bottom 20%) */}
      <div className="h-[20vh] bg-gray-100 flex items-center justify-center px-10">
        <div className="w-full max-w-5xl opacity-10 font-black text-[9px] uppercase tracking-[0.8em] text-center border-t border-black pt-8">
           Systems_Stable // Buffers_Clear // Encryption_High // RAG-Lite_OS
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Space Mono', monospace !important; 
          background: white;
          overflow: hidden;
        }
        ::-webkit-scrollbar { width: 14px; }
        ::-webkit-scrollbar-track { background: #fff; border-left: 4px solid #000; }
        ::-webkit-scrollbar-thumb { background: #000; border: 3px solid #fff; }
      `}</style>
    </div>
  );
}