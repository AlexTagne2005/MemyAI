import { MemeTemplate } from '../types';

// Clean inline SVG template Data URIs or SVG builders for guaranteed instant zero-dependency loading,
// along with reliable CDN links.

const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

// High visual quality SVG templates representing classic meme formats
const drakeTemplateSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#1e293b"/>
  <!-- Top Panel (Reject) -->
  <rect x="10" y="10" width="380" height="385" rx="16" fill="#ef4444"/>
  <circle cx="200" cy="180" r="70" fill="#fca5a5"/>
  <path d="M 160 180 Q 200 130 240 180" stroke="#7f1d1d" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M 140 230 Q 200 270 260 230" stroke="#7f1d1d" stroke-width="12" fill="none" stroke-linecap="round"/>
  <text x="200" y="320" font-family="Arial Black" font-size="28" fill="#ffffff" text-anchor="middle">NO WAY ✋</text>
  <rect x="400" y="10" width="390" height="385" rx="16" fill="#334155" stroke="#475569" stroke-width="4"/>
  
  <!-- Bottom Panel (Approve) -->
  <rect x="10" y="405" width="380" height="385" rx="16" fill="#10b981"/>
  <circle cx="200" cy="575" r="70" fill="#6ee7b7"/>
  <path d="M 160 575 Q 200 620 240 575" stroke="#065f46" stroke-width="12" fill="none" stroke-linecap="round"/>
  <text x="200" y="715" font-family="Arial Black" font-size="28" fill="#ffffff" text-anchor="middle">YES PLEASE 👉</text>
  <rect x="400" y="405" width="390" height="385" rx="16" fill="#334155" stroke="#475569" stroke-width="4"/>
  <text x="595" y="200" font-family="Arial" font-size="22" fill="#94a3b8" text-anchor="middle">[ Top Text Here ]</text>
  <text x="595" y="595" font-family="Arial" font-size="22" fill="#94a3b8" text-anchor="middle">[ Bottom Text Here ]</text>
</svg>
`);

const twoButtonsSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#0f172a"/>
  <!-- Console Machine -->
  <rect x="50" y="40" width="700" height="300" rx="24" fill="#334155" stroke="#64748b" stroke-width="8"/>
  <!-- Button 1 -->
  <ellipse cx="280" cy="190" rx="130" ry="80" fill="#dc2626" stroke="#991b1b" stroke-width="8"/>
  <ellipse cx="280" cy="180" rx="120" ry="70" fill="#ef4444"/>
  <!-- Button 2 -->
  <ellipse cx="520" cy="190" rx="130" ry="80" fill="#dc2626" stroke="#991b1b" stroke-width="8"/>
  <ellipse cx="520" cy="180" rx="120" ry="70" fill="#ef4444"/>
  <!-- Guy sweating below -->
  <path d="M 250 600 L 400 420 L 550 600 Z" fill="#fde047"/>
  <circle cx="400" cy="430" r="90" fill="#fef08a"/>
  <!-- Sweat droplets -->
  <path d="M 470 380 Q 485 360 480 395 Z" fill="#38bdf8"/>
  <path d="M 330 380 Q 315 360 320 395 Z" fill="#38bdf8"/>
  <!-- Worried eyes -->
  <circle cx="365" cy="420" r="14" fill="#020617"/>
  <circle cx="435" cy="420" r="14" fill="#020617"/>
  <!-- Wavy worried mouth -->
  <path d="M 360 470 Q 400 450 440 470" stroke="#020617" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>
`);

const changeMyMindSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#e2e8f0"/>
  <!-- Park background -->
  <rect x="0" y="0" width="800" height="400" fill="#bfdbfe"/>
  <ellipse cx="150" cy="380" rx="200" ry="80" fill="#22c55e"/>
  <ellipse cx="650" cy="380" rx="250" ry="90" fill="#16a34a"/>
  <!-- Guy at desk -->
  <circle cx="280" cy="220" r="50" fill="#fde047"/>
  <rect x="230" y="270" width="100" height="150" rx="20" fill="#2563eb"/>
  <!-- Mug -->
  <rect x="360" y="320" width="30" height="40" rx="6" fill="#dc2626"/>
  <!-- Table -->
  <rect x="200" y="350" width="500" height="200" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="6"/>
  <!-- Banner Text area -->
  <rect x="230" y="380" width="440" height="140" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
  <text x="450" y="490" font-family="Arial Black" font-size="28" fill="#0f172a" text-anchor="middle">CHANGE MY MIND</text>
