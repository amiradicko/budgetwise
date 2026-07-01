import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Commencer le fade out après 2.5 secondes
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Cacher complètement après 3 secondes
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Grille de circuits en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZDlmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        {/* Logo BudgetWise avec animation */}
        <div className="mb-8 transform animate-scale-in">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d9ff] to-[#0088ff] blur-3xl opacity-30 animate-pulse"></div>
            
            {/* Logo principal */}
            <img 
              src="/icon-simple.svg" 
              alt="BudgetWise" 
              className="relative w-32 h-32 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Nom BudgetWise */}
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] via-[#0088ff] to-[#0055ff] mb-4 animate-slide-up">
          BudgetWise
        </h1>

        {/* Ligne séparatrice animée */}
        <div className="w-64 h-px bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent mb-6 animate-expand"></div>

        {/* Logo Nefertiti */}
        <div className="mb-3 opacity-90 animate-fade-in-delay">
          <img 
            src="/nefertiti-logo.png" 
            alt="Nefertiti Digital Solutions" 
            className="h-8 object-contain"
            onError={(e) => {
              // Fallback si l'image n'existe pas
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden text-sm text-[#00d9ff] font-semibold tracking-wider">
            NEFERTITI DIGITAL SOLUTIONS
          </div>
        </div>

        {/* Texte "A Product of" */}
        <p className="text-gray-400 text-sm mb-2 animate-fade-in-delay">
          A Product of <span className="text-[#00d9ff] font-semibold">Nefertiti Digital Solutions</span>
        </p>

        {/* Slogan */}
        <p className="text-[#0088ff] text-xs font-medium tracking-widest uppercase animate-fade-in-delay-2">
          Innovating Digital Finance
        </p>

        {/* Loading animation */}
        <div className="mt-8 flex space-x-2 animate-fade-in-delay-2">
          <div className="w-2 h-2 rounded-full bg-[#00d9ff] animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#0088ff] animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#0055ff] animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
