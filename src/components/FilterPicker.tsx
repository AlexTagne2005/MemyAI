import React from 'react';
import { MemeFilter } from '../types';
import { Sliders, Flame, Sparkles } from 'lucide-react';

interface FilterPickerProps {
  currentFilter: MemeFilter;
  onSelectFilter: (filter: MemeFilter) => void;
}

const FILTERS: { id: MemeFilter; label: string; icon: string; desc: string }[] = [
  { id: 'none', label: 'Normal', icon: '✨', desc: 'Original photo' },
  { id: 'deepfried', label: 'Deep Fried', icon: '🔥', desc: 'High saturation & contrast meme classic' },
  { id: 'vintage', label: 'Vintage', icon: '📷', desc: 'Retro warm photo' },
  { id: 'contrast', label: 'High Contrast', icon: '⚡', desc: 'Dramatic punchy shadows' },
  { id: 'grayscale', label: 'Grayscale', icon: '🖤', desc: 'Monochrome drama' },
  { id: 'sepia', label: 'Sepia', icon: '📜', desc: 'Old-school parchment' },
  { id: 'invert', label: 'Invert', icon: '🎨', desc: 'Negative color shock' },
];

export const FilterPicker: React.FC<FilterPickerProps> = ({ currentFilter, onSelectFilter }) => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-fuchsia-400" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base">Meme Image Filters</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {FILTERS.map((f) => {
          const isSelected = currentFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFilter(f.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 backdrop-blur-md active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white border-fuchsia-400 shadow-lg shadow-fuchsia-500/30 scale-[0.98]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xl">{f.icon}</span>
              <span className="text-xs font-bold leading-tight">{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
