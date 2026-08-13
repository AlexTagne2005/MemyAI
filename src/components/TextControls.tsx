import React from 'react';
import { TextOverlay, FontFamily } from '../types';
import { Type, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Palette, Sliders, RotateCw } from 'lucide-react';

interface TextControlsProps {
  textOverlays: TextOverlay[];
  onUpdateOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  onAddOverlay: () => void;
  onRemoveOverlay: (id: string) => void;
}

const FONTS: { id: FontFamily; label: string; class: string }[] = [
  { id: 'Impact', label: 'Impact (Classic Meme)', class: 'font-impact' },
  { id: 'Anton', label: 'Anton (Heavy Sans)', class: 'font-sans' },
  { id: 'Bangers', label: 'Bangers (Comic Hero)', class: 'font-serif' },
  { id: 'Comic Neue', label: 'Comic Neue (Casual)', class: 'font-sans' },
  { id: 'Montserrat', label: 'Montserrat (Bold Clean)', class: 'font-sans' },
  { id: 'Oswald', label: 'Oswald (Condensed)', class: 'font-sans' },
  { id: 'Permanent Marker', label: 'Marker Style', class: 'font-sans' },
  { id: 'Press Start 2P', label: 'Retro 8-Bit Pixel', class: 'font-mono' },
  { id: 'Inter', label: 'Inter (Modern)', class: 'font-sans' },
];

const PRESET_COLORS = [
  '#FFFFFF', // White
  '#FFFF00', // Yellow
  '#00FFFF', // Neon Cyan
  '#FF0055', // Neon Pink
  '#00FF66', // Neon Green
  '#FF9900', // Orange
  '#000000', // Black
];

const STROKE_COLORS = [
  '#000000', // Black outline
  '#FFFFFF', // White outline
  '#1e1b4b', // Dark Purple
  '#7f1d1d', // Dark Red
  '#064e3b', // Dark Green
];

export const TextControls: React.FC<TextControlsProps> = ({
  textOverlays,
  onUpdateOverlay,
  onAddOverlay,
  onRemoveOverlay,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-fuchsia-400" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base">Text Layer Customizer</h3>
        </div>
        <button
          onClick={onAddOverlay}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-2xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-500/30 transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Floating Text
        </button>
      </div>

      {/* Text Layers Accordion/Inputs */}
      <div className="flex flex-col gap-4">
        {textOverlays.map((item, index) => {
          const isMainLayer = index < 2; // Top or Bottom
          const label = index === 0 ? 'Top Text' : index === 1 ? 'Bottom Text' : `Custom Text #${index - 1}`;

          return (
            <div
              key={item.id}
              className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col gap-3"
            >
              {/* Header line */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                  {label}
                </span>

                {!isMainLayer && (
                  <button
                    onClick={() => onRemoveOverlay(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Delete text layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Text Input */}
              <div className="relative">
                <textarea
                  rows={2}
                  value={item.text}
                  onChange={(e) => onUpdateOverlay(item.id, { text: e.target.value })}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  className="w-full px-3 py-2 text-sm font-bold uppercase bg-white/10 border border-white/15 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all resize-none"
                />
              </div>

              {/* Font Family Selector */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Font Style:</label>
                  <select
                    value={item.fontFamily}
                    onChange={(e) => onUpdateOverlay(item.id, { fontFamily: e.target.value as FontFamily })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white/10 border border-white/15 rounded-xl text-slate-200 focus:outline-none focus:border-fuchsia-400 cursor-pointer"
                  >
                    {FONTS.map((f) => (
                      <option key={f.id} value={f.id} className="bg-slate-900 text-slate-100">
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Text Transform:</label>
                  <button
                    onClick={() => onUpdateOverlay(item.id, { isUppercase: !item.isUppercase })}
                    className={`w-full py-1.5 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      item.isUppercase
                        ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white border-white/20'
                        : 'bg-white/10 text-slate-300 border-white/15'
                    }`}
                  >
                    {item.isUppercase ? 'UPPERCASE (ON)' : 'Mixed Case (OFF)'}
                  </button>
                </div>
              </div>

              {/* Size & Rotation Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 font-semibold mb-1">
                    <span>Font Size:</span>
                    <span className="text-fuchsia-300 font-mono">{item.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="110"
                    value={item.fontSize}
                    onChange={(e) => onUpdateOverlay(item.id, { fontSize: Number(e.target.value) })}
                    className="w-full accent-fuchsia-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 font-semibold mb-1">
                    <span>Rotation:</span>
                    <span className="text-fuchsia-300 font-mono">{item.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={item.rotation}
                    onChange={(e) => onUpdateOverlay(item.id, { rotation: Number(e.target.value) })}
                    className="w-full accent-fuchsia-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Colors & Stroke Outline */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                {/* Text Fill Color */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Text Color:</label>
                  <div className="flex items-center gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateOverlay(item.id, { color: c })}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border border-white/30 cursor-pointer transition-transform ${
                          item.color === c ? 'scale-125 ring-2 ring-fuchsia-400' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={item.color}
                      onChange={(e) => onUpdateOverlay(item.id, { color: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                      title="Custom text color"
                    />
                  </div>
                </div>

                {/* Stroke Outline Color & Width */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Stroke Outline:</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {STROKE_COLORS.map((sc) => (
                        <button
                          key={sc}
                          onClick={() => onUpdateOverlay(item.id, { strokeColor: sc })}
                          style={{ backgroundColor: sc }}
                          className={`w-4 h-4 rounded-full border border-white/30 cursor-pointer ${
                            item.strokeColor === sc ? 'scale-125 ring-1 ring-fuchsia-400' : ''
                          }`}
                        />
                      ))}
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="16"
                      value={item.strokeWidth}
                      onChange={(e) => onUpdateOverlay(item.id, { strokeWidth: Number(e.target.value) })}
                      className="w-16 accent-fuchsia-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                      title="Outline Thickness"
                    />
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Align:</label>
                  <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15 backdrop-blur-md">
                    <button
                      onClick={() => onUpdateOverlay(item.id, { align: 'left' })}
                      className={`p-1 rounded-lg cursor-pointer ${item.align === 'left' ? 'bg-fuchsia-600 text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateOverlay(item.id, { align: 'center' })}
                      className={`p-1 rounded-lg cursor-pointer ${item.align === 'center' ? 'bg-fuchsia-600 text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateOverlay(item.id, { align: 'right' })}
                      className={`p-1 rounded-lg cursor-pointer ${item.align === 'right' ? 'bg-fuchsia-600 text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
