import { TextOverlay, StickerOverlay, MemeFilter } from '../types';

export interface RenderOptions {
  imageUrl: string;
  textOverlays: TextOverlay[];
  stickerOverlays: StickerOverlay[];
  filter: MemeFilter;
  targetWidth?: number;
}

export async function renderMemeCanvas(
  options: RenderOptions
): Promise<{ dataUrl: string; blob: Blob; width: number; height: number }> {
  const { imageUrl, textOverlays, stickerOverlays, filter } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.naturalWidth || 800;
      const height = img.naturalHeight || 600;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context non-available'));
        return;
      }

      // 1. Apply Filter Effects to Canvas Context
      ctx.save();

      let filterCss = 'none';
      switch (filter) {
        case 'deepfried':
          filterCss = 'saturate(300%) contrast(250%) brightness(110%)';
          break;
        case 'vintage':
          filterCss = 'sepia(40%) contrast(120%) brightness(95%) hue-rotate(-10deg)';
          break;
        case 'contrast':
          filterCss = 'contrast(180%) saturate(140%)';
          break;
        case 'grayscale':
          filterCss = 'grayscale(100%) contrast(110%)';
          break;
        case 'sepia':
          filterCss = 'sepia(100%)';
          break;
        case 'invert':
          filterCss = 'invert(100%)';
          break;
        default:
          filterCss = 'none';
      }

      ctx.filter = filterCss;
      ctx.drawImage(img, 0, 0, width, height);
      ctx.restore(); // Reset filter for text/stickers

      // Deep fried extra noise effect overlay if deepfried
      if (filter === 'deepfried') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 60, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 2. Render Text Overlays
      textOverlays.forEach((item) => {
        if (!item.text.trim()) return;

        ctx.save();

        // Calculate positions
        const posX = (item.x / 100) * width;
        const posY = (item.y / 100) * height;

        // Scale font size proportionally to image resolution (base scale relative to 800px width)
        const scaleFactor = Math.max(0.5, width / 800);
        const actualFontSize = Math.round(item.fontSize * scaleFactor);

        ctx.translate(posX, posY);
        if (item.rotation) {
          ctx.rotate((item.rotation * Math.PI) / 180);
        }

        const displayText = item.isUppercase ? item.text.toUpperCase() : item.text;
        const fontName = item.fontFamily || 'Impact';

        ctx.font = `900 ${actualFontSize}px "${fontName}", Impact, sans-serif`;
        ctx.textAlign = item.align || 'center';
        ctx.textBaseline = 'middle';

        // Auto wrap long text lines
        const maxWidth = width * 0.9;
        const words = displayText.split(' ');
        const lines: string[] = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        const lineHeight = actualFontSize * 1.15;
        const startY = -((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, index) => {
          const lineY = startY + index * lineHeight;

          // Draw background pill if requested
          if (item.backgroundColor) {
            const metrics = ctx.measureText(line);
            const padX = actualFontSize * 0.3;
            const padY = actualFontSize * 0.15;
            let bgX = -metrics.width / 2 - padX;
            if (item.align === 'left') bgX = -padX;
            if (item.align === 'right') bgX = -metrics.width - padX;

            ctx.fillStyle = item.backgroundColor;
            ctx.beginPath();
            ctx.roundRect(bgX, lineY - actualFontSize / 2 - padY, metrics.width + padX * 2, actualFontSize + padY * 2, 8);
            ctx.fill();
          }

          // Draw Stroke Outline (Classic Meme Text!)
          if (item.strokeWidth > 0) {
            ctx.strokeStyle = item.strokeColor || '#000000';
            ctx.lineWidth = Math.max(2, item.strokeWidth * scaleFactor);
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 2;
            ctx.strokeText(line, 0, lineY);
          }

          // Draw Text Fill
          ctx.fillStyle = item.color || '#FFFFFF';
          ctx.fillText(line, 0, lineY);
        });

        ctx.restore();
      });

      // 3. Render Sticker Overlays
      stickerOverlays.forEach((sticker) => {
        ctx.save();
        const posX = (sticker.x / 100) * width;
        const posY = (sticker.y / 100) * height;
        const scaleFactor = Math.max(0.5, width / 800);
        const actualSize = Math.round(sticker.size * scaleFactor);

        ctx.translate(posX, posY);
        if (sticker.rotation) {
          ctx.rotate((sticker.rotation * Math.PI) / 180);
        }

        if (sticker.content === 'sunglasses') {
          // Draw classic Thug Life / Deal With It pixel sunglasses!
          ctx.fillStyle = '#000000';
          const w = actualSize * 1.6;
          const h = actualSize * 0.4;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          // Glare pixels
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-w / 2 + 8, -h / 2 + 4, 12, 12);
          ctx.fillRect(w / 4 + 4, -h / 2 + 4, 12, 12);
        } else {
          // Draw Emoji or Sticker text
          ctx.font = `${actualSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sticker.content, 0, 0);
        }

        ctx.restore();
      });

      // Export
      const dataUrl = canvas.toDataURL('image/png', 0.95);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ dataUrl, blob, width, height });
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/png',
        0.95
      );
    };

    img.onerror = (err) => {
      reject(new Error('Failed to load image for meme rendering'));
    };

    img.src = imageUrl;
  });
}
