import React from 'react';
import { HelpCircle, X, Wand2, Sparkles, Image as ImageIcon, Download } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-950/80 border border-white/20 backdrop-blur-2xl rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 shadow-lg shadow-fuchsia-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">How MemeAI Works</h3>
            <p className="text-xs text-slate-300/80">Create viral memes powered by Multimodal AI</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs text-slate-200">
          <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-xs mb-0.5">1. Pick or Upload Image</h4>
              <p className="text-slate-300/80">
                Choose a classic template from the catalog, drag &amp; drop your own photo, or generate a custom background using the AI Image Generator.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-xs mb-0.5">2. Click "✨ Magic AI Caption"</h4>
              <p className="text-slate-300/80">
                Gemini 3.6 Flash visually analyzes the image mood and generates 5 witty punchline options tailored to your chosen humor tone!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-xs mb-0.5">3. Drag, Style &amp; Add Filters</h4>
              <p className="text-slate-300/80">
                Click any caption card to apply text. Customize fonts, outline stroke, colors, and drag text or stickers directly on the live preview canvas!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-xs mb-0.5">4. Download &amp; Share</h4>
              <p className="text-slate-300/80">
                Instantly download crisp PNG memes, copy directly to your clipboard, or save to your local gallery!
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-all cursor-pointer border border-white/20 active:scale-95"
          >
            Got it, let's make memes!
          </button>
        </div>
      </div>
    </div>
  );
};
