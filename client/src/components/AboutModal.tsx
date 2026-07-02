import { X, Info } from 'lucide-react';
import Modal from './ui/Modal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-[#00d9ff] to-[#0088ff] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Info className="w-6 h-6" />
              <h2 className="text-2xl font-bold">À propos</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Logos */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/icon-simple.svg" 
              alt="BudgetWise" 
              className="w-16 h-16"
            />
            <div className="w-8 h-px bg-gradient-to-r from-[#00d9ff] to-[#0088ff]"></div>
            <img 
              src="/nefertiti-logo.png" 
              alt="Nefertiti Digital Solutions" 
              className="h-12 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Nom de l'app */}
          <h3 className="text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0088ff]">
            BudgetWise
          </h3>

          {/* Version */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
            Version <span className="font-semibold">1.0.0</span>
          </p>

          {/* Slogan */}
          <div className="text-center mb-6">
            <p className="text-[#0088ff] dark:text-[#00d9ff] font-medium text-sm mb-1">
              Innovating Digital Finance
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Plateforme moderne de gestion financière personnelle
            </p>
          </div>

          {/* Séparateur */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-6"></div>

          {/* Développé par */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
              Développé par
            </p>
            <p className="font-semibold text-[#0088ff] dark:text-[#00d9ff] text-lg">
              Nefertiti Digital Solutions
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-2xl mb-1">🤖</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">IA Intégrée</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-2xl mb-1">🎮</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Gamification</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-2xl mb-1">📱</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">PWA Ready</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-500">
            <p className="mb-1">Made with ❤️ in Burkina Faso</p>
            <p>© 2026 Nefertiti Digital Solutions</p>
            <p>All Rights Reserved</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
