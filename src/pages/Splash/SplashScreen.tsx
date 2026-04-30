import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-[#0a0a14] z-0" />
      <div 
        className="absolute inset-0 opacity-0 animate-gridFade z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(63,56,200,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(63,56,200,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(83,74,183,0.28)_0%,transparent_70%)] animate-orbPulse pointer-events-none z-20" />
      
      {/* RINGS */}
      <div className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-[#7f77dd2e] pointer-events-none z-[3] w-[200px] h-[200px] animate-ringExpand [animation-delay:0.3s]" />
      <div className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-[#7f77dd2e] pointer-events-none z-[3] w-[300px] h-[300px] animate-ringExpand [animation-delay:0.5s]" />
      <div className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-[#7f77dd2e] pointer-events-none z-[3] w-[420px] h-[420px] animate-ringExpand [animation-delay:0.7s]" />
      
      {/* SCAN LINE */}
      <div className="absolute left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,#7f77dd99,transparent)] animate-scan [animation-delay:1s] pointer-events-none z-[4]" />

      {/* CORNER BRACKETS */}
      <div className="absolute w-4 h-4 z-[5] top-5 left-5 border-t border-l border-[#7f77dd4d]" />
      <div className="absolute w-4 h-4 z-[5] top-5 right-5 border-t border-r border-[#7f77dd4d]" />
      <div className="absolute w-4 h-4 z-[5] bottom-5 left-5 border-b border-l border-[#7f77dd4d]" />
      <div className="absolute w-4 h-4 z-[5] bottom-5 right-5 border-b border-r border-[#7f77dd4d]" />

      {/* CONTENT WRAPPER */}
      <div className="flex flex-col items-center text-center gap-0 relative z-[10]">
        {/* SHIELD SVG */}
        <div className="animate-shieldDrop mb-7">
          <svg width="80" height="92" viewBox="0 0 80 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="80" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7F77DD" />
                <stop offset="100%" stopColor="#3F38C8" />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0" y1="0" x2="80" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#AFA9EC" />
                <stop offset="100%" stopColor="#7F77DD" />
              </linearGradient>
            </defs>
            <path d="M40 4L6 16v24c0 22 14.7 42.5 34 50 C59.3 86.5 74 66 74 40V16L40 4z" fill="url(#shieldGrad)" fillOpacity="0.15" stroke="url(#strokeGrad)" strokeWidth="1" />
            <path d="M40 10L10 21v19c0 18.5 12.3 35.5 30 42 C57.7 75.5 70 58.5 70 40V21L40 10z" fill="url(#shieldGrad)" fillOpacity="0.25" />
            <path d="M40 18L16 27v13c0 13.5 9 25.8 24 31 C55 65.8 64 53.5 64 40V27L40 18z" fill="url(#shieldGrad)" fillOpacity="0.50" />
            <path d="M29 46 l8 8 l14 -16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* WORDMARK */}
        <h1 className="font-extrabold text-[46px] tracking-tight leading-none m-0 animate-wordIn [animation-delay:0.6s]">
          <span className="text-white">Integri</span>
          <span className="text-[#7F77DD]">Guard</span>
        </h1>

        {/* TAGLINE */}
        <p className="font-light text-[13px] uppercase tracking-[0.22em] text-white/40 mt-2.5 mx-0 mb-0 animate-fadeUp [animation-delay:0.9s]">
          Academic integrity intelligence
        </p>

        {/* DIVIDER */}
        <div className="w-[1px] h-8 bg-[linear-gradient(to_bottom,transparent,#7f77dd80,transparent)] mx-auto my-5 animate-fadeUp [animation-delay:1.1s]" />

        {/* PILLS ROW */}
        <div className="flex gap-2 animate-fadeUp [animation-delay:1.2s]">
          <span className="font-normal text-[11px] tracking-wider px-3.5 py-1.5 rounded-full border-[0.5px] border-[#7f77dd4d] text-white/45 bg-[#7f77dd0f] whitespace-nowrap">Behavioural signals</span>
          <span className="font-normal text-[11px] tracking-wider px-3.5 py-1.5 rounded-full border-[0.5px] border-[#7f77dd4d] text-white/45 bg-[#7f77dd0f] whitespace-nowrap">Explainable AI</span>
          <span className="font-normal text-[11px] tracking-wider px-3.5 py-1.5 rounded-full border-[0.5px] border-[#7f77dd4d] text-white/45 bg-[#7f77dd0f] whitespace-nowrap">Faculty-first</span>
        </div>

        {/* ENTER BUTTON */}
        <button 
          className="font-normal text-sm tracking-wide px-10 py-3 rounded-lg bg-[#3F38C8] text-white border-none cursor-pointer mt-9 relative overflow-hidden transition-all duration-200 animate-fadeUp [animation-delay:1.4s] hover:bg-[#534AB7] hover:-translate-y-[1px] active:scale-95 group"
          onClick={() => navigate('/login')}
        >
          Enter platform →
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.12)_50%,transparent_70%)] -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        </button>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { 
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important; 
          }
        }
      `}</style>
    </div>
  );
};
