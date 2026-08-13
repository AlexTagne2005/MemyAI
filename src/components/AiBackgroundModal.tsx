import React, { useState } from 'react';
import { Sparkles, X, RefreshCw, Wand2 } from 'lucide-react';

interface AiBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
}

const PRESET_PROMPTS = [
  'A cute cat wearing futuristic cyberpunk VR glasses, dramatic cinematic lighting',
  'A developer sitting at a desk with 10 monitors displaying green matrix code and drinking coffee',
  'An astronaut riding a unicorn on Mars, retro synthwave style',
  'A golden retriever dog dressed in a sharp business suit presenting a pie chart in a boardroom',
];

export const AiBackgroundModal: React.FC<AiBackgroundModalProps> = ({
  isOpen,
  onClose,
  onImageGenerated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-ai-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        onImageGenerated(data.imageUrl);
        onClose();
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err: any) {
      console.error('AI image generation error:', err);
      setErrorMsg(err.message || 'Image generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-950/80 border border-white/20 backdrop-blur-2xl rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">AI Meme Background Generator</h3>
            <p className="text-xs text-slate-300/80">Generate a custom background image with Gemini AI</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-200 mb-1.5 block">
            Describe the image you want:
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A tired programmer looking at a laptop while coffee spills everywhere..."
            className="w-full px-3.5 py-2.5 text-xs bg-white/10 border border-white/15 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all resize-none backdrop-blur-md"
          />
        </div>

        {/* Preset Prompt Chips */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
            Or pick a preset idea:
          </label>
          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="text-left text-xs p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-200 hover:text-fuchsia-200 transition-all cursor-pointer line-clamp-2 backdrop-blur-md"
              >
                ✨ "{p}"
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 active:scale-95"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Image...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate Meme Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
