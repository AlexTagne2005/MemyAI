import React from 'react';
import { Sparkles, ImagePlus, Bookmark, HelpCircle, Flame } from 'lucide-react';

interface HeaderProps {
  onOpenAiModal: () => void;
  onOpenSavedModal: () => void;
  onOpenHelpModal: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAiModal,
  onOpenSavedModal,
  onOpenHelpModal,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-3 sm:px-6 shadow-lg shadow-indigo-950/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-400 via-purple-500 to-indigo-400 p-0.5 shadow-lg shadow-fuchsia-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[10px] flex items-center justify-center text-xl">
              🐸
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight text-white">
                MemeAI <span className="text-fuchsia-400">Magic</span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/30 backdrop-blur-md">
                3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300/80 hidden sm:block">
              AI Context Analysis &amp; Multimodal Caption Generator
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all border border-white/20 cursor-pointer active:scale-95"
            title="Generate custom meme image background using AI prompt"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-200 animate-pulse" />
            <span className="hidden sm:inline">AI Image Generator</span>
            <span className="sm:hidden">AI Bg</span>
          </button>

          <button
            onClick={onOpenSavedModal}
            className="relative flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
            title="Saved Memes Gallery"
          >
            <Bookmark className="w-4 h-4 text-fuchsia-300" />
            <span className="hidden sm:inline">My Memes</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-fuchsia-500 text-white shadow-sm">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenHelpModal}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
            title="How Magic AI Meme Generator Works"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
