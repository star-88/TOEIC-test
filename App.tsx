// @ts-nocheck
// App.tsx
// Critical: We assume React and ReactRouterDOM are loaded globally via UMD in index.html

(function() {
  const mountApp = () => {
    // 1. Validate Globals
    if (!window.React || !window.ReactDOM || !window.ReactRouterDOM) {
      console.warn('Waiting for React/Router globals...');
      return false; 
    }
    
    // 2. Setup Aliases
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const ReactRouterDOM = window.ReactRouterDOM;
    
    const { useState, useEffect, useMemo } = React;
    const { HashRouter, Routes, Route, useNavigate, useLocation, Navigate, useParams } = ReactRouterDOM;

    // 3. Access Services (Safe Defaults)
    const loadState = window.TOEIC?.loadState || (() => ({ words: [], notes: [] }));
    const saveState = window.TOEIC?.saveState || (() => {});
    const speak = window.TOEIC?.speak || (() => {});
    // Wait for Icons if possible, but have hard fallback
    const Icons = window.TOEIC?.Icons || {};

    // --- Components Definitions ---

    const BottomNav = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const isVocab = location.pathname.startsWith('/vocab') || location.pathname === '/';
      const isGrammar = location.pathname.startsWith('/grammar');

      const BookIcon = Icons.Book || (() => <span>Vocab</span>);
      const PenIcon = Icons.Pen || (() => <span>Grammar</span>);

      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-around items-center h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
          <button 
            onClick={() => navigate('/vocab')}
            className={`flex flex-col items-center gap-1 transition-colors ${isVocab ? 'text-primary-600' : 'text-slate-400'}`}
          >
            <BookIcon size={24} strokeWidth={isVocab ? 2.5 : 2} />
            <span className="text-[10px] font-medium">單字集</span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 mx-2"></div>

          <button 
            onClick={() => navigate('/grammar')}
            className={`flex flex-col items-center gap-1 transition-colors ${isGrammar ? 'text-primary-600' : 'text-slate-400'}`}
          >
            <PenIcon size={24} strokeWidth={isGrammar ? 2.5 : 2} />
            <span className="text-[10px] font-medium">文法筆記</span>
          </button>
        </div>
      );
    };

    const VocabHome = ({ words }) => {
      const navigate = useNavigate();
      const PlusIcon = Icons.Plus || (() => <span>+</span>);
      const FolderIcon = Icons.Folder || (() => <span>F</span>);
      
      const groups = useMemo(() => {
        const map = new Map();
        words.forEach(w => {
          map.set(w.group, (map.get(w.group) || 0) + 1);
        });
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
      }, [words]);

      return (
        <div className="min-h-screen bg-slate-50 pb-24">
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">我的單字</h1>
            <button 
              onClick={() => navigate('/add')}
              className="bg-primary-600 text-white rounded-full p-2 shadow-lg shadow-primary-500/30 active:scale-95 transition-transform"
            >
              <PlusIcon size={24} />
            </button>
          </header>

          <div className="p-4 grid grid-cols-2 gap-4">
            {groups.map(([groupName, count]) => (
              <div 
                key={groupName}
                onClick={() => navigate(`/vocab/${encodeURIComponent(groupName)}`)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors cursor-pointer flex flex-col gap-3 h-32 justify-between"
              >
                <div className="bg-primary-50 w-10 h-10 rounded-full flex items-center justify-center text-primary-600">
                  <FolderIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{groupName}</h3>
                  <p className="text-slate-400 text-sm font-medium">{count} 個單字</p>
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-400">
                <p>還沒有單字，點擊右上角新增！</p>
              </div>
            )}
          </div>
        </div>
      );
    };

    const WordCard = ({ word }) => {
      const [expanded, setExpanded] = useState(false);
      const SpeakerIcon = Icons.Speaker || (() => <span>Sound</span>);

      return (
        <div 
          className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 ${expanded ? 'ring-2 ring-primary-100' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-800">{word.term}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(word.term, 'en'); }}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-primary-100 active:text-primary-600 transition-colors"
                  title="Play English"
                >
                  <span className="text-[10px] font-bold mr-0.5">EN</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(word.term, 'fr'); }}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-primary-100 active:text-primary-600 transition-colors"
                  title="Play French"
                >
                   <span className="text-[10px] font-bold mr-0.5">FR</span>
                </button>
              </div>
            </div>
            
            {!expanded && (
               <p className="text-slate-500 text-sm truncate">{word.meaning}</p>
            )}

            {expanded && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">中文</span>
                  <p className="text-slate-700 font-medium text-lg">{word.meaning}</p>
                </div>
                {word.example && (
                  <div>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">例句</span>
                    <p className="text-slate-600 italic leading-relaxed text-sm mt-1">"{word.example}"</p>
                    <button 
                       onClick={(e) => { e.stopPropagation(); speak(word.example, 'en'); }}
                       className="mt-2 text-xs flex items-center gap-1 text-slate-400 hover:text-primary-600"
                    >
                      <SpeakerIcon size={12} /> 唸出例句
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

    const GroupDetail = ({ words }) => {
      const { groupName } = useParams();
      const navigate = useNavigate();
      const decodedGroup = decodeURIComponent(groupName || '');
      const BackIcon = Icons.Back || (() => <span>Back</span>);

      const groupWords = words.filter(w => w.group === decodedGroup);

      return (
        <div className="min-h-screen bg-slate-50 pb-24">
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-4 py-4 border-b border-slate-100 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600 rounded-full active:bg-slate-100">
              <BackIcon size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 truncate">{decodedGroup}</h1>
          </header>

          <div className="p-4 space-y-4">
            {groupWords.map(word => (
              <WordCard key={word.id} word={word} />
            ))}
            {groupWords.length === 0 && (
              <div className="text-center text-slate-400 mt-10">此群組沒有單字</div>
            )}
          </div>
        </div>
      );
    };

    const AddWord = ({ existingGroups, onAdd }) => {
      const navigate = useNavigate();
      const [term, setTerm] = useState('');
      const [meaning, setMeaning] = useState('');
      const [example, setExample] = useState('');
      const [group, setGroup] = useState('');
      const [isNewGroup, setIsNewGroup] = useState(false);
      const CloseIcon = Icons.Close || (() => <span>X</span>);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!term || !meaning || !group) return;
        
        onAdd({
          term,
          meaning,
          example,
          group
        });
        navigate(-1);
      };

      return (
        <div className="min-h-screen bg-white pb-safe">
          <header className="px-4 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <button onClick={() => navigate(-1)} className="text-slate-500 font-medium text-sm">取消</button>
            <h1 className="font-bold text-slate-800">新增單字</h1>
            <button 
              onClick={handleSubmit}
              disabled={!term || !meaning || !group}
              className="text-primary-600 font-bold text-sm disabled:opacity-50"
            >
              完成
            </button>
          </header>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">單字 (Word)</label>
              <input 
                type="text" 
                value={term}
                onChange={e => setTerm(e.target.value)}
                placeholder="Ex: Acquisition"
                className="w-full text-2xl font-bold text-slate-800 border-b-2 border-slate-100 focus:border-primary-500 outline-none py-2 placeholder-slate-200 transition-colors"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">中文意思 (Meaning)</label>
              <input 
                type="text" 
                value={meaning}
                onChange={e => setMeaning(e.target.value)}
                placeholder="Ex: 收購"
                className="w-full text-lg text-slate-800 border-b border-slate-100 focus:border-primary-500 outline-none py-2 placeholder-slate-300 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">群組 (Group)</label>
              {!isNewGroup && existingGroups.length > 0 ? (
                <div className="flex gap-2">
                  <select 
                    value={group}
                    onChange={e => {
                      if (e.target.value === 'NEW_GROUP_TRIGGER') {
                        setIsNewGroup(true);
                        setGroup('');
                      } else {
                        setGroup(e.target.value);
                      }
                    }}
                    className="flex-1 bg-slate-50 rounded-lg px-3 py-3 text-slate-700 outline-none border border-transparent focus:border-primary-500 appearance-none"
                  >
                    <option value="" disabled>選擇群組</option>
                    {existingGroups.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                    <option value="NEW_GROUP_TRIGGER">+ 新增群組...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <input 
                    type="text"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                    placeholder="輸入新群組名稱"
                    className="flex-1 bg-slate-50 rounded-lg px-3 py-3 text-slate-700 outline-none border border-primary-500"
                    autoFocus={isNewGroup}
                  />
                  {existingGroups.length > 0 && (
                    <button 
                      onClick={() => setIsNewGroup(false)} 
                      className="p-2 text-slate-400"
                    >
                      <CloseIcon size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">例句 (Example)</label>
              <textarea 
                value={example}
                onChange={e => setExample(e.target.value)}
                placeholder="The company announced..."
                rows={3}
                className="w-full bg-slate-50 rounded-xl p-4 text-slate-700 outline-none border border-transparent focus:border-primary-500 resize-none text-base leading-relaxed"
              />
            </div>
          </div>
        </div>
      );
    };

    const GrammarHome = ({ notes }) => {
      const navigate = useNavigate();
      const PlusIcon = Icons.Plus || (() => <span>+</span>);

      return (
        <div className="min-h-screen bg-slate-50 pb-24">
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">文法筆記</h1>
          </header>

          <div className="p-4 grid gap-4">
            <div 
              onClick={() => navigate('/grammar/new')}
              className="bg-white rounded-xl shadow-sm border border-dashed border-slate-300 p-4 flex items-center justify-center text-slate-400 gap-2 cursor-pointer active:bg-slate-50 h-16"
            >
              <PlusIcon size={20} />
              <span className="font-medium">新增筆記</span>
            </div>

            {notes.sort((a,b) => b.updatedAt - a.updatedAt).map(note => {
              const lines = note.content.split('\n');
              const title = lines[0] || 'Untitled';
              const preview = lines.slice(1).join(' ').substring(0, 50) + (lines.join(' ').length > 50 ? '...' : '');
              const date = new Date(note.updatedAt).toLocaleDateString();

              return (
                <div 
                  key={note.id}
                  onClick={() => navigate(`/grammar/${note.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 active:bg-slate-50 transition-colors cursor-pointer"
                >
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm mb-3 h-5 overflow-hidden text-ellipsis whitespace-nowrap">{preview}</p>
                  <span className="text-xs text-slate-300 font-medium">{date}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const GrammarEditor = ({ notes, onSave, onDelete }) => {
      const { id } = useParams();
      const navigate = useNavigate();
      const BackIcon = Icons.Back || (() => <span>Back</span>);
      
      const existingNote = notes.find(n => n.id === id);
      const [content, setContent] = useState(existingNote?.content || '');

      const handleBack = () => {
        if (content.trim()) {
          onSave({
            id: id === 'new' ? crypto.randomUUID() : id,
            content,
            updatedAt: Date.now()
          });
        }
        navigate(-1);
      };

      const handleDelete = () => {
          if(id && id !== 'new') {
              onDelete(id);
          }
          navigate(-1);
      }

      return (
        <div className="min-h-screen bg-white flex flex-col">
          <header className="px-4 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
            <button onClick={handleBack} className="flex items-center text-primary-600 font-medium">
              <BackIcon size={20} />
              <span>列表</span>
            </button>
            {id !== 'new' && (
                 <button onClick={handleDelete} className="text-red-500 text-sm font-medium">刪除</button>
            )}
          </header>

          <div className="flex-1 p-6">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="開始輸入文法重點..."
              className="w-full h-full resize-none outline-none text-lg leading-relaxed text-slate-800 placeholder-slate-300"
              autoFocus={id === 'new'}
            />
          </div>
        </div>
      );
    };

    const MainApp = () => {
      const [state, setState] = useState(loadState());
      
      useEffect(() => {
        saveState(state);
      }, [state]);

      const addWord = (newWord) => {
        const word = {
          ...newWord,
          id: crypto.randomUUID(),
          createdAt: Date.now()
        };
        setState(prev => ({ ...prev, words: [word, ...prev.words] }));
      };

      const saveNote = (note) => {
        setState(prev => {
          const exists = prev.notes.find(n => n.id === note.id);
          if (exists) {
            return {
              ...prev,
              notes: prev.notes.map(n => n.id === note.id ? note : n)
            };
          } else {
            return {
              ...prev,
              notes: [note, ...prev.notes]
            };
          }
        });
      };

      const deleteNote = (id) => {
          setState(prev => ({
              ...prev,
              notes: prev.notes.filter(n => n.id !== id)
          }));
      }

      const existingGroups = useMemo(() => {
        return Array.from(new Set(state.words.map(w => w.group))).sort();
      }, [state.words]);

      return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl overflow-hidden relative">
          <Routes>
            <Route path="/vocab" element={
              <>
                <VocabHome words={state.words} />
                <BottomNav />
              </>
            } />
            <Route path="/vocab/:groupName" element={
              <>
                <GroupDetail words={state.words} />
                <BottomNav />
              </>
            } />
            <Route path="/add" element={
              <AddWord existingGroups={existingGroups} onAdd={addWord} />
            } />
            <Route path="/grammar" element={
              <>
                <GrammarHome notes={state.notes} />
                <BottomNav />
              </>
            } />
            <Route path="/grammar/:id" element={
              <GrammarEditor notes={state.notes} onSave={saveNote} onDelete={deleteNote} />
            } />
            <Route path="/" element={<Navigate to="/vocab" replace />} />
          </Routes>
        </div>
      );
    };

    const App = () => {
      return (
        <HashRouter>
          <MainApp />
        </HashRouter>
      );
    };

    // 4. Mount
    const rootElement = document.getElementById('root');
    const loadingEl = document.getElementById('loading-indicator');
    
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      // Remove loading indicator after successful render
      if (loadingEl) {
        setTimeout(() => {
           loadingEl.style.opacity = '0';
           setTimeout(() => loadingEl.remove(), 500);
        }, 100);
      }
    }
    return true;
  };

  // Safe Start: Polling for dependencies
  // This is necessary because babel script loading might be async relative to UMD
  let attempts = 0;
  const initInterval = setInterval(() => {
    attempts++;
    if (mountApp()) {
      clearInterval(initInterval);
    } else if (attempts > 50) { // 5 seconds timeout
      clearInterval(initInterval);
      document.body.innerHTML += '<div style="color:red; padding:20px;">Failed to load dependencies (React). Please refresh.</div>';
    }
  }, 100);

})();
