import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, BookOpen, BookText, Check, CheckCheck,
  CheckCircle2, ChevronDown, ChevronRight, Circle, Clipboard, Code2, Copy,
  Download, ExternalLink, FileCode, FolderOpen, GraduationCap, HelpCircle, Info,
  Keyboard, Layers, Lightbulb, ListChecks, Menu, PanelLeftClose, PanelLeftOpen,
  Play, RotateCcw, Search, Sparkles, Terminal, X
} from 'lucide-react';
import { stages, glossary, coreCount, totalChallenges } from './curriculum';
import './style.css';

const STORE = 'python-workshop-reference-v2';
const readProgress = () => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; } };
const keyFor = (id, i) => `${id}:${i}`;
const percentage = (part, whole) => whole > 0 ? Math.round((part / whole) * 100) : 0;
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const formatStep = (n) => String(n).padStart(2, '0');
const copyText = async (text) => {
  if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return; }
  const el = document.createElement('textarea');
  el.value = text; el.style.position = 'fixed'; el.style.left = '-10000px'; document.body.appendChild(el);
  el.select(); document.execCommand('copy'); el.remove();
};
const addTaskDownload = (stage, challenge, index) => {
  const title = `CHALLENGE ${index + 1}: ${challenge.title}`;
  const description = [title, challenge.task, `Example: ${challenge.example}`].flatMap(line => line.split('\n').map(part => `# ${part}`)).join('\n');
  const starter = `${description}\n\n\n# Write your solution below.\n\n`;
  const blob = new Blob([starter], {type: 'text/x-python;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${stage.id}-${String(index + 1).padStart(2,'0')}-${slug(challenge.title)}.${challenge.language === 'terminal' ? 'txt' : 'py'}`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function App() {
  const [route, setRoute] = useState('home');
  const [progress, setProgress] = useState(readProgress);
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSolution, setActiveSolution] = useState(null);
  const [solutionCodeVisible, setSolutionCodeVisible] = useState(false);
  const [copied, setCopied] = useState('');
  const [showReset, setShowReset] = useState(false);
  const contentRef = useRef(null);
  const currentStage = stages.find(s => s.id === route) || null;
  const index = currentStage ? stages.indexOf(currentStage) : -1;
  const completedTotal = stages.reduce((sum, stage) => sum + stage.challenges.filter((_, i) => progress[keyFor(stage.id,i)]).length, 0);
  const completedStages = stages.filter(stage => stage.challenges.every((_, i) => progress[keyFor(stage.id,i)])).length;
  const completePercent = percentage(completedTotal, totalChallenges);
  const queried = search.trim().toLowerCase();
  const filtered = useMemo(() => stages.filter(stage => (
    !queried || `${stage.title} ${stage.subtitle} ${stage.concept} ${stage.challenges.map(c => c.title).join(' ')}`.toLowerCase().includes(queried)
  )), [queried]);

  useEffect(() => { localStorage.setItem(STORE, JSON.stringify(progress)); }, [progress]);
  const move = useCallback((where) => {
    setRoute(where); setMobileMenu(false); setSearch(''); setActiveSolution(null); setSolutionCodeVisible(false);
    window.scrollTo({top: 0, behavior:'instant'});
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, []);
  const openSolution = (stageId, challengeIndex) => { setActiveSolution({stageId, challengeIndex}); setSolutionCodeVisible(false); setCopied(''); };
  const closeSolution = () => { setActiveSolution(null); setSolutionCodeVisible(false); };
  useEffect(() => {
    if (!activeSolution && !showReset) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => { if (event.key === 'Escape') { setActiveSolution(null); setShowReset(false); } };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', onKey); };
  }, [activeSolution, showReset]);
  const toggleDone = (stageId, i) => setProgress(previous => ({...previous, [keyFor(stageId,i)]: !previous[keyFor(stageId,i)]}));
  const handleCopy = async (text, token) => {
    try { await copyText(text); setCopied(token); setTimeout(() => setCopied(v => v === token ? '' : v), 1600); } catch { setCopied(''); }
  };
  const solutionStage = activeSolution && stages.find(s => s.id === activeSolution.stageId);
  const solutionExercise = solutionStage && solutionStage.challenges[activeSolution.challengeIndex];
  const nextRoute = currentStage && stages[index + 1];
  const prevRoute = currentStage && stages[index - 1];
  const visibleCore = filtered.filter(s => s.category === 'core');
  const visibleExtended = filtered.filter(s => s.category === 'extended');
  const visibleProjects = filtered.filter(s => s.category === 'projects');

  function navItem(stage) {
    const realIndex = stages.indexOf(stage);
    const done = stage.challenges.filter((_, i) => progress[keyFor(stage.id, i)]).length;
    const isCurrent = route === stage.id;
    return <button key={stage.id} type="button" onClick={() => move(stage.id)} title={stage.title} className={`side-item ${isCurrent ? 'side-item-active':''}`}>
      <span className="side-number">{stage.category === 'projects' ? '✦' : formatStep(realIndex + 1)}</span>
      {!sidebarCollapsed && <><span className="side-title">{stage.title}</span>{done === stage.challenges.length ? <Check className="side-check" size={13} /> : done > 0 ? <span className="side-progress-dot" /> : null}</>}
    </button>;
  }
  function navGroup(items, label) {
    if (!items.length) return null;
    return <div className="side-group">
      {!sidebarCollapsed && <div className="side-group-label">{label}</div>}
      {items.map(navItem)}
    </div>;
  }
  function miniStat(value, label) {
    return <div className="metric"><strong>{value}</strong><span>{label}</span></div>;
  }

  return <div className="app-shell">
    {mobileMenu && <button className="mobile-shade" aria-label="Close sidebar" onClick={() => setMobileMenu(false)} />}
    <aside className={`sidebar ${mobileMenu ? 'mobile-open':''} ${sidebarCollapsed ? 'sidebar-collapsed':''}`}>
      <div className="side-brand-wrap">
        <button className="side-brand" onClick={() => move('home')} aria-label="Go to workshop home" title="Workshop home">
          <span className="brand-square">PY</span>
          {!sidebarCollapsed && <span className="brand-name"><b>WORKSHOP</b><b>PYTHON</b></span>}
        </button>
        {!sidebarCollapsed && <button className="close-mobile icon-btn" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button>}
        <button className="collapse-toggle icon-btn" onClick={() => setSidebarCollapsed(p => !p)} aria-label="Toggle sidebar">{sidebarCollapsed ? <PanelLeftOpen size={15}/> : <PanelLeftClose size={15}/>}</button>
      </div>
      {!sidebarCollapsed && <div className="side-search"><Search size={14}/><input aria-label="Find a concept" placeholder="Find a concept..." value={search} onChange={e => setSearch(e.target.value)} /></div>}
      <div className="side-scroller">
        <button onClick={() => move('home')} className={`side-item side-home ${route === 'home' ? 'side-item-active' : ''}`} title="Overview">
          <span className="side-number"><Layers size={13}/></span>{!sidebarCollapsed && <span className="side-title">Overview</span>}
        </button>
        {filtered.length > 0 ? <>
          {navGroup(visibleCore, '01 — THE FOUNDATIONS')}
          {navGroup(visibleExtended, '02 — GO FURTHER')}
          {navGroup(visibleProjects, '03 — BUILD SOMETHING')}
        </> : <div className="side-no-results">No matching concepts.</div>}
        {!queried && <button onClick={() => move('glossary')} className={`side-item side-glossary ${route === 'glossary' ? 'side-item-active' : ''}`} title="Python glossary"><span className="side-number">Aa</span>{!sidebarCollapsed && <span className="side-title">Python glossary</span>}</button>}
        {!sidebarCollapsed && <div className="side-tip"><Lightbulb size={15}/><span>Move one concept at a time. Write every solution in VS Code before opening the walkthrough.</span></div>}
      </div>
      <div className="side-bottom">
        {sidebarCollapsed ? <div className="mini-meter" title={`${completePercent}% completed`}>{completePercent}%</div> : <>
          <div className="progress-caption"><span>Your progress</span><strong>{completePercent}%</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{width: `${completePercent}%`}} /></div>
          <div className="progress-meta">{completedTotal} of {totalChallenges} challenges complete</div>
        </>}
      </div>
    </aside>

    <div className={`workspace ${sidebarCollapsed ? 'workspace-expanded':''}`}>
      <header className="topbar">
        <div className="topbar-left"><button onClick={() => {setSidebarCollapsed(false);setMobileMenu(true);}} className="mobile-toggle icon-btn" aria-label="Open navigation"><Menu size={20}/></button><button className="topbar-back" onClick={() => move('home')}>← <span>Back to the learning path</span></button></div>
        <div className="topbar-right"><span className="topbar-dot"/><span>PYTHON LEARNING PATH</span><span className="topbar-separator"/><span className="topbar-step">{currentStage ? `STEP ${formatStep(index + 1)} / ${stages.length}` : route === 'glossary' ? 'GLOSSARY' : 'START HERE'}</span></div>
      </header>
      <main className="main-content" ref={contentRef}>
        {route === 'home' && <>
          <section className="landing-hero">
            <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
            <div className="hero-code-note" aria-hidden="true"><span>def your_future():</span><span>  learn("python")</span><span>  build("anything")</span><span className="note-coral">  return confidence</span></div>
            <div className="landing-content">
              <div className="eyebrow">LEARN • PRACTICE • UNDERSTAND</div>
              <h1>Build your logic,<br/><span>one concept</span><br/>at a time.</h1>
              <p>A practical Python learning path. Start with your very first variable, then grow into algorithms, real projects, and the foundations you need for AI.</p>
              <div className="landing-actions"><button className="mint-button" onClick={() => move(stages[0].id)}>Start learning <ArrowRight size={17}/></button><span className="landing-micro">{stages.length} steps <i/> {totalChallenges} progressive challenges</span></div>
            </div>
            <div className="hero-footer-line">PYTHON 3.12+ <span>—</span> DESIGNED FOR VS CODE</div>
          </section>
          <div className="page-body intro-body">
            <div className="eyebrow">THE MISSION</div>
            <h2>Why learn Python?</h2>
            <p className="lead-copy">Python is readable, flexible, and used across automation, web backends, data analysis, and machine learning. This workshop helps you learn the actual programming concepts—not just memorize syntax.</p>
            <div className="stats-bar">{miniStat(formatStep(coreCount), 'core concepts')}{miniStat(stages.length - coreCount, 'extra stages')}{miniStat(totalChallenges, 'VS Code challenges')}{miniStat('04', 'capstones')}</div>
            <div className="divider-wide"/>
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>A workshop built for learning by doing.</h2>
            <div className="how-grid">
              <div><span className="how-number">01</span><BookOpen size={22}/><h3>Read the concept</h3><p>Understand the idea, syntax, and common mistakes before you attempt the exercises.</p></div>
              <div><span className="how-number">02</span><Terminal size={22}/><h3>Work in VS Code</h3><p>Download a starter .py file or write from scratch in your own environment.</p></div>
              <div><span className="how-number">03</span><Lightbulb size={22}/><h3>Check the walkthrough</h3><p>Use hints only when needed. Compare your approach with an explained solution.</p></div>
            </div>
            <div className="divider-wide"/>
            <div className="eyebrow">YOUR ROADMAP</div>
            <h2>What you will learn.</h2>
            <p className="soft-copy">11 core concepts, practical Python skills, and four longer projects. Work in order—the difficulty increases gradually.</p>
            <div className="roadmap-list">{stages.map((stage,i) => {
              const count = stage.challenges.filter((_, j) => progress[keyFor(stage.id,j)]).length;
              return <button key={stage.id} onClick={() => move(stage.id)} className="roadmap-row"><span className="roadmap-index">{formatStep(i + 1)}</span><span className="roadmap-name">{stage.title}<small>{stage.subtitle}</small></span><span className="roadmap-count">{count}/{stage.challenges.length}</span><ArrowUpRightIcon /></button>;
            })}</div>
            <div className="readiness-panel"><div><div className="eyebrow">AFTER THE WORKSHOP</div><h3>Ready for the next step?</h3><p>Complete the projects independently and pass the final assessment before moving to NumPy, Pandas, and machine learning basics. Finishing pages alone is not the finish line.</p></div><button className="outline-button" onClick={() => move('projects')}>See capstones <ArrowRight size={15}/></button></div>
          </div>
        </>}
        {currentStage && <>
          <div className="stage-topline"><button onClick={() => move('home')}><ArrowLeft size={13}/> BACK TO THE PATH</button><span>{currentStage.category === 'core' ? 'FOUNDATIONS' : currentStage.category === 'extended' ? 'BEYOND THE BASICS' : 'CAPSTONE PROJECTS'} <span className="stage-topline-dot">·</span> {currentStage.challenges.length} CHALLENGES</span></div>
          <section className="stage-hero"><div className="stage-watermark">{formatStep(index+1)}</div><div className="eyebrow">STEP {formatStep(index+1)} / {formatStep(stages.length)}</div><h1>{currentStage.title}</h1><p>{currentStage.subtitle}</p><div className="stage-hero-progress"><span>{currentStage.challenges.filter((_, i) => progress[keyFor(currentStage.id,i)]).length} of {currentStage.challenges.length} completed</span><div className="progress-track"><div className="progress-fill" style={{width:`${percentage(currentStage.challenges.filter((_,i)=>progress[keyFor(currentStage.id,i)]).length,currentStage.challenges.length)}%`}}/></div></div></section>
          <div className="page-body stage-body">
            <section className="section-intro"><div className="eyebrow">UNDERSTAND THE CONCEPT</div><h2>Before you start</h2><p className="lead-copy">{currentStage.concept}</p><div className="inline-code-heading"><span><FileCode size={14}/> QUICK EXAMPLE</span><button onClick={() => handleCopy(currentStage.snippet,`example-${currentStage.id}`)}>{copied === `example-${currentStage.id}` ? <Check size={13}/> : <Copy size={13}/>} {copied === `example-${currentStage.id}` ? 'COPIED' : 'COPY'}</button></div><pre className="code-snippet"><code>{currentStage.snippet}</code></pre>
              <div className="keypoint-box"><div className="keypoint-heading"><Lightbulb size={17}/> KEY TAKEAWAYS</div><ul>{currentStage.takeaways.map((item,i) => <li key={i}><Check size={14}/><span>{item}</span></li>)}</ul><div className="mistake-line"><Info size={15}/><span><b>Common mistake:</b> {currentStage.mistakes}</span></div></div>
            </section>
            <div className="section-divider"/>
            <section className="challenges-section"><div className="eyebrow">PRACTICE IN VS CODE</div><h2>Exercises on {currentStage.title}</h2><p className="soft-copy">Read the task, solve it yourself in a Python file, and open the guided solution only when you're ready to compare. Mark exercises complete after you solve them.</p>
              <div className="exercise-stack">{currentStage.challenges.map((exercise, i) => {
                const done = !!progress[keyFor(currentStage.id,i)];
                return <article className={`exercise ${done ? 'exercise-done' : ''}`} key={i} id={`challenge-${i+1}`}>
                  <div className="exercise-label"><span>CHALLENGE {formatStep(i+1)}</span><span className={`difficulty difficulty-${exercise.level.toLowerCase()}`}>{exercise.level}</span></div>
                  <div className="exercise-title-row"><h3>{exercise.title}</h3>{done && <CheckCircle2 size={18} className="done-icon"/>}</div>
                  <p>{exercise.task}</p>
                  <div className="exercise-example"><span>EXAMPLE</span><code>{exercise.example}</code></div>
                  <div className="exercise-actions"><button className="guide-button" onClick={() => openSolution(currentStage.id,i)}><Lightbulb size={14}/> VIEW GUIDED SOLUTION <ArrowRight size={13}/></button><button className="quiet-button" onClick={() => addTaskDownload(currentStage,exercise,i)} title="Download a Python starter file with the task"><Download size={14}/> {exercise.language === 'terminal' ? 'TASK .TXT' : 'STARTER .PY'}</button><button className="quiet-button mark-button" onClick={() => toggleDone(currentStage.id,i)}>{done ? <CheckCircle2 size={15}/> : <Circle size={15}/>} {done ? 'COMPLETED' : 'MARK DONE'}</button></div>
                </article>;
              })}</div>
            </section>
            <div className="stage-footer"><div><div className="eyebrow">KEEP YOUR MOMENTUM</div><h3>{nextRoute ? 'Ready for the next concept?' : 'You reached the end of the path.'}</h3><p>Understanding comes from practice, not just reading answers.</p></div><div className="stage-footer-actions">{prevRoute && <button className="outline-button" onClick={() => move(prevRoute.id)}><ArrowLeft size={15}/> Previous</button>}{nextRoute ? <button className="mint-button" onClick={() => move(nextRoute.id)}>Next step <ArrowRight size={16}/></button> : <button className="mint-button" onClick={() => move('home')}>Back to overview <ArrowRight size={16}/></button>}</div></div>
          </div>
        </>}
        {route === 'glossary' && <><div className="stage-topline"><button onClick={() => move('home')}><ArrowLeft size={13}/> BACK TO THE PATH</button><span>REFERENCE GUIDE</span></div><section className="stage-hero glossary-hero"><div className="eyebrow">A QUICK REFERENCE</div><h1>Python glossary</h1><p>Clear definitions of words you will see throughout your programming journey.</p></section><div className="page-body stage-body glossary-body"><div className="eyebrow">THE VOCABULARY</div><h2>Learn the language of programming.</h2><div className="glossary-grid">{glossary.map(([term,definition]) => <div key={term} className="glossary-item"><h3>{term}</h3><p>{definition}</p></div>)}</div><div className="stage-footer"><div><h3>Go back to learning.</h3><p>The glossary is always available from the sidebar.</p></div><button className="mint-button" onClick={() => move(stages[0].id)}>Start learning <ArrowRight size={16}/></button></div></div></>}
        <footer className="site-footer"><span><span className="footer-mark">PY</span> PYTHON WORKSHOP</span><span>Learn with purpose. Build in VS Code.</span><button onClick={() => setShowReset(true)}>RESET PROGRESS <RotateCcw size={12}/></button></footer>
      </main>
    </div>

    {solutionExercise && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) closeSolution();}}>
      <section className="solution-modal" role="dialog" aria-modal="true" aria-labelledby="solution-heading">
        <button className="modal-x" onClick={closeSolution} aria-label="Close solution"><X size={17}/></button>
        <div className="modal-eyebrow">STEP-BY-STEP WALKTHROUGH <span>·</span> CHALLENGE {formatStep(activeSolution.challengeIndex+1)}</div>
        <h2 id="solution-heading">{solutionExercise.title}</h2>
        <p className="modal-explanation">Before looking at the reference code, follow the reasoning below. Try implementing each step yourself in VS Code.</p>
        <div className="walkthrough-heading"><Lightbulb size={16}/> THE REASONING</div>
        <ol className="walkthrough-steps">{solutionExercise.walkthrough.map((line,i) => <li key={i}><span>{formatStep(i+1)}</span><p>{line}</p></li>)}</ol>
        <div className="hint-panel"><div className="hint-title"><Sparkles size={15}/> A SMALL HINT</div><p>{solutionExercise.hint}</p></div>
        <div className="solution-toggle"><span>{solutionExercise.language === 'terminal' ? 'TERMINAL COMMANDS' : 'REFERENCE SOLUTION'}</span><button onClick={() => setSolutionCodeVisible(v=>!v)}>{solutionCodeVisible ? 'HIDE CODE' : 'REVEAL CODE'} <ChevronDown className={solutionCodeVisible?'flip':''} size={13}/></button></div>
        {solutionCodeVisible ? <><pre className="modal-code"><code>{solutionExercise.solution}</code></pre><button className="copy-solution" onClick={() => handleCopy(solutionExercise.solution,'solution')}>{copied==='solution'?<Check size={15}/>:<Copy size={15}/>} {copied==='solution'?'COPIED TO CLIPBOARD':'COPY SOLUTION'}</button></> : <div className="solution-hidden"><Code2 size={17}/> The reference code is hidden so you can try the exercise first.</div>}
        <div className="modal-footer"><button className="outline-button" onClick={closeSolution}>Close</button><button className="mint-button" onClick={() => {toggleDone(activeSolution.stageId,activeSolution.challengeIndex);closeSolution();}}>{progress[keyFor(activeSolution.stageId,activeSolution.challengeIndex)] ? 'Mark as not done' : 'I solved it'} <Check size={15}/></button></div>
      </section>
    </div>}
    {showReset && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowReset(false);}}><section className="reset-modal" role="dialog" aria-modal="true" aria-labelledby="reset-heading"><button className="modal-x" aria-label="Close" onClick={()=>setShowReset(false)}><X size={16}/></button><h2 id="reset-heading">Reset your progress?</h2><p>This will clear the {completedTotal} challenges you marked as complete in this browser. This action cannot be undone.</p><div className="modal-footer"><button className="outline-button" onClick={()=>setShowReset(false)}>Cancel</button><button className="danger-button" onClick={()=>{setProgress({});setShowReset(false);}}>Reset all progress</button></div></section></div>}
  </div>;
}
function ArrowUpRightIcon(){return <ArrowRight size={16} className="roadmap-arrow"/>}

createRoot(document.getElementById('root')).render(<App />);
