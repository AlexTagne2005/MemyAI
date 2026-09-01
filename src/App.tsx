import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { MagicCaptionPanel } from './components/MagicCaptionPanel';
import { MemeCanvas } from './components/MemeCanvas';
import { TextControls } from './components/TextControls';
import { StickerPicker } from './components/StickerPicker';
import { FilterPicker } from './components/FilterPicker';
import { AiBackgroundModal } from './components/AiBackgroundModal';
import { SavedMemesModal } from './components/SavedMemesModal';
import { HelpModal } from './components/HelpModal';

import { MEME_TEMPLATES } from './data/memeTemplates';
import { MemeTemplate, TextOverlay, StickerOverlay, MemeFilter, SavedMeme, CanvasState } from './types';

const INITIAL_TEXT_OVERLAYS: TextOverlay[] = [
  {
    id: 'top-text',
    text: MEME_TEMPLATES[0].defaultTopText || 'TOP TEXT HERE',
    x: 50,
    y: 12,
    fontSize: 44,
    fontFamily: 'Impact',
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 6,
    isUppercase: true,
    align: 'center',
    rotation: 0,
  },
  {
    id: 'bottom-text',
    text: MEME_TEMPLATES[0].defaultBottomText || 'BOTTOM TEXT HERE',
    x: 50,
    y: 86,
    fontSize: 44,
    fontFamily: 'Impact',
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 6,
    isUppercase: true,
    align: 'center',
    rotation: 0,
  },
];

const INITIAL_CANVAS_STATE: CanvasState = {
  currentImageUrl: MEME_TEMPLATES[0].url,
  selectedTemplateId: MEME_TEMPLATES[0].id,
  textOverlays: INITIAL_TEXT_OVERLAYS,
  stickerOverlays: [],
  filter: 'none',
};

