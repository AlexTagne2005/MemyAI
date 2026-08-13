import React, { useEffect, useRef, useState } from 'react';
import { TextOverlay, StickerOverlay, MemeFilter } from '../types';
import { renderMemeCanvas } from '../utils/canvasRenderer';
import { Download, Copy, Bookmark, Check, RefreshCw, Eye, Share2, Undo2, Redo2 } from 'lucide-react';

interface MemeCanvasProps {
  imageUrl: string;
  textOverlays: TextOverlay[];
  stickerOverlays: StickerOverlay[];
  filter: MemeFilter;
  onUpdateTextPosition: (id: string, x: number, y: number) => void;
  onUpdateStickerPosition: (id: string, x: number, y: number) => void;
  onSaveToGallery: (dataUrl: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onDragEnd?: () => void;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  imageUrl,
  textOverlays,
  stickerOverlays,
  filter,
  onUpdateTextPosition,
  onUpdateStickerPosition,
  onSaveToGallery,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onDragEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedDataUrl, setRenderedDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Dragging state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingType, setDraggingType] = useState<'text' | 'sticker' | null>(null);

  // Re-render canvas whenever overlays, image, or filter change
  useEffect(() => {
    let isMounted = true;
    if (!imageUrl) return;

    setIsRendering(true);
    renderMemeCanvas({
      imageUrl,
      textOverlays,
      stickerOverlays,
      filter,
    })
      .then((res) => {
        if (isMounted) {
          setRenderedDataUrl(res.dataUrl);
          setIsRendering(false);
        }
      })
      .catch((err) => {
        console.error('Error rendering meme canvas:', err);
        if (isMounted) setIsRendering(false);
      });

    return () => {
      isMounted = false;
    };
  }, [imageUrl, textOverlays, stickerOverlays, filter]);

  // Handle Dragging Text/Stickers on Container
  const handlePointerDown = (id: string, type: 'text' | 'sticker', e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingId(id);
    setDraggingType(type);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !draggingType || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    let xPercent = ((clientX - rect.left) / rect.width) * 100;
    let yPercent = ((clientY - rect.top) / rect.height) * 100;

    xPercent = Math.max(5, Math.min(95, xPercent));
    yPercent = Math.max(5, Math.min(95, yPercent));

    if (draggingType === 'text') {
      onUpdateTextPosition(draggingId, Math.round(xPercent), Math.round(yPercent));
    } else if (draggingType === 'sticker') {
      onUpdateStickerPosition(draggingId, Math.round(xPercent), Math.round(yPercent));
    }
  };

  const handlePointerUp = () => {
    if (draggingId && onDragEnd) {
      onDragEnd();
    }
    setDraggingId(null);
    setDraggingType(null);
  };

