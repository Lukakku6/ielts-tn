'use client'
import { useState, useEffect, useRef } from 'react'
const TnFlag = ({ className = '' }: { className?: string }) => (
  <span className={`inline-flex items-center justify-center leading-none text-[1.1em] ${className}`} role="img" aria-label="Tunisia flag">🇹🇳</span>
)
// ─── LANGUAGE TRACK METADATA (flags, accents, exam bodies) ──
const TRACK_META: Record<'en'|'de'|'it', { flag:string, name:string, accent:string, accentSoft:string, exam:string, level:string }> = {
  en: { flag:'🇬🇧', name:'English',  accent:'#FF4500', accentSoft:'rgba(255,69,0,0.12)',  exam:'Cambridge · IELTS-style',    level:'A1 → C2' },
  de: { flag:'🇩🇪', name:'Deutsch',  accent:'#FFCE00', accentSoft:'rgba(255,206,0,0.14)', exam:'Goethe-Zertifikat · TestDaF', level:'B2 focus' },
  it: { flag:'🇮🇹', name:'Italiano', accent:'#009246', accentSoft:'rgba(0,146,70,0.14)',  exam:'CILS · PLIDA',                level:'B2 focus' },
}
// ─── SOCIAL ICON COMPONENTS ──────────────────────────────
const InstagramIcon = ({ className = '', size = 18 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
)
const WhatsAppIcon = ({ className = '', size = 18 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
)
const TikTokIcon = ({ className = '', size = 18 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-2.84 3.37-2.22V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.89a7.34 7.34 0 0 0 4.3 1.38V8.22a4.26 4.26 0 0 1-2.09-2.4z"/>
  </svg>
)
const MessengerIcon = ({ className = '', size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.486 2 2 6.262 2 11.5c0 2.846 1.392 5.392 3.588 7.054L4.5 22l3.526-1.92c.85.35 1.768.556 2.75.62.075.006.15.01.224.01 5.514 0 10-4.262 10-9.5S17.514 2 12 2zm0 17c-.835 0-1.64-.12-2.4-.345l-1.05-.35-2.2 1.2 1.2-2.2-.35-1.05C6.123 15.14 6 14.335 6 13.5 6 9.91 8.686 7 12 7s6 2.91 6 6.5S15.314 19 12 19zm1-6.5l-1.5-1.5-3 3 2.5-1.5 1.5 1.5 3-3-2.5 1.5z"/>
  </svg>
)
// ─── NEW MEMOJI-STYLE AVATAR SYSTEM ─────────────────────
// Each avatar is a complete, hand-crafted SVG in memoji style
// with distinct personality, skin tone, hair, eyes, and accessories
interface AvatarData {
  svg: string
  name: string
  isDali: boolean
  bg: string
}
const ROOM_BG = [
  { dark:'#1E1814', light:'#F5EDE5' }, { dark:'#161E24', light:'#EBF0F5' }, { dark:'#1E1822', light:'#F2EDF5' },
  { dark:'#161E1C', light:'#EBF5F2' }, { dark:'#1E1818', light:'#F5EDED' }, { dark:'#181C24', light:'#EDF0F5' },
  { dark:'#1E1820', light:'#F5EDF2' }, { dark:'#1A1618', light:'#F5F0F2' },
]
// Skin tone palettes for diversity
const SKIN_TONES = [
  { base:'#FFDFC4', mid:'#F5C6A0', shadow:'#E8A87C', dark:'#D4916A' }, // Amira
  { base:'#C68642', mid:'#A66A30', shadow:'#8B5522', dark:'#6B3F18' },  // Sami
  { base:'#FFE0BD', mid:'#F5CBA0', shadow:'#E8B080', dark:'#D49560' }, // Nour
  { base:'#D4A574', mid:'#B8895C', shadow:'#9B7044', dark:'#7E5830' }, // Mehdi
  { base:'#FDDCB5', mid:'#E8C090', shadow:'#D4A570', dark:'#BF8A50' }, // Karim
  { base:'#8D5524', mid:'#6B3F18', shadow:'#522D10', dark:'#3A1C08' }, // Rania
  { base:'#FCEAD8', mid:'#F0D5BA', shadow:'#E0C0A0', dark:'#C8A880' }, // Sara
]
// ─── MEMOJI AVATAR GENERATION FUNCTIONS ──────────────
// Helper to create a memoji-style gradient
function skinGradientDef(base: string, mid: string) {
  return `<radialGradient id="sk" cx="42%" cy="35%" r="65%">
    <stop offset="0%" stop-color="${base}"/>
    <stop offset="45%" stop-color="${mid}"/>
    <stop offset="100%" stop-color="${mid}"/>
  </radialGradient>`
}
function eyeGradientDef(eyeColor: string) {
  return `<radialGradient id="ey" cx="40%" cy="35%" r="65%">
    <stop offset="0%" stop-color="${eyeColor}"/>
    <stop offset="50%" stop-color="${eyeColor}dd"/>
    <stop offset="100%" stop-color="${eyeColor}99"/>
  </radialGradient>`
}
// Generic memoji head base with customizable features
function createMemojiAvatar(
  index: number,
  isLight: boolean,
  options: {
    skinIdx: number
    hairStyle: string
    hairColor: string
    eyeStyle: string
    eyeColor: string
    mouthStyle: string
    accessory: string
    clothColor: string
    faceDetails: string
  }
): string {
  const skin = SKIN_TONES[options.skinIdx]
  const room = ROOM_BG[index] || ROOM_BG[0]
  const bg = isLight ? room.light : room.dark
  const shadowOpacity = isLight ? '0.06' : '0.18'
  const glassOpacity = isLight ? '0.03' : '0.08'
  
  // Eyebrow and lash colors based on skin depth
  const browColor = options.skinIdx >= 3 ? '#1A0E05' : '#3D2815'
  const lashColor = options.skinIdx >= 3 ? '#0A0400' : '#2D1E0F'
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      ${skinGradientDef(skin.base, skin.mid)}
      ${eyeGradientDef(options.eyeColor)}
      <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity="${shadowOpacity}"/></filter>
      <filter id="softShadow"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="${shadowOpacity}"/></filter>
    </defs>
    
    <!-- Background -->
    <rect width="200" height="200" fill="${bg}" rx="18"/>
    
    <!-- Subtle glass reflection -->
    <ellipse cx="70" cy="50" rx="60" ry="30" fill="white" opacity="${glassOpacity}" transform="rotate(-15 70 50)"/>
    
    <!-- Hair (behind head) -->
    ${options.hairStyle}
    
    <!-- Neck / Body hint -->
    <rect x="85" y="148" width="30" height="20" rx="10" fill="${skin.mid}" opacity="0.7"/>
    <ellipse cx="100" cy="175" rx="35" ry="16" fill="${options.clothColor}"/>
    
    <!-- Face shadow on neck -->
    <ellipse cx="100" cy="155" rx="20" ry="5" fill="${skin.shadow}" opacity="0.15"/>
    
    <!-- Head (main memoji shape) -->
    <ellipse cx="100" cy="105" rx="48" ry="52" fill="url(#sk)" filter="url(#shadow)"/>
    
    <!-- Cheek blush -->
    <ellipse cx="65" cy="118" rx="14" ry="8" fill="#FF8C69" opacity="0.15"/>
    <ellipse cx="135" cy="118" rx="14" ry="8" fill="#FF8C69" opacity="0.15"/>
    
    <!-- Ear hints -->
    <ellipse cx="52" cy="110" rx="8" ry="12" fill="url(#sk)"/>
    <ellipse cx="148" cy="110" rx="8" ry="12" fill="url(#sk)"/>
    <ellipse cx="52" cy="110" rx="5" ry="8" fill="${skin.shadow}" opacity="0.3"/>
    <ellipse cx="148" cy="110" rx="5" ry="8" fill="${skin.shadow}" opacity="0.3"/>
    
    <!-- Face contour -->
    <ellipse cx="100" cy="130" rx="38" ry="18" fill="${skin.shadow}" opacity="0.08"/>
    
    <!-- Eyes -->
    ${options.eyeStyle}
    
    <!-- Eyebrows -->
    ${generateEyebrows(browColor)}
    
    <!-- Nose hint -->
    <path d="M96 108 Q100 104 104 108" stroke="${skin.shadow}" stroke-width="1.2" fill="none" opacity="0.4"/>
    <ellipse cx="100" cy="119" rx="6" ry="3.5" fill="${skin.shadow}" opacity="0.15"/>
    
    <!-- Mouth -->
    ${options.mouthStyle}
    
    <!-- Face details (freckles, beauty marks, etc.) -->
    ${options.faceDetails}
    
    <!-- Accessory (glasses, earrings, etc.) -->
    ${options.accessory}
    
    <!-- Hair (in front of head) -->
    ${generateHairFront(options.skinIdx, options.hairColor)}
    
  </svg>`
}
function generateEyebrows(color: string): string {
  // Expressive memoji eyebrows
  return `
    <path d="M62 98 Q74 91 90 94 Q76 94 62 98Z" fill="${color}" opacity="0.7"/>
    <path d="M138 98 Q126 91 110 94 Q124 94 138 98Z" fill="${color}" opacity="0.7"/>
    <path d="M62 98 Q72 92 86 95" stroke="${color}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M138 98 Q128 92 114 95" stroke="${color}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  `
}
function generateHairFront(skinIdx: number, color: string): string {
  // Simple hair swoop
  return `
    <path d="M50 95 Q48 55 100 48 Q152 55 150 95 Q140 60 100 56 Q60 60 50 95Z" fill="${color}" opacity="0.9"/>
    <path d="M55 90 Q53 60 100 53 Q147 60 145 90" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.3"/>
  `
}
// ─── STUDENT MEMOJI CREATION ─────────────────────────
// Student 0 - Amira (warm smile, hijab-like wrap)
function createAmiraSvg(isLight: boolean): string {
  return createMemojiAvatar(0, isLight, {
    skinIdx: 0,
    hairStyle: '',
    hairColor: '#2D1E0F',
    eyeStyle: `
      <ellipse cx="78" cy="110" rx="12" ry="13" fill="white"/>
      <ellipse cx="122" cy="110" rx="12" ry="13" fill="white"/>
      <circle cx="79" cy="111" r="8" fill="url(#ey)"/>
      <circle cx="123" cy="111" r="8" fill="url(#ey)"/>
      <circle cx="80" cy="112" r="4.5" fill="#0A0400"/>
      <circle cx="124" cy="112" r="4.5" fill="#0A0400"/>
      <circle cx="77" cy="108" r="3" fill="white"/>
      <circle cx="121" cy="108" r="3" fill="white"/>
      <circle cx="83" cy="115" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="127" cy="115" r="1.5" fill="white" opacity="0.5"/>
    `,
    eyeColor: '#5C3A1E',
    mouthStyle: `
      <path d="M75 135 Q100 152 125 135" stroke="#D4916A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M75 135 Q100 150 125 135" fill="white" opacity="0.5"/>
      <path d="M85 140 Q95 146 105 140" stroke="#B86840" stroke-width="1" fill="none" opacity="0.3"/>
    `,
    accessory: `
      <!-- Hijab-like head covering -->
      <path d="M40 100 Q35 40 100 30 Q165 40 160 100 Q145 55 100 48 Q55 55 40 100Z" fill="#0D9488" opacity="0.85"/>
      <path d="M40 100 Q100 85 160 100 Q100 95 40 100Z" fill="#0F766E"/>
      <path d="M35 105 Q30 50 100 38 Q170 50 165 105" stroke="#134E4A" stroke-width="2" fill="none" opacity="0.5"/>
      <!-- Small sparkle pin -->
      <circle cx="130" cy="55" r="4" fill="#FCD34D" opacity="0.7"/>
    `,
    clothColor: '#0D9488',
    faceDetails: '',
  })
}
// Student 1 - Sami (confident, cap)
function createSamiSvg(isLight: boolean): string {
  return createMemojiAvatar(1, isLight, {
    skinIdx: 1,
    hairStyle: '',
    hairColor: '#1A0E05',
    eyeStyle: `
      <ellipse cx="78" cy="108" rx="11" ry="12" fill="white"/>
      <ellipse cx="122" cy="108" rx="11" ry="12" fill="white"/>
      <circle cx="79" cy="109" r="7.5" fill="url(#ey)"/>
      <circle cx="123" cy="109" r="7.5" fill="url(#ey)"/>
      <circle cx="80" cy="110" r="4.2" fill="#000"/>
      <circle cx="124" cy="110" r="4.2" fill="#000"/>
      <circle cx="76" cy="106" r="2.8" fill="white"/>
      <circle cx="120" cy="106" r="2.8" fill="white"/>
    `,
    eyeColor: '#2D1508',
    mouthStyle: `
      <path d="M70 137 Q100 158 130 137" stroke="#6B3F18" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M70 137 Q100 156 130 137" fill="white" opacity="0.6"/>
    `,
    accessory: `
      <!-- Baseball cap -->
      <path d="M55 55 Q100 20 145 55 Q100 50 55 55Z" fill="#1D4ED8"/>
      <path d="M50 55 Q100 48 150 55" stroke="#1E3A8A" stroke-width="3" fill="none"/>
      <path d="M55 55 Q53 70 60 78" stroke="#1D4ED8" stroke-width="4" fill="none"/>
      <rect x="58" y="52" width="10" height="4" rx="2" fill="#3B82F6"/>
    `,
    clothColor: '#1D4ED8',
    faceDetails: '',
  })
}
// Student 2 - Nour (bright eyes, headband)
function createNourSvg(isLight: boolean): string {
  return createMemojiAvatar(2, isLight, {
    skinIdx: 2,
    hairStyle: '',
    hairColor: '#3D2010',
    eyeStyle: `
      <ellipse cx="78" cy="112" rx="12" ry="13" fill="white"/>
      <ellipse cx="122" cy="112" rx="12" ry="13" fill="white"/>
      <circle cx="79" cy="113" r="8" fill="url(#ey)"/>
      <circle cx="123" cy="113" r="8" fill="url(#ey)"/>
      <circle cx="80" cy="114" r="4.5" fill="#0A0400"/>
      <circle cx="124" cy="114" r="4.5" fill="#0A0400"/>
      <circle cx="77" cy="110" r="3.2" fill="white"/>
      <circle cx="121" cy="110" r="3.2" fill="white"/>
      <circle cx="83" cy="117" r="1.6" fill="white" opacity="0.5"/>
      <circle cx="127" cy="117" r="1.6" fill="white" opacity="0.5"/>
    `,
    eyeColor: '#8B5E3C',
    mouthStyle: `
      <path d="M72 133 Q100 150 128 133" stroke="#D49560" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M72 133 Q100 148 128 133" fill="white" opacity="0.5"/>
    `,
    accessory: `
      <!-- Floral headband -->
      <path d="M40 70 Q100 50 160 70" stroke="#FB923C" stroke-width="4" fill="none"/>
      <path d="M40 70 Q100 50 160 70" stroke="#F97316" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
      <circle cx="60" cy="65" r="5" fill="#FDBA74"/>
      <circle cx="140" cy="65" r="5" fill="#FDBA74"/>
    `,
    clothColor: '#7C3AED',
    faceDetails: `
      <!-- Light freckles -->
      <circle cx="72" cy="115" r="1" fill="#D4916A" opacity="0.4"/>
      <circle cx="76" cy="118" r="1" fill="#D4916A" opacity="0.35"/>
      <circle cx="124" cy="115" r="1" fill="#D4916A" opacity="0.4"/>
      <circle cx="128" cy="118" r="1" fill="#D4916A" opacity="0.35"/>
    `,
  })
}
// Student 3 - Mehdi (cool, sunglasses)
function createMehdiSvg(isLight: boolean): string {
  return createMemojiAvatar(3, isLight, {
    skinIdx: 3,
    hairStyle: '',
    hairColor: '#1A0E05',
    eyeStyle: `
      <!-- Sunglasses hide eyes -->
      <rect x="58" y="103" width="40" height="18" rx="8" fill="#111827"/>
      <rect x="102" y="103" width="40" height="18" rx="8" fill="#111827"/>
      <rect x="56" y="101" width="88" height="12" rx="5" fill="#1F2937" opacity="0.9"/>
      <line x1="98" y1="107" x2="102" y2="107" stroke="#374151" stroke-width="2.5"/>
      <!-- Lens reflection -->
      <path d="M64 107 Q72 103 80 107" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>
      <path d="M108 107 Q116 103 124 107" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>
    `,
    eyeColor: '#2D1508',
    mouthStyle: `
      <path d="M72 135 Q100 155 128 135" stroke="#7E5830" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M72 135 Q100 153 128 135" fill="white" opacity="0.55"/>
      <path d="M88 142 Q100 148 112 142" stroke="#9B7044" stroke-width="1" fill="none" opacity="0.3"/>
    `,
    accessory: `
      <!-- Hair texture -->
      <path d="M48 80 Q55 55 75 52" stroke="#2D1E0F" stroke-width="3" fill="none" opacity="0.4"/>
      <path d="M125 52 Q145 55 152 80" stroke="#2D1E0F" stroke-width="3" fill="none" opacity="0.4"/>
    `,
    clothColor: '#059669',
    faceDetails: '',
  })
}
// Student 4 - Karim (friendly, round glasses)
function createKarimSvg(isLight: boolean): string {
  return createMemojiAvatar(4, isLight, {
    skinIdx: 4,
    hairStyle: '',
    hairColor: '#3D2010',
    eyeStyle: `
      <!-- Round glasses -->
      <circle cx="78" cy="110" r="14" fill="none" stroke="#78350F" stroke-width="2.5"/>
      <circle cx="122" cy="110" r="14" fill="none" stroke="#78350F" stroke-width="2.5"/>
      <line x1="92" y1="110" x2="108" y2="110" stroke="#78350F" stroke-width="2.5"/>
      <line x1="64" y1="110" x2="56" y2="112" stroke="#78350F" stroke-width="2.5"/>
      <line x1="136" y1="110" x2="144" y2="112" stroke="#78350F" stroke-width="2.5"/>
      <!-- Eyes behind glasses -->
      <ellipse cx="78" cy="110" rx="10" ry="11" fill="white"/>
      <ellipse cx="122" cy="110" rx="10" ry="11" fill="white"/>
      <circle cx="79" cy="111" r="7" fill="url(#ey)"/>
      <circle cx="123" cy="111" r="7" fill="url(#ey)"/>
      <circle cx="80" cy="112" r="4" fill="#0A0400"/>
      <circle cx="124" cy="112" r="4" fill="#0A0400"/>
      <circle cx="76" cy="108" r="2.5" fill="white"/>
      <circle cx="120" cy="108" r="2.5" fill="white"/>
    `,
    eyeColor: '#7B4B2A',
    mouthStyle: `
      <path d="M74 134 Q100 152 126 134" stroke="#BF8A50" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <path d="M74 134 Q100 150 126 134" fill="white" opacity="0.5"/>
    `,
    accessory: '',
    clothColor: '#059669',
    faceDetails: `
      <!-- Warm smile lines -->
      <path d="M62 130 Q60 135 58 132" stroke="#D4A570" stroke-width="0.8" fill="none" opacity="0.4"/>
      <path d="M138 130 Q140 135 142 132" stroke="#D4A570" stroke-width="0.8" fill="none" opacity="0.4"/>
    `,
  })
}
// Student 5 - Rania (glam, earrings)
function createRaniaSvg(isLight: boolean): string {
  return createMemojiAvatar(5, isLight, {
    skinIdx: 5,
    hairStyle: '',
    hairColor: '#0A0400',
    eyeStyle: `
      <ellipse cx="78" cy="110" rx="11" ry="12" fill="white"/>
      <ellipse cx="122" cy="110" rx="11" ry="12" fill="white"/>
      <circle cx="79" cy="111" r="7.5" fill="url(#ey)"/>
      <circle cx="123" cy="111" r="7.5" fill="url(#ey)"/>
      <circle cx="80" cy="112" r="4.2" fill="#000"/>
      <circle cx="124" cy="112" r="4.2" fill="#000"/>
      <circle cx="76" cy="108" r="2.8" fill="white"/>
      <circle cx="120" cy="108" r="2.8" fill="white"/>
      <!-- Eyelashes -->
      <path d="M66 103 Q70 100 74 103" stroke="#000" stroke-width="1.5" fill="none"/>
      <path d="M110 103 Q114 100 118 103" stroke="#000" stroke-width="1.5" fill="none"/>
    `,
    eyeColor: '#3A1C08',
    mouthStyle: `
      <path d="M74 135 Q100 155 126 135" stroke="#522D10" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <path d="M74 135 Q100 153 126 135" fill="white" opacity="0.45"/>
      <path d="M88 143 Q100 150 112 143" fill="#8B3A62" opacity="0.5"/>
    `,
    accessory: `
      <!-- Gold hoop earrings -->
      <circle cx="44" cy="118" r="6" fill="none" stroke="#F0C6A0" stroke-width="2.5"/>
      <circle cx="44" cy="118" r="3.5" fill="none" stroke="#D99C7A" stroke-width="1"/>
      <circle cx="156" cy="118" r="6" fill="none" stroke="#F0C6A0" stroke-width="2.5"/>
      <circle cx="156" cy="118" r="3.5" fill="none" stroke="#D99C7A" stroke-width="1"/>
      <!-- Bindi/forehead dot -->
      <circle cx="100" cy="90" r="2" fill="#DB2777" opacity="0.7"/>
    `,
    clothColor: '#DB2777',
    faceDetails: '',
  })
}
// Student 6 - Sara (gentle, hijab)
function createSaraSvg(isLight: boolean): string {
  return createMemojiAvatar(6, isLight, {
    skinIdx: 6,
    hairStyle: '',
    hairColor: '#3D2815',
    eyeStyle: `
      <ellipse cx="78" cy="112" rx="11" ry="12" fill="white"/>
      <ellipse cx="122" cy="112" rx="11" ry="12" fill="white"/>
      <circle cx="79" cy="113" r="7.5" fill="url(#ey)"/>
      <circle cx="123" cy="113" r="7.5" fill="url(#ey)"/>
      <circle cx="80" cy="114" r="4.2" fill="#0A0400"/>
      <circle cx="124" cy="114" r="4.2" fill="#0A0400"/>
      <circle cx="76" cy="110" r="3" fill="white"/>
      <circle cx="120" cy="110" r="3" fill="white"/>
      <circle cx="83" cy="116" r="1.5" fill="white" opacity="0.45"/>
      <circle cx="127" cy="116" r="1.5" fill="white" opacity="0.45"/>
    `,
    eyeColor: '#6B4226',
    mouthStyle: `
      <path d="M74 134 Q100 152 126 134" stroke="#C8A880" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M74 134 Q100 150 126 134" fill="white" opacity="0.5"/>
    `,
    accessory: `
      <!-- Hijab -->
      <path d="M35 95 Q30 35 100 28 Q170 35 165 95 Q145 50 100 45 Q55 50 35 95Z" fill="#B45309" opacity="0.9"/>
      <path d="M35 95 Q100 80 165 95 Q100 90 35 95Z" fill="#92400E"/>
      <path d="M30 100 Q25 45 100 35 Q175 45 170 100" stroke="#78350F" stroke-width="2" fill="none" opacity="0.6"/>
      <!-- Soft drape detail -->
      <path d="M60 60 Q80 70 100 55" stroke="#D97706" stroke-width="1.5" fill="none" opacity="0.4"/>
    `,
    clothColor: '#B45309',
    faceDetails: `
      <!-- Subtle beauty mark -->
      <circle cx="112" cy="125" r="1.5" fill="#8B5E3C" opacity="0.4"/>
    `,
  })
}
// Dali - the teacher (distinct, professional, pointer stick)
function createDaliSvg(isLight: boolean): string {
  const skin = SKIN_TONES[0] // Warm skin tone
  const room = ROOM_BG[0]
  const bg = isLight ? room.light : room.dark
  const shadowOpacity = isLight ? '0.06' : '0.18'
  
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      ${skinGradientDef('#FFE4C0', '#F5C898')}
      ${eyeGradientDef('#4A3A2A')}
      <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity="${shadowOpacity}"/></filter>
    </defs>
    
    <!-- Background -->
    <rect width="200" height="200" fill="${bg}" rx="18"/>
    
    <!-- Teaching pointer stick -->
    <g transform="rotate(-25 148 108)">
      <line x1="148" y1="108" x2="60" y2="40" stroke="#8B4513" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="148" y1="108" x2="60" y2="40" stroke="#A0522D" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
      <circle cx="60" cy="40" r="4" fill="#FF4500"/>
      <circle cx="60" cy="40" r="1.5" fill="white" opacity="0.6"/>
    </g>
    
    <!-- Whiteboard hint -->
    <rect x="15" y="18" width="90" height="50" rx="6" fill="${isLight ? '#FFFFFF' : '#1C1C1E'}" opacity="0.9"/>
    <rect x="15" y="18" width="90" height="50" rx="6" fill="none" stroke="${isLight ? '#E03D00' : '#FF4500'}" stroke-width="1.5"/>
    <text x="22" y="35" font-size="7.5" fill="${isLight ? '#CC3700' : '#FF7A3D'}" font-family="monospace" font-weight="bold">displace ≠ replace</text>
    <line x1="22" y1="42" x2="80" y2="42" stroke="${isLight ? '#E03D00' : '#FF4500'}" stroke-width="1.5" stroke-linecap="round"/>
    <text x="22" y="52" font-size="6.5" fill="${isLight ? '#D4884A' : '#FF8C69'}" font-family="monospace">→ "AI may displace</text>
    <text x="22" y="60" font-size="6.5" fill="${isLight ? '#D4884A' : '#FF8C69'}" font-family="monospace">   some roles..."</text>
    
    <!-- Neck -->
    <rect x="88" y="148" width="24" height="14" rx="7" fill="${skin.mid}" opacity="0.6"/>
    
    <!-- Body/Shirt -->
    <ellipse cx="100" cy="180" rx="38" ry="16" fill="#FF4500"/>
    
    <!-- Head -->
    <ellipse cx="100" cy="105" rx="46" ry="50" fill="url(#sk)" filter="url(#shadow)"/>
    
    <!-- Hair (professional cut) -->
    <path d="M50 95 Q48 48 100 42 Q152 48 150 95 Q142 56 100 52 Q58 56 50 95Z" fill="#2D1E0F"/>
    <path d="M52 88 Q50 52 100 46 Q150 52 148 88" stroke="#1A0E05" stroke-width="2" fill="none" opacity="0.5"/>
    <!-- Side hair detail -->
    <path d="M50 80 Q48 95 52 100" stroke="#3D2815" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M150 80 Q152 95 148 100" stroke="#3D2815" stroke-width="4" fill="none" stroke-linecap="round"/>
    
    <!-- Ears -->
    <ellipse cx="54" cy="108" rx="7" ry="10" fill="url(#sk)"/>
    <ellipse cx="146" cy="108" rx="7" ry="10" fill="url(#sk)"/>
    
    <!-- Cheek blush -->
    <ellipse cx="68" cy="118" rx="12" ry="7" fill="#FF8C69" opacity="0.13"/>
    <ellipse cx="132" cy="118" rx="12" ry="7" fill="#FF8C69" opacity="0.13"/>
    
    <!-- Eyebrows (confident, slightly raised) -->
    <path d="M62 96 Q74 88 92 92" stroke="#2D1E0F" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M138 96 Q126 88 108 92" stroke="#2D1E0F" stroke-width="3" fill="none" stroke-linecap="round"/>
    
    <!-- Eyes (warm, engaging) -->
    <ellipse cx="80" cy="112" rx="11" ry="12.5" fill="white"/>
    <ellipse cx="120" cy="112" rx="11" ry="12.5" fill="white"/>
    <circle cx="81" cy="113" r="7.8" fill="url(#ey)"/>
    <circle cx="121" cy="113" r="7.8" fill="url(#ey)"/>
    <circle cx="82" cy="114" r="4.5" fill="#0A0400"/>
    <circle cx="122" cy="114" r="4.5" fill="#0A0400"/>
    <circle cx="78" cy="110" r="3.2" fill="white"/>
    <circle cx="118" cy="110" r="3.2" fill="white"/>
    <circle cx="85" cy="117" r="1.6" fill="white" opacity="0.5"/>
    <circle cx="125" cy="117" r="1.6" fill="white" opacity="0.5"/>
    <!-- Eye outline for depth -->
    <circle cx="80" cy="112" r="11.5" fill="none" stroke="#5C4433" stroke-width="1.5" opacity="0.5"/>
    <circle cx="120" cy="112" r="11.5" fill="none" stroke="#5C4433" stroke-width="1.5" opacity="0.5"/>
    <!-- Bridge of nose between eyes -->
    <line x1="96" y1="112" x2="104" y2="112" stroke="#5C4433" stroke-width="1.5" opacity="0.4"/>
    
    <!-- Nose (defined) -->
    <path d="M95 108 Q100 103 105 108" stroke="#D4A060" stroke-width="1.2" fill="none" opacity="0.5"/>
    <ellipse cx="100" cy="120" rx="7" ry="4" fill="#D4A060" opacity="0.12"/>
    
    <!-- Mouth (warm, teaching smile) -->
    <path d="M80 132 Q92 128 100 130 Q108 128 120 132" stroke="#2D1E0F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M80 132 Q92 130 100 131.5 Q108 130 120 132" fill="#3D2815"/>
    <path d="M78 140 Q100 160 122 140" stroke="#C87940" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M80 140.5 Q100 158 120 140.5" fill="white" opacity="0.6"/>
    <!-- Smile highlight -->
    <path d="M88 145 Q100 155 112 145" stroke="#D4A060" stroke-width="1" fill="none" opacity="0.25"/>
    
    <!-- Subtle stubble/beard texture -->
    <circle cx="85" cy="138" r="0.6" fill="#C8A880" opacity="0.3"/>
    <circle cx="88" cy="136" r="0.5" fill="#C8A880" opacity="0.25"/>
    <circle cx="92" cy="139" r="0.6" fill="#C8A880" opacity="0.3"/>
    <circle cx="108" cy="139" r="0.6" fill="#C8A880" opacity="0.3"/>
    <circle cx="112" cy="136" r="0.5" fill="#C8A880" opacity="0.25"/>
    <circle cx="115" cy="138" r="0.6" fill="#C8A880" opacity="0.3"/>
    
  </svg>`
}
// ─── EXPORT ALL AVATARS ──────────────────────────────
function getAllAvatars(isLight: boolean): AvatarData[] {
  return [
    {
      svg: createDaliSvg(isLight),
      name: 'Dali 👨‍🏫',
      isDali: true,
      bg: isLight ? ROOM_BG[0].light : ROOM_BG[0].dark,
    },
    {
      svg: createAmiraSvg(isLight),
      name: 'Amira ✨',
      isDali: false,
      bg: isLight ? ROOM_BG[1].light : ROOM_BG[1].dark,
    },
    {
      svg: createSamiSvg(isLight),
      name: 'Sami 🎧',
      isDali: false,
      bg: isLight ? ROOM_BG[2].light : ROOM_BG[2].dark,
    },
    {
      svg: createNourSvg(isLight),
      name: 'Nour 🌸',
      isDali: false,
      bg: isLight ? ROOM_BG[3].light : ROOM_BG[3].dark,
    },
    {
      svg: createMehdiSvg(isLight),
      name: 'Mehdi 🔥',
      isDali: false,
      bg: isLight ? ROOM_BG[4].light : ROOM_BG[4].dark,
    },
    {
      svg: createKarimSvg(isLight),
      name: 'Karim 😎',
      isDali: false,
      bg: isLight ? ROOM_BG[5].light : ROOM_BG[5].dark,
    },
    {
      svg: createRaniaSvg(isLight),
      name: 'Rania 🎵',
      isDali: false,
      bg: isLight ? ROOM_BG[6].light : ROOM_BG[6].dark,
    },
    {
      svg: createSaraSvg(isLight),
      name: 'Sara 🧕',
      isDali: false,
      bg: isLight ? ROOM_BG[7].light : ROOM_BG[7].dark,
    },
  ]
}
// ─── TRANSLATIONS ────────────────────────
const T = {
  en: {
    tagline: 'built for Tunisian English learners',
    hero1: 'stop studying.',
    hero2: 'start speaking',
    sub: 'Live online classes with Prof. Dali — learn English through real conversations about current events, culture, trends and what the world is talking about.',
    heroLangHint: 'English · Deutsch · Italiano',
    enrollBtn: 'Enroll Now',
    topicsTag: 'what we discuss',
    topicsH: 'real topics. real english.',
    topicsSub: 'every class is built around something happening in the world right now',
    howTag: 'how it works',
    howH: 'join, speak, level up',
    howSub: 'three steps — no textbooks needed',
    steps: [
      { n:'01', icon:'🎯', t:'pick your class', d:'Browse live sessions by topic. Current events, finance, culture — pick what you care about and grab a spot.' },
      { n:'02', icon:'🎙️', t:'join & speak', d:"Join the live session. Dali leads the conversation in English, you participate, ask questions, make mistakes — that's the point." },
      { n:'03', icon:'🚀', t:'track your level', d:'See your vocabulary grow, get personalised feedback after each class, and watch your proficiency climb week by week.' },
    ],
    classesTag: 'our offerings',
    classesH: 'choose your path',
    classesSub: 'flexible ways to learn English — pick what fits your life',
    trustBadge: 'Trusted by 12,000+ students · 4.9★ rating',
    liveTag: 'live session',
    liveH: 'join the conversation',
    liveSub: 'every friday at 8PM Tunisia time — open to all tiers',
    communityTag: 'reach dali',
    communityH: 'message directly',
    communitySub: 'questions about a session? not sure which path? Dali replies personally.',
    monthly: 'monthly',
    yearly: 'yearly (-20%)',
    billedYearly: 'billed yearly',
    notSure: 'not sure which path?',
    waLink: 'ask on whatsapp ↗',
    nextLive: 'next live',
    days: 'd',
    hours: 'h',
    min: 'm',
    sec: 's',
    badgeLabel: 'your path',
    communityBannerTag: 'the community',
    communityBannerH: "Join Tunisia's English-Speaking Community",
    communityBannerSub: 'Practice English every week through live discussions on topics that matter.',
    differenceH: 'What makes us different',
    differenceList: [
      'Real conversations, not textbook exercises',
      'Speak with learners from different backgrounds',
      'Build confidence through weekly practice',
      'Learn the English people actually use',
    ],
    trackEn: 'English', trackDe: 'Deutsch', trackIt: 'Italiano',
    trackEnSub: 'career & speaking', trackDeSub: 'B2 exam prep', trackItSub: 'B2 exam prep',
    packages: [
      {
        id:'offline',
        icon:'📦',
        name:'Self-Study Pack',
        tagline:'Learn on your own terms',
        desc:'No schedule, no pressure. Study through interactive digital books packed with lessons, exercises, and vocabulary — paired with audio tracks to train your listening. Everything downloads to your device, no internet needed after that.',
        priceTnd: '59',
        yearlyTnd: '47',
        features:[
          'Interactive digital books',
          'Listening audio tracks',
          'Exercises & vocabulary per topic',
          'Self-paced — study when you want',
          '12 new lessons added monthly'
        ],
        cta:'get offline pack',
        ctaLabel:'Start Learning',
        tier:'Self-Paced'
      },
      {
        id:'speaking',
        icon:'💬',
        name:'Speaking Groups',
        tagline:'Speak more, stress less',
        desc:'A small, friendly group of Tunisian learners meeting live every week to talk in English — real topics, real conversation, real progress. You\'ll stop overthinking and start actually speaking.',
        priceTnd: '179',
        yearlyTnd: '143',
        features:[
          'Plus 4 small-group sessions/month (max 8 people), in addition to the free Friday live session',
          'Weekly topics: culture, news, daily life',
          'Pronunciation coaching included',
          'Session replays available'
        ],
        cta:'join speaking group',
        ctaLabel:'Join a Group',
        tier:'Group',
        popular:true
      },
      {
        id:'cabin',
        icon:'✈️',
        name:'Cabin Crew',
        tagline:'English built for the sky',
        desc:'Built for Tunisians aiming for an aviation career. You\'ll train in the English that actually gets you hired — interview confidence, HR vocabulary, safety announcements, and passenger communication.',
        priceTnd: '249',
        yearlyTnd: '199',
        features:[
          'Interview English & role-play practice',
          'Aviation vocabulary & safety phrases',
          'Pronunciation drills for announcements',
          'CV coaching & application prep',
          'Mock HR interview sessions'
        ],
        cta:'start cabin crew prep',
        ctaLabel:'Reserve a Spot',
        tier:'Career',
        spotsLeft: 6
      },
      {
        id:'career',
        icon:'💼',
        name:'Career Placement Pack',
        tagline:'We find you the job',
        desc:'Built for Tunisians job-hunting in sales, customer service, and cabin crew roles. We match your CV against real open positions in Tunisia, prep your English for the interview, and push you directly to recruiters we work with.',
        priceTnd: '299',
        yearlyTnd: '239',
        features:[
          'Weekly job alerts (sales, cabin crew, CX)',
          'CV rewritten for Tunisian & Gulf recruiters',
          'Mock interviews in English',
          'Direct intros to partner recruiters',
          'LinkedIn profile audit',
          'Unlimited WhatsApp support until hired'
        ],
        cta:'start job search',
        ctaLabel:'Find Me a Job',
        tier:'Career'
      },
      {
        id:'private',
        icon:'🎓',
        name:'Private Sessions',
        tagline:'One goal, your pace',
        desc:'No group, no waiting, no fixed programme. Every session is built around you — your level, your goals, your schedule. The most personal way to learn English on B2Please.',
        priceTnd: '399',
        yearlyTnd: '319',
        features:[
          '4 private sessions/month with Dali',
          'Custom plan reviewed and adjusted every 4 sessions',
          'Unlimited WhatsApp support',
          'Book up to 2 weeks ahead of standard users',
          'Certificate on completion'
        ],
        cta:'book a session',
        ctaLabel:'Book a Session',
        premium:true,
        tier:'Premium'
      },
    ],
  },
  fr: {
    tagline: "conçu pour les apprenants tunisiens",
    hero1: "arrête de bachoter.",
    hero2: "commence à parler",
    sub: "Des cours en ligne en direct avec Prof. Dali — apprends l'anglais à travers de vraies conversations sur l'actualité, la culture et les tendances du moment.",
    heroLangHint: 'Anglais · Allemand · Italien',
    enrollBtn: "S'inscrire",
    topicsTag: "ce qu'on discute",
    topicsH: "vrais sujets. vrai anglais.",
    topicsSub: "chaque cours est ancré dans l'actualité mondiale du moment",
    howTag: "comment ça marche",
    howH: "rejoins, parle, progresse",
    howSub: "trois étapes — sans manuel scolaire",
    steps: [
      { n:'01', icon:'🎯', t:'choisis ton cours', d:"Parcours les sessions en direct par thème. Actualité, finance, culture — choisis ce qui t'intéresse et prends ta place." },
      { n:'02', icon:'🎙️', t:'rejoins & parle', d:"Intègre la session en direct. Dali anime la conversation en anglais, tu participes, tu poses des questions, tu fais des erreurs — c'est ça l'idée." },
      { n:'03', icon:'🚀', t:'suis ton niveau', d:"Vois ton vocabulaire s'élargir, reçois des retours personnalisés après chaque cours et observe ton niveau grimper semaine après semaine." },
    ],
    classesTag: "nos offres",
    classesH: "choisis ta voie",
    classesSub: "des façons flexibles d'apprendre l'anglais — choisis ce qui te correspond",
    trustBadge: 'Approuvé par 12 000+ étudiants · 4.9★',
    liveTag: "session live",
    liveH: "rejoins la conversation",
    liveSub: "chaque vendredi à 20h heure tunisienne — ouvert à tous les tiers",
    communityTag: "contacter dali",
    communityH: "écrire directement",
    communitySub: "questions sur une session ? pas sûr de ta voie ? Dali répond personnellement.",
    monthly: "mensuel",
    yearly: "annuel (-20%)",
    billedYearly: 'facturé annuellement',
    notSure: "pas sûr de ta voie ?",
    waLink: "demander sur whatsapp ↗",
    nextLive: "prochain live",
    days: "j",
    hours: "h",
    min: "m",
    sec: "s",
    badgeLabel: 'ton parcours',
    communityBannerTag: 'la communauté',
    communityBannerH: "Rejoins la communauté anglophone de Tunisie",
    communityBannerSub: "Pratique l'anglais chaque semaine à travers des discussions en direct sur des sujets qui comptent.",
    differenceH: 'Ce qui nous différencie',
    differenceList: [
      'De vraies conversations, pas des exercices de manuel',
      'Parle avec des apprenants de tous horizons',
      'Gagne en confiance grâce à une pratique hebdomadaire',
      "Apprends l'anglais qu'on parle vraiment",
    ],
    trackEn: 'Anglais', trackDe: 'Allemand', trackIt: 'Italien',
    trackEnSub: 'carrière & conversation', trackDeSub: 'préparation B2', trackItSub: 'préparation B2',
    packages: [
      {
        id:'offline',
        icon:'📦',
        name:'Pack Auto-Formation',
        tagline:'Apprends à ton rythme',
        desc:'Pas d\'horaire, pas de pression. Étudie grâce à des livres numériques interactifs remplis de leçons, d\'exercices et de vocabulaire — accompagnés de pistes audio pour entraîner ta compréhension orale. Tout se télécharge sur ton appareil, plus besoin d\'internet après.',
        priceTnd: '59',
        yearlyTnd: '47',
        features:[
          'Livres numériques interactifs',
          'Pistes audio d\'écoute',
          'Exercices & vocabulaire par thème',
          'Rythme libre — étudie quand tu veux',
          '12 nouvelles leçons chaque mois'
        ],
        cta:'obtenir le pack',
        ctaLabel:'Commencer à apprendre',
        tier:'Auto-apprentissage'
      },
      {
        id:'speaking',
        icon:'💬',
        name:'Groupes de Conversation',
        tagline:'Parle plus, stresse moins',
        desc:'Un petit groupe sympa d\'apprenants tunisiens qui se retrouvent chaque semaine pour parler anglais — vrais sujets, vraies conversations, vrais progrès. Tu vas arrêter de bloquer et commencer à vraiment parler.',
        priceTnd: '179',
        yearlyTnd: '143',
        features:[
          'En plus, 4 sessions en petit groupe/mois (max 8 personnes), en plus de la session live gratuite du vendredi',
          'Thèmes hebdo : culture, actu, vie quotidienne',
          'Coaching prononciation inclus',
          'Replay des sessions disponible'
        ],
        cta:'rejoindre un groupe',
        ctaLabel:'Rejoindre un groupe',
        tier:'Groupe',
        popular:true
      },
      {
        id:'cabin',
        icon:'✈️',
        name:'Personnel Navigant',
        tagline:'L\'anglais pour le ciel',
        desc:'Conçu pour les Tunisiens qui visent une carrière dans l\'aviation. Tu t\'entraîneras sur l\'anglais qui fait vraiment la différence — confiance en entretien, vocabulaire RH, annonces de sécurité et communication passagers.',
        priceTnd: '249',
        yearlyTnd: '199',
        features:[
          'Anglais d\'entretien & jeux de rôle',
          'Vocabulaire aviation & phrases de sécurité',
          'Exercices de prononciation pour les annonces',
          'Coaching CV & préparation candidature',
          'Simulations d\'entretiens RH'
        ],
        cta:'préparer ma carrière',
        ctaLabel:'Réserver ma place',
        tier:'Carrière',
        spotsLeft: 6
      },
      {
        id:'career',
        icon:'💼',
        name:'Pack Placement Carrière',
        tagline:'On te trouve le poste',
        desc:'Conçu pour les Tunisiens en recherche d\'emploi dans la vente, le service client et le personnel navigant. On confronte ton CV à de vraies offres en Tunisie, on prépare ton anglais pour l\'entretien, et on te met en contact direct avec nos recruteurs partenaires.',
        priceTnd: '299',
        yearlyTnd: '239',
        features:[
          'Alertes emploi hebdomadaires (vente, PNC, service client)',
          'CV réécrit pour recruteurs tunisiens & du Golfe',
          'Entretiens simulés en anglais',
          'Mise en relation directe avec des recruteurs partenaires',
          'Audit de profil LinkedIn',
          'Support WhatsApp illimité jusqu\'à l\'embauche'
        ],
        cta:'lancer ma recherche',
        ctaLabel:'Trouver mon emploi',
        tier:'Carrière'
      },
      {
        id:'private',
        icon:'🎓',
        name:'Sessions Privées',
        tagline:'Un objectif, ton rythme',
        desc:'Pas de groupe, pas d\'attente, pas de programme imposé. Chaque session est construite autour de toi — ton niveau, tes objectifs, ton emploi du temps.',
        priceTnd: '399',
        yearlyTnd: '319',
        features:[
          '4 sessions privées/mois avec Dali',
          'Plan personnalisé revu et ajusté toutes les 4 sessions',
          'Support WhatsApp illimité',
          'Réservation possible jusqu\'à 2 semaines à l\'avance',
          'Certificat à la fin du parcours'
        ],
        cta:'réserver une session',
        ctaLabel:'Réserver une session',
        premium:true,
        tier:'Premium'
      },
    ],
  },
  ar: {
    tagline: 'مصمّم للمتعلّمين التونسيين',
    hero1: 'توقّف عن الحفظ.',
    hero2: 'ابدأ تتكلّم',
    sub: 'دروس مباشرة أونلاين مع الأستاذ دالي — تعلّم الإنجليزية من خلال نقاشات حقيقية حول الأحداث الراهنة والثقافة والتريندات.',
    heroLangHint: 'الإنجليزية · الألمانية · الإيطالية',
    enrollBtn: 'سجل الآن',
    topicsTag: 'شنو نحكيو فيه',
    topicsH: 'مواضيع حقيقية. إنجليزية حقيقية.',
    topicsSub: 'كل درس مبني على شيء يصير في العالم هذا الوقت',
    howTag: 'كيفاش يخدم',
    howH: 'انضم، تكلّم، ارتقي',
    howSub: 'ثلاث خطوات — بلا كتب ولا حفظ',
    steps: [
      { n:'٠١', icon:'🎯', t:'اختار درسك', d:'شوف الجلسات المباشرة حسب الموضوع. أحداث راهنة، فلوس، ثقافة — اختار اللي يهمّك واحجز مقعدك.' },
      { n:'٠٢', icon:'🎙️', t:'انضم وتكلّم', d:'ادخل الجلسة المباشرة. الأستاذ دالي يقود النقاش بالإنجليزية، أنت تشارك وتسأل وتغلط — هذا هو المطلوب.' },
      { n:'٠٣', icon:'🚀', t:'تابع مستواك', d:'شوف كيف تتوسّع مفرداتك، خذ ملاحظات شخصية بعد كل جلسة، وراقب مستواك يصعد أسبوع بأسبوع.' },
    ],
    classesTag: 'عروضنا',
    classesH: 'اختر طريقك',
    classesSub: 'طرق مرنة لتعلّم الإنجليزية — اختر ما يناسب حياتك',
    trustBadge: 'موثوق من قبل أكثر من 12,000 طالب · تقييم 4.9★',
    liveTag: 'جلسة مباشرة',
    liveH: 'انضم للنقاش',
    liveSub: 'كل جمعة الساعة 8 مساءً بتوقيت تونس — مفتوح للجميع',
    communityTag: 'تواصل مع دالي',
    communityH: 'راسل مباشرة',
    communitySub: 'عندك سؤال على جلسة؟ ما عرفتش تختار الطريق؟ الأستاذ دالي يردّ شخصيًا.',
    monthly: 'شهري',
    yearly: 'سنوي (-20%)',
    billedYearly: 'فوترة سنوية',
    notSure: 'ما عرفتش تختار الطريق؟',
    waLink: 'اسأل على واتساب ↗',
    nextLive: 'البث القادم',
    days: 'أيام',
    hours: 'ساعات',
    min: 'دق',
    sec: 'ثا',
    badgeLabel: 'مسارك',
    communityBannerTag: 'المجتمع',
    communityBannerH: 'انضم لمجتمع الإنجليزية التونسي',
    communityBannerSub: 'تدرّب على الإنجليزية كل أسبوع من خلال نقاشات مباشرة حول مواضيع تهمّك.',
    differenceH: 'شنو يخلّينا مختلفين',
    differenceList: [
      'نقاشات حقيقية، مش تمارين كتاب',
      'تحكي مع متعلّمين من خلفيات مختلفة',
      'ابني ثقتك بالنفس من خلال التدريب الأسبوعي',
      'تعلّم الإنجليزية اللي الناس تستخدمها فعلاً',
    ],
    trackEn: 'الإنجليزية', trackDe: 'الألمانية', trackIt: 'الإيطالية',
    trackEnSub: 'مهني ومحادثة', trackDeSub: 'تحضير B2', trackItSub: 'تحضير B2',
    packages: [
      {
        id:'offline',
        icon:'📦',
        name:'حزمة التعلّم الذاتي',
        tagline:'تعلّم على وتيرتك',
        desc:'لا جداول، لا ضغط. ادرس من خلال كتب رقمية تفاعلية مليئة بالدروس والتمارين والمفردات — مرفقة بتسجيلات صوتية لتدريب الاستماع. كل شيء يتحمّل على جهازك، لا حاجة للإنترنت بعد ذلك.',
        priceTnd: '59',
        yearlyTnd: '47',
        features:[
          'كتب رقمية تفاعلية',
          'تسجيلات صوتية للاستماع',
          'تمارين ومفردات حسب كل موضوع',
          'وتيرة حرة — ادرس متى تريد',
          '12 درساً جديداً كل شهر'
        ],
        cta:'احصل على الحزمة',
        ctaLabel:'ابدأ التعلم',
        tier:'تعلّم ذاتي'
      },
      {
        id:'speaking',
        icon:'💬',
        name:'مجموعات المحادثة',
        tagline:'تكلّم أكثر، توتر أقل',
        desc:'مجموعة صغيرة ودودة من المتعلّمين التونسيين تلتقي كل أسبوع للتحدث بالإنجليزية — مواضيع حقيقية، محادثات حقيقية، تقدّم حقيقي. ستتوقف عن التردد وتبدأ فعلاً بالكلام.',
        priceTnd: '179',
        yearlyTnd: '143',
        features:[
          '4 جلسات جماعية إضافية شهريًا (8 أشخاص كحد أقصى)، بالإضافة إلى جلسة الجمعة المباشرة المجانية',
          'مواضيع أسبوعية: ثقافة، أخبار، حياة يومية',
          'تدريب على النطق مشمول',
          'تسجيلات الجلسات متاحة'
        ],
        cta:'انضم لمجموعة محادثة',
        ctaLabel:'انضم لمجموعة',
        tier:'جماعي',
        popular:true
      },
      {
        id:'cabin',
        icon:'✈️',
        name:'طاقم الطيران',
        tagline:'الإنجليزية للسماء',
        desc:'مصمَّم للتونسيين الراغبين في مسار مهني في الطيران. ستتدرّب على الإنجليزية التي تجعلك فعلاً مقبولاً — ثقة في المقابلات، مفردات الموارد البشرية، إعلانات السلامة، والتواصل مع المسافرين.',
        priceTnd: '249',
        yearlyTnd: '199',
        features:[
          'إنجليزية المقابلات وتمارين لعب الأدوار',
          'مفردات الطيران وعبارات السلامة',
          'تدريبات نطق للإعلانات',
          'تدريب على السيرة الذاتية والتقديم',
          'جلسات محاكاة لمقابلات الموارد البشرية'
        ],
        cta:'ابدأ التحضير',
        ctaLabel:'احجز مقعدك',
        tier:'مهني',
        spotsLeft: 6
      },
      {
        id:'career',
        icon:'💼',
        name:'حزمة التوظيف المهني',
        tagline:'نحن نجد لك الوظيفة',
        desc:'مصمَّمة للتونسيين الباحثين عن عمل في المبيعات وخدمة العملاء وطاقم الطيران. نطابق سيرتك الذاتية مع وظائف حقيقية شاغرة في تونس، نجهّز إنجليزيتك للمقابلة، ونوصلك مباشرة بشركائنا من المُوظِّفين.',
        priceTnd: '299',
        yearlyTnd: '239',
        features:[
          'تنبيهات وظائف أسبوعية (مبيعات، طاقم طيران، خدمة عملاء)',
          'سيرة ذاتية مُعاد صياغتها لموظّفين تونسيين وخليجيين',
          'مقابلات تجريبية بالإنجليزية',
          'تواصل مباشر مع شركاء التوظيف',
          'تدقيق ملف LinkedIn',
          'دعم واتساب غير محدود حتى التوظيف'
        ],
        cta:'ابدأ البحث عن عمل',
        ctaLabel:'اعثر لي على وظيفة',
        tier:'مهني'
      },
      {
        id:'private',
        icon:'🎓',
        name:'جلسات خاصة',
        tagline:'هدف واحد، وتيرتك',
        desc:'لا مجموعات، لا انتظار، لا برنامج موحّد. كل جلسة مبنية حولك أنت — مستواك، أهدافك، وقتك. الطريقة الأكثر خصوصية لتعلّم الإنجليزية على B2Please.',
        priceTnd: '399',
        yearlyTnd: '319',
        features:[
          '4 جلسات خاصة / شهر مع دالي',
          'خطة مخصصة تُراجع وتُعدَّل كل 4 جلسات',
          'دعم مفتوح عبر واتساب',
          'حجز مسبق حتى أسبوعين قبل المستخدمين العاديين',
          'شهادة عند إتمام البرنامج'
        ],
        cta:'تواصل للحجز',
        ctaLabel:'احجز جلسة',
        premium:true,
        tier:'مميز'
      },
    ],
  },
}
// ─── EXAM PREP PACKAGES (Deutsch / Italiano B2) ──────
type ExamPack = { id:string, icon:string, name:string, tagline:string, desc:string, priceTnd:string, yearlyTnd:string, features:string[], cta:string, ctaLabel:string, tier:string, popular?:boolean }
const EXAM_PACKS: Record<'de'|'it', Record<'en'|'fr'|'ar', ExamPack[]>> = {
  de: {
    en: [
      { id:'de-self', icon:'📘', name:'Deutsch B2 Self-Study', tagline:'Goethe / telc format', desc:'Digital course mapped to the Goethe-Zertifikat B2 and telc B2 exam structure — reading, listening, writing and speaking modules with graded mock exams.', priceTnd:'89', yearlyTnd:'71', features:['4 skills modules','Timed mock exams','Grammar drill bank','Exam-day checklist'], cta:'start deutsch b2', ctaLabel:'Start Learning', tier:'Self-Paced' },
      { id:'de-live', icon:'🗣️', name:'Deutsch B2 Live Prep', tagline:'Small group, exam-focused', desc:'Weekly live sessions in a small group, built entirely around passing your Goethe/telc B2 exam — speaking practice with real exam prompts and written correction.', priceTnd:'219', yearlyTnd:'175', features:['4 live sessions/month','Speaking module simulation','Written correction (Schreiben)','Exam booking guidance'], cta:'join deutsch group', ctaLabel:'Join a Group', tier:'Group', popular:true },
    ],
    fr: [
      { id:'de-self', icon:'📘', name:'Allemand B2 Auto-Formation', tagline:'Format Goethe / telc', desc:'Cours numérique calqué sur la structure des examens Goethe-Zertifikat B2 et telc B2 — modules de lecture, écoute, écriture et expression orale avec examens blancs notés.', priceTnd:'89', yearlyTnd:'71', features:['4 modules de compétences','Examens blancs chronométrés','Banque d\'exercices de grammaire','Checklist jour d\'examen'], cta:'commencer allemand b2', ctaLabel:'Commencer', tier:'Auto-apprentissage' },
      { id:'de-live', icon:'🗣️', name:'Allemand B2 Live', tagline:'Petit groupe, axé examen', desc:'Sessions live hebdomadaires en petit groupe, entièrement construites autour de la réussite de ton examen Goethe/telc B2 — pratique orale et correction écrite.', priceTnd:'219', yearlyTnd:'175', features:['4 sessions live/mois','Simulation de l\'épreuve orale','Correction écrite (Schreiben)','Accompagnement inscription examen'], cta:'rejoindre groupe allemand', ctaLabel:'Rejoindre un groupe', tier:'Groupe', popular:true },
    ],
    ar: [
      { id:'de-self', icon:'📘', name:'ألمانية B2 تعلّم ذاتي', tagline:'صيغة Goethe / telc', desc:'دورة رقمية مبنية على هيكل امتحان Goethe-Zertifikat B2 و telc B2 — وحدات قراءة واستماع وكتابة ومحادثة مع امتحانات تجريبية مقيّمة.', priceTnd:'89', yearlyTnd:'71', features:['4 وحدات مهارات','امتحانات تجريبية موقوتة','بنك تمارين قواعد','قائمة تحضير ليوم الامتحان'], cta:'ابدأ الألمانية B2', ctaLabel:'ابدأ التعلم', tier:'تعلّم ذاتي' },
      { id:'de-live', icon:'🗣️', name:'ألمانية B2 مباشر', tagline:'مجموعة صغيرة، مركّز على الامتحان', desc:'جلسات مباشرة أسبوعية في مجموعة صغيرة، مبنية بالكامل حول اجتياز امتحان Goethe/telc B2 — تدريب على المحادثة وتصحيح الكتابة.', priceTnd:'219', yearlyTnd:'175', features:['4 جلسات مباشرة/شهر','محاكاة وحدة المحادثة','تصحيح الكتابة (Schreiben)','إرشاد للتسجيل بالامتحان'], cta:'انضم لمجموعة الألمانية', ctaLabel:'انضم لمجموعة', tier:'جماعي', popular:true },
    ],
  },
  it: {
    en: [
      { id:'it-self', icon:'📗', name:'Italiano B2 Self-Study', tagline:'CILS / CELI format', desc:'Digital course mapped to CILS and CELI B2 exam structure — reading, listening, writing and speaking modules with timed mock exams.', priceTnd:'89', yearlyTnd:'71', features:['4 skills modules','Timed mock exams','Grammar drill bank','Exam-day checklist'], cta:'start italiano b2', ctaLabel:'Start Learning', tier:'Self-Paced' },
      { id:'it-live', icon:'🗣️', name:'Italiano B2 Live Prep', tagline:'Small group, exam-focused', desc:'Weekly live sessions in a small group focused on CILS/CELI B2 — speaking practice, written correction, real exam simulations.', priceTnd:'219', yearlyTnd:'175', features:['4 live sessions/month','Speaking module simulation','Written correction (Produzione scritta)','Exam booking guidance'], cta:'join italiano group', ctaLabel:'Join a Group', tier:'Group', popular:true },
    ],
    fr: [
      { id:'it-self', icon:'📗', name:'Italien B2 Auto-Formation', tagline:'Format CILS / CELI', desc:'Cours numérique calqué sur la structure des examens CILS et CELI B2 — modules de lecture, écoute, écriture et expression orale avec examens blancs chronométrés.', priceTnd:'89', yearlyTnd:'71', features:['4 modules de compétences','Examens blancs chronométrés','Banque d\'exercices de grammaire','Checklist jour d\'examen'], cta:'commencer italien b2', ctaLabel:'Commencer', tier:'Auto-apprentissage' },
      { id:'it-live', icon:'🗣️', name:'Italien B2 Live', tagline:'Petit groupe, axé examen', desc:'Sessions live hebdomadaires en petit groupe axées sur CILS/CELI B2 — pratique orale, correction écrite, simulations d\'examen réelles.', priceTnd:'219', yearlyTnd:'175', features:['4 sessions live/mois','Simulation de l\'épreuve orale','Correction écrite (Produzione scritta)','Accompagnement inscription examen'], cta:'rejoindre groupe italien', ctaLabel:'Rejoindre un groupe', tier:'Groupe', popular:true },
    ],
    ar: [
      { id:'it-self', icon:'📗', name:'إيطالية B2 تعلّم ذاتي', tagline:'صيغة CILS / CELI', desc:'دورة رقمية مبنية على هيكل امتحان CILS و CELI B2 — وحدات قراءة واستماع وكتابة ومحادثة مع امتحانات تجريبية موقوتة.', priceTnd:'89', yearlyTnd:'71', features:['4 وحدات مهارات','امتحانات تجريبية موقوتة','بنك تمارين قواعد','قائمة تحضير ليوم الامتحان'], cta:'ابدأ الإيطالية B2', ctaLabel:'ابدأ التعلم', tier:'تعلّم ذاتي' },
      { id:'it-live', icon:'🗣️', name:'إيطالية B2 مباشر', tagline:'مجموعة صغيرة، مركّز على الامتحان', desc:'جلسات مباشرة أسبوعية في مجموعة صغيرة مركّزة على CILS/CELI B2 — تدريب على المحادثة وتصحيح الكتابة ومحاكاة امتحانات حقيقية.', priceTnd:'219', yearlyTnd:'175', features:['4 جلسات مباشرة/شهر','محاكاة وحدة المحادثة','تصحيح الكتابة (Produzione scritta)','إرشاد للتسجيل بالامتحان'], cta:'انضم لمجموعة الإيطالية', ctaLabel:'انضم لمجموعة', tier:'جماعي', popular:true },
    ],
  },
}
// ─── TOPICS & CLASS DATA ─────────────────────────────
const TOPICS = [
  { icon:'🌍', en:'World Events', fr:'Actualités Mondiales', ar:'أحداث العالم' },
  { icon:'📰', en:'Breaking News', fr:'Actualités', ar:'أخبار عاجلة' },
  { icon:'💼', en:'Workplace & Careers', fr:'Carrières & Travail', ar:'العمل والمسارات المهنية' },
  { icon:'💰', en:'Finance & Markets', fr:'Finance & Marchés', ar:'المال والأسواق' },
  { icon:'🤖', en:'Tech & AI', fr:'Tech & IA', ar:'التكنولوجيا والذكاء الاصطناعي' },
  { icon:'✈️', en:'Travel & Aviation', fr:'Voyage & Aviation', ar:'السفر والطيران' },
  { icon:'🏆', en:'Sports', fr:'Sport', ar:'الرياضة' },
  { icon:'🎓', en:'Education & Learning', fr:'Éducation & Apprentissage', ar:'التعليم والتعلّم' },
]
const CLASS_TOPICS = [
  { topic:'AI & The Future of Work', icon:'🤖', participants:8, level:'B2–C1' },
  { topic:'The US Elections 2024',   icon:'🗳️', participants:12, level:'B1–B2' },
  { topic:'Climate Change Debate',   icon:'🌱', participants:6,  level:'B2–C1' },
  { topic:'Social Media & Society',  icon:'📱', participants:10, level:'B1–B2' },
]
const FLOATING_WORDS = [
  { text: 'current events', icon: '🌍', rotStart: '-3deg', rotEnd: '5deg', dur: '12s', delay: '0s', wobble: '15px' },
  { text: 'trending', icon: '🔥', rotStart: '4deg', rotEnd: '-6deg', dur: '11s', delay: '1.2s', wobble: '-12px' },
  { text: 'discussions', icon: '💬', rotStart: '-5deg', rotEnd: '7deg', dur: '13s', delay: '2.5s', wobble: '18px' },
  { text: 'live practice', icon: '🎙️', rotStart: '6deg', rotEnd: '-4deg', dur: '10.5s', delay: '0.8s', wobble: '-15px' },
  { text: 'breaking news', icon: '📰', rotStart: '-7deg', rotEnd: '3deg', dur: '12.5s', delay: '3.2s', wobble: '20px' },
  { text: 'pop culture', icon: '🎬', rotStart: '5deg', rotEnd: '-8deg', dur: '11.5s', delay: '1.8s', wobble: '-18px' },
  { text: 'tech & AI', icon: '🤖', rotStart: '-4deg', rotEnd: '6deg', dur: '13.5s', delay: '4s', wobble: '16px' },
  { text: 'finance', icon: '💰', rotStart: '3deg', rotEnd: '-5deg', dur: '10s', delay: '0.5s', wobble: '-14px' },
  { text: 'sports', icon: '🏆', rotStart: '-6deg', rotEnd: '4deg', dur: '12s', delay: '2.2s', wobble: '17px' },
  { text: 'music', icon: '🎵', rotStart: '7deg', rotEnd: '-3deg', dur: '14s', delay: '3.8s', wobble: '-19px' },
]
const ANIM_CLASSES = ['anim-bob','anim-think','anim-nod','anim-lean','anim-bob','anim-nod','anim-think']
// ─── COMPONENTS ──────────────────────────────────────
function CefrBadges({ isLight, label }: { isLight: boolean, label: string }) {
  const levels = [
  { level: 'A1', tier: 'muted' as const }, { level: 'A2', tier: 'muted' as const }, { level: 'B1', tier: 'muted' as const },
  { level: 'B2', tier: 'target' as const }, { level: 'C1', tier: 'gold' as const }, { level: 'C2', tier: 'diamond' as const },
]
  const mutedBg = isLight ? '#F0EBE5' : 'rgba(26,26,26,0.8)'
  const mutedBorder = isLight ? '#DDD0C0' : '#2A2A2C'
  const mutedText = isLight ? 'rgba(26,26,26,0.3)' : 'rgba(255,240,232,0.25)'
  const targetBg = isLight ? '#FFF0E8' : '#2A1A0A'
  const targetColor = isLight ? '#E03D00' : '#FF4500'
  const goldBgDark = 'linear-gradient(135deg, #4A3500 0%, #6B5000 50%, #4A3500 100%)'
  const goldBgLight = 'linear-gradient(135deg, #FFF8E0 0%, #FFE8A0 50%, #FFF0C0 100%)'
  const goldBorder = '#D4A017'
  const goldTextDark = '#FFD700'
  const goldTextLight = '#8B6914'
  const goldShadow = '0 0 18px rgba(212,160,23,0.55), 0 0 35px rgba(212,160,23,0.2)'
  const diamondBgDark = 'linear-gradient(135deg, #222840 0%, #354060 30%, #222840 60%, #2D3550 100%)'
  const diamondBgLight = 'linear-gradient(135deg, #F0F2F8 0%, #DDE0EC 30%, #E8EAF2 60%, #E0E2EC 100%)'
  const diamondBorder = '#A0B0D0'
  const diamondTextDark = '#E0E8F8'
  const diamondTextLight = '#4A5580'
  const diamondShadow = '0 0 20px rgba(160,180,220,0.6), 0 0 40px rgba(180,200,240,0.3)'
  const labelColor = isLight ? 'rgba(26,26,26,0.35)' : 'rgba(255,240,232,0.25)'
  function getBadgeStyle(tier: 'muted' | 'target' | 'gold' | 'diamond') {
    switch (tier) {
      case 'target': return { background: targetBg, borderColor: targetColor, color: targetColor, borderWidth: '2px', boxShadow: `0 0 14px ${targetColor}35, 0 0 28px ${targetColor}12`, animation: 'b2pulse 2.5s ease-in-out infinite' }
      case 'gold': return { background: isLight ? goldBgLight : goldBgDark, borderColor: goldBorder, color: isLight ? goldTextLight : goldTextDark, borderWidth: '2px', boxShadow: goldShadow, animation: 'goldShimmer 3s ease-in-out infinite' }
      case 'diamond': return { background: isLight ? diamondBgLight : diamondBgDark, borderColor: diamondBorder, color: isLight ? diamondTextLight : diamondTextDark, borderWidth: '2px', boxShadow: diamondShadow, animation: 'diamondSparkle 4s ease-in-out infinite' }
      default: return { background: mutedBg, borderColor: mutedBorder, color: mutedText, borderWidth: '1px', boxShadow: 'none' }
    }
  }
  return (
    <div className="inline-flex items-center gap-1 flex-wrap">
      {levels.map((l, i) => {
        const style = getBadgeStyle(l.tier)
        return (
          <span key={l.level} className="inline-flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[11px] font-black border transition-all relative overflow-hidden"
              style={{ background:style.background, borderColor:style.borderColor, color:style.color, borderWidth:style.borderWidth, boxShadow:style.boxShadow, letterSpacing:'-0.02em', animation:(style as any).animation }}>
              {l.tier === 'diamond' && (
                <>
                  <span className="absolute inset-0 pointer-events-none" style={{ background:'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 55%, transparent 70%)', animation:'diamondShine 2s ease-in-out infinite' }} />
                  <span className="absolute top-0.5 right-1 text-[7px] opacity-70" style={{ color: isLight ? '#8898C0' : '#C8D8F0' }}>◆</span>
                </>
              )}
              {l.level}
            </span>
            {i < levels.length - 1 && <span className="w-2.5 h-px" style={{ backgroundColor: l.tier === 'diamond' || l.tier === 'gold' ? goldBorder : mutedBorder }} />}
          </span>
        )
      })}
      <span className="text-[11px] font-semibold ml-1.5" style={{ color: labelColor }}>{label}</span>
    </div>
  )
}
function B2Logo({className='',isLight=false}:{className?:string,isLight?:boolean}){
  return(
    <span className={`inline-flex items-center gap-0.5 tracking-tight whitespace-nowrap leading-none select-none ${className}`} dir="ltr">
      <span className="font-black animate-b2pulse" style={{letterSpacing:'-0.05em',color:isLight?'#E03D00':'#FF4500',textShadow:isLight?'0 0 12px rgba(224,61,0,0.25), 0 0 24px rgba(224,61,0,0.1)':'0 0 20px rgba(255,69,0,0.5), 0 0 40px rgba(255,69,0,0.2)'}}>B2</span>
      <span className="font-light" style={{letterSpacing:'0',marginLeft:'-3px',color:isLight?'#1A1A1A':'rgba(255,255,255,0.9)'}}>please</span>
      <TnFlag/>
    </span>
  )
}
function useCountdown(target:Date){const[t,st]=useState({d:0,h:0,m:0,s:0});useEffect(()=>{const tk=()=>{const df=target.getTime()-Date.now();if(df<=0)return;st({d:Math.floor(df/86400000),h:Math.floor((df%86400000)/3600000),m:Math.floor((df%3600000)/60000),s:Math.floor((df%60000)/1000)})};tk();const id=setInterval(tk,1000);return()=>clearInterval(id)},[target]);return t}
type Theme='dark'|'light'
function detectSystemTheme():Theme{if(typeof window==='undefined')return'dark';return window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
function themeStyles(theme:Theme){const d=theme==='dark';return{mainBg:d?'#0A0A0A':'#F5F1ED',cardBg:d?'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)':'linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 100%)',cardBgFlat:d?'#1A1A1A':'#FFFFFF',inputBg:d?'#0A0A0A':'#FFF8F3',navBg:d?'rgba(10,10,10,0.85)':'rgba(245,241,237,0.85)',borderColor:d?'#2A2A2C':'#E8E0D8',borderHover:d?'rgba(255,69,0,0.35)':'rgba(224,61,0,0.25)',textPrimary:d?'#FFFFFF':'#1A1A1A',textSecondary:d?'rgba(255,240,232,0.55)':'rgba(26,26,26,0.55)',textTertiary:d?'rgba(255,240,232,0.35)':'rgba(26,26,26,0.35)',textOrange:d?'#FF4500':'#E03D00',textOrangeLight:d?'#FF7A3D':'#CC3700',orangeGlow:d?'rgba(255,69,0,0.25)':'rgba(224,61,0,0.15)',cardShadow:d?'0 8px 30px rgba(0,0,0,0.3)':'0 8px 30px rgba(0,0,0,0.06)',cardShadowHover:d?'0 12px 40px rgba(0,0,0,0.4)':'0 12px 40px rgba(0,0,0,0.08)',toggleBg:d?'#1C1C1E':'#EDE8E3',pillBg:d?'rgba(255,69,0,0.1)':'rgba(224,61,0,0.08)',pillText:d?'#FF4500':'#E03D00',pillBgInactive:d?'#1A1A1A':'#F0EDE8',pillTextInactive:d?'rgba(255,240,232,0.35)':'rgba(26,26,26,0.3)',pillBorderInactive:d?'#2A2A2C':'#E0D8D0',countdownBg:d?'#0A0A0A':'#FFF8F3',countdownBorder:d?'#2A2A2C':'#E8E0D8',chatBg:d?'#0A0A0A':'#FFF8F3',chatBorder:d?'#2A2A2C':'#E8E0D8',btnSecondaryBg:d?'#1A1A1A':'#FFFFFF',btnSecondaryBorder:d?'#2A2A2C':'#E8E0D8',btnSecondaryText:d?'#FFF0E8':'#1A1A1A',blobOpacity:d?'0.06':'0.03',fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif"}}
export default function Home(){
  const[lang,setLang]=useState<'en'|'fr'|'ar'>('en')
  const[theme,setTheme]=useState<Theme>('dark')
  const[showModal,setShowModal]=useState(false)
  const[selectedPlan,setSelectedPlan]=useState<string>('')
  const[activePrice,setActivePrice]=useState<'m'|'y'>('m')
  const[track,setTrack]=useState<'en'|'de'|'it'>('en')
  const t=T[lang];const isAr=lang==='ar';const s=themeStyles(theme);const isLight=theme==='light'
  const displayedPackages = track==='en' ? t.packages : EXAM_PACKS[track][lang]
  useEffect(()=>{setTheme(detectSystemTheme());const mq=window.matchMedia('(prefers-color-scheme: light)');const handler=(e:MediaQueryListEvent)=>setTheme(e.matches?'light':'dark');mq.addEventListener('change',handler);return()=>mq.removeEventListener('change',handler)},[])
  const[charIndex,setCharIndex]=useState(0);const[wordIndex,setWordIndex]=useState(0);const[deleting,setDeleting]=useState(false);const[displayed,setDisplayed]=useState('')
  const words=['native speaker','confidently','fluently','fearlessly']
  useEffect(()=>{const word=words[wordIndex];const timeout=setTimeout(()=>{if(!deleting){if(charIndex<word.length){setDisplayed(word.slice(0,charIndex+1));setCharIndex(c=>c+1)}else setTimeout(()=>setDeleting(true),2000)}else{if(charIndex>0){setDisplayed(word.slice(0,charIndex-1));setCharIndex(c=>c-1)}else{setDeleting(false);setWordIndex(i=>(i+1)%words.length)}}},deleting?40:80);return()=>clearTimeout(timeout)},[charIndex,deleting,wordIndex])
  const[activeTopicIndex,setActiveTopicIndex]=useState(0);const[topicProgress,setTopicProgress]=useState(0)
  useEffect(()=>{const interval=setInterval(()=>{setTopicProgress(p=>{if(p>=100){setActiveTopicIndex(i=>(i+1)%CLASS_TOPICS.length);return 0}return p+1.5})},80);return()=>clearInterval(interval)},[])
  const[visibleP,setVisibleP]=useState<number[]>([])
  const [activeSpeakers, setActiveSpeakers] = useState<Map<number, 'mic' | 'hand'>>(new Map([[0, 'mic']]))
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    const updateMics = () => {setActiveSpeakers(prev=>{const next=new Map(prev);next.set(0,'mic');const students=[1,2,3,4,5,6,7];const micCount=2+Math.floor(Math.random()*2);const shuffled=students.sort(()=>Math.random()-0.5);students.forEach(s=>{if(next.get(s)==='mic')next.delete(s)});shuffled.slice(0,micCount).forEach(s=>next.set(s,'mic'));return next});timers[0]=setTimeout(updateMics,2500+Math.random()*1500)}
    const updateHands = () => {setActiveSpeakers(prev=>{const next=new Map(prev);const students=[1,2,3,4,5,6,7];students.forEach(s=>{if(next.get(s)==='hand')next.delete(s)});const withoutMics=students.filter(s=>next.get(s)!=='mic');const handCount=1+Math.floor(Math.random()*2);withoutMics.sort(()=>Math.random()-0.5).slice(0,handCount).forEach(s=>next.set(s,'hand'));return next});timers[1]=setTimeout(updateHands,4000+Math.random()*2000)}
    timers[0]=setTimeout(updateMics,1000);timers[1]=setTimeout(updateHands,2000)
    return ()=>timers.forEach(t=>clearTimeout(t))
  },[])
  const[chatMsgs,setChatMsgs]=useState<{id:number,text:string,from:string,isDali:boolean}[]>([])
  const chatSnippets=[{text:'Will AI replace all jobs eventually?',from:'Mehdi',isDali:false},{text:'Say "displace" not "replace" — much stronger! 💡',from:'Dali',isDali:true},{text:'AI might displace some roles...',from:'Nour',isDali:false},{text:'Perfect — that\'s Band 7+ vocabulary 🔥',from:'Dali',isDali:true},{text:'This session is incredible 🙌',from:'Sami',isDali:false}]
  useEffect(()=>{for(let i=0;i<8;i++)setTimeout(()=>setVisibleP(p=>[...p,i]),i*280);chatSnippets.forEach((msg,i)=>setTimeout(()=>setChatMsgs(p=>[...p.slice(-3),{id:i,...msg}]),2000+i*2800))},[])
  const[menuOpen,setMenuOpen]=useState(false)
  const revealRefs=useRef<(HTMLDivElement|null)[]>([])
  const nextLive=useRef((()=>{const d=new Date();const days=(5-d.getDay()+7)%7||7;d.setDate(d.getDate()+days);d.setHours(20,0,0,0);return d})()).current
  const countdown=useCountdown(nextLive)
  useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:0.1});revealRefs.current.forEach(el=>el&&observer.observe(el));return()=>observer.disconnect()},[])
  const addRef=(i:number)=>(el:HTMLDivElement|null)=>{revealRefs.current[i]=el}
  const activeTopic=CLASS_TOPICS[activeTopicIndex]
  // ─── USE NEW MEMOJI AVATARS ────────────────────────
  const allAvatars = getAllAvatars(isLight)
  const openModal = (planName: string) => {
    setSelectedPlan(planName)
    setShowModal(true)
    document.body.style.overflow = 'hidden'
  }
  const closeModal = () => {
    setShowModal(false)
    document.body.style.overflow = 'unset'
  }
  const trackWaClick = (source: string) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', { source })
    }
  }
  const handleContact = (platform: string) => {
    const urls: Record<string, string> = {
      whatsapp: 'https://wa.me/21656633546?text=Hi!%20I%27m%20interested%20in%20the%20' + encodeURIComponent(selectedPlan) + '%20plan',
      instagram: 'https://www.instagram.com/b2.please/',
      messenger: 'https://www.facebook.com/B2Please'
    }
    if (urls[platform]) {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { content_name: selectedPlan, platform })
      }
      window.open(urls[platform], '_blank')
    }
    closeModal()
  }
  // Glass button style helper
  const glassBtnStyle = (popular?: boolean, premium?: boolean) => {
    if (popular) {
      return {
        background: `linear-gradient(135deg, ${s.textOrange}, ${s.textOrangeLight})`,
        color: '#FFFFFF',
        boxShadow: `0 4px 14px ${s.orangeGlow}`,
        border: 'none',
        backdropFilter: 'blur(4px)',
      }
    }
    if (premium) {
      return {
        background: isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(30, 30, 32, 0.6)',
        color: s.textOrangeLight,
        border: `1px solid ${s.textOrangeLight}25`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }
    }
    return {
      background: isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(20, 20, 22, 0.5)',
      color: s.textPrimary,
      border: `1px solid ${s.btnSecondaryBorder}`,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }
  }
  return(
    <main className="min-h-screen transition-colors duration-500" style={{backgroundColor:s.mainBg,fontFamily:s.fontFamily}} dir={isAr?'rtl':'ltr'}>
      <style>{`
        @keyframes b2pulse{0%,100%{opacity:1}50%{opacity:.82}}.animate-b2pulse{animation:b2pulse 2.5s ease-in-out infinite}
        @keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}.cursor-thin{animation:cursorBlink 1s step-end infinite}
        .reveal{opacity:0;transform:translateY(30px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}.reveal.visible{opacity:1;transform:translateY(0)}
        .blob{position:absolute;border-radius:50%;filter:blur(90px)}.b1{animation:b1 12s ease-in-out infinite}.b2{animation:b2 15s ease-in-out infinite}.b3{animation:b3 10s ease-in-out infinite}
        @keyframes b1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,25px) scale(1.12)}66%{transform:translate(-15px,35px) scale(.94)}}
        @keyframes b2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-30px,-25px) scale(1.06)}66%{transform:translate(20px,-15px) scale(1.12)}}
        @keyframes b3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,-20px) scale(1.18)}}
        
        /* Rain animation - words fall from top to bottom of section */
        @keyframes rainDown {
          0% {
            top: -40px;
            opacity: 0;
            transform: translateX(0px) rotate(var(--rot-start, 0deg));
          }
          5% {
            opacity: 0.8;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 0.9;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            top: calc(100% + 20px);
            opacity: 0;
            transform: translateX(var(--wobble-final, 0px)) rotate(var(--rot-end, 0deg));
          }
        }
        /* Wobble effect while falling */
        @keyframes rainWobble {
          0%, 100% {
            transform: translateX(0px) rotate(var(--rot-start, 0deg));
          }
          25% {
            transform: translateX(var(--wobble-1, 15px)) rotate(calc(var(--rot-start) + 2deg));
          }
          50% {
            transform: translateX(var(--wobble-2, -10px)) rotate(calc(var(--rot-end) - 2deg));
          }
          75% {
            transform: translateX(var(--wobble-3, 12px)) rotate(calc(var(--rot-end) + 1deg));
          }
        }
        .rain-word {
          animation: 
            rainDown var(--dur, 12s) linear infinite,
            rainWobble var(--dur, 12s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
          will-change: transform, opacity, top;
        }
        @keyframes goldShimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(1.2)}}
        @keyframes diamondSparkle{0%,100%{filter:brightness(1);box-shadow:0 0 20px rgba(160,180,220,0.6),0 0 40px rgba(180,200,240,0.3)}30%{filter:brightness(1.15);box-shadow:0 0 28px rgba(180,200,240,0.75),0 0 50px rgba(200,220,255,0.4)}60%{filter:brightness(0.95)}}
        @keyframes diamondShine{0%,100%{opacity:0;transform:translateX(-100%) rotate(-30deg)}50%{opacity:.7}}
        .dali-wrap{animation:daliFloat 4s ease-in-out infinite}@keyframes daliFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .speaking-ring{animation:sp 1.2s ease-in-out infinite}@keyframes sp{0%,100%{box-shadow:0 0 0 0 rgba(255,69,0,.6)}50%{box-shadow:0 0 0 8px rgba(255,69,0,0)}}
        .anim-bob{animation:avBob 4s ease-in-out infinite}@keyframes avBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .anim-think{animation:avThink 4.5s ease-in-out infinite}@keyframes avThink{0%,100%{transform:rotate(0deg) translateY(0)}30%{transform:rotate(-7deg) translateY(-4px)}70%{transform:rotate(5deg) translateY(-2px)}}
        .anim-nod{animation:avNod 3.2s ease-in-out infinite}@keyframes avNod{0%,100%{transform:translateY(0) scaleY(1)}40%{transform:translateY(-7px) scaleY(1.03)}80%{transform:translateY(-3px) scaleY(.98)}}
        .anim-lean{animation:avLean 5.5s ease-in-out infinite}@keyframes avLean{0%,100%{transform:rotate(0deg)}35%{transform:rotate(6deg)}70%{transform:rotate(-4deg)}}
        .anim-participate{animation:avParticipate 1.2s ease-in-out infinite}@keyframes avParticipate{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.06) translateY(-5px)}}
        .av-cell{opacity:0;transform:scale(0);transition:opacity .4s ease,transform .5s cubic-bezier(.34,1.56,.64,1)}.av-cell.show{opacity:1;transform:scale(1)}
        .chat-in{animation:cin .4s ease forwards}@keyframes cin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .progress-fill{transition:width .15s linear}
        .topic-card{transition:all .3s cubic-bezier(.16,1,.3,1)}.topic-card:hover{transform:translateY(-4px)}
        .pkg-card{transition:all .35s cubic-bezier(.16,1,.3,1)}.pkg-card:hover{transform:translateY(-4px)}
        @keyframes actPop{0%{opacity:0;transform:translateY(6px) scale(.8)}10%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-2px) scale(1)}}
        .act-indicator{animation:actPop 4s ease-out forwards}
        @keyframes handRaise{0%{transform:translateY(0)}30%{transform:translateY(-8px)}60%{transform:translateY(-4px)}100%{transform:translateY(0)}}
        .hand-raised{animation:handRaise 1.5s ease-in-out infinite}
        .hand-indicator{animation:actPop 5s ease-out forwards}
        /* Glassmorphism card styles */
        .glass-card {
          background: ${isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(20, 20, 22, 0.7)'};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid ${s.borderColor};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(.16,1,.3,1);
        }
        .glass-card:hover {
          background: ${isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 30, 32, 0.85)'};
          border-color: ${s.borderHover};
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        .glass-card-light {
          background: ${isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 15, 17, 0.5)'};
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid ${s.borderColor};
        }
        /* Glass button styles */
        .glass-btn {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.25s cubic-bezier(.16,1,.3,1);
        }
        .glass-btn:hover {
          transform: scale(1.02);
        }
        .glass-btn:active {
          transform: scale(0.97);
        }
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        .modal-content {
          max-width: 420px;
          width: 90%;
          padding: 32px 24px;
          border-radius: 24px;
          animation: slideUp 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .option-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          border: 1px solid ${s.borderColor};
          background: ${isLight ? 'rgba(255,255,255,0.5)' : 'rgba(20,20,22,0.5)'};
          backdrop-filter: blur(4px);
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          font-size: 15px;
          font-weight: 600;
          color: ${s.textPrimary};
        }
        .option-btn:hover {
          border-color: ${s.textOrange};
          background: ${isLight ? 'rgba(255,255,255,0.8)' : 'rgba(30,30,32,0.8)'};
          transform: scale(1.02);
        }
        .option-btn .icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .option-btn .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 20px;
          background: ${s.textOrange};
          color: white;
          margin-left: auto;
        }
        .close-btn {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: ${s.textTertiary};
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: ${s.textPrimary};
        }
        .track-tab {
          transition: all 0.25s cubic-bezier(.16,1,.3,1);
        }
      `}</style>
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b transition-colors duration-500" style={{backgroundColor:s.navBg,borderColor:s.borderColor}}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <B2Logo className="text-lg md:text-xl" isLight={isLight}/>
            <span className="hidden sm:inline-flex items-center gap-0.5 ml-1 pl-2 border-l" style={{borderColor:s.borderColor}} aria-label="Languages taught: English, German, Italian">
              {(['en','de','it'] as const).map(id=>(<span key={id} className="text-[13px] leading-none px-0.5">{TRACK_META[id].flag}</span>))}
            </span>
          </div>
          <div className="hidden md:flex gap-1 items-center">
            {['languages','offers','how','live','topics','community'].map(item=>(
              <a key={item} href={`#${item}`} className="px-3.5 py-2 text-[13px] rounded-xl transition-all font-medium capitalize" style={{color:s.textSecondary}} onMouseEnter={e=>{e.currentTarget.style.color=s.textOrange;e.currentTarget.style.backgroundColor=s.pillBg}} onMouseLeave={e=>{e.currentTarget.style.color=s.textSecondary;e.currentTarget.style.backgroundColor='transparent'}}>{item}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            <div className="flex gap-0.5 p-0.5 rounded-lg" style={{backgroundColor:s.toggleBg}}>
              {(['en','fr','ar'] as const).map(l=>(
                <button key={l} onClick={()=>setLang(l)} className="px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-all" style={lang===l?{backgroundColor:s.textOrange,color:'#FFFFFF'}:{color:s.textTertiary}}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} className="glass-btn px-2.5 py-1.5 rounded-xl text-sm transition-all border" style={{backgroundColor:s.toggleBg,borderColor:s.borderColor,color:s.textSecondary}}>{isLight?'🌙':'☀️'}</button>
            
            <a href="https://www.instagram.com/b2.please/" target="_blank" className="glass-btn flex items-center justify-center w-9 h-9 rounded-xl transition-colors border hover:border-orange-500" style={{borderColor:s.borderColor,color:s.textSecondary}}>
              <InstagramIcon size={18} />
            </a>
            <a href="https://wa.me/21656633546" target="_blank" onClick={()=>trackWaClick('header_icon')} className="glass-btn flex items-center justify-center w-9 h-9 rounded-xl transition-colors border hover:border-green-500" style={{borderColor:s.borderColor,color:s.textSecondary}}>
              <WhatsAppIcon size={18} />
            </a>
            <a href="https://www.tiktok.com/@b2please" target="_blank" className="glass-btn flex items-center justify-center w-9 h-9 rounded-xl transition-colors border hover:border-white" style={{borderColor:s.borderColor,color:s.textSecondary}}>
              <TikTokIcon size={18} />
            </a>
            
            <div className="w-px h-6" style={{backgroundColor:s.borderColor}}></div>
            <a href="https://www.tiktok.com/@b2please" target="_blank" className="glass-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap border" style={{backgroundColor:s.pillBg,borderColor:'transparent',color:s.pillText}}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{backgroundColor:s.textOrange}}/>
              {t.nextLive}: {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
            </a>
          </div>
          <button className="md:hidden border px-3 py-1.5 rounded-xl text-sm font-medium glass-btn" style={{borderColor:s.borderColor,color:s.textOrange,backgroundColor:'transparent'}} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'✕':'☰'}</button>
        </div>
        {menuOpen&&(
          <div className="md:hidden px-6 py-5 flex flex-col gap-3 items-center text-center" style={{backgroundColor:s.mainBg,borderColor:s.borderColor}}>
            <div className="flex gap-1 mb-1 justify-center w-full">
              {(['en','fr','ar'] as const).map(l=>(
                <button key={l} onClick={()=>{setLang(l);setMenuOpen(false)}} className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all" style={lang===l?{backgroundColor:s.textOrange,color:'#FFFFFF'}:{backgroundColor:s.pillBgInactive,color:s.pillTextInactive}}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={()=>{setTheme(t=>t==='dark'?'light':'dark');setMenuOpen(false)}} className="glass-btn px-4 py-3 rounded-xl text-sm font-medium transition-all border w-full text-center" style={{color:s.textSecondary,borderColor:s.borderColor,backgroundColor:s.cardBgFlat}}>{isLight?'🌙 Dark':'☀️ Light'}</button>
            
            <a href="https://wa.me/21656633546" target="_blank" className="glass-btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border w-full" style={{color:s.textSecondary,borderColor:s.borderColor,backgroundColor:s.cardBgFlat}} onClick={()=>{trackWaClick('mobile_menu');setMenuOpen(false)}}>
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
            <a href="https://www.instagram.com/b2.please/" target="_blank" className="glass-btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border w-full" style={{color:s.textSecondary,borderColor:s.borderColor,backgroundColor:s.cardBgFlat}} onClick={()=>setMenuOpen(false)}>
              <InstagramIcon size={18} /> Instagram
            </a>
            <a href="https://www.tiktok.com/@b2please" target="_blank" className="glass-btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border w-full" style={{color:s.textSecondary,borderColor:s.borderColor,backgroundColor:s.cardBgFlat}} onClick={()=>setMenuOpen(false)}>
              <TikTokIcon size={18} /> TikTok
            </a>
            
            <div className="w-full border-t" style={{borderColor:s.borderColor}}></div>
            {['languages','offers','how','live','topics','community'].map(item=>(
              <a key={item} href={`#${item}`} onClick={()=>setMenuOpen(false)} className="glass-btn px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all w-full text-center" style={{color:s.textSecondary,backgroundColor:s.cardBgFlat}}>{item}</a>
            ))}
          </div>
        )}
      </nav>
      {/* ─── HERO SECTION ──────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at 25% 50%,${s.textOrange}06 0%,transparent 55%),radial-gradient(ellipse at 75% 30%,${s.textOrangeLight}04 0%,transparent 50%)`}}/>
        <div className="blob b1 w-[500px] h-[500px] absolute -top-32 -left-32" style={{background:s.textOrange,opacity:s.blobOpacity}}/><div className="blob b2 w-[400px] h-[400px] absolute -bottom-20 -right-20" style={{background:s.textOrangeLight,opacity:s.blobOpacity}}/><div className="blob b3 w-[300px] h-[300px] absolute top-1/2 left-1/3" style={{background:s.textOrangeLight,opacity:s.blobOpacity}}/>
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center w-full relative z-10">
          <div>
            <div className="glass-card-light rounded-full inline-flex items-center gap-2 text-xs px-3 py-1.5 mb-3 font-semibold" style={{color:s.textOrange}}><TnFlag className="text-base"/><span>{t.tagline}</span></div>
            <div className="mb-5"><CefrBadges isLight={isLight} label={t.badgeLabel}/></div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-1" style={{letterSpacing:'-0.035em',color:s.textPrimary}}>{t.hero1}<br/>{t.hero2}<br/><span style={{color:s.textOrange}}>{displayed}</span><span className="cursor-thin font-light" style={{color:s.textOrange}}>│</span></h1>
            <div className="text-base md:text-lg font-bold tracking-tight mb-6" style={{color:s.textSecondary}}>{t.heroLangHint}</div>
            {/* Flagpoles — planted, overlapping, bigger. The signature visual: pick a language by picking a flag. */}
            <div className="flex items-end mb-7 -space-x-4" role="group" aria-label="Choose a language">
              {(['en','de','it'] as const).map((id,i)=>{
                const m=TRACK_META[id]
                const isActive=track===id
                return (
                  <button key={id} onClick={()=>setTrack(id)}
                    className="relative flex flex-col items-center bg-transparent border-none cursor-pointer transition-transform duration-300"
                    style={{ zIndex: isActive?30:20-i, transform:`translateY(${isActive?'-6px':'0px'}) rotate(${i===0?'-4deg':i===1?'0deg':'4deg'})` }}
                    aria-pressed={isActive} title={m.name}>
                    {/* flag */}
                    <span className="leading-none select-none transition-all duration-300"
                      style={{ fontSize: isActive?'64px':'52px', filter: isActive?`drop-shadow(0 6px 14px ${m.accentSoft})`:'grayscale(0.15) opacity(0.75)' }}>
                      {m.flag}
                    </span>
                    {/* pole */}
                    <span className="w-[3px] rounded-full -mt-1" style={{height: isActive?'46px':'36px', background:`linear-gradient(to bottom, ${isActive?m.accent:s.borderColor}, transparent)`}} />
                    {/* base */}
                    <span className="w-8 h-1.5 rounded-full -mt-0.5" style={{background: isActive?m.accent:s.borderColor, opacity: isActive?0.9:0.5, boxShadow: isActive?`0 0 12px ${m.accentSoft}`:'none'}} />
                  </button>
                )
              })}
            </div>
            <p className="text-[15px] mb-8 leading-relaxed max-w-md" style={{color:s.textSecondary}}>{t.sub}</p>
            <div className="flex flex-wrap gap-3 mb-5">
              <a href="#offers" className="glass-btn inline-flex items-center gap-2 text-white px-6 py-3.5 rounded-2xl active:scale-[0.97] transition-all text-[15px] font-semibold whitespace-nowrap" style={{background: `linear-gradient(135deg, ${s.textOrange}, ${s.textOrangeLight})`,boxShadow:`0 4px 18px ${s.orangeGlow}`}}>{t.enrollBtn} →</a>
            </div>
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              {[{n:'500K+',l:'TikTok'},{n:'12K+',l:'students'},{n:'4.9★',l:'rating'},{n:'live',l:'sessions'}].map(stat=>(
                <div key={stat.l} className="glass-card-light rounded-2xl px-4 py-2.5 text-center" style={{borderColor:s.borderColor}}>
                  <div className="text-sm font-bold" style={{color:s.textPrimary}}>{stat.n}</div>
                  <div className="text-[11px]" style={{color:s.textTertiary}}>{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="glass-card rounded-2xl p-5" style={{boxShadow:s.cardShadow}}>
              <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold flex items-center gap-2" style={{color:s.textPrimary}}><span className="text-lg">{activeTopic.icon}</span><span>{activeTopic.topic}</span></span><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor:s.textOrange}}/><span className="text-[11px] font-bold" style={{color:s.textOrange}}>LIVE</span></div></div>
              <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{backgroundColor:s.chatBg}}><div className="progress-fill h-full rounded-full" style={{width:`${topicProgress}%`,background:`linear-gradient(to right,${s.textOrange},${s.textOrangeLight})`}}/></div>
              <div className="flex justify-between items-center"><div className="flex gap-1">{CLASS_TOPICS.map((_,i)=>(<div key={i} className="h-1 rounded-full transition-all duration-500" style={{width:i===activeTopicIndex?'28px':'8px',backgroundColor:i===activeTopicIndex?s.textOrange:s.borderColor}}/>))}</div><span className="text-[11px]" style={{color:s.textTertiary}}>{activeTopic.level} · {activeTopic.participants} students</span></div>
            </div>
            <div className="glass-card rounded-2xl p-5" style={{boxShadow:s.cardShadow}}>
              <div className="flex items-center justify-between pb-3 border-b mb-3.5" style={{borderColor:s.borderColor}}>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor:s.textOrange}}/><span className="text-xs font-bold" style={{color:s.textPrimary}}>Live Session — {activeTopic.icon} {activeTopic.topic}</span></div>
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[14px]" style={{background:TRACK_META[track].accentSoft}}>{TRACK_META[track].flag}</span>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-lg" style={{backgroundColor:s.pillBg,color:s.pillText}}>👥 {activeTopic.participants}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3.5">
                {allAvatars.map((av,i)=>{const state=activeSpeakers.get(i);const isMic=state==='mic';const isHand=state==='hand';return(
                  <div key={i} className={`av-cell ${visibleP.includes(i)?'show':''} aspect-square rounded-2xl overflow-hidden relative ${av.isDali?'dali-wrap':isMic?'anim-participate':isHand?'hand-raised':ANIM_CLASSES[i-1]||'anim-bob'}`} 
                    style={{transitionDelay:`${i*0.1}s`,border:isMic?`2px solid ${s.textOrange}`:isHand?'2px solid rgba(255,69,0,0.4)':'1px solid transparent',backgroundColor:av.bg,boxShadow:isMic?`0 0 20px ${s.orangeGlow}`:isHand?'0 0 10px rgba(255,69,0,0.15)':'none'}}>
                    <div dangerouslySetInnerHTML={{__html:av.svg}} className="w-full h-full"/>
                    {isMic&&(<><div className="speaking-ring absolute inset-0 rounded-2xl border-2" style={{borderColor:s.textOrange}}/><div className="act-indicator absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{background:s.textOrange,color:'white',boxShadow:`0 2px 8px ${s.orangeGlow}`}}>🎤</div></>)}
                    {isHand&&(<div className="hand-indicator absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{background:'rgba(255,69,0,0.2)',color:s.textOrange}}>✋</div>)}
                    <div className="absolute bottom-0 left-0 right-0 text-center backdrop-blur-md font-semibold py-0.5 truncate px-1" style={{fontSize:'8px',backgroundColor:'rgba(0,0,0,0.45)',color:'#FFF0E8'}}>{av.name}</div>
                  </div>
                )})}
              </div>
              <div className="glass-card-light rounded-2xl p-3 min-h-[72px] flex flex-col gap-1.5" style={{borderColor:s.chatBorder}}>
                <div className="text-[11px] font-bold mb-0.5" style={{color:s.textTertiary}}>live chat</div>
                {chatMsgs.map(msg=>(<div key={msg.id} className="chat-in flex items-start gap-1.5"><span className="text-[11px] font-bold flex-shrink-0" style={{color:msg.isDali?s.textOrange:s.textTertiary}}>{msg.from}:</span><span className="text-[11px] leading-relaxed" style={{color:s.textSecondary}}>{msg.text}</span></div>))}
              </div>
              <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t" style={{borderColor:s.borderColor}}>
                {[{icon:'🎤',l:'mute'},{icon:'📹',l:'video'},{icon:'✋',l:'hand'},{icon:'💬',l:'chat'}].map(c=>(
                  <button key={c.l} className="glass-btn flex flex-col items-center gap-0.5 group">
                    <div className="glass-card-light w-9 h-9 rounded-2xl flex items-center justify-center text-sm transition-all" style={{borderColor:s.borderColor}}>{c.icon}</div>
                    <span className="text-[10px]" style={{color:s.textTertiary}}>{c.l}</span>
                  </button>
                ))}
                <button className="ml-auto glass-btn px-4 py-1.5 rounded-2xl text-[11px] font-semibold transition-all border" style={{backgroundColor:s.pillBg,color:s.textOrange,borderColor:`${s.textOrange}25`}}>leave</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── LANGUAGES SECTION ─────────────────────────── */}
      <section id="languages" ref={addRef(6)} className="reveal max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:s.textOrange}}>
          {lang==='ar'?'اللغات':lang==='fr'?'les langues':'the languages'}
        </div>
        <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{letterSpacing:'-0.025em',color:s.textPrimary}}>
          {lang==='ar'?'ثلاث لغات، منصّة وحدة':lang==='fr'?'trois langues, une seule plateforme':'three languages, one platform'}
        </h2>
        <p className="text-[15px] mb-10 max-w-lg" style={{color:s.textSecondary}}>
          {lang==='ar'?'اختر لغتك، وشوف المستوى المستهدف وهيئة الامتحان':lang==='fr'?"choisis ta langue, ton niveau cible et l'organisme d'examen":'pick your language, see the exam board and target level'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(['en','de','it'] as const).map(id=>{
            const m = TRACK_META[id]
            const isActive = track===id
            return (
              <button key={id} onClick={()=>{setTrack(id);document.getElementById('offers')?.scrollIntoView({behavior:'smooth'})}} className="glass-card pkg-card rounded-2xl p-6 text-left relative overflow-hidden"
                style={{ borderColor: isActive ? m.accent+'55' : s.borderColor, boxShadow: isActive ? `0 4px 24px ${m.accentSoft}` : s.cardShadow }}>
                {/* Giant flag watermark, subject-appropriate signature element */}
                <span className="absolute -right-4 -top-4 text-[110px] leading-none opacity-[0.07] select-none pointer-events-none rotate-12">{m.flag}</span>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{background:m.accentSoft}}>{m.flag}</span>
                    <div>
                      <div className="text-lg font-black" style={{color:s.textPrimary}}>{m.name}</div>
                      <div className="text-[11px] font-semibold" style={{color:m.accent}}>{m.exam}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{background:m.accentSoft,color:m.accent}}>{m.level}</span>
                  </div>
                  <div className="text-[13px] leading-relaxed" style={{color:s.textSecondary}}>
                    {id==='en' && (lang==='ar'?'إنجليزية للمحادثة والمهن — من A1 إلى C2':lang==='fr'?"anglais conversationnel & carrière — de A1 à C2":'career & speaking English — A1 all the way to C2')}
                    {id==='de' && (lang==='ar'?'تحضير مكثّف لامتحان B2 الألماني للدراسة أو الهجرة':lang==='fr'?"préparation intensive à l'examen B2 pour étudier ou t'installer":'focused B2 exam prep for study or relocation abroad')}
                    {id==='it' && (lang==='ar'?'تحضير مكثّف لامتحان B2 الإيطالي للدراسة أو الهجرة':lang==='fr'?"préparation intensive à l'examen B2 pour étudier ou t'installer":'focused B2 exam prep for study or relocation abroad')}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold" style={{color:m.accent}}>
                    {lang==='ar'?'شوف الخطط':lang==='fr'?'voir les offres':'view plans'} <span aria-hidden>→</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>
      {/* ─── OFFERS SECTION ──────────────────────────────── */}
      <section id="offers" ref={addRef(0)} className="reveal max-w-6xl mx-auto px-6 py-10 md:py-20 relative overflow-hidden">
        {/* Rain words container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {FLOATING_WORDS.map((w, i) => (
            <div 
              key={i} 
              className="rain-word absolute text-[11px] font-medium px-3.5 py-2 rounded-full whitespace-nowrap flex items-center gap-2"
              style={{
                left: `${5 + (i * 10)}%`,
                '--rot-start': w.rotStart,
                '--rot-end': w.rotEnd,
                '--dur': w.dur,
                '--delay': w.delay,
                '--wobble-1': w.wobble,
                '--wobble-2': `-${w.wobble}`,
                '--wobble-3': w.wobble,
                background: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(20,20,22,0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${s.borderColor}`,
                color: s.textSecondary,
                top: '-40px',
                opacity: 0,
                transform: `rotate(${w.rotStart})`
              } as React.CSSProperties}
            >
              <span className="text-base">{w.icon}</span>
              {w.text}
            </div>
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:s.textOrange}}>{t.classesTag}</div>
          <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{letterSpacing:'-0.025em',color:s.textPrimary}}>{t.classesH}</h2>
          <p className="text-[15px] mb-6 max-w-lg" style={{color:s.textSecondary}}>{t.classesSub}</p>

          {/* Condensed trust badge — duplicated from hero, placed directly above pricing cards */}
          <div className="glass-card-light inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-semibold" style={{borderColor:s.borderColor,color:s.textPrimary}}>
            <span style={{color:s.textOrange}}>★</span>
            <span>{t.trustBadge}</span>
          </div>

          {/* Language track switcher — English career/speaking vs German/Italian B2 exam prep */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {[
              {id:'en' as const, flag:'🇬🇧', label:t.trackEn, sub:t.trackEnSub},
              {id:'de' as const, flag:'🇩🇪', label:t.trackDe, sub:t.trackDeSub},
              {id:'it' as const, flag:'🇮🇹', label:t.trackIt, sub:t.trackItSub},
            ].map(tr => (
              <button key={tr.id} onClick={()=>setTrack(tr.id)}
                className="track-tab glass-btn px-4 py-2.5 rounded-2xl text-left border"
                style={track===tr.id
                  ? {background:`linear-gradient(135deg,${s.textOrange},${s.textOrangeLight})`,color:'#fff',border:'none',boxShadow:`0 4px 14px ${s.orangeGlow}`}
                  : {background:s.cardBgFlat,color:s.textSecondary,borderColor:s.borderColor}}>
                <div className="text-sm font-bold flex items-center gap-1.5">{tr.flag} {tr.label}</div>
                <div className="text-[10px] opacity-80">{tr.sub}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedPackages.map((pkg) => {
              return (
                <div key={pkg.id} className="glass-card pkg-card rounded-2xl p-6 relative" style={{
                  borderColor: (pkg as any).popular ? `${s.textOrange}35` : (pkg as any).premium ? `${s.textOrangeLight}25` : s.borderColor,
                  boxShadow: (pkg as any).popular ? `0 4px 24px ${s.orangeGlow}` : s.cardShadow,
                }} onMouseEnter={e => {
                  e.currentTarget.style.borderColor = s.borderHover
                  e.currentTarget.style.boxShadow = s.cardShadowHover
                }} onMouseLeave={e => {
                  e.currentTarget.style.borderColor = (pkg as any).popular ? `${s.textOrange}35` : (pkg as any).premium ? `${s.textOrangeLight}25` : s.borderColor
                  e.currentTarget.style.boxShadow = (pkg as any).popular ? `0 4px 24px ${s.orangeGlow}` : s.cardShadow
                }}>
                  {(pkg as any).popular && (
                    <div className="absolute -top-3.5 left-6 text-white text-[11px] px-3.5 py-1 rounded-full font-bold" style={{backgroundColor: s.textOrange, boxShadow: `0 2px 10px ${s.orangeGlow}`}}>
                      most popular
                    </div>
                  )}
                  {(pkg as any).spotsLeft !== undefined && (
                    <div className="absolute -top-3.5 left-6 text-white text-[11px] px-3.5 py-1 rounded-full font-bold" style={{backgroundColor: s.textOrangeLight}}>
                      {(pkg as any).spotsLeft} spots left this cohort
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="glass-card-light w-12 h-12 rounded-2xl flex items-center justify-center text-2xl relative" style={{borderColor: s.borderColor}}>
                        {pkg.icon}
                        <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2" style={{background:TRACK_META[track].accentSoft, borderColor: s.cardBgFlat}} title={TRACK_META[track].name}>{TRACK_META[track].flag}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="text-base font-bold" style={{color: s.textPrimary}}>{pkg.name}</div>
                        </div>
                        <div className="text-[13px] font-semibold" style={{color: s.textOrangeLight}}>{pkg.tagline}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {activePrice === 'm' ? (
                        <div className="text-2xl font-black" style={{color: s.textOrange}}>
                          {pkg.priceTnd}
                          <span className="text-sm font-normal" style={{color: s.textTertiary}}> TND/month</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-black flex items-baseline gap-1.5 justify-end" style={{color: s.textOrange}}>
                            <span className="text-sm font-semibold line-through" style={{color: s.textTertiary}}>{pkg.priceTnd}</span>
                            <span>→ {pkg.yearlyTnd}</span>
                            <span className="text-sm font-normal" style={{color: s.textTertiary}}>/mo</span>
                          </div>
                          <div className="text-[11px] font-semibold mt-0.5" style={{color: s.textOrangeLight}}>
                            {t.billedYearly}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed mb-5" style={{color: s.textSecondary}}>{pkg.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">{pkg.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-[12px]" style={{color: s.textSecondary}}>
                      <span className="font-bold mt-0.5 flex-shrink-0" style={{color: s.textOrange}}>✓</span>
                      {f}
                    </div>
                  ))}</div>
                  
                  <button 
                    onClick={() => openModal(pkg.name)}
                    className="glass-btn block w-full text-center py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]" 
                    style={glassBtnStyle((pkg as any).popular, (pkg as any).premium)}
                  >
                    {(pkg as any).ctaLabel || t.enrollBtn}
                  </button>
                </div>
              )
            })}
          </div>
          
          {/* Yearly/Monthly Switch at bottom */}
          <div className="flex items-center justify-center gap-3 mt-10 pt-6 border-t" style={{borderColor:s.borderColor}}>
            <span className="text-sm" style={{color: s.textSecondary}}>{t.monthly}</span>
            <button 
              onClick={() => setActivePrice(p => p === 'm' ? 'y' : 'm')} 
              className="w-12 h-6 rounded-full transition-all relative glass-btn" 
              style={{backgroundColor: activePrice === 'y' ? s.textOrange : s.borderColor}}
            >
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm" 
                style={{left: activePrice === 'y' ? '25px' : '2px'}} 
              />
            </button>
            <span className="text-sm font-semibold" style={{color: activePrice === 'y' ? s.textOrange : s.textSecondary}}>{t.yearly}</span>
          </div>
        </div>
      </section>
      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section id="how" ref={addRef(1)} className="reveal max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:s.textOrange}}>{t.howTag}</div>
        <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{letterSpacing:'-0.025em',color:s.textPrimary}}>{t.howH}</h2>
        <p className="text-[15px] mb-10 max-w-lg" style={{color:s.textSecondary}}>{t.howSub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.steps.map(step => (
            <div key={step.n} className="glass-card rounded-2xl p-6 transition-all duration-300" onMouseEnter={e=>e.currentTarget.style.borderColor=s.borderHover} onMouseLeave={e=>e.currentTarget.style.borderColor=s.borderColor}>
              <div className="text-xs font-bold mb-4" style={{color:`${s.textOrange}50`}}>{step.n}</div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="text-base font-bold mb-2" style={{color:s.textPrimary}}>{step.t}</div>
              <div className="text-[13px] leading-relaxed" style={{color:s.textSecondary}}>{step.d}</div>
            </div>
          ))}
        </div>
      </section>
      {/* ─── LIVE SESSION SIMULATOR ────────────────────── */}
      <section id="live" ref={addRef(2)} className="reveal max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:s.textOrange}}>{t.liveTag}</div>
        <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{letterSpacing:'-0.025em',color:s.textPrimary}}>{t.liveH}</h2>
        <p className="text-[15px] mb-8 max-w-lg" style={{color:s.textSecondary}}>{t.liveSub}</p>
        <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6" style={{boxShadow:s.cardShadow}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:`linear-gradient(135deg,${s.textOrange},${s.textOrangeLight})`,boxShadow:`0 4px 14px ${s.orangeGlow}`}}>🎙️</div>
            <div>
              <div className="text-sm font-bold" style={{color:s.textPrimary}}>friday live session</div>
              <div className="text-[13px] mt-0.5" style={{color:s.textSecondary}}>every week · 8:00 PM Tunisia time</div>
              <div className="text-[13px] font-bold mt-1" style={{color:s.textOrange}}>TikTok Live & Instagram Live</div>
            </div>
          </div>
          <div className="flex gap-2">
            {[{v:countdown.d,l:t.days},{v:countdown.h,l:t.hours},{v:countdown.m,l:t.min},{v:countdown.s,l:t.sec}].map(ct=>(
              <div key={ct.l} className="glass-card-light rounded-2xl px-3.5 py-2.5 min-w-[56px] text-center" style={{borderColor:s.countdownBorder}}>
                <div className="text-xl font-black" style={{color:s.textOrange}}>{String(ct.v).padStart(2,'0')}</div>
                <div className="text-[10px] mt-0.5" style={{color:s.textTertiary}}>{ct.l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5">
            <a href="https://www.tiktok.com/@b2please" target="_blank" className="glass-btn flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold active:scale-[0.97] transition-all" style={{color:s.textPrimary, border: `1px solid ${s.borderColor}`, background: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(20,20,22,0.5)'}}>🎵 TikTok</a>
            <a href="https://www.instagram.com/b2.please/" target="_blank" className="glass-btn flex items-center gap-2 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold active:scale-[0.97] transition-all" style={{background:'linear-gradient(135deg,#FF4500,#FF5722,#FF7A3D)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg> Instagram
            </a>
          </div>
        </div>
      </section>
      {/* ─── TOPICS SECTION ──────────────────────────────── */}
      <section id="topics" ref={addRef(3)} className="reveal max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:s.textOrange}}>{t.topicsTag}</div>
        <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{letterSpacing:'-0.025em',color:s.textPrimary}}>{t.topicsH}</h2>
        <p className="text-[15px] mb-10 max-w-lg" style={{color:s.textSecondary}}>{t.topicsSub}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOPICS.map(tp => (
            <div 
              key={tp.en} 
              className="glass-card rounded-2xl px-5 py-6 flex flex-col items-start gap-3 cursor-pointer transition-all duration-300"
              style={{ opacity: 0.85 }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.95'
                e.currentTarget.style.borderColor = s.borderHover
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '0.85'
                e.currentTarget.style.borderColor = s.borderColor
              }}
            >
              <span className="text-4xl">{tp.icon}</span>
              <span className="text-xs font-semibold" style={{ color: s.textPrimary }}>
                {lang === 'ar' ? tp.ar : lang === 'fr' ? tp.fr : tp.en}
              </span>
            </div>
          ))}
        </div>
      </section>
      {/* ─── COMMUNITY SECTION ──────────────────────────── */}
      <section id="community" ref={addRef(4)} className="reveal max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden" style={{boxShadow:s.cardShadow}}>
          <div className="absolute inset-0 pointer-events-none" style={{background:`radial-gradient(ellipse at 20% 50%,${s.textOrange}07 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,${s.textOrangeLight}04 0%,transparent 55%)`}}/>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:s.textOrange}}>{t.communityBannerTag}</div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 leading-tight" style={{letterSpacing:'-0.025em',color:s.textPrimary}}>{t.communityBannerH}</h2>
              <p className="text-[15px] mb-8 leading-relaxed max-w-sm" style={{color:s.textSecondary}}>{t.communityBannerSub}</p>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{color:s.textTertiary}}>{t.differenceH}</div>
                <div className="flex flex-col gap-3.5 mb-10">
                  {t.differenceList.map((item,i)=>(
                    <div key={i} className="glass-card-light flex items-start gap-3.5 rounded-2xl px-4 py-3.5" style={{borderColor:s.borderColor}}>
                      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5"
                        style={{backgroundColor:s.textOrange,color:'#FFFFFF',boxShadow:`0 2px 8px ${s.orangeGlow}`}}>✓</span>
                      <span className="text-[13px] leading-relaxed font-medium" style={{color:s.textSecondary}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#offers" className="glass-btn inline-flex items-center gap-2 text-white px-6 py-3.5 rounded-2xl active:scale-[0.97] transition-all text-[14px] font-semibold" style={{background: `linear-gradient(135deg, ${s.textOrange}, ${s.textOrangeLight})`,boxShadow:`0 4px 18px ${s.orangeGlow}`}}>{t.enrollBtn} →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── NEXT LIVE ──────────────────────────────────── */}
      <section id="next-live" ref={addRef(5)} className="reveal max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="glass-card rounded-2xl p-8 text-center" style={{boxShadow:s.cardShadow}}>
          <h3 className="text-2xl font-black mb-2" style={{color:s.textPrimary}}>🎙️ {t.liveH}</h3>
          <p className="text-sm mb-6" style={{color:s.textSecondary}}>{t.liveSub}</p>
          <div className="flex justify-center gap-2">
            {[{v:countdown.d,l:t.days},{v:countdown.h,l:t.hours},{v:countdown.m,l:t.min},{v:countdown.s,l:t.sec}].map(ct=>(
              <div key={ct.l} className="glass-card-light rounded-2xl px-3.5 py-2.5 min-w-[56px] text-center" style={{borderColor:s.countdownBorder}}>
                <div className="text-xl font-black" style={{color:s.textOrange}}>{String(ct.v).padStart(2,'0')}</div>
                <div className="text-[10px] mt-0.5" style={{color:s.textTertiary}}>{ct.l}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <a href="https://www.tiktok.com/@b2please" target="_blank" className="glass-btn flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold active:scale-[0.97] transition-all" style={{color:s.textPrimary, border: `1px solid ${s.borderColor}`, background: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(20,20,22,0.5)'}}>🎵 TikTok</a>
            <a href="https://www.instagram.com/b2.please/" target="_blank" className="glass-btn flex items-center gap-2 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold active:scale-[0.97] transition-all" style={{background:'linear-gradient(135deg,#FF4500,#FF5722,#FF7A3D)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg> Instagram
            </a>
          </div>
        </div>
      </section>
      {/* ─── FOOTER ────────────────────────────────────── */}
      <footer className="border-t px-6 py-8" style={{borderColor:s.borderColor}}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2"><B2Logo className="text-sm" isLight={isLight}/></div>
          <div className="flex gap-6 text-[13px] flex-wrap justify-center" style={{color:s.textTertiary}}>
            <a href="https://wa.me/21656633546" target="_blank" onClick={()=>trackWaClick('footer')} className="transition-colors hover:underline" style={{color:s.textTertiary}} onMouseEnter={e=>e.currentTarget.style.color=s.textOrange} onMouseLeave={e=>e.currentTarget.style.color=s.textTertiary}>💬 WhatsApp</a>
            <a href="https://www.instagram.com/b2.please/" target="_blank" className="transition-colors hover:underline" style={{color:s.textTertiary}} onMouseEnter={e=>e.currentTarget.style.color=s.textOrange} onMouseLeave={e=>e.currentTarget.style.color=s.textTertiary}>📸 Instagram</a>
            <a href="https://www.tiktok.com/@b2please" target="_blank" className="transition-colors hover:underline" style={{color:s.textTertiary}} onMouseEnter={e=>e.currentTarget.style.color=s.textOrange} onMouseLeave={e=>e.currentTarget.style.color=s.textTertiary}>🎵 TikTok</a>
          </div>
          <div className="text-xs" style={{color:s.textTertiary}}>© 2026 B2Please</div>
        </div>
      </footer>
      <a href="https://wa.me/21656633546" target="_blank" onClick={()=>trackWaClick('floating_button')} className="glass-btn fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl hover:scale-105 active:scale-[0.97] transition-all" style={{background: `linear-gradient(135deg, ${s.textOrange}, ${s.textOrangeLight})`,boxShadow:`0 4px 20px ${s.orangeGlow}`, border: 'none'}}>💬</a>
      {/* ─── ENROLL MODAL ────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-card" style={{position:'relative'}} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✕</button>
            
            <div className="text-center mb-6">
              <span className="text-4xl block mb-2">🎓</span>
              <h3 className="text-xl font-bold" style={{color:s.textPrimary}}>Ready to join?</h3>
              <p className="text-sm" style={{color:s.textSecondary}}>
                {selectedPlan !== 'General' ? `For the ${selectedPlan}` : 'Choose how you\'d like to continue'}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleContact('whatsapp')} className="option-btn" style={{borderColor:'#25D366'}}>
                <span className="icon" style={{color:'#25D366'}}><WhatsAppIcon size={24} /></span>
                Continue with WhatsApp
                <span className="badge">Recommended</span>
              </button>
              <button onClick={() => handleContact('messenger')} className="option-btn" style={{borderColor:'#0084FF'}}>
                <span className="icon" style={{color:'#0084FF'}}><MessengerIcon size={24} /></span>
                Continue with Messenger
              </button>
              <button onClick={() => handleContact('instagram')} className="option-btn" style={{borderColor:'#E1306C'}}>
                <span className="icon" style={{color:'#E1306C'}}><InstagramIcon size={24} /></span>
                Continue with Instagram
              </button>
            </div>
            <p className="text-center text-xs mt-4" style={{color:s.textTertiary}}>
              We'll get back to you within 24 hours
            </p>
          </div>
        </div>
      )}
    </main>
  )
}