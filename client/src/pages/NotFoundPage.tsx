import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center px-4">
      {/* Grille de circuits en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZDlmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* 404 animé */}
        <div className="mb-8 animate-scale-in">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] via-[#0088ff] to-[#0055ff] mb-4">
            404
          </h1>
          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent mb-6"></div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-4 animate-slide-up">
          Page introuvable
        </h2>
        <p className="text-gray-400 text-lg mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-[#0088ff] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00d9ff]/50 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Retour au tableau de bord
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>

        {/* Branding Nefertiti Digital Solutions */}
        <div className="pt-8 border-t border-white/10 animate-fade-in-delay">
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/nefertiti-logo.png" 
              alt="Nefertiti Digital Solutions" 
              className="h-6 object-contain opacity-60"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-sm text-[#00d9ff] font-semibold">
              NEFERTITI DIGITAL SOLUTIONS
            </div>
            
            <p className="text-xs text-gray-500">
              Powered by <span className="font-semibold text-[#00d9ff]">Nefertiti Digital Solutions</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
