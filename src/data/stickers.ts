export interface StickerItem {
  id: string;
  name: string;
  content: string; // Emoji character or SVG path/URL
  category: 'emoji' | 'reactions' | 'badges';
}

export const STICKER_LIBRARY: StickerItem[] = [
  { id: 'laugh', name: 'Joy Emoji', content: '😂', category: 'emoji' },
  { id: 'rofl', name: 'ROFL', content: '🤣', category: 'emoji' },
  { id: 'fire', name: 'Fire', content: '🔥', category: 'emoji' },
  { id: 'mindblown', name: 'Mind Blown', content: '🤯', category: 'emoji' },
  { id: 'clown', name: 'Clown', content: '🤡', category: 'emoji' },
  { id: 'skull', name: 'Dead / Skull', content: '💀', category: 'emoji' },
  { id: 'cool', name: 'Sunglasses', content: 'sunglasses', category: 'reactions' },
  { id: '100', name: '100 Percent', content: '💯', category: 'badges' },
  { id: 'crown', name: 'Crown', content: '👑', category: 'badges' },
  { id: 'sparkles', name: 'Sparkles', content: '✨', category: 'emoji' },
  { id: 'eyes', name: 'Side Eyes', content: '👀', category: 'emoji' },
  { id: 'holding_back', name: 'Crying', content: '😭', category: 'emoji' },
  { id: 'nerd', name: 'Nerd', content: '🤓', category: 'emoji' },
  { id: 'party', name: 'Party Popper', content: '🎉', category: 'emoji' },
  { id: 'salute', name: 'Salute', content: '🫡', category: 'emoji' },
  { id: 'sus', name: 'Sus Eyes', content: '🧐', category: 'emoji' },
];