</svg>
`);

const dogeSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#fef3c7"/>
  <!-- Shiba Inu Face -->
  <ellipse cx="400" cy="320" rx="260" ry="220" fill="#f59e0b"/>
  <!-- Snout -->
  <ellipse cx="400" cy="380" rx="140" ry="110" fill="#fef3c7"/>
  <!-- Nose -->
  <ellipse cx="400" cy="320" rx="40" ry="25" fill="#1e293b"/>
  <!-- Ears -->
  <polygon points="180,180 240,60 320,160" fill="#d97706"/>
  <polygon points="620,180 560,60 480,160" fill="#d97706"/>
  <!-- Eyes side suspicious look -->
  <circle cx="310" cy="260" r="30" fill="#ffffff"/>
  <circle cx="320" cy="260" r="16" fill="#0f172a"/>
  <circle cx="490" cy="260" r="30" fill="#ffffff"/>
  <circle cx="500" cy="260" r="16" fill="#0f172a"/>
  <!-- Side eyebrows -->
  <path d="M 270 210 Q 320 200 350 220" stroke="#b45309" stroke-width="8" fill="none"/>
  <path d="M 530 210 Q 480 200 450 220" stroke="#b45309" stroke-width="8" fill="none"/>
</svg>
`);

const distractedBoyfriendSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#f1f5f9"/>
  <!-- Background Street -->
  <rect x="0" y="320" width="800" height="180" fill="#94a3b8"/>
  <!-- Left Girl (New Shiny Thing) -->
  <rect x="100" y="120" width="160" height="300" rx="30" fill="#ec4899"/>
  <circle cx="180" cy="90" r="40" fill="#fbcfe8"/>
  <text x="180" y="270" font-family="Arial Black" font-size="20" fill="#ffffff" text-anchor="middle">NEW SHINY</text>

  <!-- Middle Guy (Turning head back) -->
  <rect x="340" y="140" width="160" height="300" rx="30" fill="#3b82f6"/>
  <circle cx="420" cy="100" r="45" fill="#bfdbfe"/>
  <!-- Eyes looking back left -->
  <circle cx="395" cy="100" r="8" fill="#1e293b"/>
  <text x="420" y="270" font-family="Arial Black" font-size="22" fill="#ffffff" text-anchor="middle">ME</text>

  <!-- Right Girl (Annoyed Girlfriend) -->
  <rect x="560" y="140" width="160" height="300" rx="30" fill="#ef4444"/>
  <circle cx="640" cy="100" r="40" fill="#fca5a5"/>
  <!-- Angered eyebrows -->
  <path d="M 610 85 L 635 95" stroke="#7f1d1d" stroke-width="6"/>
  <path d="M 670 85 L 645 95" stroke="#7f1d1d" stroke-width="6"/>
  <text x="640" y="270" font-family="Arial Black" font-size="18" fill="#ffffff" text-anchor="middle">EXISTING</text>
</svg>
`);

const catYellingSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <rect width="800" height="450" fill="#090d16"/>
  <!-- Left Side: Screaming Woman -->
  <rect x="20" y="20" width="370" height="410" rx="16" fill="#1e1b4b"/>
  <circle cx="180" cy="150" r="60" fill="#fbcfe8"/>
  <path d="M 150 180 Q 180 230 220 180" fill="#be185d"/>
  <text x="205" y="320" font-family="Arial Black" font-size="22" fill="#e0e7ff" text-anchor="middle">YELLING LADY</text>

  <!-- Right Side: Confused Cat at Dinner Table -->
  <rect x="410" y="20" width="370" height="410" rx="16" fill="#022c22"/>
  <!-- Table -->
  <rect x="430" y="260" width="330" height="150" fill="#f8fafc"/>
  <!-- Plate -->
  <ellipse cx="595" cy="280" rx="80" ry="25" fill="#cbd5e1"/>
  <ellipse cx="595" cy="280" rx="50" ry="12" fill="#15803d"/> <!-- Salad -->
  <!-- Cat Face -->
  <circle cx="595" cy="180" r="55" fill="#f8fafc"/>
  <!-- Cat Ears -->
  <polygon points="540,150 560,90 585,140" fill="#e2e8f0"/>
  <polygon points="650,150 630,90 605,140" fill="#e2e8f0"/>
  <!-- Confused Cat squint eyes -->
  <ellipse cx="575" cy="175" rx="10" ry="4" fill="#0f172a"/>
  <ellipse cx="615" cy="175" rx="10" ry="4" fill="#0f172a"/>
  <!-- Smirk mouth -->
  <path d="M 585 200 Q 595 190 605 200" stroke="#0f172a" stroke-width="4" fill="none"/>
</svg>
`);

const thinkingMonkeySvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#1c1917"/>
  <!-- Outer aura / realization -->
  <circle cx="400" cy="300" r="240" fill="#b45309" opacity="0.2"/>
  <!-- Monkey head -->
  <circle cx="400" cy="280" r="180" fill="#78350f"/>
  <ellipse cx="400" cy="310" rx="130" ry="110" fill="#fde68a"/>
  <!-- Eyes looking up in deep epiphany -->
  <circle cx="340" cy="250" r="25" fill="#ffffff"/>
  <circle cx="340" cy="235" r="12" fill="#0f172a"/>
  <circle cx="460" cy="250" r="25" fill="#ffffff"/>
  <circle cx="460" cy="235" r="12" fill="#0f172a"/>
  <!-- Snout & Mouth -->
  <ellipse cx="400" cy="330" rx="35" ry="20" fill="#451a03"/>
  <path d="M 370 370 Q 400 390 430 370" stroke="#451a03" stroke-width="8" stroke-linecap="round" fill="none"/>
  <!-- Hand chin reflection -->
  <circle cx="480" cy="420" r="50" fill="#fde68a"/>
