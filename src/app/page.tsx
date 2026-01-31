'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState, useRef } from 'react';
import { Send, User, FileText, Loader2, Sparkles, CheckCircle2, Circle, Globe, ExternalLink, SlidersHorizontal, ChevronDown, ChevronUp, Save, RotateCcw, Star, History } from 'lucide-react';

const FACTORY_DEFAULT_PERSONA = 'Never output raw JSON. Use professional corporate tone. Cite sources where possible.';

export default function Chat() {
  const [localInput, setLocalInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState(FACTORY_DEFAULT_PERSONA);
  const [showPersona, setShowPersona] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { 
    messages, 
    append, 
    setMessages,
    isLoading, 
    error 
  } = useChat({
    onError: (err) => {
      console.error('AI_SDK_ERROR:', err);
    }
  });

  useEffect(() => {
    setMounted(true);
    
    // Load persisted instructions (current session)
    const savedInstructions = localStorage.getItem('smartdocs_persona');
    if (savedInstructions) {
      setCustomInstructions(savedInstructions);
    }

    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setFiles(data.files);
          setSelectedFiles(data.files);
        }
      })
      .catch(err => console.error('Error fetching files:', err));
  }, []);

  const loadDefaultPersona = () => {
    const savedDefault = localStorage.getItem('smartdocs_default_persona');
    setCustomInstructions(savedDefault || FACTORY_DEFAULT_PERSONA);
  };

  const saveAsDefaultPersona = () => {
    localStorage.setItem('smartdocs_default_persona', customInstructions);
    // Also save as current session
    localStorage.setItem('smartdocs_persona', customInstructions);
    alert('Persona saved as your new default.');
  };

  const clearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleFile = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) 
        ? prev.filter(f => f !== fileName) 
        : [...prev, fileName]
    );
  };

  const toggleAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files);
    }
  };

  const onFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = localInput.trim();
    if (!text || isLoading) return;

    try {
      await append({ 
        content: text, 
        role: 'user' 
      }, {
        body: { 
          selectedFiles,
          customInstructions 
        }
      });
      setLocalInput('');
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#FAFBFC] text-[#192a3d] font-sans selection:bg-[#2872fa]/10">
      
      {/* 1. CORPORATE HEADER */}
      <header className="h-16 bg-[#192a3d] flex items-center justify-between px-6 shadow-md z-10">
        <div className="flex items-center gap-4">
          <a 
            href="https://www.CenterForAppliedai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://centerforappliedai.com/wp-content/uploads/2025/03/8e2adab0e3f168217b0338d68bba5992.png" 
              alt="Applied AI Labs" 
              className="h-[50px] w-auto object-contain rounded-md"
            />
          </a>
          <div className="h-6 w-[1px] bg-white/20 hidden md:block" />
          <h1 className="text-white font-montserrat font-semibold tracking-wide text-sm md:text-base">
            SmartDocs <span className="text-[#2872fa] font-black text-xs ml-1 opacity-80 uppercase tracking-tighter">Live Tuning</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://www.CenterForAppliedai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white flex items-center gap-2 text-xs font-medium transition-colors"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">appliedailabs.com</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. SIDEBAR (Brand Style + Tuning) */}
        <aside className="w-80 bg-[#192a3d] text-white hidden md:flex flex-col shadow-inner">
          <div className="p-6 border-b border-white/5">
            <button 
              onClick={clearChat}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#2872fa] hover:bg-[#1559ed] text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-black/20 active:scale-95"
            >
              <RotateCcw size={14} />
              New Research Session
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
            
            {/* KNOWLEDGE BASE SECTION */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText size={12} className="text-[#2872fa]" /> Knowledge Base
                </h3>
                <button 
                  onClick={toggleAll}
                  className="text-[10px] font-bold text-[#2872fa] hover:text-[#1559ed] transition-colors uppercase"
                >
                  {selectedFiles.length === files.length ? 'Clear' : 'Select All'}
                </button>
              </div>

              <div className="space-y-2">
                {files.length === 0 ? (
                  <p className="text-xs text-white/30 italic px-2">No documents discovered</p>
                ) : (
                  files.map(file => {
                    const isSelected = selectedFiles.includes(file);
                    return (
                      <button 
                        key={file} 
                        onClick={() => toggleFile(file)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs text-left rounded-xl transition-all border ${
                          isSelected 
                            ? 'bg-[#2872fa]/10 border-[#2872fa]/30 text-white font-semibold' 
                            : 'bg-transparent border-transparent text-white/50 hover:bg-white/5'
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 size={14} className="text-[#2872fa] flex-shrink-0" />
                        ) : (
                          <Circle size={14} className="text-white/10 flex-shrink-0" />
                        )}
                        <span className="truncate" title={file}>{file}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            {/* LIVE TUNING SECTION */}
            <section className="bg-black/20 rounded-2xl p-4 border border-white/5">
              <button 
                onClick={() => setShowPersona(!showPersona)}
                className="w-full flex items-center justify-between text-[10px] font-black text-[#2872fa] uppercase tracking-[0.2em]"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={12} />
                  Persona Tuning
                </div>
                {showPersona ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              
              {showPersona && (
                <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] text-white/40 leading-relaxed italic">
                    Instructions sent to the AI alongside your documents to refine behavior.
                  </p>
                  <textarea 
                    className="w-full bg-[#192a3d] border border-white/10 rounded-xl p-3 text-xs text-white/80 focus:border-[#2872fa] focus:outline-none min-h-[240px] resize-none leading-relaxed caret-[#2872fa] selection:bg-[#2872fa] selection:text-white"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Speak like an expert consultant..."
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={loadDefaultPersona}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-[9px] font-bold transition-all border border-white/10"
                    >
                      <History size={12} />
                      LOAD DEFAULT
                    </button>
                    <button 
                      onClick={saveAsDefaultPersona}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-[9px] font-bold transition-all border border-white/10"
                    >
                      <Star size={12} />
                      SET AS DEFAULT
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[8px] font-bold text-white/20 uppercase">Local Session Store</span>
                    <button 
                      onClick={() => {
                        localStorage.setItem('smartdocs_persona', customInstructions);
                        setShowPersona(false);
                        window.location.reload();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2872fa] hover:bg-[#1559ed] text-white rounded-lg text-[10px] font-black transition-colors shadow-lg shadow-[#2872fa]/20"
                      title="Apply and Collapse"
                    >
                      <Save size={12} />
                      APPLY & CLOSE
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
          
          <div className="p-6 bg-black/20 border-t border-white/5 space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/30">Intelligence</span>
              <span className="text-[#2872fa]">Claude Haiku</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#2872fa] h-full transition-all duration-700 ease-out" 
                style={{ width: `${(selectedFiles.length / Math.max(files.length, 1)) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col relative min-w-0 bg-white">
          
          <div 
            className="flex-1 overflow-y-auto px-6 md:px-16 py-12 scroll-smooth custom-scrollbar"
            ref={scrollRef}
          >
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
                  <div className="bg-[#FAFBFC] p-8 rounded-[2.5rem] border border-[#2872fa]/10 shadow-sm">
                    <Sparkles size={48} className="text-[#2872fa] opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-montserrat font-bold text-[#192a3d] tracking-tight text-balance">
                      Document Intelligence Platform
                    </h2>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                      Select specific documents from your library to begin a context-aware research session.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 pb-24">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border ${
                        m.role === 'user' 
                          ? 'bg-[#192a3d] text-white border-[#192a3d]' 
                          : 'bg-white text-[#2872fa] border-[#2872fa]/10'
                      }`}>
                        {m.role === 'user' ? <User size={18} /> : (
                          <img 
                            src="https://centerforappliedai.com/wp-content/uploads/2025/03/8e2adab0e3f168217b0338d68bba5992.png" 
                            className="w-5 h-auto brightness-0" 
                            style={{ filter: 'invert(32%) sepia(91%) saturate(3042%) hue-rotate(213deg) brightness(101%) contrast(97%)' }} 
                            alt="AI"
                          />
                        )}
                      </div>
                      
                      <div className={`max-w-[80%] space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-6 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
                          m.role === 'user' 
                            ? 'bg-[#2872fa] text-white rounded-tr-none' 
                            : 'bg-[#FAFBFC] text-[#192a3d] border border-[#2872fa]/5 rounded-tl-none'
                        }`}>
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 px-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {m.role === 'user' ? 'Transmission Recv' : 'Intelligence Stream'}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-6 animate-in fade-in duration-300">
                      <div className="w-9 h-9 rounded-full bg-white border border-[#2872fa]/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <Loader2 size={18} className="animate-spin text-[#2872fa]" />
                      </div>
                      <div className="bg-[#FAFBFC] border border-[#2872fa]/5 px-6 py-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-[#2872fa] rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-[#2872fa] rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-[#2872fa] rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Analyzing Documents</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {error && (
                <div className="max-w-md mx-auto mb-12 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-800 text-xs font-semibold shadow-sm">
                  <div className="bg-red-500 text-white p-1.5 rounded-full border border-red-600"><SlidersHorizontal size={14} /></div>
                  <div className="space-y-0.5">
                    <p className="uppercase tracking-tight opacity-50 text-[10px]">Critical Stream Error</p>
                    <p>{error.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. PREMIUM INPUT DOCK */}
          <div className="p-8 md:p-12 bg-gradient-to-t from-white via-white to-transparent sticky bottom-0">
            <div className="max-w-3xl mx-auto relative group">
              <form onSubmit={onFormSubmit} className="relative flex items-center">
                <input
                  autoFocus
                  className="w-full pl-8 pr-16 py-5 rounded-[2rem] bg-white border-2 border-slate-100 focus:border-[#2872fa] outline-none transition-all text-[16px] shadow-2xl shadow-slate-200/40 placeholder:text-slate-300 disabled:bg-[#FAFBFC] disabled:cursor-not-allowed"
                  value={localInput}
                  placeholder={selectedFiles.length === 0 ? "Select context to begin..." : "Ask your intelligence agent anything..."}
                  onChange={(e) => setLocalInput(e.target.value)}
                  disabled={selectedFiles.length === 0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onFormSubmit();
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput.trim() || selectedFiles.length === 0}
                  className="absolute right-3.5 p-3 bg-[#2872fa] text-white rounded-full disabled:bg-slate-100 disabled:text-slate-300 hover:bg-[#1559ed] transition-all shadow-lg shadow-[#2872fa]/20 active:scale-90"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
              <div className="flex justify-between items-center mt-4 px-6">
                 <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedFiles.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-200'}`} />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                      {selectedFiles.length} ACTIVE_SOURCES
                    </span>
                 </div>
                 <div className="text-[9px] font-black text-slate-200 uppercase tracking-[0.2em]">
                   Applied AI Labs // Intelligent Research Node
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@200;400;600;700;900&display=swap');
        
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Inter', sans-serif;
          background: #FAFBFC;
        }

        .font-montserrat {
          font-family: var(--font-montserrat), 'Montserrat', sans-serif;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E1E8ED; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2872fa; }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}