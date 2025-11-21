import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Header */}
      <header className="p-6 pt-8 z-10 text-center">
         <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase drop-shadow-sm">
           {title || "Caza del Impostor"}
         </h1>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col p-6 z-10">
        {children}
      </main>
    </div>
  );
};