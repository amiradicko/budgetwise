export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Version */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-[#0088ff]">BudgetWise</span> v1.0
          </div>

          {/* Powered by */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Powered by</span>
              <img 
                src="/nefertiti-logo.png" 
                alt="Nefertiti Digital Solutions" 
                className="h-5 object-contain opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden font-semibold text-[#00d9ff]">Nefertiti Digital Solutions</span>
            </div>
            
            {/* Séparateur */}
            <div className="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
            
            {/* Made with love */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Made with <span className="text-red-500">❤️</span> in <span className="font-semibold">Burkina Faso</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-right">
            © {currentYear} Nefertiti Digital Solutions. All Rights Reserved.
          </div>
        </div>

        {/* Mobile: Stack vertically on very small screens */}
        <div className="mt-3 text-center text-xs text-gray-400 dark:text-gray-600 md:hidden">
          Innovating Digital Finance
        </div>
      </div>
    </footer>
  );
}
