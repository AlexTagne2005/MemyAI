import React, { useState } from 'react';
import { MagicCaptionOption, AiCaptionTone } from '../types';
import { Sparkles, RefreshCw, Wand2, ArrowRight, MessageSquareText, Lightbulb, Check, Flame } from 'lucide-react';

interface MagicCaptionPanelProps {
  currentImageUrl: string;
  onApplyCaption: (topText: string, bottomText: string) => void;
  onRemixCaption: (instruction: string) => Promise<void>;
  currentTopText: string;
  currentBottomText: string;
}

const TONES: { id: AiCaptionTone; label: string; icon: string }[] = [
  { id: 'viral', label: 'Viral & Punchy', icon: '🔥' },
  { id: 'sarcastic', label: 'Sarcastic', icon: '🎭' },
  { id: 'tech', label: 'Dev & Tech', icon: '💻' },
  { id: 'corporate', label: 'Office Life', icon: '💼' },
  { id: 'genz', label: 'Gen Z / Brainrot', icon: '🧠' },
  { id: 'wholesome', label: 'Wholesome', icon: '😇' },
  { id: 'dark', label: 'Dark Comedy', icon: '💀' },
];

const LOADING_MESSAGES = [
  'Analyzing image context & facial vibes...',
  'Consulting ancient meme elders...',
  'Synthesizing viral comedy algorithms...',
  'Drafting top-tier punchlines...',
  'Formatting 5 hilarious meme options...',
];

export const MagicCaptionPanel: React.FC<MagicCaptionPanelProps> = ({
  currentImageUrl,
  onApplyCaption,
  onRemixCaption,
  currentTopText,
  currentBottomText,
}) => {
  const [selectedTone, setSelectedTone] = useState<AiCaptionTone>('viral');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [captions, setCaptions] = useState<MagicCaptionOption[]>([]);
  const [appliedCaptionId, setAppliedCaptionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [remixInstruction, setRemixInstruction] = useState('');
  const [isRemixing, setIsRemixing] = useState(false);

  const handleGenerateMagicCaptions = async () => {
    if (!currentImageUrl) return;

    setIsLoading(true);
    setErrorMessage(null);
    setAppliedCaptionId(null);

    // Cycle through loading funny status messages
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);

    try {
      const response = await fetch('/api/magic-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentImageUrl,
          tone: selectedTone,
          customInstruction: customPrompt.trim(),
        }),
      });

      const data = await response.json();

      if (data.captions && Array.isArray(data.captions)) {
        const formattedCaptions: MagicCaptionOption[] = data.captions.map((c: any, index: number) => ({
          id: `caption-${index}-${Date.now()}`,
          topText: c.topText || '',
          bottomText: c.bottomText || '',
          humorType: c.humorType || 'Funny',
          explanation: c.explanation || 'AI matched image context',
        }));
        setCaptions(formattedCaptions);

        // Auto apply the first top candidate
        if (formattedCaptions.length > 0) {
          onApplyCaption(formattedCaptions[0].topText, formattedCaptions[0].bottomText);
          setAppliedCaptionId(formattedCaptions[0].id);
        }
      } else {
        throw new Error(data.error || 'Invalid response from magic caption service');
      }
    } catch (err: any) {
      console.error('Magic caption error:', err);
      setErrorMessage(err.message || 'Could not generate captions. Check connection.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleApplySingleCaption = (option: MagicCaptionOption) => {
    onApplyCaption(option.topText, option.bottomText);
    setAppliedCaptionId(option.id);
  };

  const handleRemixSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remixInstruction.trim()) return;

    setIsRemixing(true);
    try {
      await onRemixCaption(remixInstruction.trim());
      setRemixInstruction('');
    } catch (err) {
      console.error('Remix error:', err);
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden">
      {/* Decorative background ambient glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/30">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base sm:text-lg flex items-center gap-2">
              Magic AI Captions
              <span className="text-[10px] bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30 px-2.5 py-0.5 rounded-full font-mono backdrop-blur-md">
                Multimodal AI
              </span>
            </h3>
            <p className="text-xs text-slate-300/80">
              AI analyzes image expressions &amp; context to suggest 5 viral punchlines
            </p>
          </div>
        </div>
      </div>

      {/* Tone Selection Chips */}
      <div>
        <label className="text-xs font-semibold text-slate-200 mb-2 block uppercase tracking-wider">
          Humor Tone Preset:
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTone(t.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                selectedTone === t.id
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/30 ring-1 ring-fuchsia-400'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Custom Topic/Keyword Prompt */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-200">
            Optional Topic Focus:
          </label>
          <span className="text-[10px] text-slate-400">e.g., "about Mondays", "about AI coding"</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Add context or specific topic (optional)..."
            className="flex-1 px-3.5 py-2 text-xs bg-white/10 border border-white/15 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all backdrop-blur-md"
          />
        </div>
      </div>

      {/* Primary Magic Caption Button */}
      <button
        onClick={handleGenerateMagicCaptions}
        disabled={isLoading || !currentImageUrl}
        className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-white/20 active:scale-[0.99]"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-fuchsia-200" />
            <span>{LOADING_MESSAGES[loadingMsgIndex]}</span>
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 text-fuchsia-200 animate-bounce" />
            <span>✨ MAGIC CAPTION (Generate 5 Ideas)</span>
          </>
        )}
      </button>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Generated Captions List (5 Cards) */}
      {captions.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span>Click any caption to overlay on image:</span>
            <span className="text-fuchsia-300 font-mono text-[11px]">{captions.length} Captions Ready</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {captions.map((opt, idx) => {
              const isApplied = appliedCaptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleApplySingleCaption(opt)}
                  className={`group text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative backdrop-blur-md ${
                    isApplied
                      ? 'bg-fuchsia-500/20 border-fuchsia-400 shadow-lg shadow-fuchsia-950/40'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30">
                      #{idx + 1} {opt.humorType}
                    </span>
                    {isApplied ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Applied
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 group-hover:text-fuchsia-300 flex items-center gap-1">
                        Apply <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {opt.topText && (
                    <p className="font-extrabold text-xs sm:text-sm text-fuchsia-200 tracking-wide uppercase line-clamp-1">
                      TOP: "{opt.topText}"
                    </p>
                  )}
                  {opt.bottomText && (
                    <p className="font-extrabold text-xs sm:text-sm text-slate-100 tracking-wide uppercase line-clamp-2 mt-0.5">
                      BOTTOM: "{opt.bottomText}"
                    </p>
                  )}

                  {opt.explanation && (
                    <p className="text-[11px] text-slate-300/80 italic mt-1.5 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-300 shrink-0" />
                      {opt.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Remix / Refine Caption Bar */}
      <div className="border-t border-white/10 pt-3 mt-1">
        <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
          <MessageSquareText className="w-3.5 h-3.5 text-fuchsia-400" />
          AI Remix / Refine Text:
        </label>
        <form onSubmit={handleRemixSubmit} className="flex gap-2">
          <input
            type="text"
            value={remixInstruction}
            onChange={(e) => setRemixInstruction(e.target.value)}
            placeholder="e.g. 'make it funnier', 'translate to Gen Z', 'make it shorter'..."
            className="flex-1 px-3.5 py-2 text-xs bg-white/10 border border-white/15 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all backdrop-blur-md"
          />
          <button
            type="submit"
            disabled={isRemixing || !remixInstruction.trim()}
            className="px-4 py-2 text-xs font-bold rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-50 text-fuchsia-200 border border-white/15 transition-all cursor-pointer flex items-center gap-1 shrink-0 backdrop-blur-md"
          >
            {isRemixing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Refine AI</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
