import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests with higher limit for image base64 payloads
  app.use(express.json({ limit: '20mb' }));

  // Helper to initialize Gemini client lazy
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // API 1: Magic Caption AI Endpoint
  app.post('/api/magic-caption', async (req, res) => {
    try {
      const { imageBase64, mimeType: userMimeType = 'image/jpeg', tone = 'viral', customInstruction = '' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required' });
      }

      const tonePromptMap: Record<string, string> = {
        viral: 'relatable, punchy, trending internet meme style, universally funny',
        sarcastic: 'dry, cynical, sarcastic, deadpan humor, dark ironies of everyday life',
        tech: 'software developer, coding, bugs, AI, tech workplace, deadline humor',
        corporate: 'office life, endless Zoom meetings, emails, HR, corporate jargon',
        genz: 'Gen Z slang, unhinged, absurd, brainrot memes, chaotic humor',
        wholesome: 'cute, wholesome, uplifting, positive twist, heart-warming irony',
        dark: 'black comedy, dramatic exaggeration, existential realization',
      };

      const selectedToneStyle = tonePromptMap[tone] || tonePromptMap.viral;

      let contentsPayload: any[] = [];

      // Case A: Image is an SVG Data URI (data:image/svg+xml...)
      if (typeof imageBase64 === 'string' && imageBase64.startsWith('data:image/svg+xml')) {
        let svgContent = '';
        try {
          if (imageBase64.includes(';utf8,')) {
            const raw = imageBase64.split(';utf8,')[1];
            svgContent = decodeURIComponent(raw);
          } else if (imageBase64.includes(';base64,')) {
            const raw = imageBase64.split(';base64,')[1];
            svgContent = Buffer.from(raw, 'base64').toString('utf-8');
          } else {
            svgContent = decodeURIComponent(imageBase64.replace(/^data:image\/svg\+xml,/, ''));
          }
        } catch (e) {
          svgContent = imageBase64;
        }

        const promptText = `
Analyze the visual context, characters, text elements, and situation in this SVG meme template:
\`\`\`xml
${svgContent.slice(0, 3000)}
\`\`\`

Generate 5 funny, viral, and highly relevant meme captions for this exact image/scene.
Tone preference: ${selectedToneStyle}.
${customInstruction ? `Additional user request: "${customInstruction}"` : ''}

Output 5 distinct caption options. Each option must have a topText (setup or top line) and bottomText (punchline or bottom line).
Keep the texts snappy, short, and formatted for a classic meme layout.
        `.trim();

        contentsPayload = [{ text: promptText }];
      } 
      // Case B: Image is an HTTP / HTTPS URL
      else if (typeof imageBase64 === 'string' && (imageBase64.startsWith('http://') || imageBase64.startsWith('https://'))) {
        try {
          const imgRes = await fetch(imageBase64);
          if (imgRes.ok) {
            const arrayBuf = await imgRes.arrayBuffer();
            const fetchedBase64 = Buffer.from(arrayBuf).toString('base64');
            const fetchedMime = imgRes.headers.get('content-type') || 'image/jpeg';
            const cleanMime = fetchedMime.includes('png') ? 'image/png' : fetchedMime.includes('webp') ? 'image/webp' : 'image/jpeg';

            const promptText = `
Analyze the visual context, facial expressions, background, characters, or situation in this image.
Generate 5 funny, viral, and highly relevant meme captions for this exact image.
Tone preference: ${selectedToneStyle}.
${customInstruction ? `Additional user request: "${customInstruction}"` : ''}

Output 5 distinct caption options. Each option must have a topText and bottomText.
            `.trim();

            contentsPayload = [
              {
                inlineData: {
                  mimeType: cleanMime,
                  data: fetchedBase64,
                },
              },
              { text: promptText },
            ];
          } else {
            throw new Error(`Failed to fetch image URL: ${imgRes.status}`);
          }
        } catch (fetchErr) {
          console.warn('Could not fetch image URL, falling back to text prompt analysis:', fetchErr);
          const promptText = `
Generate 5 funny, viral meme captions inspired by this image source: ${imageBase64}.
Tone preference: ${selectedToneStyle}.
${customInstruction ? `Additional user request: "${customInstruction}"` : ''}
          `.trim();
          contentsPayload = [{ text: promptText }];
        }
      }
      // Case C: Base64 Data URI (e.g. data:image/png;base64,...) or raw base64 string
      else {
        let cleanBase64 = imageBase64;
        let detectedMime = userMimeType;

        const dataUriMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+-]+);base64,(.+)$/s);
        if (dataUriMatch) {
          detectedMime = dataUriMatch[1];
          cleanBase64 = dataUriMatch[2];
        } else {
          cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        }

        // Standardize mimeType for Gemini
        if (detectedMime.includes('png')) detectedMime = 'image/png';
        else if (detectedMime.includes('webp')) detectedMime = 'image/webp';
        else detectedMime = 'image/jpeg';

        const promptText = `
Analyze the visual context, facial expressions, background, characters, or situation in this image.
Generate 5 funny, viral, and highly relevant meme captions for this exact image.
Tone preference: ${selectedToneStyle}.
${customInstruction ? `Additional user request: "${customInstruction}"` : ''}

Output 5 distinct caption options. Each option must have a topText (setup or top line) and bottomText (punchline or bottom line).
Keep the texts snappy, short, and formatted for a classic meme layout.
        `.trim();

        contentsPayload = [
          {
            inlineData: {
              mimeType: detectedMime,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ];
      }

      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contentsPayload,
        config: {
          systemInstruction:
            'You are an elite viral meme creator, comedian, and social media trendsetter. You analyze images and craft hilarious, sharp, culturally relevant meme captions.',
          temperature: 1.0,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: 'List of 5 funny meme caption suggestions',
            items: {
              type: Type.OBJECT,
              properties: {
                topText: { type: Type.STRING, description: 'Top text line of the meme' },
                bottomText: { type: Type.STRING, description: 'Bottom punchline text of the meme' },
                humorType: { type: Type.STRING, description: 'Short humor tag, e.g. Sarcastic, Relatable, Tech, Plot Twist' },
                explanation: { type: Type.STRING, description: 'One brief sentence why this caption fits the visual context' },
              },
              required: ['topText', 'bottomText', 'humorType', 'explanation'],
            },
          },
        },
      });

      const responseText = response.text || '[]';
      const captions = JSON.parse(responseText);

      return res.json({ success: true, captions });
    } catch (error: any) {
      console.error('Error in /api/magic-caption:', error);

      // Fallback captions if Gemini API fails or key is unconfigured
      const fallbackCaptions = [
        {
          topText: 'WHEN YOU CLICK "MAGIC CAPTION"',
          bottomText: 'AND THE AI DELIVERS INSTANT GOLD',
          humorType: 'Relatable',
          explanation: 'Classic setup celebrating AI speed',
        },
        {
          topText: 'IT WAS AT THIS MOMENT',
          bottomText: 'THEY KNEW THEY CREATED A MASTERPIECE',
          humorType: 'Plot Twist',
          explanation: 'Dramatic narrative meme format',
        },
        {
          topText: 'EXPECTATION: NORMAL IMAGE',
          bottomText: 'REALITY: VIRAL MEME TEMPLATE',
          humorType: 'Sarcastic',
          explanation: 'Expectation vs Reality contrast',
        },
        {
          topText: 'ME LOOKING AT THIS IMAGE',
          bottomText: 'TRYING TO ACT NORMAL',
          humorType: 'Self-Deprecating',
          explanation: 'Awkward social reaction',
        },
        {
          topText: 'NO ONE:',
          bottomText: 'ABSOLUTELY NOBODY AT ALL:',
          humorType: 'Gen Z',
          explanation: 'Classic Nobody meme format',
        },
      ];

      return res.json({
        success: true,
        isFallback: true,
        error: error.message || 'Used fallback captions due to AI service rate limit',
        captions: fallbackCaptions,
      });
    }
  });

  // API 2: Remix / Rewrite Caption with AI
  app.post('/api/remix-caption', async (req, res) => {
    try {
      const { currentTopText = '', currentBottomText = '', instruction = '' } = req.body;

      const ai = getGeminiClient();

      const prompt = `
Rewrite this meme caption based on the user's instructions:
Current Top Text: "${currentTopText}"
Current Bottom Text: "${currentBottomText}"
User Instruction: "${instruction}"

Return a JSON object with revised "topText" and "bottomText".
      `.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topText: { type: Type.STRING },
              bottomText: { type: Type.STRING },
            },
            required: ['topText', 'bottomText'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      return res.json({ success: true, ...result });
    } catch (error: any) {
      console.error('Error in /api/remix-caption:', error);
      const { currentTopText = '', currentBottomText = '', instruction = '' } = req.body || {};
      return res.json({
        success: true,
        isFallback: true,
        topText: currentTopText || 'WHEN YOU TRY TO REMIX',
        bottomText: `${instruction.toUpperCase()} - ${currentBottomText || 'MEME REWRITTEN!'}`,
      });
    }
  });

  // API 3: Generate Custom AI Background Image for Meme
  app.post('/api/generate-ai-template', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();

      const memeImagePrompt = `A high quality, vivid, hilarious meme template photo of: ${prompt}. Clean composition suitable for adding text overlays.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: memeImagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Str = part.inlineData.data;
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${base64Str}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        throw new Error('No image generated by the AI model');
      }

      return res.json({ success: true, imageUrl });
    } catch (error: any) {
      console.error('Error in /api/generate-ai-template:', error);

      // Stock fallback images array
      const stockImages = [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
      ];
      const fallbackUrl = stockImages[Math.floor(Math.random() * stockImages.length)];

      return res.json({
        success: true,
        imageUrl: fallbackUrl,
        isFallback: true,
        note: 'Loaded stock meme template background due to AI quota limit.',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
