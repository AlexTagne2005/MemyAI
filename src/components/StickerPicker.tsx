import React from 'react';
import { StickerOverlay } from '../types';
import { STICKER_LIBRARY } from '../data/stickers';
import { Smile, Trash2, Glasses, Sparkles } from 'lucide-react';

interface StickerPickerProps {
  stickerOverlays: StickerOverlay[];
  onAddSticker: (content: string) => void;
  onRemoveSticker: (id: string) => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  stickerOverlays,
  onAddSticker,
  onRemoveSticker,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-fuchsia-400" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base">Stickers &amp; Overlays</h3>
        </div>
      </div>

      {/* Preset Stickers / Emojis Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {STICKER_LIBRARY.map((st) => (
          <button
            key={st.id}
            onClick={() => onAddSticker(st.content)}
            className="p-2.5 bg-white/5 hover:bg-white/15 border border-white/15 hover:border-fuchsia-400 rounded-2xl text-xl transition-all cursor-pointer hover:scale-110 shrink-0 flex items-center justify-center backdrop-blur-md active:scale-95"
            title={st.name}
          >
            {st.content === 'sunglasses' ? (
              <span className="text-xs font-bold text-fuchsia-200 px-1.5 py-0.5 bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/30">
                😎 Glasses
              </span>
            ) : (
              st.content
            )}
          </button>
        ))}
      </div>

      {/* Active Stickers List */}
      {stickerOverlays.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap border-t border-white/10 pt-2">
          <span className="text-xs font-semibold text-slate-300">Added Stickers:</span>
          {stickerOverlays.map((st) => (
            <div
              key={st.id}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/15 rounded-xl text-xs backdrop-blur-md"
            >
              <span className="text-slate-100 font-medium">
                {st.content === 'sunglasses' ? '😎 Glasses' : st.content}
              </span>
              <button
                onClick={() => onRemoveSticker(st.id)}
                className="text-slate-400 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                title="Remove sticker"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
