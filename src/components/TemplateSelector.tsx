import React, { useState, useRef, useEffect , useMemo} from 'react';
import { MEME_TEMPLATES } from '../data/memeTemplates';
import { MemeTemplate, MemeCategory } from '../types';
import { Search, Upload, Sparkles, Flame, Image as ImageIcon, Check, Heart } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (template: MemeTemplate) => void;
  onCustomImageUpload: (imageUrl: string, fileName?: string) => void;
  onOpenAiGenerator: () => void;
}

const CATEGORIES: { id: MemeCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Templates', icon: '🔥' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
  { id: 'trending', label: 'Trending', icon: '⚡' },
  { id: 'classic', label: 'Classics', icon: '👑' },
  { id: 'tech', label: 'Dev & Tech', icon: '💻' },
  { id: 'office', label: 'Office & Job', icon: '💼' },
  { id: 'animals', label: 'Animals & Cats', icon: '🐱' },
  { id: 'reactions', label: 'Reactions', icon: '🎭' },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onCustomImageUpload,
  onOpenAiGenerator,
}) => {
  const [activeCategory, setActiveCategory] = useState<MemeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Favorite template IDs state with localStorage persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('memeai_favorite_templates');
      return stored ? JSON.parse(stored) : ['drake-hotline', 'distracted-boyfriend', 'doge'];
    } catch {
      return ['drake-hotline', 'distracted-boyfriend', 'doge'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('memeai_favorite_templates', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favoriteIds]);


  const favoriteIdsSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTemplates = MEME_TEMPLATES.filter((template) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'favorites'
        ? favoriteIdsSet.has(template.id)
        : template.category === activeCategory;

    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCustomImageUpload(event.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-2xl">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-fuchsia-400" />
            Select Image or Template
          </h2>
          <p className="text-xs text-slate-300/80">
            Pick a viral meme template, upload your photo, or generate with AI
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 text-slate-300" />
            Upload Photo
          </button>

          {/* AI Generate Button */}
          <button
            onClick={onOpenAiGenerator}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-2xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-500/30 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
            AI Image
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Drag and Drop Zone Notice */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-3 text-center transition-all ${
          isDragging
            ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100 scale-[1.01]'
            : 'border-white/15 bg-white/5 backdrop-blur-md text-slate-300 hover:border-white/30'
        }`}
      >
        <p className="text-xs font-medium">
          {isDragging ? '🚀 Drop image here to upload!' : '💡 Drag & drop any image here to make a meme instantly'}
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (e.g. Drake, Doge, Cat)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white/10 border border-white/15 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all backdrop-blur-md"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-2xl whitespace-nowrap transition-all cursor-pointer backdrop-blur-md ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold shadow-lg shadow-fuchsia-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center gap-2">
          <Heart className="w-8 h-8 text-fuchsia-400/50 stroke-[1.5]" />
          <p className="text-xs text-slate-300 font-medium">
            {activeCategory === 'favorites'
              ? 'No favorite templates yet! Click the heart ❤️ icon on any template card to bookmark it here.'
              : 'No templates match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            const isFavorite = favoriteIdsSet.has(template.id);
            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-950 text-left ${
                  isSelected
                    ? 'border-fuchsia-400 ring-2 ring-fuchsia-500/40 scale-[0.98]'
                    : 'border-white/15 hover:border-white/30 hover:scale-[1.02]'
                }`}
              >
                <img
                  src={template.url}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Favorite Heart Button */}
                <div
                  onClick={(e) => toggleFavorite(template.id, e)}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className={`absolute top-1.5 left-1.5 p-1 rounded-xl backdrop-blur-md transition-all cursor-pointer z-10 ${
                    isFavorite
                      ? 'bg-fuchsia-500/80 text-white shadow-md shadow-fuchsia-500/30'
                      : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFavorite ? 'fill-white text-white' : 'text-slate-200'
                    }`}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-90 p-1.5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-slate-100 line-clamp-1 leading-tight pl-0.5">
                    {template.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-fuchsia-500 text-white flex items-center justify-center shadow-md z-10">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
