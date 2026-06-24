'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

// ── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    tagline: 'built for Tunisian English learners',
    hero1: 'stop studying.',
    hero2: 'start speaking',
    sub: 'Live online classes with Prof. Dali — learn English through real conversations about current events, culture, trends and what the world is talking about.',
    joinBtn: 'grab a spot',
    dmBtn: 'DM on instagram',
    waBtn: 'chat on whatsapp',
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
    classesTag: 'live sessions',
    classesH: 'pick your tier',
    classesSub: 'structured progression designed around what you actually need',
    comingSoon: 'First sessions launching soon',
    comingSoonSub: 'Join now and be the first to book. Early members get their first session free.',
    notifyBtn: "reserve my spot — it's free",
    liveTag: 'next session',
    liveH: 'join the next live',
    liveSub: 'every friday at 8PM Tunisia time — open to all tiers',
    communityTag: 'reach dali',
    communityH: 'message directly',
    communitySub: 'questions about a session? not sure which tier? Dali replies personally.',
    monthly: 'monthly', yearly: 'yearly (-20%)',
    signupTag: 'get started', signupH: 'create your free account', signupSub: 'free account · first session included',
    namePH: 'full name', emailPH: 'email address', passPH: 'password',
    signupBtn2: 'create account — first session free', creating: 'creating account...',
    loginQ: 'already have an account?', loginLink: 'log in',
    notSure: 'not sure which tier?', waLink: 'ask on whatsapp ↗',
    nextLive: 'next live', days: 'd', hours: 'h', min: 'm', sec: 's',
    badgeLabel: 'your path',
    packages: [
      { id:'ielts', icon:'🏆', name:'IELTS Prep', tagline:'Band 7+ target', desc:'Intensive live sessions focused on all four IELTS skills — speaking, writing, reading, listening — taught through real exam topics.', price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 live sessions/month','Speaking mock tests','Writing task corrections','Exam vocabulary deep-dives','Personal score tracking'], cta:'start IELTS prep', popular:true, tier:'Pro' },
      { id:'comms', icon:'💬', name:'Communication', tagline:'Sound natural', desc:'Weekly live discussions on trending topics — current events, culture, tech, finance. Build confidence and fluency through real conversation.', price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 live discussions/month','Topic vocabulary sheets','Pronunciation coaching','Weekly news breakdown','Replay access'], cta:'join conversations', tier:'Starter' },
      { id:'business', icon:'💼', name:'Business English', tagline:'Career accelerator', desc:'Live sessions built around real workplace situations — presentations, negotiations, emails, interviews. For professionals who need English at work.', price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 live sessions/month','CV & interview practice','Presentation coaching','Business vocabulary','LinkedIn profile review'], cta:'grow professionally', tier:'Core' },
      { id:'1on1', icon:'🎓', name:'1-on-1 with Dali', tagline:'Personal coaching', desc:'Private sessions with Dali. Custom curriculum, direct feedback, and the fastest path to B2 and beyond. Limited spots available each month.', price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 private sessions/month','Custom study plan','Unlimited WhatsApp access','Priority booking','Certificate on completion'], cta:'book private sessions', premium:true, tier:'Elite' },
    ],
  },
  fr: {
    tagline: "conçu pour les apprenants tunisiens",
    hero1: "arrête de bachoter.",
    hero2: "commence à parler",
    sub: "Des cours en ligne en direct avec Prof. Dali — apprends l'anglais à travers de vraies conversations sur l'actualité, la culture et les tendances du moment.",
    joinBtn: "prends ta place", dmBtn: "DM sur instagram", waBtn: "écrire sur whatsapp",
    topicsTag: "ce qu'on discute", topicsH: "vrais sujets. vrai anglais.", topicsSub: "chaque cours est ancré dans l'actualité mondiale du moment",
    howTag: "comment ça marche", howH: "rejoins, parle, progresse", howSub: "trois étapes — sans manuel scolaire",
    steps: [
      { n:'01', icon:'🎯', t:'choisis ton cours', d:"Parcours les sessions en direct par thème. Actualité, finance, culture — choisis ce qui t'intéresse et prends ta place." },
      { n:'02', icon:'🎙️', t:'rejoins & parle', d:"Intègre la session en direct. Dali anime la conversation en anglais, tu participes, tu poses des questions, tu fais des erreurs — c'est ça l'idée." },
      { n:'03', icon:'🚀', t:'suis ton niveau', d:"Vois ton vocabulaire s'élargir, reçois des retours personnalisés après chaque cours et observe ton niveau grimper semaine après semaine." },
    ],
    classesTag: "sessions en direct", classesH: "choisis ton tier", classesSub: "une progression structurée autour de tes besoins réels",
    comingSoon: "Premières sessions bientôt disponibles", comingSoonSub: "Inscris-toi maintenant et sois le premier à réserver. Les premiers membres obtiennent leur première session gratuite.",
    notifyBtn: "réserver ma place — gratuit",
    liveTag: "prochaine session", liveH: "rejoins le prochain live", liveSub: "chaque vendredi à 20h heure tunisienne — ouvert à tous les tiers",
    communityTag: "contacter dali", communityH: "écrire directement", communitySub: "questions sur une session ? pas sûr du tier ? Dali répond personnellement.",
    monthly: "mensuel", yearly: "annuel (-20%)",
    signupTag: "commencer", signupH: "créer ton compte gratuit", signupSub: "compte gratuit · première session incluse",
    namePH: "nom complet", emailPH: "adresse email", passPH: "mot de passe",
    signupBtn2: "créer un compte — première session offerte", creating: "création en cours...",
    loginQ: "déjà un compte ?", loginLink: "se connecter",
    notSure: "pas sûr du tier ?", waLink: "demander sur whatsapp ↗",
    nextLive: "prochain live", days: "j", hours: "h", min: "m", sec: "s",
    badgeLabel: 'votre parcours',
    packages: [
      { id:'ielts', icon:'🏆', name:'Prépa IELTS', tagline:'Objectif Band 7+', desc:"Sessions en direct intensives sur les quatre compétences IELTS enseignés à travers de vrais sujets d'examen.", price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 sessions/mois','Tests oraux simulés','Corrections écrites','Vocabulaire examen','Suivi de score'], cta:'commencer la prépa', popular:true, tier:'Pro' },
      { id:'comms', icon:'💬', name:'Communication', tagline:'Parle naturellement', desc:"Discussions en direct hebdomadaires sur les sujets d'actualité — culture, tech, finance.", price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 discussions/mois','Fiches vocabulaire','Coaching prononciation',"Décryptage actualité",'Accès replays'], cta:'rejoindre les discussions', tier:'Starter' },
      { id:'business', icon:'💼', name:'Anglais Pro', tagline:"Boost carrière", desc:"Sessions en direct autour de situations professionnelles réelles — présentations, négociations, entretiens.", price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 sessions/mois','Prépa CV et entretiens','Coaching présentation','Vocabulaire pro','Revue LinkedIn'], cta:'progresser pro', tier:'Core' },
      { id:'1on1', icon:'🎓', name:'1-pour-1 avec Dali', tagline:'Coaching personnel', desc:"Sessions privées avec Dali. Programme sur mesure, retours directs. Places limitées chaque mois.", price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 sessions privées/mois',"Plan d'étude personnalisé",'Accès WhatsApp illimité','Réservation prioritaire','Certificat'], cta:'réserver sessions privées', premium:true, tier:'Elite' },
    ],
  },
  ar: {
    tagline: 'مصمّم للمتعلّمين التونسيين',
    hero1: 'توقّف عن الحفظ.',
    hero2: 'ابدأ تتكلّم',
    sub: 'دروس مباشرة أونلاين مع الأستاذ دالي — تعلّم الإنجليزية من خلال نقاشات حقيقية حول الأحداث الراهنة والثقافة والتريندات.',
    joinBtn: 'احجز مقعدك', dmBtn: 'راسلنا على انستغرام', waBtn: 'تحدّث على واتساب',
    topicsTag: 'شنو نحكيو فيه', topicsH: 'مواضيع حقيقية. إنجليزية حقيقية.', topicsSub: 'كل درس مبني على شيء يصير في العالم هذا الوقت',
    howTag: 'كيفاش يخدم', howH: 'انضم، تكلّم، ارتقي', howSub: 'ثلاث خطوات — بلا كتب ولا حفظ',
    steps: [
      { n:'٠١', icon:'🎯', t:'اختار درسك', d:'شوف الجلسات المباشرة حسب الموضوع. أحداث راهنة، فلوس، ثقافة — اختار اللي يهمّك واحجز مقعدك.' },
      { n:'٠٢', icon:'🎙️', t:'انضم وتكلّم', d:'ادخل الجلسة المباشرة. الأستاذ دالي يقود النقاش بالإنجليزية، أنت تشارك وتسأل وتغلط — هذا هو المطلوب.' },
      { n:'٠٣', icon:'🚀', t:'تابع مستواك', d:'شوف كيف تتوسّع مفرداتك، خذ ملاحظات شخصية بعد كل جلسة، وراقب مستواك يصعد أسبوع بأسبوع.' },
    ],
    classesTag: 'الجلسات المباشرة', classesH: 'اختار مستواك', classesSub: 'تقدّم مهيكل حسب احتياجاتك الحقيقية',
    comingSoon: 'أوّل الجلسات قريبًا', comingSoonSub: 'سجّل هالوقت وكن أوّل من يحجز. الأعضاء الأوائل يأخذون أوّل جلسة مجّانًا.',
    notifyBtn: 'احجز مكاني — مجّانًا',
    liveTag: 'الجلسة القادمة', liveH: 'انضم للبث القادم', liveSub: 'كل جمعة الساعة 8 مساءً بتوقيت تونس — مفتوح للجميع',
    communityTag: 'تواصل مع دالي', communityH: 'راسل مباشرة', communitySub: 'عندك سؤال على جلسة؟ ما عرفتش تختار المستوى؟ الأستاذ دالي يردّ شخصيًا.',
    monthly: 'شهري', yearly: 'سنوي (-20%)',
    signupTag: 'ابدأ الرحلة', signupH: 'أنشئ حسابك المجاني', signupSub: 'حساب مجاني · أوّل جلسة مشمولة',
    namePH: 'الاسم الكامل', emailPH: 'البريد الإلكتروني', passPH: 'كلمة المرور',
    signupBtn2: 'أنشئ حساب — أوّل جلسة مجّانية', creating: 'جاري إنشاء الحساب...',
    loginQ: 'عندك حساب بالفعل؟', loginLink: 'تسجيل الدخول',
    notSure: 'ما عرفتش تختار المستوى؟', waLink: 'اسأل على واتساب ↗',
    nextLive: 'البث القادم', days: 'أيام', hours: 'ساعات', min: 'دق', sec: 'ثا',
    badgeLabel: 'مسارك',
    packages: [
      { id:'ielts', icon:'🏆', name:'تحضير IELTS', tagline:'هدف Band 7+', desc:'جلسات مباشرة مكثّفة على المهارات الأربع من خلال مواضيع الامتحان الحقيقية.', price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 جلسات/شهر','اختبارات تحدّث تجريبية','تصحيح التعبير الكتابي','مفردات الامتحان','متابعة النقاط'], cta:'ابدأ تحضير IELTS', popular:true, tier:'Pro' },
      { id:'comms', icon:'💬', name:'مهارات التواصل', tagline:'تكلّم بطبيعة', desc:'نقاشات مباشرة أسبوعية حول أبرز المواضيع — أحداث راهنة، ثقافة، تكنولوجيا، اقتصاد.', price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 نقاشات/شهر','قوائم مفردات الموضوع','تدريب على النطق','شرح أخبار الأسبوع','الوصول للتسجيلات'], cta:'انضم للنقاشات', tier:'Starter' },
      { id:'business', icon:'💼', name:'الإنجليزية المهنية', tagline:'مسرّع مهني', desc:'جلسات مباشرة حول مواقف مهنية حقيقية — عروض تقديمية، مفاوضات، مقابلات عمل.', price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 جلسات/شهر','تحضير السيرة والمقابلات','تدريب على العروض','مفردات مهنية','مراجعة LinkedIn'], cta:'تطوّر مهنيًا', tier:'Core' },
      { id:'1on1', icon:'🎓', name:'جلسات فردية مع دالي', tagline:'تدريب شخصي', desc:'جلسات خاصة مع الأستاذ دالي. منهج مخصّص، ملاحظات مباشرة. أماكن محدودة كل شهر.', price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 جلسات خاصة/شهر','خطة دراسية مخصّصة','وصول واتساب غير محدود','حجز أولوية','شهادة إتمام'], cta:'احجز جلسات خاصة', premium:true, tier:'Elite' },
    ],
  },
}

const TOPICS = [
  { icon:'🌍', en:'World Events', fr:'Actualité Mondiale', ar:'أحداث العالم' },
  { icon:'📰', en:'Breaking News', fr:'Actualités', ar:'أخبار عاجلة' },
  { icon:'🎬', en:'Pop Culture', fr:'Culture Pop', ar:'الثقافة الشعبية' },
  { icon:'💰', en:'Finance & Markets', fr:'Finance & Marchés', ar:'المال والأسواق' },
  { icon:'🤖', en:'Tech & AI', fr:'Tech & IA', ar:'التكنولوجيا والذكاء الاصطناعي' },
  { icon:'🏆', en:'Sports', fr:'Sport', ar:'الرياضة' },
  { icon:'🎵', en:'Music & Entertainment', fr:'Musique & Divertissement', ar:'الموسيقى والترفيه' },
  { icon:'🌐', en:'Social Trends', fr:'Tendances Sociales', ar:'الاتجاهات الاجتماعية' },
]

const CLASS_TOPICS = [
  { topic:'AI & The Future of Work', icon:'🤖', participants:8, level:'B2–C1' },
  { topic:'The US Elections 2024',   icon:'🗳️', participants:12, level:'B1–B2' },
  { topic:'Climate Change Debate',   icon:'🌱', participants:6,  level:'B2–C1' },
  { topic:'Social Media & Society',  icon:'📱', participants:10, level:'B1–B2' },
]

// ── ROOM BACKGROUNDS (simulates video call rooms) ───────────────────────────
const ROOM_BG = [
  { bg: '#1E1814', light: 'radial-gradient(ellipse at 30% 20%, rgba(255,200,150,0.14) 0%, transparent 60%)' },
  { bg: '#161E24', light: 'radial-gradient(ellipse at 30% 20%, rgba(180,200,255,0.11) 0%, transparent 60%)' },
  { bg: '#1E1822', light: 'radial-gradient(ellipse at 30% 20%, rgba(210,180,240,0.11) 0%, transparent 60%)' },
  { bg: '#161E1C', light: 'radial-gradient(ellipse at 30% 20%, rgba(170,220,200,0.11) 0%, transparent 60%)' },
  { bg: '#1E1818', light: 'radial-gradient(ellipse at 30% 20%, rgba(255,180,180,0.11) 0%, transparent 60%)' },
  { bg: '#181C24', light: 'radial-gradient(ellipse at 30% 20%, rgba(180,200,240,0.11) 0%, transparent 60%)' },
  { bg: '#1E1820', light: 'radial-gradient(ellipse at 30% 20%, rgba(230,180,210,0.11) 0%, transparent 60%)' },
]

// ── APPLE MEMOJI-STYLE AVATARS ───────────────────────────────────────────────

function buildAvatarSvg(
  skinBase: string, skinMid: string, skinShadow: string, skinDeep: string,
  eyeBase: string, eyeMid: string, eyeDark: string,
  hairDark: string, hairSheen: string, hairSheen2: string,
  topElement: string, // hair/hijab/hat SVG
  eyesElement: string,
  mouthElement: string,
  accessories: string,
  clothingColor: string,
  roomBg: string, roomLight: string
) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="sk" cx="42%" cy="35%" r="65%">
    <stop offset="0%" stop-color="${skinBase}"/>
    <stop offset="35%" stop-color="${skinMid}"/>
    <stop offset="75%" stop-color="${skinShadow}"/>
    <stop offset="100%" stop-color="${skinDeep}"/>
  </radialGradient>
  <radialGradient id="ey" cx="35%" cy="30%" r="70%">
    <stop offset="0%" stop-color="${eyeBase}"/>
    <stop offset="40%" stop-color="${eyeMid}"/>
    <stop offset="100%" stop-color="${eyeDark}"/>
  </radialGradient>
  <filter id="fs"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="${roomBg}" rx="18"/>
<rect width="200" height="200" style="background:${roomLight}" rx="18"/>
${topElement}
<rect x="88" y="144" width="24" height="16" rx="6" fill="${skinMid}"/>
<ellipse cx="100" cy="115" rx="43" ry="46" fill="url(#sk)" filter="url(#fs)"/>
<ellipse cx="100" cy="138" rx="28" ry="16" fill="${skinShadow}" opacity="0.12"/>
<ellipse cx="56" cy="115" rx="7" ry="10" fill="${skinShadow}"/>
<ellipse cx="58" cy="115" rx="4" ry="6.5" fill="${skinDeep}"/>
<ellipse cx="144" cy="115" rx="7" ry="10" fill="${skinShadow}"/>
<ellipse cx="142" cy="115" rx="4" ry="6.5" fill="${skinDeep}"/>
${eyesElement}
<path d="M97 100 Q100 110 103 118" stroke="${skinShadow}" stroke-width="0.8" fill="none" opacity="0.18"/>
<path d="M95 121 Q100 128 105 121" stroke="${skinShadow}" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="100" cy="123" rx="6.5" ry="3" fill="${skinDeep}" opacity="0.22"/>
<path d="M93 128 Q100 130 107 128" stroke="${skinShadow}" stroke-width="0.8" fill="none" opacity="0.15"/>
${mouthElement}
<ellipse cx="68" cy="127" rx="10" ry="6" fill="#FF8C69" opacity="0.16"/>
<ellipse cx="132" cy="127" rx="10" ry="6" fill="#FF8C69" opacity="0.16"/>
<ellipse cx="100" cy="152" rx="5" ry="1.8" fill="white" opacity="0.06"/>
${accessories}
<ellipse cx="100" cy="185" rx="42" ry="18" fill="${clothingColor}"/>
</svg>`
}

// Dali — teaching with whiteboard
const DALI_SVG = (() => {
  const skinBase='#FFE8CC', skinMid='#FACA8A', skinShadow='#E8965A', skinDeep='#D4814A'
  const eyeBase='#8B5E3C', eyeMid='#5C3A1E', eyeDark='#1A0A00'
  const hairDark='#2D1E0F'
  const topElement = `
<rect x="10" y="12" width="100" height="58" rx="6" fill="#1A1A1A" opacity="0.9"/>
<rect x="10" y="12" width="100" height="58" rx="6" fill="none" stroke="#FF4500" stroke-width="1" opacity="0.35"/>
<text x="18" y="28" font-size="7" fill="#FF7A3D" font-family="monospace" font-weight="bold">displace ≠ replace</text>
<line x1="18" y1="36" x2="76" y2="36" stroke="#FF4500" stroke-width="1" stroke-linecap="round"/>
<text x="18" y="46" font-size="6" fill="#FF8C69" font-family="monospace">→ "AI may displace</text>
<text x="18" y="55" font-size="6" fill="#FF8C69" font-family="monospace">   some roles..."</text>
<rect x="92" y="62" width="12" height="5" rx="2" fill="#2A2A2A"/>
<ellipse cx="100" cy="74" rx="37" ry="14" fill="${hairDark}"/>
<path d="M57 98 Q58 68 100 64 Q142 68 143 98 Q138 76 100 72 Q62 76 57 98Z" fill="${hairDark}"/>
<ellipse cx="100" cy="70" rx="33" ry="11" fill="#3D2815"/>
<path d="M74 68 Q88 64 102 66" stroke="#5C4433" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.55"/>
<path d="M80 64 Q92 61 104 63" stroke="#6B5040" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.35"/>
<ellipse cx="59" cy="94" rx="8" ry="18" fill="${hairDark}"/>
<ellipse cx="141" cy="94" rx="8" ry="18" fill="${hairDark}"/>
<g>
  <animateTransform attributeName="transform" type="rotate" values="0 148 108;-8 148 108;6 148 108;-3 148 108;0 148 108" keyTimes="0;0.2;0.5;0.75;1" dur="4s" repeatCount="indefinite"/>
  <line x1="148" y1="108" x2="112" y2="62" stroke="${skinShadow}" stroke-width="4" stroke-linecap="round"/>
  <line x1="148" y1="108" x2="112" y2="62" stroke="${skinMid}" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
  <circle cx="112" cy="62" r="3.5" fill="#FF4500"/>
  <circle cx="112" cy="62" r="1.5" fill="white" opacity="0.6"/>
  <ellipse cx="152" cy="112" rx="8" ry="6" fill="${skinMid}"/>
  <ellipse cx="154" cy="110" rx="3.5" ry="2.5" fill="${skinBase}"/>
</g>`
  const eyesElement = `
<ellipse cx="82" cy="112" rx="10.5" ry="12" fill="white"/>
<ellipse cx="118" cy="112" rx="10.5" ry="12" fill="white"/>
<circle cx="82.5" cy="112.5" r="7.5" fill="url(#ey)"/>
<circle cx="118.5" cy="112.5" r="7.5" fill="url(#ey)"/>
<circle cx="83" cy="113" r="4.2" fill="#0A0400"/>
<circle cx="119" cy="113" r="4.2" fill="#0A0400"/>
<circle cx="79.5" cy="109.5" r="3" fill="white"/>
<circle cx="115.5" cy="109.5" r="3" fill="white"/>
<circle cx="85.5" cy="115.5" r="1.6" fill="white" opacity="0.55"/>
<circle cx="121.5" cy="115.5" r="1.6" fill="white" opacity="0.55"/>
<path d="M76 122 Q82 124 88 122" stroke="${skinShadow}" stroke-width="0.5" fill="none" opacity="0.25"/>
<path d="M112 122 Q118 124 124 122" stroke="${skinShadow}" stroke-width="0.5" fill="none" opacity="0.25"/>
<path d="M71 99 Q82 95 93 98" stroke="#1A0E05" stroke-width="3.2" fill="none" stroke-linecap="round"/>
<path d="M107 98 Q118 95 129 99" stroke="#1A0E05" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
  const mouthElement = `
<path d="M82 132 Q90 128 100 130 Q110 128 118 132" stroke="#1A0E05" stroke-width="3.8" fill="none" stroke-linecap="round"/>
<path d="M82 132 Q90 130 100 131.5 Q110 130 118 132" fill="#2D1E0F"/>
<path d="M78 139 Q100 158 122 139" stroke="#A0522D" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M80 139.5 Q100 155 120 139.5" fill="white"/>
<path d="M73 135 Q71 139 73 143" stroke="${skinShadow}" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.35"/>
<path d="M127 135 Q129 139 127 143" stroke="${skinShadow}" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.35"/>`
  return buildAvatarSvg(skinBase, skinMid, skinShadow, skinDeep, eyeBase, eyeMid, eyeDark, hairDark, '', '', topElement, eyesElement, mouthElement, '', '#FF4500', ROOM_BG[0].bg, ROOM_BG[0].light)
})()

// Student avatar builder
function makeStudent(i: number) {
  const skins = [
    { base:'#FFE8CC', mid:'#FDDCB5', shadow:'#E8A06A', deep:'#D4884A' },
    { base:'#FFE4A0', mid:'#FBBF7A', shadow:'#D4800A', deep:'#B86800' },
    { base:'#FFE8CC', mid:'#FDDCB5', shadow:'#E8A06A', deep:'#D4884A' },
    { base:'#FFE8CC', mid:'#FACA8A', shadow:'#E8965A', deep:'#D07530' },
    { base:'#FFE8CC', mid:'#FDDCB5', shadow:'#E8A06A', deep:'#D4884A' },
    { base:'#FFE8CC', mid:'#FDDCB5', shadow:'#E8A06A', deep:'#D4884A' },
    { base:'#FFE8CC', mid:'#FDDCB5', shadow:'#E8A06A', deep:'#D4884A' },
  ][i]
  const eyeBase='#8B5E3C', eyeMid='#5C3A1E', eyeDark='#1A0A00'
  const hairDark='#1C0E06'

  const tops = [
    // Amira - space buns
    `<ellipse cx="100" cy="86" rx="44" ry="22" fill="${hairDark}"/>
<circle cx="58" cy="70" r="18" fill="${hairDark}"/><circle cx="58" cy="70" r="11" fill="#FF4500"/><circle cx="58" cy="70" r="6" fill="#E03D00"/>
<circle cx="142" cy="70" r="18" fill="${hairDark}"/><circle cx="142" cy="70" r="11" fill="#FF4500"/><circle cx="142" cy="70" r="6" fill="#E03D00"/>
<path d="M70 78 Q100 68 130 78" stroke="${hairDark}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    // Sami - fade
    `<path d="M56 100 Q56 70 100 66 Q144 70 144 100 Q138 78 100 74 Q62 78 56 100Z" fill="${hairDark}"/>
<rect x="56" y="96" width="88" height="14" rx="3" fill="${hairDark}"/>
<rect x="56" y="108" width="11" height="16" rx="3" fill="#2D1E0F" opacity="0.55"/>
<rect x="133" y="108" width="11" height="16" rx="3" fill="#2D1E0F" opacity="0.55"/>`,
    // Nour - purple hijab
    `<ellipse cx="100" cy="86" rx="50" ry="34" fill="#7C3AED"/>
<ellipse cx="100" cy="120" rx="54" ry="36" fill="#7C3AED"/>
<ellipse cx="46" cy="126" rx="13" ry="32" fill="#6D28D9"/>
<ellipse cx="154" cy="126" rx="13" ry="32" fill="#6D28D9"/>
<ellipse cx="100" cy="88" rx="36" ry="22" fill="#6D28D9"/>
<path d="M64 88 Q100 76 136 88" stroke="#8B5CF6" stroke-width="2.5" fill="none" opacity="0.45" stroke-linecap="round"/>`,
    // Mehdi - red beanie
    `<ellipse cx="100" cy="76" rx="42" ry="18" fill="#DC2626"/>
<ellipse cx="100" cy="72" rx="38" ry="14" fill="#EF4444"/>
<rect x="58" y="74" width="84" height="12" rx="5" fill="#DC2626"/>
<ellipse cx="100" cy="66" rx="8" ry="4.5" fill="#B91C1C"/>
<path d="M58 88 Q62 82 70 84" stroke="${hairDark}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<path d="M130 84 Q138 82 142 88" stroke="${hairDark}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    // Karim - snapback
    `<ellipse cx="106" cy="84" rx="48" ry="17" fill="#1D4ED8"/>
<ellipse cx="106" cy="82" rx="48" ry="15" fill="#1E40AF"/>
<ellipse cx="144" cy="94" rx="24" ry="7.5" fill="#1D4ED8" transform="rotate(-18 144 94)"/>
<circle cx="96" cy="80" r="7" fill="#3B82F6" opacity="0.65"/>
<ellipse cx="62" cy="96" rx="11" ry="7" fill="${hairDark}"/>`,
    // Rania - long auburn hair + headphones
    `<rect x="56" y="84" width="14" height="55" rx="7" fill="#7C2D12"/>
<rect x="130" y="84" width="14" height="55" rx="7" fill="#7C2D12"/>
<ellipse cx="100" cy="80" rx="44" ry="18" fill="#7C2D12"/>
<path d="M80 76 Q100 72 120 76" stroke="#9B4A2A" stroke-width="2.5" fill="none" opacity="0.45" stroke-linecap="round"/>
<path d="M56 104 Q56 66 100 62 Q144 66 144 104" stroke="#1A1A1A" stroke-width="5.5" fill="none"/>
<rect x="44" y="98" width="20" height="32" rx="8" fill="#1A1A1A"/>
<rect x="136" y="98" width="20" height="32" rx="8" fill="#1A1A1A"/>`,
    // Sara - teal hijab
    `<ellipse cx="100" cy="86" rx="52" ry="36" fill="#0D9488"/>
<ellipse cx="100" cy="122" rx="56" ry="38" fill="#0D9488"/>
<ellipse cx="42" cy="128" rx="15" ry="34" fill="#0F766E"/>
<ellipse cx="158" cy="128" rx="15" ry="34" fill="#0F766E"/>
<ellipse cx="100" cy="88" rx="38" ry="24" fill="#0F766E"/>
<path d="M60 88 Q100 74 140 88" stroke="#14B8A6" stroke-width="2.8" fill="none" opacity="0.5" stroke-linecap="round"/>`,
  ][i]

  const eyes = [
    // Amira - big round eyes
    `<ellipse cx="82" cy="113" rx="10.5" ry="12" fill="white"/><ellipse cx="118" cy="113" rx="10.5" ry="12" fill="white"/>
<circle cx="82.5" cy="113.5" r="7.8" fill="url(#ey)"/><circle cx="118.5" cy="113.5" r="7.8" fill="url(#ey)"/>
<circle cx="83" cy="114" r="4.3" fill="#0A0400"/><circle cx="119" cy="114" r="4.3" fill="#0A0400"/>
<circle cx="79.5" cy="110.5" r="3" fill="white"/><circle cx="115.5" cy="110.5" r="3" fill="white"/>
<circle cx="85.5" cy="116.5" r="1.5" fill="white" opacity="0.5"/><circle cx="121.5" cy="116.5" r="1.5" fill="white" opacity="0.5"/>
<path d="M73 106 Q78 102 83 106" stroke="${hairDark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M107 106 Q112 102 117 106" stroke="${hairDark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M71 104 Q82 100 94 104" stroke="${hairDark}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M106 104 Q118 100 130 104" stroke="${hairDark}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    // Sami - bold brows
    `<ellipse cx="82" cy="113" rx="10.5" ry="12" fill="white"/><ellipse cx="118" cy="113" rx="10.5" ry="12" fill="white"/>
<circle cx="82.5" cy="113.5" r="7.8" fill="url(#ey)"/><circle cx="118.5" cy="113.5" r="7.8" fill="url(#ey)"/>
<circle cx="83" cy="114" r="4.3" fill="#0A0400"/><circle cx="119" cy="114" r="4.3" fill="#0A0400"/>
<circle cx="79.5" cy="110.5" r="3" fill="white"/><circle cx="115.5" cy="110.5" r="3" fill="white"/>
<circle cx="85.5" cy="116.5" r="1.5" fill="white" opacity="0.5"/><circle cx="121.5" cy="116.5" r="1.5" fill="white" opacity="0.5"/>
<path d="M71 104 Q82 99 94 103" stroke="${hairDark}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M106 103 Q118 99 130 104" stroke="${hairDark}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    // Nour - almond eyes with lashes
    `<path d="M65 109 Q83 97 101 109 Q83 121 65 109Z" fill="white"/>
<path d="M99 109 Q117 97 135 109 Q117 121 99 109Z" fill="white"/>
<circle cx="83" cy="109" r="8.2" fill="url(#ey)"/><circle cx="117" cy="109" r="8.2" fill="url(#ey)"/>
<circle cx="83.5" cy="109.5" r="4.6" fill="#0A0400"/><circle cx="117.5" cy="109.5" r="4.6" fill="#0A0400"/>
<circle cx="80" cy="106" r="3.2" fill="white"/><circle cx="114" cy="106" r="3.2" fill="white"/>
<circle cx="86" cy="112" r="1.7" fill="white" opacity="0.45"/><circle cx="120" cy="112" r="1.7" fill="white" opacity="0.45"/>
<line x1="65" y1="106" x2="61" y2="100" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="75" y1="102" x2="73" y2="96" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="91" y1="101" x2="91" y2="95" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="109" y1="101" x2="109" y2="95" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="125" y1="102" x2="125" y2="96" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="135" y1="106" x2="137" y2="100" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>`,
    // Mehdi - glasses + wink
    `<rect x="60" y="101" width="34" height="22" rx="7" fill="none" stroke="#78350F" stroke-width="3"/>
<rect x="106" y="101" width="34" height="22" rx="7" fill="none" stroke="#78350F" stroke-width="3"/>
<line x1="94" y1="112" x2="106" y2="112" stroke="#78350F" stroke-width="3"/>
<line x1="60" y1="112" x2="52" y2="113" stroke="#78350F" stroke-width="3"/>
<line x1="140" y1="112" x2="148" y2="113" stroke="#78350F" stroke-width="3"/>
<ellipse cx="77" cy="112" rx="9" ry="10" fill="white"/>
<circle cx="77.5" cy="112.5" r="6.5" fill="url(#ey)"/>
<circle cx="77.5" cy="113" r="3.7" fill="#0A0400"/>
<circle cx="74.5" cy="109.5" r="2.6" fill="white"/>
<path d="M112 113 Q122 113 132 113" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M66 100 Q79 96 92 100" stroke="#1C1007" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M108 100 Q121 96 134 100" stroke="#1C1007" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // Karim - shield sunglasses
    `<rect x="60" y="105" width="80" height="20" rx="9" fill="#111827" opacity="0.9"/>
<rect x="60" y="105" width="80" height="20" rx="9" fill="none" stroke="#374151" stroke-width="2"/>
<path d="M68 111 Q78 108 88 111" stroke="white" stroke-width="1" fill="none" opacity="0.28" stroke-linecap="round"/>
<path d="M112 111 Q122 108 132 111" stroke="white" stroke-width="1" fill="none" opacity="0.28" stroke-linecap="round"/>`,
    // Rania - soft eyes + lashes
    `<ellipse cx="82" cy="113" rx="10.5" ry="12" fill="white"/><ellipse cx="118" cy="113" rx="10.5" ry="12" fill="white"/>
<circle cx="82.5" cy="113.5" r="7.8" fill="url(#ey)"/><circle cx="118.5" cy="113.5" r="7.8" fill="url(#ey)"/>
<circle cx="83" cy="114" r="4.3" fill="#0A0400"/><circle cx="119" cy="114" r="4.3" fill="#0A0400"/>
<circle cx="79.5" cy="110.5" r="3" fill="white"/><circle cx="115.5" cy="110.5" r="3" fill="white"/>
<circle cx="85.5" cy="116.5" r="1.5" fill="white" opacity="0.5"/><circle cx="121.5" cy="116.5" r="1.5" fill="white" opacity="0.5"/>
<path d="M73 106 Q78 102 83 106" stroke="${hairDark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M107 106 Q112 102 117 106" stroke="${hairDark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M71 104 Q82 100 94 104" stroke="${hairDark}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M106 104 Q118 100 130 104" stroke="${hairDark}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    // Sara - almond eyes + lashes (teal)
    `<path d="M63 109 Q83 96 103 109 Q83 122 63 109Z" fill="white"/>
<path d="M97 109 Q117 96 137 109 Q117 122 97 109Z" fill="white"/>
<circle cx="83" cy="109" r="8.5" fill="url(#ey)"/><circle cx="117" cy="109" r="8.5" fill="url(#ey)"/>
<circle cx="83.5" cy="109.5" r="4.8" fill="#0A0400"/><circle cx="117.5" cy="109.5" r="4.8" fill="#0A0400"/>
<circle cx="80" cy="106" r="3.3" fill="white"/><circle cx="114" cy="106" r="3.3" fill="white"/>
<circle cx="86" cy="112" r="1.8" fill="white" opacity="0.45"/><circle cx="120" cy="112" r="1.8" fill="white" opacity="0.45"/>
<line x1="63" y1="106" x2="59" y2="100" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="73" y1="102" x2="71" y2="96" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="89" y1="101" x2="89" y2="95" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="111" y1="101" x2="111" y2="95" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="127" y1="102" x2="127" y2="96" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>
<line x1="137" y1="106" x2="139" y2="100" stroke="${hairDark}" stroke-width="1.6" stroke-linecap="round"/>`,
  ][i]

  const mouths = [
    `<path d="M75 137 Q100 154 125 137" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M75 137 Q100 152 125 137" fill="white" opacity="0.65"/>`,
    `<path d="M72 139 Q100 160 128 139" stroke="#78350F" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M72 139 Q100 158 128 139" fill="white" opacity="0.75"/>`,
    `<path d="M75 131 Q100 148 125 131" stroke="#B45309" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M75 131 Q100 146 125 131" fill="white" opacity="0.55"/>`,
    `<path d="M72 137 Q100 158 128 137" stroke="#78350F" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M72 137 Q100 156 128 137" fill="white" opacity="0.75"/>`,
    `<path d="M76 142 Q96 155 118 145" stroke="#92400E" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M76 142 Q96 154 118 145" fill="white" opacity="0.5"/>`,
    `<path d="M75 135 Q100 152 125 135" stroke="#B45309" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M75 135 Q100 150 125 135" fill="white" opacity="0.65"/>`,
    `<path d="M75 131 Q100 148 125 131" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M75 131 Q100 146 125 131" fill="white" opacity="0.6"/>`,
  ][i]

  const accessories = [
    `<ellipse cx="56" cy="127" rx="4.5" ry="7" fill="#FCD34D" stroke="#D97706" stroke-width="1.2"/><ellipse cx="144" cy="127" rx="4.5" ry="7" fill="#FCD34D" stroke="#D97706" stroke-width="1.2"/>`,
    `<circle cx="56" cy="124" r="4.5" fill="#FCD34D" stroke="#D97706" stroke-width="1.2"/>`,
    `<ellipse cx="86" cy="76" rx="18" ry="9" fill="#8B5CF6" opacity="0.35"/>`,
    ``,
    `<text x="92" y="79" font-size="7" fill="white" font-weight="bold" font-family="Arial" text-anchor="middle">NY</text>`,
    `<ellipse cx="50" cy="110" rx="3.5" ry="2.5" fill="white" opacity="0.12"/><ellipse cx="144" cy="110" rx="3.5" ry="2.5" fill="white" opacity="0.12"/>`,
    `<ellipse cx="84" cy="76" rx="20" ry="11" fill="#14B8A6" opacity="0.3"/>`,
  ][i]

  const clothing = ['#FF4500','#FF7A3D','#5B21B6','#DC2626','#1D4ED8','#DB2777','#0D9488'][i]

  return buildAvatarSvg(skins.base, skins.mid, skins.shadow, skins.deep, eyeBase, eyeMid, eyeDark, hairDark, '', '', tops, eyes, mouths, accessories, clothing, ROOM_BG[i].bg, ROOM_BG[i].light)
}

const STUDENT_SVGS = Array.from({length:7}, (_,i) => makeStudent(i))
const STUDENT_NAMES = [
  { name:'Amira', emoji:'✨' },
  { name:'Sami', emoji:'🎧' },
  { name:'Nour', emoji:'🌸' },
  { name:'Mehdi', emoji:'🔥' },
  { name:'Karim', emoji:'😎' },
  { name:'Rania', emoji:'🎵' },
  { name:'Sara', emoji:'🧕' },
]

const ANIM_CLASSES = ['anim-bob','anim-think','anim-nod','anim-lean','anim-bob','anim-nod','anim-think']

// ── CEFR BADGE ROW ──────────────────────────────────────────────────────────
function CefrBadges({ isLight, label }: { isLight: boolean, label: string }) {
  const levels = [
    { level:'A1', active:false }, { level:'A2', active:false }, { level:'B1', active:false },
    { level:'B2', active:true },  { level:'C1', active:false }, { level:'C2', active:false },
  ]
  const activeColor = isLight ? '#E03D00' : '#FF4500'
  const inactiveBg = isLight ? '#F0EBE5' : 'rgba(26,26,26,0.8)'
  const inactiveBorder = isLight ? '#DDD0C0' : '#2A1A0A'
  const inactiveText = isLight ? 'rgba(26,26,26,0.3)' : 'rgba(255,240,232,0.25)'
  const activeBg = isLight ? '#FFF0E8' : '#2A1A0A'
  const labelColor = isLight ? 'rgba(26,26,26,0.35)' : 'rgba(255,240,232,0.25)'

  return (
    <div className="inline-flex items-center gap-1 flex-wrap">
      {levels.map((l, i) => (
        <span key={l.level} className="inline-flex items-center gap-1">
          <span
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-[11px] font-black border transition-all ${
              l.active ? 'animate-b2pulse' : ''
            }`}
            style={l.active ? {
              backgroundColor: activeBg,
              borderColor: activeColor,
              color: activeColor,
              borderWidth: '2px',
              boxShadow: `0 0 14px ${activeColor}35, 0 0 28px ${activeColor}12`,
              letterSpacing: '-0.02em'
            } : {
              backgroundColor: inactiveBg,
              borderColor: inactiveBorder,
              color: inactiveText,
              borderWidth: '1px',
              letterSpacing: '-0.02em'
            }}>
            {l.level}
          </span>
          {i < levels.length - 1 && (
            <span className="w-2.5 h-px" style={{backgroundColor: inactiveBorder}}/>
          )}
        </span>
      ))}
      <span className="text-[11px] font-semibold ml-1.5" style={{color: labelColor}}>
        {label}
      </span>
    </div>
  )
}

// ── B2 LOGO ─────────────────────────────────────────────────────────────────
function B2Logo({ className = '', isLight = false }: { className?: string, isLight?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-0 tracking-tight whitespace-nowrap leading-none select-none ${className}`}>
      <span className="font-black animate-b2pulse" style={{
        letterSpacing:'-0.03em',
        color: isLight ? '#E03D00' : '#FF4500',
        textShadow: isLight ? '0 0 12px rgba(224,61,0,0.25), 0 0 24px rgba(224,61,0,0.1)' : '0 0 20px rgba(255,69,0,0.5), 0 0 40px rgba(255,69,0,0.2)'
      }}>B2</span>
      <span className="font-light" style={{letterSpacing:'0.02em', color: isLight ? '#1A1A1A' : 'rgba(255,255,255,0.9)'}}>please</span>
    </span>
  )
}

function useCountdown(target: Date) {
  const [time, setTime] = useState({d:0,h:0,m:0,s:0})
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTime({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)})
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])
  return time
}

type Theme = 'dark' | 'light'

function detectSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function themeStyles(theme: Theme) {
  const dark = theme === 'dark'
  return {
    mainBg: dark ? '#0A0A0A' : '#FFFBF5',
    cardBg: dark ? '#1A1A1A' : '#FFFFFF',
    inputBg: dark ? '#0A0A0A' : '#FFF8F3',
    navBg: dark ? 'rgba(10,10,10,0.9)' : 'rgba(255,251,245,0.9)',
    borderColor: dark ? '#2A1A0A' : '#FFD4C2',
    borderHover: dark ? 'rgba(255,69,0,0.3)' : 'rgba(224,61,0,0.2)',
    textPrimary: dark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: dark ? 'rgba(255,240,232,0.6)' : 'rgba(26,26,26,0.6)',
    textTertiary: dark ? 'rgba(255,240,232,0.4)' : 'rgba(26,26,26,0.4)',
    textOrange: dark ? '#FF4500' : '#E03D00',
    textOrangeLight: dark ? '#FF7A3D' : '#CC3700',
    orangeGlow: dark ? 'rgba(255,69,0,0.25)' : 'rgba(224,61,0,0.15)',
    cardShadow: dark ? '0 8px 25px rgba(255,69,0,0.05)' : '0 8px 25px rgba(224,61,0,0.06)',
    cardShadowHover: dark ? '0 12px 40px rgba(255,69,0,0.1)' : '0 12px 40px rgba(224,61,0,0.1)',
    toggleBg: dark ? '#1A1A1A' : '#FFE8D6',
    pillBg: dark ? '#2A1A0A' : '#FFF0E8',
    pillText: dark ? '#FF4500' : '#E03D00',
    pillBgInactive: dark ? '#1A1A1A' : '#F5F5F5',
    pillTextInactive: dark ? 'rgba(255,240,232,0.4)' : 'rgba(26,26,26,0.35)',
    pillBorderInactive: dark ? '#2A1A0A' : '#E5E0D8',
    countdownBg: dark ? '#0A0A0A' : '#FFF8F3',
    countdownBorder: dark ? '#2A1A0A' : '#FFD4C2',
    chatBg: dark ? '#0A0A0A' : '#FFF8F3',
    chatBorder: dark ? '#2A1A0A' : '#FFD4C2',
    btnSecondaryBg: dark ? '#0A0A0A' : '#FFFFFF',
    btnSecondaryBorder: dark ? '#2A1A0A' : '#FFD4C2',
    btnSecondaryText: dark ? '#FFF0E8' : '#1A1A1A',
    blobOpacity: dark ? '0.06' : '0.04',
  }
}

export default function Home() {
  const [lang, setLang] = useState<'en'|'fr'|'ar'>('en')
  const [theme, setTheme] = useState<Theme>('dark')
  const t = T[lang]
  const isAr = lang === 'ar'
  const s = themeStyles(theme)

  // Auto-detect system theme on mount
  useEffect(() => {
    setTheme(detectSystemTheme())
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'light' : 'dark')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const [charIndex, setCharIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [displayed, setDisplayed] = useState('')
  const words = ['native speaker','confidently','fluently','fearlessly']
  useEffect(() => {
    const word = words[wordIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < word.length) { setDisplayed(word.slice(0,charIndex+1)); setCharIndex(c=>c+1) }
        else setTimeout(()=>setDeleting(true), 2000)
      } else {
        if (charIndex > 0) { setDisplayed(word.slice(0,charIndex-1)); setCharIndex(c=>c-1) }
        else { setDeleting(false); setWordIndex(i=>(i+1)%words.length) }
      }
    }, deleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex])

  const [activeTopicIndex, setActiveTopicIndex] = useState(0)
  const [topicProgress, setTopicProgress] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTopicProgress(p => {
        if (p >= 100) { setActiveTopicIndex(i=>(i+1)%CLASS_TOPICS.length); return 0 }
        return p + 1.5
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const [visibleP, setVisibleP] = useState<number[]>([])
  const [speakingP, setSpeakingP] = useState(0)
  const [chatMsgs, setChatMsgs] = useState<{id:number,text:string,from:string,isDali:boolean}[]>([])
  const chatSnippets = [
    {text:'Will AI replace all jobs eventually?', from:'Mehdi', isDali:false},
    {text:'Say "displace" not "replace" — much stronger! 💡', from:'Dali', isDali:true},
    {text:'AI might displace some roles...', from:'Nour', isDali:false},
    {text:'Perfect — that\'s Band 7+ vocabulary 🔥', from:'Dali', isDali:true},
    {text:'This session is incredible 🙌', from:'Sami', isDali:false},
  ]
  useEffect(() => {
    for (let i=0;i<8;i++) setTimeout(()=>setVisibleP(p=>[...p,i]), i*280)
    const si = setInterval(()=>setSpeakingP(i=>(i+1)%8), 2200)
    chatSnippets.forEach((msg,i) => setTimeout(()=>setChatMsgs(p=>[...p.slice(-3),{id:i,...msg}]), 2000+i*2800))
    return () => clearInterval(si)
  }, [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [activePrice, setActivePrice] = useState<'m'|'y'>('m')
  const [menuOpen, setMenuOpen] = useState(false)
  const revealRefs = useRef<(HTMLDivElement|null)[]>([])

  const nextLive = useRef((() => {
    const d = new Date()
    const days = (5-d.getDay()+7)%7||7
    d.setDate(d.getDate()+days); d.setHours(20,0,0,0); return d
  })()).current
  const countdown = useCountdown(nextLive)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      {threshold:0.1}
    )
    revealRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addRef = (i:number) => (el:HTMLDivElement|null) => { revealRefs.current[i] = el }

  const handleSignup = async () => {
    setLoading(true); setMessage('')
    const {error} = await supabase.auth.signUp({email, password, options:{data:{full_name:name}}})
    if (error) setMessage(error.message)
    else setMessage('Account created! Check your email to confirm.')
    setLoading(false)
  }

  const activeTopic = CLASS_TOPICS[activeTopicIndex]
  const allAvatars = [
    {svg:DALI_SVG, name:'Dali 👨‍🏫', isDali:true, bg:ROOM_BG[0].bg},
    ...STUDENT_SVGS.map((svg,i) => ({
      svg,
      name: `${STUDENT_NAMES[i].name} ${STUDENT_NAMES[i].emoji}`,
      isDali: false,
      bg: ROOM_BG[i].bg
    }))
  ]

  return (
    <main className="min-h-screen font-sans transition-colors duration-300" style={{backgroundColor: s.mainBg}} dir={isAr?'rtl':'ltr'}>
      <style>{`
        @keyframes b2pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.82; }
        }
        .animate-b2pulse { animation: b2pulse 2.5s ease-in-out infinite; }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-thin { animation: cursorBlink 1s step-end infinite; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); }
        .b1 { animation: b1 10s ease-in-out infinite; }
        .b2 { animation: b2 13s ease-in-out infinite; }
        .b3 { animation: b3 8s ease-in-out infinite; }
        @keyframes b1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,20px) scale(1.1);} 66%{transform:translate(-10px,30px) scale(.95);} }
        @keyframes b2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-25px,-20px) scale(1.05);} 66%{transform:translate(15px,-10px) scale(1.1);} }
        @keyframes b3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(20px,-15px) scale(1.15);} }
        .float-word { animation: fw linear infinite; }
        @keyframes fw { 0%,100%{transform:translateY(0) rotate(var(--r));} 50%{transform:translateY(-10px) rotate(var(--r));} }
        .dali-wrap { animation: daliFloat 4s ease-in-out infinite; }
        @keyframes daliFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }
        .speaking-ring { animation: sp 1.2s ease-in-out infinite; }
        @keyframes sp { 0%,100%{box-shadow:0 0 0 0 rgba(255,69,0,.6);} 50%{box-shadow:0 0 0 8px rgba(255,69,0,0);} }
        .anim-bob { animation: avBob 3.5s ease-in-out infinite; }
        @keyframes avBob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }
        .anim-think { animation: avThink 4s ease-in-out infinite; }
        @keyframes avThink { 0%,100%{transform:rotate(0deg) translateY(0);} 30%{transform:rotate(-6deg) translateY(-3px);} 70%{transform:rotate(4deg) translateY(-1px);} }
        .anim-nod { animation: avNod 2.8s ease-in-out infinite; }
        @keyframes avNod { 0%,100%{transform:translateY(0) scaleY(1);} 40%{transform:translateY(-6px) scaleY(1.02);} 80%{transform:translateY(-2px) scaleY(.99);} }
        .anim-lean { animation: avLean 5s ease-in-out infinite; }
        @keyframes avLean { 0%,100%{transform:rotate(0deg);} 35%{transform:rotate(5deg);} 70%{transform:rotate(-3deg);} }
        .anim-participate { animation: avParticipate 1.1s ease-in-out infinite; }
        @keyframes avParticipate { 0%,100%{transform:scale(1) translateY(0);} 50%{transform:scale(1.05) translateY(-4px);} }
        .av-cell { opacity: 0; transform: scale(0); transition: opacity .3s ease, transform .4s cubic-bezier(.34,1.56,.64,1); }
        .av-cell.show { opacity: 1; transform: scale(1); }
        .chat-in { animation: cin .35s ease forwards; }
        @keyframes cin { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:translateY(0);} }
        .progress-fill { transition: width .1s linear; }
        .topic-card { transition: all .25s ease; }
        .topic-card:hover { transform: translateY(-3px); }
        .pkg-card { transition: all .3s ease; }
        .pkg-card:hover { transform: translateY(-4px); }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300" style={{backgroundColor: s.navBg, borderColor: s.borderColor}}>
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 flex-shrink-0">
            <B2Logo className="text-lg md:text-xl" isLight={theme === 'light'} />
          </div>
          <div className="hidden md:flex gap-0.5 items-center">
            {['topics','classes','live','community'].map(item => (
              <a key={item} href={`#${item}`}
                className="px-3 py-2 text-sm rounded-lg transition-all font-medium capitalize"
                style={{color: s.textSecondary}}
                onMouseEnter={e => { e.currentTarget.style.color = s.textOrange; e.currentTarget.style.backgroundColor = s.cardBg }}
                onMouseLeave={e => { e.currentTarget.style.color = s.textSecondary; e.currentTarget.style.backgroundColor = 'transparent' }}>
                {item}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <div className="flex gap-0.5 p-0.5 rounded-lg" style={{backgroundColor: s.toggleBg}}>
              {(['en','fr','ar'] as const).map(l => (
                <button key={l} onClick={()=>setLang(l)}
                  className="px-2.5 py-1 rounded-md text-xs font-bold transition-all"
                  style={lang===l ? {backgroundColor: s.textOrange, color: '#FFFFFF'} : {color: s.textTertiary}}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="px-2.5 py-1.5 rounded-lg text-sm transition-all border"
              style={{backgroundColor: s.toggleBg, borderColor: s.borderColor, color: s.textSecondary}}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap border"
              style={{backgroundColor: s.pillBg, borderColor: s.borderColor, color: s.pillText}}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{backgroundColor: s.textOrange}}/>
              {t.nextLive}: {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
            </a>
            <a href="#signup"
              className="text-white px-4 py-2 rounded-xl active:scale-95 transition-all text-sm font-bold whitespace-nowrap"
              style={{backgroundColor: s.textOrange, textShadow:'0 1px 2px rgba(0,0,0,0.2)', boxShadow: `0 4px 12px ${s.orangeGlow}`}}>
              {t.joinBtn}
            </a>
          </div>
          <button className="md:hidden border px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{borderColor: s.borderColor, color: s.textOrange, backgroundColor: 'transparent'}}
            onClick={()=>setMenuOpen(!menuOpen)}>
            {menuOpen?'✕':'☰'}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-5 py-4 flex flex-col gap-2 border-t" style={{backgroundColor: s.mainBg, borderColor: s.borderColor}}>
            <div className="flex gap-1 mb-2">
              {(['en','fr','ar'] as const).map(l => (
                <button key={l} onClick={()=>{setLang(l);setMenuOpen(false)}}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={lang===l ? {backgroundColor: s.textOrange, color: '#FFFFFF'} : {backgroundColor: s.pillBgInactive, color: s.pillTextInactive}}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => {setTheme(t => t === 'dark' ? 'light' : 'dark'); setMenuOpen(false)}}
              className="text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all border"
              style={{color: s.textSecondary, borderColor: s.borderColor, backgroundColor: s.cardBg}}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            {['topics','classes','live','community'].map(item => (
              <a key={item} href={`#${item}`} onClick={()=>setMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
                style={{color: s.textSecondary, backgroundColor: s.cardBg}}>
                {item}
              </a>
            ))}
            <a href="#signup"
              className="text-white px-4 py-3 rounded-xl text-sm font-bold text-center mt-1"
              style={{backgroundColor: s.textOrange, boxShadow: `0 4px 12px ${s.orangeGlow}`}}>
              {t.joinBtn}
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0" style={{background: `radial-gradient(ellipse at 25% 50%, ${s.textOrange}08 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, ${s.textOrangeLight}06 0%, transparent 50%)`}}/>
        <div className="blob b1 w-96 h-96 absolute -top-20 -left-20" style={{background: s.textOrange, opacity: s.blobOpacity}}/>
        <div className="blob b2 w-80 h-80 absolute -bottom-10 -right-10" style={{background: s.textOrangeLight, opacity: s.blobOpacity}}/>
        <div className="blob b3 w-60 h-60 absolute top-1/2 left-1/3" style={{background: s.textOrangeLight, opacity: s.blobOpacity}}/>
        {[
          {text:'current events 🌍', top:'8%',  left:'58%', r:'-3deg', dur:'4s'},
          {text:'trending 🔥',       top:'14%', left:'74%', r:'2deg',  dur:'5s',   delay:'.5s'},
          {text:'live session 🎙️',  top:'70%', left:'57%', r:'-2deg', dur:'4.5s', delay:'1s'},
          {text:'speak freely 💬',   top:'78%', left:'74%', r:'3deg',  dur:'5.5s', delay:'.3s'},
          {text:'real english 🎯',   top:'48%', left:'56%', r:'-1deg', dur:'6s',   delay:'.8s'},
        ].map((w,i) => (
          <div key={i} className="float-word absolute text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap z-10 hidden lg:block"
            style={{
              top:w.top, left:w.left,
              backgroundColor: s.cardBg,
              border: `1px solid ${s.borderColor}`,
              color: s.textOrangeLight,
              '--r':w.r, animationDuration:w.dur, animationDelay:(w as any).delay||'0s'
            } as React.CSSProperties}>
            {w.text}
          </div>
        ))}
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-4 font-semibold border"
              style={{backgroundColor: s.cardBg, borderColor: s.borderColor, color: s.textOrange}}>
              <span>🇹🇳</span>{t.tagline}
            </div>
            <div className="mb-5">
              <CefrBadges isLight={theme === 'light'} label={t.badgeLabel} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none mb-4" style={{letterSpacing:'-0.03em', color: s.textPrimary}}>
              {t.hero1}<br/>
              {t.hero2}<br/>
              <span style={{color: s.textOrange}}>{displayed}</span>
              <span className="cursor-thin font-light" style={{color: s.textOrange}}>│</span>
            </h1>
            <p className="text-base mb-7 leading-relaxed max-w-md" style={{color: s.textSecondary}}>{t.sub}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <a href="#classes"
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl active:scale-95 transition-all text-sm font-bold whitespace-nowrap"
                style={{backgroundColor: s.textOrange, textShadow:'0 1px 2px rgba(0,0,0,0.2)', boxShadow: `0 4px 15px ${s.orangeGlow}`}}>
                {t.joinBtn} →
              </a>
              <a href="https://www.instagram.com/ielts.tn" target="_blank"
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-xl active:scale-95 transition-all whitespace-nowrap border"
                style={{backgroundColor: s.btnSecondaryBg, borderColor: s.btnSecondaryBorder, color: s.textPrimary}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="6" stroke={s.textOrange} strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke={s.textOrange} strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill={s.textOrange}/>
                </svg>
                {t.dmBtn}
              </a>
            </div>
            <a href="https://wa.me/216XXXXXXXX" target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl active:scale-95 transition-all text-sm font-semibold border"
              style={{backgroundColor: s.btnSecondaryBg, borderColor: s.btnSecondaryBorder, color: s.textOrangeLight}}>
              💬 {t.waBtn}
            </a>
            <div className="mt-7 flex items-center gap-2 flex-wrap">
              {[{n:'500K+',l:'TikTok'},{n:'12K+',l:'students'},{n:'4.9★',l:'rating'},{n:'live',l:'sessions'}].map(stat => (
                <div key={stat.l} className="rounded-xl px-3 py-2 text-center border" style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}>
                  <div className="text-sm font-bold" style={{color: s.textPrimary}}>{stat.n}</div>
                  <div className="text-xs" style={{color: s.textTertiary}}>{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl p-4 border" style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold flex items-center gap-2" style={{color: s.textPrimary}}>
                  <span>{activeTopic.icon}</span><span>{activeTopic.topic}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: s.textOrange}}/>
                  <span className="text-xs font-bold" style={{color: s.textOrange}}>LIVE</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{backgroundColor: s.chatBg}}>
                <div className="progress-fill h-full rounded-full" style={{width:`${topicProgress}%`, background: `linear-gradient(to right, ${s.textOrange}, ${s.textOrangeLight})`}}/>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {CLASS_TOPICS.map((_,i) => (
                    <div key={i} className="h-1 rounded-full transition-all duration-500"
                      style={{width: i===activeTopicIndex ? '24px' : '8px', backgroundColor: i===activeTopicIndex ? s.textOrange : s.borderColor}}/>
                  ))}
                </div>
                <span className="text-xs" style={{color: s.textTertiary}}>{activeTopic.level} · {activeTopic.participants} students</span>
              </div>
            </div>
            <div className="rounded-2xl p-4 border" style={{backgroundColor: s.cardBg, borderColor: s.borderColor, boxShadow: s.cardShadow}}>
              <div className="flex items-center justify-between pb-3 border-b mb-3" style={{borderColor: s.borderColor}}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: s.textOrange}}/>
                  <span className="text-xs font-bold" style={{color: s.textPrimary}}>Live Session — {activeTopic.icon} {activeTopic.topic}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{backgroundColor: s.pillBg, color: s.pillText}}>👥 {activeTopic.participants}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {allAvatars.map((av,i) => (
                  <div key={i}
                    className={`av-cell ${visibleP.includes(i)?'show':''} aspect-square rounded-xl overflow-hidden relative ${
                      av.isDali ? 'dali-wrap' : speakingP === i ? 'anim-participate' : ANIM_CLASSES[i-1] || 'anim-bob'
                    }`}
                    style={{
                      transitionDelay:`${i*0.08}s`,
                      border: speakingP===i ? `2px solid ${s.textOrange}` : `1px solid ${s.borderColor}`,
                      backgroundColor: av.bg
                    }}>
                    <div dangerouslySetInnerHTML={{__html:av.svg}} className="w-full h-full"/>
                    {speakingP === i && (
                      <div className="speaking-ring absolute inset-0 rounded-xl border-2" style={{borderColor: s.textOrange}}/>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 text-center backdrop-blur-sm font-bold py-0.5 truncate px-1"
                      style={{fontSize:'8px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF0E8'}}>
                      {av.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-2.5 min-h-[72px] flex flex-col gap-1.5 border" style={{backgroundColor: s.chatBg, borderColor: s.chatBorder}}>
                <div className="text-xs font-bold mb-0.5" style={{color: s.textTertiary}}>live chat</div>
                {chatMsgs.map(msg => (
                  <div key={msg.id} className="chat-in flex items-start gap-1.5">
                    <span className="text-xs font-bold flex-shrink-0" style={{color: msg.isDali ? s.textOrange : s.textTertiary}}>{msg.from}:</span>
                    <span className="text-xs leading-relaxed" style={{color: s.textSecondary}}>{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2.5 pt-2.5 border-t" style={{borderColor: s.borderColor}}>
                {[{icon:'🎤',l:'mute'},{icon:'📹',l:'video'},{icon:'✋',l:'hand'},{icon:'💬',l:'chat'}].map(c => (
                  <button key={c.l} className="flex flex-col items-center gap-0.5 group">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors border" style={{borderColor: s.borderColor}}>{c.icon}</div>
                    <span className="text-xs" style={{color: s.textTertiary}}>{c.l}</span>
                  </button>
                ))}
                <button className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border"
                  style={{backgroundColor: s.pillBg, color: s.textOrange, borderColor: `${s.textOrange}30`}}>
                  leave
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOPICS ──────────────────────────────────────────── */}
      <section id="topics" ref={addRef(0)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: s.textOrange}}>{t.topicsTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black mb-1" style={{letterSpacing:'-0.02em', color: s.textPrimary}}>{t.topicsH}</h2>
        <p className="text-sm mb-8" style={{color: s.textSecondary}}>{t.topicsSub}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOPICS.map(tp => (
            <div key={tp.en} className="topic-card rounded-2xl px-4 py-5 flex items-center gap-3 cursor-pointer border"
              style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.borderHover; e.currentTarget.style.boxShadow = s.cardShadow }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = s.borderColor; e.currentTarget.style.boxShadow = 'none' }}>
              <span className="text-2xl">{tp.icon}</span>
              <span className="text-sm font-bold" style={{color: s.textPrimary}}>{lang==='ar'?tp.ar:lang==='fr'?tp.fr:tp.en}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section ref={addRef(1)} className="reveal max-w-6xl mx-auto px-6 py-8">
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: s.textOrange}}>{t.howTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black mb-1" style={{letterSpacing:'-0.02em', color: s.textPrimary}}>{t.howH}</h2>
        <p className="text-sm mb-8" style={{color: s.textSecondary}}>{t.howSub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.steps.map(step => (
            <div key={step.n} className="rounded-2xl p-6 transition-all border"
              style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.borderHover }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = s.borderColor }}>
              <div className="text-xs font-bold mb-3" style={{color: `${s.textOrange}40`}}>{step.n}</div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <div className="text-sm font-bold mb-2" style={{color: s.textPrimary}}>{step.t}</div>
              <div className="text-xs leading-relaxed" style={{color: s.textSecondary}}>{step.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────────────────────── */}
      <section id="classes" ref={addRef(2)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: s.textOrange}}>{t.classesTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black mb-1" style={{letterSpacing:'-0.02em', color: s.textPrimary}}>{t.classesH}</h2>
        <p className="text-sm mb-8" style={{color: s.textSecondary}}>{t.classesSub}</p>
        <div className="rounded-3xl p-8 text-center mb-10 relative overflow-hidden border" style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}>
          <div className="absolute inset-0" style={{background: `radial-gradient(ellipse at center, ${s.textOrange}08 0%, transparent 70%)`}}/>
          <div className="flex justify-center gap-3 mb-5 flex-wrap relative z-10">
            {['🗞️','🎙️','🌍','📊','🤖','🏛️','💰','🎬'].map((icon,i) => (
              <div key={i} className="w-11 h-11 rounded-xl flex items-center justify-center text-lg float-word border"
                style={{backgroundColor: s.inputBg, borderColor: s.borderColor, '--r':'0deg', animationDuration:`${3+i*.4}s`, animationDelay:`${i*.15}s`} as React.CSSProperties}>
                {icon}
              </div>
            ))}
          </div>
          <h3 className="text-xl font-black mb-2 relative z-10" style={{letterSpacing:'-0.02em', color: s.textPrimary}}>{t.comingSoon}</h3>
          <p className="text-sm mb-6 max-w-sm mx-auto relative z-10" style={{color: s.textSecondary}}>{t.comingSoonSub}</p>
          <a href="#signup"
            className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl active:scale-95 transition-all text-sm font-bold relative z-10"
            style={{backgroundColor: s.textOrange, textShadow:'0 1px 2px rgba(0,0,0,0.2)', boxShadow: `0 4px 15px ${s.orangeGlow}`}}>
            {t.notifyBtn} →
          </a>
        </div>
        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          {['Free','Starter','Core','Pro','Elite'].map((tier,i) => (
            <div key={tier} className="px-3 py-1 rounded-full text-xs font-bold border transition-all"
              style={i===3 ? {backgroundColor: s.textOrange, color: '#FFFFFF', borderColor: s.textOrange, boxShadow: `0 2px 8px ${s.orangeGlow}`}
                : i===4 ? {backgroundColor: s.pillBg, color: s.textOrangeLight, borderColor: `${s.textOrangeLight}30`}
                : {backgroundColor: s.pillBgInactive, color: s.pillTextInactive, borderColor: s.pillBorderInactive}}>
              {tier}{i===3 && <span className="ml-1">← target B2</span>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.packages.map((pkg) => (
            <div key={pkg.id} className="pkg-card rounded-2xl p-6 relative border"
              style={{
                backgroundColor: s.cardBg,
                borderColor: (pkg as any).popular ? `${s.textOrange}40` : (pkg as any).premium ? `${s.textOrangeLight}30` : s.borderColor,
                boxShadow: (pkg as any).popular ? `0 4px 20px ${s.orangeGlow}` : 'none'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.borderHover; e.currentTarget.style.boxShadow = s.cardShadowHover }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = (pkg as any).popular ? `${s.textOrange}40` : (pkg as any).premium ? `${s.textOrangeLight}30` : s.borderColor; e.currentTarget.style.boxShadow = (pkg as any).popular ? `0 4px 20px ${s.orangeGlow}` : 'none' }}>
              {(pkg as any).popular && (
                <div className="absolute -top-3 left-6 text-white text-xs px-3 py-1 rounded-full font-bold"
                  style={{backgroundColor: s.textOrange, boxShadow: `0 2px 8px ${s.orangeGlow}`}}>most popular</div>
              )}
              {(pkg as any).premium && (
                <div className="absolute -top-3 left-6 text-white text-xs px-3 py-1 rounded-full font-bold"
                  style={{backgroundColor: s.textOrangeLight}}>limited spots</div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border"
                    style={{backgroundColor: s.inputBg, borderColor: s.borderColor}}>{pkg.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-base font-bold" style={{color: s.textPrimary}}>{pkg.name}</div>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{backgroundColor: s.pillBg, color: s.pillText}}>{(pkg as any).tier}</span>
                    </div>
                    <div className="text-xs font-semibold" style={{color: s.textOrangeLight}}>{pkg.tagline}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{color: s.textPrimary}}>${pkg.price[activePrice]}<span className="text-sm font-normal" style={{color: s.textTertiary}}>/mo</span></div>
                  <div className="text-xs font-semibold" style={{color: s.textOrangeLight}}>≈ {pkg.tnd[activePrice]} TND</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{color: s.textSecondary}}>{pkg.desc}</p>
              <div className="grid grid-cols-2 gap-1.5 mb-5">
                {pkg.features.map(f => (
                  <div key={f} className="flex items-start gap-1.5 text-xs" style={{color: s.textSecondary}}>
                    <span className="font-bold mt-0.5 flex-shrink-0" style={{color: s.textOrange}}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="#signup" className="block text-center py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={(pkg as any).popular
                  ? {backgroundColor: s.textOrange, color: '#FFFFFF', textShadow:'0 1px 2px rgba(0,0,0,0.2)', boxShadow: `0 4px 12px ${s.orangeGlow}`}
                  : (pkg as any).premium
                  ? {backgroundColor: s.pillBg, color: s.textOrangeLight, border: `1px solid ${s.textOrangeLight}30`}
                  : {backgroundColor: s.btnSecondaryBg, color: s.btnSecondaryText, border: `1px solid ${s.btnSecondaryBorder}`}}>
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="text-sm" style={{color: s.textSecondary}}>{t.monthly}</span>
          <button onClick={()=>setActivePrice(p=>p==='m'?'y':'m')}
            className="w-12 h-6 rounded-full transition-colors relative"
            style={{backgroundColor: activePrice==='y' ? s.textOrange : s.borderColor}}>
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
              style={{left: activePrice==='y' ? '24px' : '2px'}}/>
          </button>
          <span className="text-sm font-semibold" style={{color: activePrice==='y' ? s.textOrange : s.textSecondary}}>{t.yearly}</span>
        </div>
        <p className="text-xs text-center mt-4" style={{color: s.textTertiary}}>
          {t.notSure} <a href="https://wa.me/216XXXXXXXX" target="_blank" className="font-bold hover:underline" style={{color: s.textOrangeLight}}>{t.waLink}</a>
        </p>
      </section>

      {/* ── LIVE ────────────────────────────────────────────── */}
      <section id="live" ref={addRef(3)} className="reveal max-w-6xl mx-auto px-6 py-8">
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: s.textOrange}}>{t.liveTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black mb-1" style={{letterSpacing:'-0.02em', color: s.textPrimary}}>{t.liveH}</h2>
        <p className="text-sm mb-6" style={{color: s.textSecondary}}>{t.liveSub}</p>
        <div className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border" style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{background: `linear-gradient(135deg, ${s.textOrange}, ${s.textOrangeLight})`, boxShadow: `0 4px 12px ${s.orangeGlow}`}}>🎙️</div>
            <div>
              <div className="text-sm font-bold" style={{color: s.textPrimary}}>friday live session</div>
              <div className="text-xs mt-0.5" style={{color: s.textSecondary}}>every week · 8:00 PM Tunisia time</div>
              <div className="text-xs font-bold mt-1" style={{color: s.textOrange}}>TikTok Live & Instagram Live</div>
            </div>
          </div>
          <div className="flex gap-2">
            {[{v:countdown.d,l:t.days},{v:countdown.h,l:t.hours},{v:countdown.m,l:t.min},{v:countdown.s,l:t.sec}].map(ct => (
              <div key={ct.l} className="rounded-xl px-3 py-2 min-w-[52px] text-center border"
                style={{backgroundColor: s.countdownBg, borderColor: s.countdownBorder}}>
                <div className="text-lg font-black" style={{color: s.textOrange}}>{String(ct.v).padStart(2,'0')}</div>
                <div className="text-xs" style={{color: s.textTertiary}}>{ct.l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all border"
              style={{color: s.textPrimary, borderColor: s.btnSecondaryBorder, backgroundColor: s.btnSecondaryBg}}>🎵 tiktok</a>
            <a href="https://www.instagram.com/ielts.tn" target="_blank"
              className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all"
              style={{background: 'linear-gradient(135deg,#FF4500,#FF5722,#FF7A3D)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg> instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ───────────────────────────────────────── */}
      <section id="community" ref={addRef(4)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: s.textOrange}}>{t.communityTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black mb-1" style={{letterSpacing:'-0.02em', color: s.textPrimary}}>{t.communityH}</h2>
        <p className="text-sm mb-6" style={{color: s.textSecondary}}>{t.communitySub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {href:'https://www.instagram.com/ielts.tn', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>, label:'instagram', sub:'DM @ielts.tn', style:{background:'linear-gradient(135deg,#FF4500,#FF5722,#FF7A3D)'}},
            {href:'https://wa.me/216XXXXXXXX', icon:'💬', label:'whatsapp', sub:'message directly', style:{background:'#FF4500'}},
            {href:'https://www.tiktok.com/@ielts.tn', icon:'🎵', label:'tiktok', sub:'@ielts.tn · 500K+', style:{background: s.inputBg, border: `1px solid ${s.borderColor}`}},
          ].map((social,i) => (
            <a key={i} href={social.href} target="_blank"
              className="flex items-center gap-4 rounded-2xl p-5 transition-all group border"
              style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.borderHover; e.currentTarget.style.boxShadow = s.cardShadow }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = s.borderColor; e.currentTarget.style.boxShadow = 'none' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={social.style}>{social.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-bold" style={{color: s.textPrimary}}>{social.label}</div>
                <div className="text-xs mt-0.5" style={{color: s.textTertiary}}>{social.sub}</div>
              </div>
              <span className="transition-transform group-hover:translate-x-1" style={{color: s.textOrange}}>↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── SIGNUP ──────────────────────────────────────────── */}
      <section id="signup" ref={addRef(5)} className="reveal py-16 px-6">
        <div className="max-w-6xl mx-auto rounded-3xl p-8 md:p-12 relative overflow-hidden border" style={{backgroundColor: s.cardBg, borderColor: s.borderColor}}>
          <div className="absolute inset-0" style={{background: `radial-gradient(ellipse at center, ${s.textOrange}06 0%, transparent 70%)`}}/>
          <div className="max-w-sm mx-auto relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{color: s.textOrange}}>{t.signupTag}</div>
            <h2 className="text-2xl font-black mb-1 text-center" style={{letterSpacing:'-0.02em', color: s.textPrimary}}>{t.signupH}</h2>
            <p className="text-sm text-center mb-8" style={{color: s.textSecondary}}>{t.signupSub}</p>
            <div className="rounded-2xl p-6 flex flex-col gap-3 border" style={{backgroundColor: s.inputBg, borderColor: s.borderColor}}>
              <input type="text" placeholder={t.namePH} value={name} onChange={e=>setName(e.target.value)}
                className="border rounded-xl px-4 py-3 text-sm w-full transition-all focus:outline-none"
                style={{backgroundColor: s.inputBg, borderColor: s.borderColor, color: s.textPrimary}}
                onFocus={e => { e.currentTarget.style.borderColor = s.textOrange; e.currentTarget.style.boxShadow = `0 0 0 3px ${s.textOrange}15` }}
                onBlur={e => { e.currentTarget.style.borderColor = s.borderColor; e.currentTarget.style.boxShadow = 'none' }}/>
              <input type="email" placeholder={t.emailPH} value={email} onChange={e=>setEmail(e.target.value)}
                className="border rounded-xl px-4 py-3 text-sm w-full transition-all focus:outline-none"
                style={{backgroundColor: s.inputBg, borderColor: s.borderColor, color: s.textPrimary}}
                onFocus={e => { e.currentTarget.style.borderColor = s.textOrange; e.currentTarget.style.boxShadow = `0 0 0 3px ${s.textOrange}15` }}
                onBlur={e => { e.currentTarget.style.borderColor = s.borderColor; e.currentTarget.style.boxShadow = 'none' }}/>
              <input type="password" placeholder={t.passPH} value={password} onChange={e=>setPassword(e.target.value)}
                className="border rounded-xl px-4 py-3 text-sm w-full transition-all focus:outline-none"
                style={{backgroundColor: s.inputBg, borderColor: s.borderColor, color: s.textPrimary}}
                onFocus={e => { e.currentTarget.style.borderColor = s.textOrange; e.currentTarget.style.boxShadow = `0 0 0 3px ${s.textOrange}15` }}
                onBlur={e => { e.currentTarget.style.borderColor = s.borderColor; e.currentTarget.style.boxShadow = 'none' }}/>
              {message && <p className="text-sm text-center font-semibold" style={{color: s.textOrangeLight}}>{message}</p>}
              <button onClick={handleSignup} disabled={loading}
                className="text-white py-3 rounded-xl text-sm font-bold active:scale-95 transition-all disabled:opacity-50"
                style={{backgroundColor: s.textOrange, textShadow:'0 1px 2px rgba(0,0,0,0.2)', boxShadow: `0 4px 15px ${s.orangeGlow}`}}>
                {loading ? t.creating : t.signupBtn2}
              </button>
              <p className="text-xs text-center" style={{color: s.textTertiary}}>
                {t.loginQ} <a href="/login" className="font-bold hover:underline" style={{color: s.textOrange}}>{t.loginLink}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-8" style={{borderColor: s.borderColor}}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <B2Logo className="text-sm" isLight={theme === 'light'} />
          <div className="flex gap-5 text-sm flex-wrap justify-center" style={{color: s.textTertiary}}>
            {['privacy','terms','tiktok ↗','instagram ↗'].map((link,i) => (
              <a key={link} href={i<2?'#':i===2?'https://www.tiktok.com/@ielts.tn':'https://www.instagram.com/ielts.tn'} target={i>=2?'_blank':undefined}
                className="transition-colors" style={{color: s.textTertiary}}
                onMouseEnter={e=>e.currentTarget.style.color=s.textOrange}
                onMouseLeave={e=>e.currentTarget.style.color=s.textTertiary}>{link}</a>
            ))}
          </div>
          <div className="text-xs" style={{color: `${s.textPrimary}20`}}>© 2026 B2Please</div>
        </div>
      </footer>

      <a href="https://wa.me/216XXXXXXXX" target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all"
        style={{backgroundColor: '#FF4500', boxShadow: `0 4px 20px ${s.orangeGlow}`}}>
        💬
      </a>
    </main>
  )
}