export default function App() {
  // History stack for Undo / Redo
  const [history, setHistory] = useState<CanvasState[]>([INITIAL_CANVAS_STATE]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [dragStartSnapshot, setDragStartSnapshot] = useState<CanvasState | null>(null);

  const currentState = history[historyIndex] || INITIAL_CANVAS_STATE;
  const { currentImageUrl, selectedTemplateId, textOverlays, stickerOverlays, filter } = currentState;

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Memoize top and bottom text overlays for better performance
  const topTextOverlay = React.useMemo(() => textOverlays.find((t) => t.id === 'top-text'), [textOverlays]);
  const bottomTextOverlay = React.useMemo(() => textOverlays.find((t) => t.id === 'bottom-text'), [textOverlays]);

  // Push new snapshot into history stack
  const pushState = (newState: CanvasState) => {
    setHistory((prevHistory) => {
      const current = prevHistory[historyIndex] || INITIAL_CANVAS_STATE;
      if (JSON.stringify(current) === JSON.stringify(newState)) {
        return prevHistory;
      }
      const truncated = prevHistory.slice(0, historyIndex + 1);
      const updated = [...truncated, newState].slice(-30);
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  };

  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex((prev) => prev + 1);
    }
  };

  // Keyboard Shortcuts for Undo/Redo (Ctrl+Z, Cmd+Z, Ctrl+Y, Cmd+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElem = document.activeElement;
      if (
        activeElem &&
        (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history.length]);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Saved Memes in localStorage
  const [savedMemes, setSavedMemes] = useState<SavedMeme[]>(() => {
    try {
      const stored = localStorage.getItem('memeai_saved_memes');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('memeai_saved_memes', JSON.stringify(savedMemes));
    } catch (e) {
      console.error('Failed to save memes to localStorage:', e);
    }
  }, [savedMemes]);

  // Handle selecting a template
  const handleSelectTemplate = (template: MemeTemplate) => {
    pushState({
      ...currentState,
      selectedTemplateId: template.id,
      currentImageUrl: template.url,
      textOverlays: [
        {
          ...(textOverlays[0] || INITIAL_TEXT_OVERLAYS[0]),
          text: template.defaultTopText || 'TOP TEXT HERE',
        },
        {
          ...(textOverlays[1] || INITIAL_TEXT_OVERLAYS[1]),
          text: template.defaultBottomText || 'BOTTOM TEXT HERE',
        },
        ...textOverlays.slice(2),
      ],
    });
  };

  // Custom photo upload
  const handleCustomImageUpload = (imageUrl: string) => {
    pushState({
      ...currentState,
      selectedTemplateId: null,
      currentImageUrl: imageUrl,
    });
  };

  // Apply AI Magic Caption
  const handleApplyCaption = (topText: string, bottomText: string) => {
    const top = topTextOverlay || textOverlays[0] || INITIAL_TEXT_OVERLAYS[0];
    const bottom = bottomTextOverlay || textOverlays[1] || INITIAL_TEXT_OVERLAYS[1];

    const newTop = { ...top, text: topText };
    const newBottom = { ...bottom, text: bottomText };
    const updated = [newTop, newBottom, ...textOverlays.filter((t) => t.id !== 'top-text' && t.id !== 'bottom-text')];

    pushState({
      ...currentState,
      textOverlays: updated,
    });
  };

  // AI Remix / Refine Text
  const handleRemixCaption = async (instruction: string) => {
    const top = topTextOverlay?.text || '';
    const bottom = bottomTextOverlay?.text || '';

    const res = await fetch('/api/remix-caption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentTopText: top,
        currentBottomText: bottom,
        instruction,
      }),
    });

    const data = await res.json();
    if (data.topText !== undefined && data.bottomText !== undefined) {
      handleApplyCaption(data.topText, data.bottomText);
    }
  };

  // Text Overlay Handlers
  const handleUpdateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    const updated = textOverlays.map((item) => (item.id === id ? { ...item, ...updates } : item));
    pushState({ ...currentState, textOverlays: updated });
  };

  const handleUpdateTextPosition = (id: string, x: number, y: number) => {
    if (!dragStartSnapshot) {
      setDragStartSnapshot(currentState);
    }
    setHistory((prevHistory) => {
      const copy = [...prevHistory];
      const cur = { ...copy[historyIndex] };
      cur.textOverlays = cur.textOverlays.map((item) => (item.id === id ? { ...item, x, y } : item));
      copy[historyIndex] = cur;
      return copy;
    });
  };

  const handleAddTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: `text-${Date.now()}`,
      text: 'NEW TEXT',
      x: 50,
      y: 50,
      fontSize: 36,
      fontFamily: 'Impact',
      color: '#FFFF00',
      strokeColor: '#000000',
      strokeWidth: 5,
      isUppercase: true,
      align: 'center',
      rotation: 0,
    };
    pushState({ ...currentState, textOverlays: [...textOverlays, newOverlay] });
  };

  const handleRemoveTextOverlay = (id: string) => {
    pushState({ ...currentState, textOverlays: textOverlays.filter((item) => item.id !== id) });
  };

  // Sticker Overlay Handlers
  const handleAddSticker = (content: string) => {
    const newSticker: StickerOverlay = {
      id: `sticker-${Date.now()}`,
      content,
      isImage: false,
      x: 50,
      y: 50,
      size: 56,
      rotation: 0,
    };
    pushState({ ...currentState, stickerOverlays: [...stickerOverlays, newSticker] });
  };

  const handleUpdateStickerPosition = (id: string, x: number, y: number) => {
    if (!dragStartSnapshot) {
      setDragStartSnapshot(currentState);
    }
    setHistory((prevHistory) => {
      const copy = [...prevHistory];
      const cur = { ...copy[historyIndex] };
      cur.stickerOverlays = cur.stickerOverlays.map((item) => (item.id === id ? { ...item, x, y } : item));
      copy[historyIndex] = cur;
      return copy;
    });
  };

  const handleDragEnd = () => {
    if (dragStartSnapshot) {
      setHistory((prevHistory) => {
        const truncated = prevHistory.slice(0, historyIndex);
        const updated = [...truncated, dragStartSnapshot, currentState].slice(-30);
        setHistoryIndex(updated.length - 1);
        return updated;
      });
      setDragStartSnapshot(null);
    }
  };

  const handleRemoveSticker = (id: string) => {
    pushState({ ...currentState, stickerOverlays: stickerOverlays.filter((item) => item.id !== id) });
  };

  const handleSelectFilter = (newFilter: MemeFilter) => {
    pushState({ ...currentState, filter: newFilter });
  };

  // Gallery Save / Delete
  const handleSaveToGallery = (dataUrl: string) => {
    const topText = topTextOverlay?.text || 'Meme';
    const newSaved: SavedMeme = {
      id: `saved-${Date.now()}`,
      title: topText,
      dataUrl,
      createdAt: Date.now(),
      templateName: selectedTemplateId || 'Custom',
    };
    setSavedMemes((prev) => [newSaved, ...prev]);
  };

  const handleDeleteSavedMeme = (id: string) => {
    setSavedMemes((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-fuchsia-950 text-slate-50 flex flex-col font-sans selection:bg-fuchsia-500 selection:text-white pb-12 relative overflow-hidden">
      {/* Frosted Glass Ambient Lighting Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-500/25 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/25 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed top-[35%] right-[25%] w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <Header
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        savedCount={savedMemes.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 relative z-10">
        {/* Template & Image Selector Section */}
        <TemplateSelector
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
          onCustomImageUpload={handleCustomImageUpload}
          onOpenAiGenerator={() => setIsAiModalOpen(true)}
        />

        {/* Core Meme Generator Workspace: Canvas + Magic AI Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Column: Live Canvas Preview */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <MemeCanvas
              imageUrl={currentImageUrl}
              textOverlays={textOverlays}
              stickerOverlays={stickerOverlays}
              filter={filter}
              onUpdateTextPosition={handleUpdateTextPosition}
              onUpdateStickerPosition={handleUpdateStickerPosition}
              onSaveToGallery={handleSaveToGallery}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onDragEnd={handleDragEnd}
            />

            <FilterPicker currentFilter={filter} onSelectFilter={handleSelectFilter} />
          </div>

          {/* Right Column: Magic AI Caption Panel & Text Customizer */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <MagicCaptionPanel
              currentImageUrl={currentImageUrl}
              onApplyCaption={handleApplyCaption}
              onRemixCaption={handleRemixCaption}
              currentTopText={topTextOverlay?.text || ''}
              currentBottomText={bottomTextOverlay?.text || ''}
            />

            <TextControls
              textOverlays={textOverlays}
              onUpdateOverlay={handleUpdateTextOverlay}
              onAddOverlay={handleAddTextOverlay}
              onRemoveOverlay={handleRemoveTextOverlay}
            />

            <StickerPicker
              stickerOverlays={stickerOverlays}
              onAddSticker={handleAddSticker}
              onRemoveSticker={handleRemoveSticker}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AiBackgroundModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onImageGenerated={(url) => {
          pushState({
            ...currentState,
            selectedTemplateId: null,
            currentImageUrl: url,
          });
        }}
      />

      <SavedMemesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedMemes={savedMemes}
        onDeleteMeme={handleDeleteSavedMeme}
        onLoadMemeToCanvas={(url) => {
          pushState({
            ...currentState,
            selectedTemplateId: null,
            currentImageUrl: url,
          });
        }}
      />

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}
