'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState, useRef } from 'react';
import { Send, Bot, User, FileText, Loader2, Sparkles, Sidebar as SidebarIcon } from 'lucide-react';

export default function Chat() {
  const [localInput, setLocalInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { 
    messages, 
    append, 
    isLoading, 
    error 
  } = useChat({
    onError: (err) => {
      console.error('AI_SDK_ERROR:', err);
    }
  });

  useEffect(() => {
    setMounted(true);
    // Fetch file list for the sidebar
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (data.files) setFiles(data.files);
      })
      .catch(err => console.error('Error fetching files:', err));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const onFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = localInput.trim();
    if (!text || isLoading) return;

    try {
      await append({ content: text, role: 'user' });
      setLocalInput('');
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* 1. SIDEBAR (Fixed Knowledge Base) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 tracking-tight">
            <div className="bg-blue-600 p-1 rounded text-white"><Bot size={16} /></div>
            RAG-Lite
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FileText size={12} /> Documents
          </h3>
          <div className="space-y-1">
            {files.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-2">No documents found</p>
            ) : (
              files.map(file => (
                <div key={file} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors cursor-default truncate" title={file}>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  {file}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Connected: Claude 3 Haiku</div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* TOP OUTPUT ZONE */}
        <div 
          className="flex-1 overflow-y-auto px-6 md:px-12 py-10 scroll-smooth custom-scrollbar"
          ref={scrollRef}
        >
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-slate-50 p-4 rounded-full text-slate-300">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Research Workspace</h2>
                  <p className="text-sm text-slate-500 max-w-sm mt-1">Ask questions about your local documents. Claude will analyze the context and provide insights.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-10 pb-20">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-4 md:gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role !== 'user' && (
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                        <Bot size={18} />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] space-y-1.5 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                      }`}>
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
                        {m.role === 'user' ? 'You' : 'Claude'}
                      </div>
                    </div>

                    {m.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white flex-shrink-0 mt-1">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <Loader2 size={18} className="animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-50 px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="text-xs text-slate-400 font-medium ml-1">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-800 text-xs font-medium">
                <div className="bg-red-500 text-white p-1 rounded-full"><Bot size={12} /></div>
                System error: {error.message}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM INPUT ZONE */}
        <div className="p-6 md:p-10 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto relative group">
            <form onSubmit={onFormSubmit} className="relative flex items-center">
              <input
                autoFocus
                className="w-full pl-6 pr-14 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-[15px] placeholder:text-slate-400"
                value={localInput}
                placeholder="Ask a question about your documents..."
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
                disabled={isLoading || !localInput.trim()}
                className="absolute right-3 p-2.5 bg-blue-600 text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-400 hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
            <div className="flex justify-center mt-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest gap-4">
               <span>RAG-Lite Protocol</span>
               <span>•</span>
               <span>Local Data Verified</span>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #fcfcfd;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