</svg>
`);

const successKidSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#38bdf8"/>
  <!-- Beach background gradient effect -->
  <ellipse cx="400" cy="500" rx="500" ry="200" fill="#fef08a"/>
  <!-- Kid head -->
  <circle cx="380" cy="260" r="140" fill="#fde047"/>
  <!-- Cute chubby cheeks -->
  <circle cx="300" cy="300" r="40" fill="#fca5a5" opacity="0.6"/>
  <circle cx="460" cy="300" r="40" fill="#fca5a5" opacity="0.6"/>
  <!-- Determined Eyes -->
  <circle cx="330" cy="240" r="18" fill="#1e293b"/>
  <circle cx="430" cy="240" r="18" fill="#1e293b"/>
  <!-- Intense brow -->
  <path d="M 300 210 L 360 225" stroke="#854d0e" stroke-width="8" stroke-linecap="round"/>
  <path d="M 460 210 L 400 225" stroke="#854d0e" stroke-width="8" stroke-linecap="round"/>
  <!-- Clenched fist -->
  <rect x="480" y="320" width="120" height="150" rx="40" fill="#0284c7" transform="rotate(-15 540 395)"/>
  <circle cx="500" cy="310" r="45" fill="#fde047"/>
</svg>
`);

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake-hotline',
    name: 'Drake Hotline Bling',
    category: 'trending',
    url: drakeTemplateSvg,
    defaultTopText: 'WRITING MEME CAPTIONS MANUALLY',
    defaultBottomText: 'CLICKING "MAGIC CAPTION" FOR INSTANT HILARITY',
  },
  {
    id: 'distracted-bf',
    name: 'Distracted Boyfriend',
    category: 'classic',
    url: distractedBoyfriendSvg,
    defaultTopText: 'AI MAGIC CAPTION',
    defaultBottomText: 'OVERTHINKING A PUNCHLINE FOR 30 MINS',
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons Choice',
    category: 'reactions',
    url: twoButtonsSvg,
    defaultTopText: 'FIX THE BUG NOW',
    defaultBottomText: 'MAKE A MEME ABOUT THE BUG',
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    category: 'classic',
    url: changeMyMindSvg,
    defaultTopText: 'AI GENERATED MEMES ARE 10X FUNNIER',
    defaultBottomText: 'CHANGE MY MIND',
  },
  {
    id: 'doge-classic',
    name: 'Doge epik classic',
    category: 'animals',
    url: dogeSvg,
    defaultTopText: 'MUCH ARTIFICIAL INTELLIGENCE',
    defaultBottomText: 'VERY MEME, WOW',
  },
  {
    id: 'woman-yelling-cat',
    name: 'Woman Yelling at Cat',
    category: 'reactions',
    url: catYellingSvg,
    defaultTopText: 'YOU CAN\'T JUST MAKE MEMES WITH AI!!',
    defaultBottomText: 'ME: WATCH ME CLICK MAGIC CAPTION',
  },
  {
    id: 'thinking-epiphany',
    name: 'Brain Epiphany Monkey',
    category: 'classic',
    url: thinkingMonkeySvg,
    defaultTopText: 'WHEN THE CODE COMPILES',
    defaultBottomText: 'ON THE VERY FIRST TRY',
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    category: 'classic',
    url: successKidSvg,
    defaultTopText: 'FOUND A BUG IN PRODUCTION',
    defaultBottomText: 'FEATURE NOW WORKS BETTER THAN EXPECTED',
  },
  {
    id: 'picsum-cat-1',
    name: 'Surprised Animal Reaction',
    category: 'animals',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
    defaultTopText: 'WHEN YOU SEE THE DEMO',
    defaultBottomText: 'AND IT ACTUALLY WORKS',
  },
  {
    id: 'unsplash-office-1',
    name: 'Corporate Meeting Drama',
    category: 'office',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    defaultTopText: 'THIS MEETING COULD HAVE BEEN',
    defaultBottomText: 'A 2-SECOND AI PROMPT',
  },
  {
    id: 'unsplash-tech-code',
    name: 'Late Night Developer',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    defaultTopText: 'ME AT 3 AM REFACTORTING CODE',
    defaultBottomText: 'THAT WAS WORKING PERFECTLY FINE',
  },
  {
    id: 'unsplash-coffee-work',
    name: 'Monday Morning Coffee',
    category: 'office',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
    defaultTopText: 'FIRST CUP OF COFFEE',
    defaultBottomText: 'PLEASE DO NOT TALK TO ME YET',
  },
];