  // Download PNG Meme
  const handleDownload = async () => {
    try {
      const res = await renderMemeCanvas({ imageUrl, textOverlays, stickerOverlays, filter });
      const a = document.createElement('a');
      a.href = res.dataUrl;
      a.download = `meme-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // Copy Meme Image to Clipboard
  const handleCopyToClipboard = async () => {
    try {
      const res = await renderMemeCanvas({ imageUrl, textOverlays, stickerOverlays, filter });
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': res.blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert('Clipboard API not supported in this browser mode.');
      }
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  // Web Share API Implementation
  const handleWebShare = async () => {
    setSharing(true);
    try {
      const res = await renderMemeCanvas({ imageUrl, textOverlays, stickerOverlays, filter });
      const file = new File([res.blob], `meme-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Meme created with MemeAI',
          text: 'Check out this meme I created with MemeAI!',
        });
        setShareStatus('Shared!');
      } else if (navigator.share) {
        await navigator.share({
          title: 'MemeAI Generator',
          text: 'Check out this meme I created with MemeAI!',
          url: window.location.href,
        });
        setShareStatus('Shared!');
      } else {
        await handleCopyToClipboard();
        setShareStatus('Copied to Clipboard!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Web share error:', err);
        handleCopyToClipboard();
        setShareStatus('Copied Image!');
      }
    } finally {
      setSharing(false);
      setTimeout(() => setShareStatus(null), 2500);
    }
  };

  // Save to Gallery
  const handleSave = async () => {
    try {
      const res = await renderMemeCanvas({ imageUrl, textOverlays, stickerOverlays, filter });
      onSaveToGallery(res.dataUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 flex flex-col items-center gap-4 shadow-2xl">
      {/* Top Controls & Status */}
      <div className="w-full flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-fuchsia-400" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base">Meme Canvas Preview</h3>
        </div>

        {/* Undo / Redo Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo recent change (Ctrl+Z)"
              className="p-1.5 rounded-xl hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent text-slate-200 transition-all cursor-pointer active:scale-95"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo recent change (Ctrl+Y)"
              className="p-1.5 rounded-xl hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent text-slate-200 transition-all cursor-pointer active:scale-95"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Render Stage */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full max-w-lg aspect-auto min-h-[320px] bg-slate-950/60 rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center select-none shadow-2xl group cursor-crosshair backdrop-blur-md"
      >
        {isRendering && !renderedDataUrl && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex items-center justify-center gap-2 text-slate-200 font-medium text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-fuchsia-400" />
            <span>Rendering high-res meme...</span>
          </div>
        )}

        {renderedDataUrl ? (
          <img
            src={renderedDataUrl}
            alt="Rendered Meme"
            className="w-full h-auto object-contain max-h-[500px] rounded-lg"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-fuchsia-400" />
            Loading preview...
          </div>
        )}

        {/* Interactive Touch/Click Drag Handles for Text Overlays */}
        {textOverlays.map((text) => {
          if (!text.text.trim()) return null;
          const isDraggingThis = draggingId === text.id;
          return (
            <div
              key={text.id}
              onPointerDown={(e) => handlePointerDown(text.id, 'text', e)}
              style={{
                left: `${text.x}%`,
                top: `${text.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute cursor-grab active:cursor-grabbing px-2 py-1 rounded-xl border transition-all z-10 hover:border-fuchsia-400 ${
                isDraggingThis
                  ? 'border-fuchsia-400 bg-fuchsia-500/30 ring-2 ring-fuchsia-400'
                  : 'border-transparent group-hover:border-white/30 hover:bg-black/40'
              }`}
              title="Click & drag to reposition text"
            >
              <div className="text-[9px] font-bold text-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 px-1.5 py-0.5 rounded-md -top-5 left-1/2 -translate-x-1/2 absolute whitespace-nowrap pointer-events-none backdrop-blur-md">
                ✋ Drag Text
              </div>
            </div>
          );
        })}

        {/* Interactive Touch/Click Drag Handles for Stickers */}
        {stickerOverlays.map((sticker) => {
          const isDraggingThis = draggingId === sticker.id;
          return (
            <div
              key={sticker.id}
              onPointerDown={(e) => handlePointerDown(sticker.id, 'sticker', e)}
              style={{
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute cursor-grab active:cursor-grabbing p-1 rounded-xl border transition-all z-10 ${
                isDraggingThis
                  ? 'border-fuchsia-400 bg-fuchsia-500/30'
                  : 'border-transparent group-hover:border-fuchsia-500/50'
              }`}
              title="Click & drag to reposition sticker"
            >
              <div className="text-[9px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 px-1.5 py-0.5 rounded-md -top-5 left-1/2 -translate-x-1/2 absolute whitespace-nowrap pointer-events-none backdrop-blur-md">
                ✋ Drag Sticker
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Action Buttons */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer border border-white/20 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        {/* Web Share Button */}
        <button
          onClick={handleWebShare}
          disabled={sharing}
          className="flex items-center justify-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-500/30 backdrop-blur-md transition-all cursor-pointer active:scale-95"
        >
          {sharing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-fuchsia-300" />
              <span>Sharing...</span>
            </>
          ) : shareStatus ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">{shareStatus}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-fuchsia-300" />
              <span>Share Meme</span>
            </>
          )}
        </button>

        {/* Copy Image Button */}
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center justify-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-fuchsia-300" />
              <span>Copy Image</span>
            </>
          )}
        </button>

        {/* Save to Gallery Button */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-bold rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-fuchsia-300" />
              <span className="text-fuchsia-300">Saved!</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-fuchsia-300" />
              <span>Save Meme</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
