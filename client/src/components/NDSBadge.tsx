export function NDSBadge() {
  return (
    <div className="fixed bottom-6 right-6 z-10 group">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 transition-all hover:shadow-xl hover:scale-105">
        {/* Logo NDS */}
        <img 
          src="/nefertiti-logo.png" 
          alt="Nefertiti Digital Solutions" 
          className="h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#0088ff]"></div>
        </div>

        {/* Texte */}
        <div className="text-xs">
          <p className="text-gray-500 dark:text-gray-400">Powered by</p>
          <p className="font-semibold text-[#0088ff] dark:text-[#00d9ff] -mt-0.5">
            Nefertiti Digital Solutions
          </p>
        </div>
      </div>

      {/* Tooltip au survol */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          Innovating Digital Finance
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}
