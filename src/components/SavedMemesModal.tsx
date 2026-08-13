import React from 'react';
import { SavedMeme } from '../types';
import { Bookmark, X, Download, Trash2, ArrowUpRight } from 'lucide-react';

interface SavedMemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedMemes: SavedMeme[];
  onDeleteMeme: (id: string) => void;
  onLoadMemeToCanvas: (dataUrl: string) => void;
}

export const SavedMemesModal: React.FC<SavedMemesModalProps> = ({
  isOpen,
  onClose,
  savedMemes,
  onDeleteMeme,
  onLoadMemeToCanvas,
}) => {
  if (!isOpen) return null;

  const handleDownloadSingle = (dataUrl: string, id: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `saved-meme-${id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-950/80 border border-white/20 backdrop-blur-2xl rounded-3xl p-6 max-w-2xl w-full flex flex-col gap-4 shadow-2xl relative max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 shadow-lg shadow-fuchsia-500/20">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">My Saved Memes</h3>
            <p className="text-xs text-slate-300/80">Your created meme collection ({savedMemes.length})</p>
          </div>
        </div>

        {savedMemes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2 my-6">
            <Bookmark className="w-8 h-8 text-slate-500 stroke-[1.5]" />
            <p>No saved memes yet! Click "Save Meme" on the preview canvas to save your creations here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1 custom-scrollbar max-h-[50vh]">
            {savedMemes.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/5 border border-white/15 rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-md"
              >
                <div className="aspect-square w-full relative bg-slate-950/60 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.dataUrl}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-2.5 flex items-center justify-between bg-white/5 gap-1 border-t border-white/10">
                  <span className="text-[10px] text-slate-300 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownloadSingle(item.dataUrl, item.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-950/40 transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onLoadMemeToCanvas(item.dataUrl);
                        onClose();
                      }}
                      className="p-1 rounded-lg text-slate-300 hover:text-fuchsia-300 hover:bg-fuchsia-950/40 transition-colors cursor-pointer"
                      title="Edit on Canvas"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteMeme(item.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
