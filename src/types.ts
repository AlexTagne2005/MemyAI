export type MemeCategory = 'trending' | 'classic' | 'tech' | 'office' | 'animals' | 'reactions' | 'custom' | 'favorites';

export interface CanvasState {
  currentImageUrl: string;
  selectedTemplateId: string | null;
  textOverlays: TextOverlay[];
  stickerOverlays: StickerOverlay[];
  filter: MemeFilter;
}

export interface MemeTemplate {
  id: string;
  name: string;
  category: MemeCategory;
  url: string;
  defaultTopText?: string;
  defaultBottomText?: string;
  width?: number;
  height?: number;
}

export interface MagicCaptionOption {
  id: string;
  topText: string;
  bottomText: string;
  humorType: string;
  explanation: string;
}

export type FontFamily =
  | 'Impact'
  | 'Anton'
  | 'Bangers'
  | 'Comic Neue'
  | 'Montserrat'
  | 'Oswald'
  | 'Permanent Marker'
  | 'Press Start 2P'
  | 'Inter';

export interface TextOverlay {
  id: string;
  text: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  fontSize: number; // in px at base canvas scale
  fontFamily: FontFamily;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  isUppercase: boolean;
  align: 'left' | 'center' | 'right';
  rotation: number; // degrees
  backgroundColor?: string;
}

export interface StickerOverlay {
  id: string;
  content: string; // Emoji character or URL
  isImage: boolean;
  x: number; // percentage
  y: number; // percentage
  size: number; // px size
  rotation: number;
}

export type MemeFilter =
  | 'none'
  | 'deepfried'
  | 'vintage'
  | 'contrast'
  | 'grayscale'
  | 'sepia'
  | 'invert';

export interface SavedMeme {
  id: string;
  title: string;
  dataUrl: string;
  createdAt: number;
  templateName: string;
}

export type AiCaptionTone =
  | 'viral'
  | 'sarcastic'
  | 'tech'
  | 'corporate'
  | 'genz'
  | 'wholesome'
  | 'dark';
