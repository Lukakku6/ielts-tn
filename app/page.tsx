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
    joinBtn: 'join the queue',
    dmBtn: 'DM on instagram',
    waBtn: 'chat on whatsapp',
    topicsTag: 'what we discuss',
    topicsH: 'real topics. real english.',
    topicsSub: 'every class is built around something happening in the world right now',
    howTag: 'how it works',
    howH: 'join, speak, level up',
    howSub: 'three steps — no textbooks needed',
    steps: [
      { n:'01', icon:'🎯', t:'pick your class', d:'Browse live sessions by topic. Current events, finance, culture — pick what you care about and queue up.' },
      { n:'02', icon:'🎙️', t:'join & speak', d:"Join the live session. Dali leads the conversation in English, you participate, ask questions, make mistakes — that's the point." },
      { n:'03', icon:'🚀', t:'track your level', d:'See your vocabulary grow, get personalised feedback after each class, and watch your proficiency climb week by week.' },
    ],
    classesTag: 'live sessions',
    classesH: 'pick your tier',
    classesSub: 'structured progression designed around what you actually need',
    comingSoon: 'First sessions launching soon',
    comingSoonSub: 'Join now and be the first in queue. Early members get their first session free.',
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
    packages: [
      { id:'ielts', icon:'🏆', name:'IELTS Prep', tagline:'Band 7+ target', desc:'Intensive live sessions focused on all four IELTS skills — speaking, writing, reading, listening — taught through real exam topics.', price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 live sessions/month','Speaking mock tests','Writing task corrections','Exam vocabulary deep-dives','Personal score tracking'], cta:'start IELTS prep', accent:'#FF4500', popular:true, tier:'Pro' },
      { id:'comms', icon:'💬', name:'Communication', tagline:'Sound natural', desc:'Weekly live discussions on trending topics — current events, culture, tech, finance. Build confidence and fluency through real conversation.', price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 live discussions/month','Topic vocabulary sheets','Pronunciation coaching','Weekly news breakdown','Replay access'], cta:'join conversations', accent:'#FF7A3D', tier:'Starter' },
      { id:'business', icon:'💼', name:'Business English', tagline:'Career accelerator', desc:'Live sessions built around real workplace situations — presentations, negotiations, emails, interviews. For professionals who need English at work.', price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 live sessions/month','CV & interview practice','Presentation coaching','Business vocabulary','LinkedIn profile review'], cta:'grow professionally', accent:'#FF8C69', tier:'Core' },
      { id:'1on1', icon:'🎓', name:'1-on-1 with Dali', tagline:'Personal coaching', desc:'Private sessions with Dali. Custom curriculum, direct feedback, and the fastest path to B2 and beyond. Limited spots available each month.', price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 private sessions/month','Custom study plan','Unlimited WhatsApp access','Priority queuing','Certificate on completion'], cta:'book private sessions', accent:'#FF5722', premium:true, tier:'Elite' },
    ],
  },
  fr: {
    tagline: "conçu pour les apprenants tunisiens",
    hero1: "arrête de bachoter.",
    hero2: "commence à parler",
    sub: "Des cours en ligne en direct avec Prof. Dali — apprends l'anglais à travers de vraies conversations sur l'actualité, la culture et les tendances du moment.",
    joinBtn: "rejoindre la file", dmBtn: "DM sur instagram", waBtn: "écrire sur whatsapp",
    topicsTag: "ce qu'on discute", topicsH: "vrais sujets. vrai anglais.", topicsSub: "chaque cours est ancré dans l'actualité mondiale du moment",
    howTag: "comment ça marche", howH: "rejoins, parle, progresse", howSub: "trois étapes — sans manuel scolaire",
    steps: [
      { n:'01', icon:'🎯', t:'choisis ton cours', d:"Parcours les sessions en direct par thème. Actualité, finance, culture — choisis ce qui t'intéresse et mets-toi en file." },
      { n:'02', icon:'🎙️', t:'rejoins & parle', d:"Intègre la session en direct. Dali anime la conversation en anglais, tu participes, tu poses des questions, tu fais des erreurs — c'est ça l'idée." },
      { n:'03', icon:'🚀', t:'suis ton niveau', d:"Vois ton vocabulaire s'élargir, reçois des retours personnalisés après chaque cours et observe ton niveau grimper semaine après semaine." },
    ],
    classesTag: "sessions en direct", classesH: "choisis ton tier", classesSub: "une progression structurée autour de tes besoins réels",
    comingSoon: "Premières sessions bientôt disponibles", comingSoonSub: "Inscris-toi maintenant et sois le premier dans la file. Les premiers membres obtiennent leur première session gratuite.",
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
    packages: [
      { id:'ielts', icon:'🏆', name:'Prépa IELTS', tagline:'Objectif Band 7+', desc:"Sessions en direct intensives sur les quatre compétences IELTS enseignés à travers de vrais sujets d'examen.", price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 sessions/mois','Tests oraux simulés','Corrections écrites','Vocabulaire examen','Suivi de score'], cta:'commencer la prépa', accent:'#FF4500', popular:true, tier:'Pro' },
      { id:'comms', icon:'💬', name:'Communication', tagline:'Parle naturellement', desc:"Discussions en direct hebdomadaires sur les sujets d'actualité — culture, tech, finance.", price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 discussions/mois','Fiches vocabulaire','Coaching prononciation',"Décryptage actualité",'Accès replays'], cta:'rejoindre les discussions', accent:'#FF7A3D', tier:'Starter' },
      { id:'business', icon:'💼', name:'Anglais Pro', tagline:"Boost carrière", desc:"Sessions en direct autour de situations professionnelles réelles — présentations, négociations, entretiens.", price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 sessions/mois','Prépa CV et entretiens','Coaching présentation','Vocabulaire pro','Revue LinkedIn'], cta:'progresser pro', accent:'#FF8C69', tier:'Core' },
      { id:'1on1', icon:'🎓', name:'1-pour-1 avec Dali', tagline:'Coaching personnel', desc:"Sessions privées avec Dali. Programme sur mesure, retours directs. Places limitées chaque mois.", price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 sessions privées/mois',"Plan d'étude personnalisé",'Accès WhatsApp illimité','File prioritaire','Certificat'], cta:'réserver sessions privées', accent:'#FF5722', premium:true, tier:'Elite' },
    ],
  },
  ar: {
    tagline: 'مصمّم للمتعلّمين التونسيين',
    hero1: 'توقّف عن الحفظ.',
    hero2: 'ابدأ تتكلّم',
    sub: 'دروس مباشرة أونلاين مع الأستاذ دالي — تعلّم الإنجليزية من خلال نقاشات حقيقية حول الأحداث الراهنة والثقافة والتريندات.',
    joinBtn: 'انضم للطابور', dmBtn: 'راسلنا على انستغرام', waBtn: 'تحدّث على واتساب',
    topicsTag: 'شنو نحكيو فيه', topicsH: 'مواضيع حقيقية. إنجليزية حقيقية.', topicsSub: 'كل درس مبني على شيء يصير في العالم هذا الوقت',
    howTag: 'كيفاش يخدم', howH: 'انضم، تكلّم، ارتقي', howSub: 'ثلاث خطوات — بلا كتب ولا حفظ',
    steps: [
      { n:'٠١', icon:'🎯', t:'اختار درسك', d:'شوف الجلسات المباشرة حسب الموضوع. أحداث راهنة، فلوس، ثقافة — اختار اللي يهمّك وانضم للطابور.' },
      { n:'٠٢', icon:'🎙️', t:'انضم وتكلّم', d:'ادخل الجلسة المباشرة. الأستاذ دالي يقود النقاش بالإنجليزية، أنت تشارك وتسأل وتغلط — هذا هو المطلوب.' },
      { n:'٠٣', icon:'🚀', t:'تابع مستواك', d:'شوف كيف تتوسّع مفرداتك، خذ ملاحظات شخصية بعد كل جلسة، وراقب مستواك يصعد أسبوع بأسبوع.' },
    ],
    classesTag: 'الجلسات المباشرة', classesH: 'اختار مستواك', classesSub: 'تقدّم مهيكل حسب احتياجاتك الحقيقية',
    comingSoon: 'أوّل الجلسات قريبًا', comingSoonSub: 'سجّل هالوقت وكن أوّل من يدخل الطابور. الأعضاء الأوائل يأخذون أوّل جلسة مجّانًا.',
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
    packages: [
      { id:'ielts', icon:'🏆', name:'تحضير IELTS', tagline:'هدف Band 7+', desc:'جلسات مباشرة مكثّفة على المهارات الأربع من خلال مواضيع الامتحان الحقيقية.', price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 جلسات/شهر','اختبارات تحدّث تجريبية','تصحيح التعبير الكتابي','مفردات الامتحان','متابعة النقاط'], cta:'ابدأ تحضير IELTS', accent:'#FF4500', popular:true, tier:'Pro' },
      { id:'comms', icon:'💬', name:'مهارات التواصل', tagline:'تكلّم بطبيعة', desc:'نقاشات مباشرة أسبوعية حول أبرز المواضيع — أحداث راهنة، ثقافة، تكنولوجيا، اقتصاد.', price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 نقاشات/شهر','قوائم مفردات الموضوع','تدريب على النطق','شرح أخبار الأسبوع','الوصول للتسجيلات'], cta:'انضم للنقاشات', accent:'#FF7A3D', tier:'Starter' },
      { id:'business', icon:'💼', name:'الإنجليزية المهنية', tagline:'مسرّع مهني', desc:'جلسات مباشرة حول مواقف مهنية حقيقية — عروض تقديمية، مفاوضات، مقابلات عمل.', price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 جلسات/شهر','تحضير السيرة والمقابلات','تدريب على العروض','مفردات مهنية','مراجعة LinkedIn'], cta:'تطوّر مهنيًا', accent:'#FF8C69', tier:'Core' },
      { id:'1on1', icon:'🎓', name:'جلسات فردية مع دالي', tagline:'تدريب شخصي', desc:'جلسات خاصة مع الأستاذ دالي. منهج مخصّص، ملاحظات مباشرة. أماكن محدودة كل شهر.', price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 جلسات خاصة/شهر','خطة دراسية مخصّصة','وصول واتساب غير محدود','طابور أولوية','شهادة إتمام'], cta:'احجز جلسات خاصة', accent:'#FF5722', premium:true, tier:'Elite' },
    ],
  },
}

const TOPICS = [
  { icon:'🌍', en:'World Events', fr:'Actualité Mondiale', ar:'أحداث العالم', color:'orange' },
  { icon:'📰', en:'Breaking News', fr:'Actualités', ar:'أخبار عاجلة', color:'orange' },
  { icon:'🎬', en:'Pop Culture', fr:'Culture Pop', ar:'الثقافة الشعبية', color:'orange' },
  { icon:'💰', en:'Finance & Markets', fr:'Finance & Marchés', ar:'المال والأسواق', color:'orange' },
  { icon:'🤖', en:'Tech & AI', fr:'Tech & IA', ar:'التكنولوجيا والذكاء الاصطناعي', color:'orange' },
  { icon:'🏆', en:'Sports', fr:'Sport', ar:'الرياضة', color:'orange' },
  { icon:'🎵', en:'Music & Entertainment', fr:'Musique & Divertissement', ar:'الموسيقى والترفيه', color:'orange' },
  { icon:'🌐', en:'Social Trends', fr:'Tendances Sociales', ar:'الاتجاهات الاجتماعية', color:'orange' },
]

const CLASS_TOPICS = [
  { topic:'AI & The Future of Work', icon:'🤖', participants:8, level:'B2–C1' },
  { topic:'The US Elections 2024',   icon:'🗳️', participants:12, level:'B1–B2' },
  { topic:'Climate Change Debate',   icon:'🌱', participants:6,  level:'B2–C1' },
  { topic:'Social Media & Society',  icon:'📱', participants:10, level:'B1–B2' },
]

// ── MEMOJI-STYLE SVG AVATARS (dark themed) ────────────────────────────────────

const DALI_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgDali" cx="50%" cy="0%" r="100%">
    <stop offset="0%" stop-color="#2A1A0A"/>
    <stop offset="100%" stop-color="#0A0A0A"/>
  </radialGradient>
  <radialGradient id="skinDali" cx="42%" cy="32%" r="62%">
    <stop offset="0%" stop-color="#FFE8CC"/>
    <stop offset="40%" stop-color="#FACA8A"/>
    <stop offset="100%" stop-color="#E8965A"/>
  </radialGradient>
  <radialGradient id="eyeDali" cx="30%" cy="25%" r="75%">
    <stop offset="0%" stop-color="#7B4E2D"/>
    <stop offset="100%" stop-color="#2D1200"/>
  </radialGradient>
  <radialGradient id="boardGrad" cx="50%" cy="50%" r="60%">
    <stop offset="0%" stop-color="#1A1A1A"/>
    <stop offset="100%" stop-color="#0A0A0A"/>
  </radialGradient>
  <filter id="faceShad" x="-15%" y="-15%" width="130%" height="130%">
    <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.15"/>
  </filter>
  <filter id="boardShad" x="-5%" y="-5%" width="110%" height="110%">
    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#FF4500" flood-opacity="0.1"/>
  </filter>
</defs>
<rect width="200" height="200" fill="url(#bgDali)" rx="18"/>
<rect x="8" y="12" width="105" height="68" rx="7" fill="url(#boardGrad)" filter="url(#boardShad)"/>
<rect x="8" y="12" width="105" height="68" rx="7" fill="none" stroke="#FF4500" stroke-width="1.8" opacity="0.5"/>
<text x="16" y="32" font-size="8.5" fill="#FF7A3D" font-family="monospace" font-weight="bold">displace ≠ replace</text>
<line x1="16" y1="42" x2="82" y2="42" stroke="#FF4500" stroke-width="1.5" stroke-linecap="round"/>
<text x="16" y="53" font-size="7.5" fill="#FF8C69" font-family="monospace">→ "AI may displace</text>
<text x="16" y="63" font-size="7.5" fill="#FF8C69" font-family="monospace">   some roles..."</text>
<line x1="16" y1="70" x2="60" y2="70" stroke="#FF4500" stroke-width="1" stroke-linecap="round" opacity=".3"/>
<rect x="88" y="72" width="16" height="6" rx="2" fill="#1A1A1A"/>
<g id="dali-arm">
  <animateTransform attributeName="transform" type="rotate"
    values="0 148 108;-11 148 108;7 148 108;-5 148 108;0 148 108"
    keyTimes="0;0.25;0.5;0.75;1" dur="3s" repeatCount="indefinite"/>
  <line x1="148" y1="108" x2="108" y2="58" stroke="#E8965A" stroke-width="5" stroke-linecap="round"/>
  <line x1="148" y1="108" x2="108" y2="58" stroke="#FACA8A" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
  <circle cx="108" cy="58" r="4.5" fill="#FF4500"/>
  <circle cx="108" cy="58" r="2" fill="white" opacity=".7"/>
  <ellipse cx="152" cy="112" rx="9" ry="7" fill="#FACA8A"/>
  <ellipse cx="155" cy="110" rx="4" ry="3" fill="#FFE8CC"/>
</g>
<rect x="88" y="147" width="24" height="18" rx="5" fill="#FACA8A"/>
<rect x="88" y="150" width="24" height="8" rx="3" fill="#E8965A" opacity=".3"/>
<ellipse cx="100" cy="115" rx="42" ry="44" fill="url(#skinDali)" filter="url(#faceShad)"/>
<ellipse cx="58" cy="115" rx="7" ry="10" fill="#E8965A"/>
<ellipse cx="59" cy="115" rx="4" ry="6" fill="#D4814A"/>
<ellipse cx="142" cy="115" rx="7" ry="10" fill="#E8965A"/>
<ellipse cx="141" cy="115" rx="4" ry="6" fill="#D4814A"/>
<path d="M58 100 Q60 68 100 65 Q140 68 142 100 Q138 78 100 74 Q62 78 58 100Z" fill="#2D1E0F"/>
<ellipse cx="100" cy="74" rx="36" ry="14" fill="#2D1E0F"/>
<path d="M72 70 Q88 66 104 68" stroke="#4A3520" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
<path d="M78 67 Q92 63 106 65" stroke="#5C4433" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>
<ellipse cx="60" cy="98" rx="8" ry="18" fill="#2D1E0F"/>
<ellipse cx="140" cy="98" rx="8" ry="18" fill="#2D1E0F"/>
<path d="M72 101 Q82 97 92 100" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M108 100 Q118 97 128 101" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<ellipse cx="82" cy="112" rx="10" ry="11" fill="white"/>
<ellipse cx="118" cy="112" rx="10" ry="11" fill="white"/>
<circle cx="82.5" cy="112.5" r="7.5" fill="url(#eyeDali)"/>
<circle cx="118.5" cy="112.5" r="7.5" fill="url(#eyeDali)"/>
<circle cx="83" cy="113" r="4" fill="#0D0600"/>
<circle cx="119" cy="113" r="4" fill="#0D0600"/>
<circle cx="79.5" cy="109.5" r="3" fill="white"/>
<circle cx="115.5" cy="109.5" r="3" fill="white"/>
<circle cx="85" cy="115" r="1.5" fill="white" opacity=".6"/>
<circle cx="121" cy="115" r="1.5" fill="white" opacity=".6"/>
<path d="M96 122 Q100 129 104 122" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="100" cy="124" rx="7" ry="3" fill="#D4814A" opacity=".2"/>
<path d="M82 133 Q90 128 100 130 Q110 128 118 133" stroke="#1C1007" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<path d="M82 133 Q90 130 100 132 Q110 130 118 133" fill="#2D1E0F" stroke="#2D1E0F" stroke-width="1"/>
<path d="M78 140 Q100 158 122 140" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M80 140 Q100 155 120 140" fill="white"/>
<path d="M73 136 Q70 140 72 145" stroke="#C87940" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5"/>
<path d="M127 136 Q130 140 128 145" stroke="#C87940" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5"/>
<ellipse cx="68" cy="128" rx="10" ry="6" fill="#FF8C69" opacity=".22"/>
<ellipse cx="132" cy="128" rx="10" ry="6" fill="#FF8C69" opacity=".22"/>
<path d="M70 168 L86 158 L100 165 L114 158 L130 168" fill="#FF4500" stroke="#FF5722" stroke-width="1"/>
<ellipse cx="100" cy="185" rx="42" ry="22" fill="#FF4500"/>
<path d="M86 158 L100 168 L114 158" fill="#FF5722" opacity=".6"/>
<line x1="100" y1="165" x2="100" y2="188" stroke="#FF5722" stroke-width="1.5" opacity=".5"/>
<circle cx="100" cy="170" r="2" fill="#2A1A0A"/>
<circle cx="100" cy="178" r="2" fill="#2A1A0A"/>
</svg>`

const AVATARS = [
  {
    name: 'Amira',
    emoji: '✨',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA1" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FF4500"/><stop offset="100%" stop-color="#1A1A1A"/></radialGradient>
  <radialGradient id="skA1" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA1" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#2D0E00"/></radialGradient>
  <filter id="fA1" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.1"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA1)" rx="18"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA1)" filter="url(#fA1)"/>
<ellipse cx="54" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<ellipse cx="146" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<ellipse cx="100" cy="90" rx="50" ry="30" fill="#1C0E06"/>
<circle cx="62" cy="75" r="20" fill="#1C0E06"/>
<circle cx="62" cy="75" r="13" fill="#FF4500"/>
<circle cx="62" cy="75" r="8" fill="#FF5722"/>
<circle cx="62" cy="75" r="4" fill="#CC3700"/>
<circle cx="138" cy="75" r="20" fill="#1C0E06"/>
<circle cx="138" cy="75" r="13" fill="#FF4500"/>
<circle cx="138" cy="75" r="8" fill="#FF5722"/>
<circle cx="138" cy="75" r="4" fill="#CC3700"/>
<path d="M72 82 Q100 72 128 82" stroke="#1C0E06" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="54" cy="130" rx="5" ry="7" fill="#FFD4C2" stroke="#FF4500" stroke-width="1.5"/>
<ellipse cx="146" cy="130" rx="5" ry="7" fill="#FFD4C2" stroke="#FF4500" stroke-width="1.5"/>
<ellipse cx="84" cy="114" rx="12" ry="13" fill="white"/>
<ellipse cx="116" cy="114" rx="12" ry="13" fill="white"/>
<circle cx="84.5" cy="114.5" r="9" fill="url(#eyA1)"/>
<circle cx="116.5" cy="114.5" r="9" fill="url(#eyA1)"/>
<circle cx="85" cy="115" r="5" fill="#0A0400"/>
<circle cx="117" cy="115" r="5" fill="#0A0400"/>
<circle cx="81" cy="111" r="3.5" fill="white"/>
<circle cx="113" cy="111" r="3.5" fill="white"/>
<circle cx="87" cy="117" r="1.8" fill="white" opacity=".55"/>
<circle cx="119" cy="117" r="1.8" fill="white" opacity=".55"/>
<path d="M74 107 Q79 103 84 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M106 107 Q111 103 116 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M72 107 Q84 103 96 107" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M104 107 Q116 103 128 107" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M96 126 Q100 132 104 126" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="70" cy="128" rx="12" ry="7" fill="#FF8C69" opacity=".35"/>
<ellipse cx="130" cy="128" rx="12" ry="7" fill="#FF8C69" opacity=".35"/>
<path d="M76 138 Q100 158 124 138" stroke="#B45309" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 138 Q100 156 124 138" fill="white" opacity=".75"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#FF4500"/>
</svg>`,
  },
  {
    name: 'Sami',
    emoji: '🎧',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA2" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FF7A3D"/><stop offset="100%" stop-color="#1A1A1A"/></radialGradient>
  <radialGradient id="skA2" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE4A0"/><stop offset="40%" stop-color="#FBBF7A"/><stop offset="100%" stop-color="#D4800A"/></radialGradient>
  <radialGradient id="eyA2" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA2" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.1"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA2)" rx="18"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA2)" filter="url(#fA2)"/>
<ellipse cx="54" cy="118" rx="7" ry="10" fill="#D4800A"/>
<ellipse cx="146" cy="118" rx="7" ry="10" fill="#D4800A"/>
<path d="M54 104 Q56 72 100 68 Q144 72 146 104 Q140 80 100 76 Q60 80 54 104Z" fill="#1C0E06"/>
<rect x="54" y="100" width="92" height="14" rx="4" fill="#1C0E06"/>
<rect x="54" y="112" width="14" height="18" rx="4" fill="#2D1E0F" opacity=".75"/>
<rect x="132" y="112" width="14" height="18" rx="4" fill="#2D1E0F" opacity=".75"/>
<circle cx="54" cy="126" r="5" fill="#FFD4C2" stroke="#FF4500" stroke-width="1.5"/>
<ellipse cx="84" cy="114" rx="12" ry="13" fill="white"/>
<ellipse cx="116" cy="114" rx="12" ry="13" fill="white"/>
<circle cx="84.5" cy="114.5" r="9" fill="url(#eyA2)"/>
<circle cx="116.5" cy="114.5" r="9" fill="url(#eyA2)"/>
<circle cx="85" cy="115" r="5" fill="#0A0400"/>
<circle cx="117" cy="115" r="5" fill="#0A0400"/>
<circle cx="81" cy="111" r="3.5" fill="white"/>
<circle cx="113" cy="111" r="3.5" fill="white"/>
<circle cx="87" cy="117" r="1.8" fill="white" opacity=".55"/>
<circle cx="119" cy="117" r="1.8" fill="white" opacity=".55"/>
<path d="M72 106 Q84 101 96 105" stroke="#1C0E06" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<path d="M104 105 Q116 101 128 106" stroke="#1C0E06" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<ellipse cx="100" cy="128" rx="7" ry="4" fill="#C87940" opacity=".3"/>
<path d="M94 126 Q100 132 106 126" stroke="#B46220" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M72 140 Q100 163 128 140" stroke="#78350F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M72 140 Q100 160 128 140" fill="white" opacity=".8"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#FF7A3D"/>
<path d="M76 172 L100 184 L124 172" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: 'Nour',
    emoji: '🌸',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA3" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FF8C69"/><stop offset="100%" stop-color="#1A1A1A"/></radialGradient>
  <radialGradient id="skA3" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA3" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA3" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.1"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA3)" rx="18"/>
<ellipse cx="100" cy="118" rx="44" ry="46" fill="url(#skA3)" filter="url(#fA3)"/>
<ellipse cx="100" cy="90" rx="55" ry="38" fill="#FF4500"/>
<ellipse cx="100" cy="122" rx="60" ry="38" fill="#FF4500"/>
<ellipse cx="42" cy="128" rx="16" ry="36" fill="#FF5722"/>
<ellipse cx="158" cy="128" rx="16" ry="36" fill="#FF5722"/>
<ellipse cx="100" cy="92" rx="40" ry="26" fill="#FF5722"/>
<path d="M60 92 Q100 80 140 92" stroke="#FF7A3D" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>
<ellipse cx="84" cy="80" rx="22" ry="12" fill="#FF7A3D" opacity=".5"/>
<path d="M68 110 Q84 100 100 110 Q84 120 68 110Z" fill="white"/>
<path d="M100 110 Q116 100 132 110 Q116 120 100 110Z" fill="white"/>
<circle cx="84" cy="110" r="9" fill="url(#eyA3)"/>
<circle cx="116" cy="110" r="9" fill="url(#eyA3)"/>
<circle cx="84.5" cy="110.5" r="5" fill="#0A0400"/>
<circle cx="116.5" cy="110.5" r="5" fill="#0A0400"/>
<circle cx="81" cy="107" r="3.5" fill="white"/>
<circle cx="113" cy="107" r="3.5" fill="white"/>
<circle cx="86.5" cy="113" r="1.8" fill="white" opacity=".5"/>
<circle cx="118.5" cy="113" r="1.8" fill="white" opacity=".5"/>
<line x1="68" y1="107" x2="64" y2="102" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="74" y1="104" x2="72" y2="99" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="80" y1="102" x2="79" y2="97" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="86" y1="102" x2="86" y2="97" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="100" y1="107" x2="96" y2="102" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="106" y1="104" x2="104" y2="99" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="112" y1="102" x2="111" y2="97" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="118" y1="102" x2="118" y2="97" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="124" y1="104" x2="124" y2="99" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="130" y1="107" x2="132" y2="102" stroke="#1C0E06" stroke-width="1.8" stroke-linecap="round"/>
<path d="M96 120 Q100 126 104 120" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="70" cy="122" rx="12" ry="7" fill="#FFD4C2" opacity=".4"/>
<ellipse cx="130" cy="122" rx="12" ry="7" fill="#FFD4C2" opacity=".4"/>
<path d="M76 132 Q100 148 124 132" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M76 132 Q100 146 124 132" fill="white" opacity=".6"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#FF5722"/>
</svg>`,
  },
  {
    name: 'Mehdi',
    emoji: '🔥',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA4" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FF5722"/><stop offset="100%" stop-color="#1A1A1A"/></radialGradient>
  <radialGradient id="skA4" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FACA8A"/><stop offset="100%" stop-color="#E8965A"/></radialGradient>
  <radialGradient id="eyA4" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#2D1200"/></radialGradient>
  <filter id="fA4" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.1"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA4)" rx="18"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA4)" filter="url(#fA4)"/>
<ellipse cx="54" cy="118" rx="7" ry="10" fill="#E8965A"/>
<ellipse cx="146" cy="118" rx="7" ry="10" fill="#E8965A"/>
<ellipse cx="100" cy="78" rx="48" ry="22" fill="#FF4500"/>
<ellipse cx="100" cy="74" rx="44" ry="18" fill="#FF5722"/>
<rect x="52" y="76" width="96" height="14" rx="6" fill="#FF4500"/>
<ellipse cx="100" cy="68" rx="10" ry="6" fill="#CC3700"/>
<path d="M58 92 Q62 82 72 88" stroke="#2D1E0F" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M128 88 Q138 82 142 92" stroke="#2D1E0F" stroke-width="6" fill="none" stroke-linecap="round"/>
<rect x="62" y="104" width="34" height="22" rx="8" fill="rgba(20,20,40,.06)" stroke="#78350F" stroke-width="3"/>
<rect x="104" y="104" width="34" height="22" rx="8" fill="rgba(20,20,40,.06)" stroke="#78350F" stroke-width="3"/>
<line x1="96" y1="115" x2="104" y2="115" stroke="#78350F" stroke-width="3"/>
<line x1="62" y1="115" x2="54" y2="116" stroke="#78350F" stroke-width="3"/>
<line x1="138" y1="115" x2="146" y2="116" stroke="#78350F" stroke-width="3"/>
<ellipse cx="79" cy="115" rx="9" ry="10" fill="white"/>
<circle cx="79.5" cy="115.5" r="6.5" fill="url(#eyA4)"/>
<circle cx="79.5" cy="116" r="3.8" fill="#0A0400"/>
<circle cx="76.5" cy="112.5" r="2.8" fill="white"/>
<path d="M112 115 Q122 115 132 115" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M66 104 Q79 100 92 104" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M108 104 Q121 100 134 104" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M94 126 Q100 132 106 126" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M72 140 Q100 162 128 140" stroke="#78350F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M72 140 Q100 159 128 140" fill="white" opacity=".8"/>
<ellipse cx="66" cy="130" rx="10" ry="6" fill="#FF8C69" opacity=".35"/>
<ellipse cx="134" cy="130" rx="10" ry="6" fill="#FF8C69" opacity=".35"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#FF5722"/>
<path d="M76 172 L100 184 L124 172" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: 'Karim',
    emoji: '😎',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA5" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FF4500"/><stop offset="100%" stop-color="#0A0A0A"/></radialGradient>
  <radialGradient id="skA5" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <filter id="fA5" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.1"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA5)" rx="18"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA5)" filter="url(#fA5)"/>
<ellipse cx="54" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<ellipse cx="146" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<ellipse cx="108" cy="88" rx="52" ry="20" fill="#FF4500"/>
<ellipse cx="108" cy="85" rx="52" ry="18" fill="#FF5722"/>
<ellipse cx="148" cy="98" rx="28" ry="10" fill="#FF4500" transform="rotate(-20 148 98)"/>
<circle cx="98" cy="83" r="9" fill="#FF7A3D" opacity=".85"/>
<text x="93.5" y="87" font-size="9" fill="white" font-weight="bold" font-family="Arial">NY</text>
<ellipse cx="60" cy="100" rx="14" ry="10" fill="#1C0E06"/>
<rect x="62" y="106" width="76" height="24" rx="12" fill="#111827" opacity=".94"/>
<rect x="62" y="106" width="76" height="24" rx="12" fill="none" stroke="#374151" stroke-width="2"/>
<path d="M70 113 Q80 110 90 113" stroke="white" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>
<path d="M110 113 Q120 110 130 113" stroke="white" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>
<path d="M96 132 Q100 138 104 132" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M76 145 Q96 158 118 148" stroke="#92400E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 145 Q96 157 118 148" fill="white" opacity=".55"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#FF4500"/>
<path d="M76 172 L100 184 L124 172" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: 'Rania',
    emoji: '🎵',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA6" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FF7A3D"/><stop offset="100%" stop-color="#0A0A0A"/></radialGradient>
  <radialGradient id="skA6" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA6" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA6" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.1"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA6)" rx="18"/>
<rect x="52" y="88" width="18" height="70" rx="9" fill="#2D1E0F"/>
<rect x="130" y="88" width="18" height="70" rx="9" fill="#2D1E0F"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA6)" filter="url(#fA6)"/>
<ellipse cx="100" cy="82" rx="48" ry="22" fill="#2D1E0F"/>
<path d="M52 106 Q52 66 100 62 Q148 66 148 106" stroke="#1A1A1A" stroke-width="7" fill="none"/>
<rect x="40" y="100" width="24" height="36" rx="10" fill="#1A1A1A"/>
<rect x="136" y="100" width="24" height="36" rx="10" fill="#1A1A1A"/>
<ellipse cx="52" cy="118" rx="10" ry="14" fill="#0A0A0A"/>
<ellipse cx="148" cy="118" rx="10" ry="14" fill="#0A0A0A"/>
<ellipse cx="50" cy="112" rx="4" ry="3" fill="#FF4500" opacity=".4"/>
<ellipse cx="146" cy="112" rx="4" ry="3" fill="#FF4500" opacity=".4"/>
<ellipse cx="84" cy="114" rx="12" ry="13" fill="white"/>
<ellipse cx="116" cy="114" rx="12" ry="13" fill="white"/>
<circle cx="84.5" cy="114.5" r="9" fill="url(#eyA6)"/>
<circle cx="116.5" cy="114.5" r="9" fill="url(#eyA6)"/>
<circle cx="85" cy="115" r="5" fill="#0A0400"/>
<circle cx="117" cy="115" r="5" fill="#0A0400"/>
<circle cx="81" cy="111" r="3.5" fill="white"/>
<circle cx="113" cy="111" r="3.5" fill="white"/>
<circle cx="87" cy="117" r="1.8" fill="white" opacity=".55"/>
<circle cx="119" cy="117" r="1.8" fill="white" opacity=".55"/>
<path d="M74 107 Q79 103 84 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M106 107 Q111 103 116 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M72 106 Q84 102 96 106" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M104 106 Q116 102 128 106" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M96 124 Q100 130 104 124" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="70" cy="126" rx="12" ry="7" fill="#FF8C69" opacity=".35"/>
<ellipse cx="130" cy="126" rx="12" ry="7" fill="#FF8C69" opacity=".35"/>
<path d="M76 136 Q100 154 124 136" stroke="#B45309" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 136 Q100 152 124 136" fill="white" opacity=".7"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#FF7A3D"/>
</svg>`,
  },
  {
    name: 'Sara',
    emoji: '🧕',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA7" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FF8C69"/><stop offset="100%" stop-color="#0A0A0A"/></radialGradient>
  <radialGradient id="skA7" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA7" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA7" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#FF4500" flood-opacity="0.1"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA7)" rx="18"/>
<ellipse cx="100" cy="118" rx="44" ry="46" fill="url(#skA7)" filter="url(#fA7)"/>
<ellipse cx="100" cy="90" rx="58" ry="42" fill="#FF4500"/>
<ellipse cx="100" cy="126" rx="64" ry="42" fill="#FF4500"/>
<ellipse cx="38" cy="132" rx="18" ry="40" fill="#FF5722"/>
<ellipse cx="162" cy="132" rx="18" ry="40" fill="#FF5722"/>
<ellipse cx="100" cy="92" rx="42" ry="28" fill="#FF5722"/>
<path d="M58 90 Q100 76 142 90" stroke="#FF7A3D" stroke-width="3.5" fill="none" opacity=".65" stroke-linecap="round"/>
<ellipse cx="82" cy="80" rx="26" ry="14" fill="#FF7A3D" opacity=".38"/>
<path d="M64 110 Q84 98 104 110 Q84 122 64 110Z" fill="white"/>
<path d="M96 110 Q116 98 136 110 Q116 122 96 110Z" fill="white"/>
<circle cx="84" cy="110" r="9.5" fill="url(#eyA7)"/>
<circle cx="116" cy="110" r="9.5" fill="url(#eyA7)"/>
<circle cx="84.5" cy="110.5" r="5.2" fill="#0A0400"/>
<circle cx="116.5" cy="110.5" r="5.2" fill="#0A0400"/>
<circle cx="81" cy="107" r="3.8" fill="white"/>
<circle cx="113" cy="107" r="3.8" fill="white"/>
<circle cx="87" cy="113" r="2" fill="white" opacity=".5"/>
<circle cx="119" cy="113" r="2" fill="white" opacity=".5"/>
<line x1="64" y1="107" x2="60" y2="101" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="72" y1="103" x2="70" y2="97" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="80" y1="101" x2="79" y2="95" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="88" y1="101" x2="88" y2="95" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="96" y1="107" x2="92" y2="101" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="104" y1="103" x2="103" y2="97" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="112" y1="101" x2="111" y2="95" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="120" y1="101" x2="120" y2="95" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="128" y1="103" x2="128" y2="97" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<line x1="136" y1="107" x2="138" y2="101" stroke="#1C0E06" stroke-width="2" stroke-linecap="round"/>
<path d="M96 120 Q100 126 104 120" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="68" cy="122" rx="12" ry="7" fill="#FFD4C2" opacity=".42"/>
<ellipse cx="132" cy="122" rx="12" ry="7" fill="#FFD4C2" opacity=".42"/>
<path d="M76 132 Q100 150 124 132" stroke="#B45309" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 132 Q100 148 124 132" fill="white" opacity=".65"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#FF4500"/>
</svg>`,
  },
]

const ANIM_CLASSES = ['anim-bob','anim-think','anim-nod','anim-lean','anim-bob','anim-nod','anim-think']

// ── B2 LOGO WITH PULSING GLOW ──────────────────────────────────────────────
function B2Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-0 tracking-tight whitespace-nowrap leading-none select-none ${className}`}>
      <span className="font-black text-[#FF4500] animate-b2pulse" style={{letterSpacing:'-0.03em',textShadow:'0 0 20px rgba(255,69,0,0.5), 0 0 40px rgba(255,69,0,0.2)'}}>
        B2
      </span>
      <span className="font-light text-white/90" style={{letterSpacing:'0.02em'}}>
        please
      </span>
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

export default function Home() {
  const [lang, setLang] = useState<'en'|'fr'|'ar'>('en')
  const t = T[lang]
  const isAr = lang === 'ar'

  // Typewriter with orange cursor
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

  // Topic cycling
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)
  const [topicProgress, setTopicProgress] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTopicProgress(p => {
        if (p >= 100) { setActiveTopicIndex(i=>(i+1)%CLASS_TOPICS.length); return 0 }
        return p + 2
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Participant animation
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
    {svg:DALI_SVG, name:'Dali 👨‍🏫', isDali:true},
    ...AVATARS.map(a=>({svg:a.svg, name:`${a.name} ${a.emoji}`, isDali:false}))
  ]

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-sans" dir={isAr?'rtl':'ltr'}>
      <style>{`
        /* ── B2 Pulse ── */
        @keyframes b2pulse {
          0%, 100% { text-shadow: 0 0 20px rgba(255,69,0,0.5), 0 0 40px rgba(255,69,0,0.2); }
          50% { text-shadow: 0 0 35px rgba(255,69,0,0.8), 0 0 65px rgba(255,69,0,0.4), 0 0 90px rgba(255,69,0,0.15); }
        }
        .animate-b2pulse { animation: b2pulse 2.5s ease-in-out infinite; }

        /* ── Reveal ── */
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* ── Blobs ── */
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.08; }
        .b1 { animation: b1 10s ease-in-out infinite; background: #FF4500; }
        .b2 { animation: b2 13s ease-in-out infinite; background: #FF7A3D; }
        .b3 { animation: b3 8s ease-in-out infinite; background: #FF5722; }
        @keyframes b1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,20px) scale(1.1);} 66%{transform:translate(-10px,30px) scale(.95);} }
        @keyframes b2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-25px,-20px) scale(1.05);} 66%{transform:translate(15px,-10px) scale(1.1);} }
        @keyframes b3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(20px,-15px) scale(1.15);} }

        /* ── Float words ── */
        .float-word { animation: fw linear infinite; }
        @keyframes fw { 0%,100%{transform:translateY(0) rotate(var(--r));} 50%{transform:translateY(-10px) rotate(var(--r));} }

        .dali-wrap { animation: daliFloat 4s ease-in-out infinite; }
        @keyframes daliFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }

        /* ── Speaking ring ── */
        .speaking-ring { animation: sp 1.2s ease-in-out infinite; }
        @keyframes sp { 0%,100%{box-shadow:0 0 0 0 rgba(255,69,0,.6);} 50%{box-shadow:0 0 0 8px rgba(255,69,0,0);} }

        /* ── Participant idle animations ── */
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

        /* ── Avatar pop-in ── */
        .av-cell { opacity: 0; transform: scale(0); transition: opacity .3s ease, transform .4s cubic-bezier(.34,1.56,.64,1); }
        .av-cell.show { opacity: 1; transform: scale(1); }

        /* ── Chat message ── */
        .chat-in { animation: cin .35s ease forwards; }
        @keyframes cin { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:translateY(0);} }

        /* ── Sound wave bars ── */
        @keyframes soundBar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .sound-bar { animation: soundBar 1.2s ease-in-out infinite; }

        /* ── Progress bar ── */
        .progress-fill { transition: width .1s linear; }

        /* ── Topic card ── */
        .topic-card { transition: all .25s ease; }
        .topic-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(255,69,0,.08); border-color: rgba(255,69,0,.3); }

        /* ── Package card ── */
        .pkg-card { transition: all .3s ease; }
        .pkg-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(255,69,0,.1); border-color: rgba(255,69,0,.3); }

        /* ── Video grid background pattern ── */
        .video-grid-bg {
          background-image: 
            linear-gradient(rgba(255,69,0,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,69,0,.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#2A1A0A]">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 flex-shrink-0">
            <B2Logo className="text-lg md:text-xl" />
          </div>

          <div className="hidden md:flex gap-0.5 items-center">
            {['topics','classes','live','community'].map(item => (
              <a key={item} href={`#${item}`}
                className="px-3 py-2 text-sm text-[#FFF0E8]/60 hover:text-[#FF4500] hover:bg-[#1A1A1A] rounded-lg transition-all font-medium capitalize">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <div className="flex gap-0.5 bg-[#1A1A1A] p-0.5 rounded-lg">
              {(['en','fr','ar'] as const).map(l => (
                <button key={l} onClick={()=>setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${lang===l?'bg-[#FF4500] text-white shadow-sm':'text-[#FFF0E8]/40 hover:text-[#FFF0E8]/70'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank"
              className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A1A0A] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#FF4500] hover:bg-[#2A1A0A] transition-colors whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#FF4500] rounded-full animate-pulse flex-shrink-0"/>
              {t.nextLive}: {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
            </a>
            <a href="#signup"
              className="bg-[#FF4500] text-white px-4 py-2 rounded-xl hover:bg-[#FF5722] active:scale-95 transition-all text-sm font-bold shadow-lg shadow-[#FF4500]/20 whitespace-nowrap"
              style={{textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>
              {t.joinBtn}
            </a>
          </div>

          <button className="md:hidden border border-[#2A1A0A] text-[#FF4500] px-3 py-1.5 rounded-lg text-sm font-medium"
            onClick={()=>setMenuOpen(!menuOpen)}>
            {menuOpen?'✕':'☰'}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0A0A0A] border-t border-[#2A1A0A] px-5 py-4 flex flex-col gap-2">
            <div className="flex gap-1 mb-2">
              {(['en','fr','ar'] as const).map(l => (
                <button key={l} onClick={()=>{setLang(l);setMenuOpen(false)}}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${lang===l?'bg-[#FF4500] text-white':'bg-[#1A1A1A] text-[#FFF0E8]/40'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {['topics','classes','live','community'].map(item => (
              <a key={item} href={`#${item}`} onClick={()=>setMenuOpen(false)}
                className="px-3 py-2.5 text-[#FFF0E8]/60 hover:text-[#FF4500] hover:bg-[#1A1A1A] rounded-xl text-sm font-medium capitalize">
                {item}
              </a>
            ))}
            <a href="#signup"
              className="bg-[#FF4500] text-white px-4 py-3 rounded-xl text-sm font-bold text-center mt-1 shadow-lg shadow-[#FF4500]/20">
              {t.joinBtn}
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center video-grid-bg">
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 25% 50%,rgba(255,69,0,.06) 0%,transparent 55%),radial-gradient(ellipse at 75% 30%,rgba(255,122,61,.04) 0%,transparent 50%)'}}/>
        <div className="blob b1 w-96 h-96 absolute -top-20 -left-20"/>
        <div className="blob b2 w-80 h-80 absolute -bottom-10 -right-10"/>
        <div className="blob b3 w-60 h-60 absolute top-1/2 left-1/3"/>

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
              background:'rgba(26,26,26,0.9)',
              border:'1px solid rgba(255,69,0,0.2)',
              color:'#FF7A3D',
              '--r':w.r,
              animationDuration:w.dur,
              animationDelay:(w as any).delay||'0s'
            } as React.CSSProperties}>
            {w.text}
          </div>
        ))}

        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#2A1A0A] text-[#FF4500] text-xs px-3 py-1.5 rounded-full mb-5 font-semibold">
              <span>🇹🇳</span>{t.tagline}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none mb-4" style={{letterSpacing:'-0.03em'}}>
              {t.hero1}<br/>
              {t.hero2}<br/>
              <span className="text-[#FF4500]">{displayed}</span>
              <span className="text-[#FF4500] animate-pulse font-normal">█</span>
            </h1>
            <p className="text-[#FFF0E8]/60 text-base mb-7 leading-relaxed max-w-md">{t.sub}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <a href="#classes"
                className="inline-flex items-center gap-2 bg-[#FF4500] text-white px-6 py-3 rounded-xl hover:bg-[#FF5722] active:scale-95 transition-all shadow-lg shadow-[#FF4500]/25 text-sm font-bold whitespace-nowrap"
                style={{textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>
                {t.joinBtn} →
              </a>
              <a href="https://www.instagram.com/ielts.tn" target="_blank"
                className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#2A1A0A] text-sm font-bold px-5 py-3 rounded-xl hover:border-[#FF4500]/30 hover:bg-[#2A1A0A] active:scale-95 transition-all whitespace-nowrap"
                style={{color:'#FFF0E8'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#igGradDark)" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="url(#igGradDark)" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="#FF4500"/>
                  <defs><linearGradient id="igGradDark" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF7A3D"/><stop offset="50%" stopColor="#FF4500"/><stop offset="100%" stopColor="#FF5722"/></linearGradient></defs>
                </svg>
                {t.dmBtn}
              </a>
            </div>
            <a href="https://wa.me/216XXXXXXXX" target="_blank"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#2A1A0A] text-[#FF7A3D] px-5 py-2.5 rounded-xl hover:bg-[#2A1A0A] hover:border-[#FF4500]/30 active:scale-95 transition-all text-sm font-semibold">
              💬 {t.waBtn}
            </a>
            <div className="mt-7 flex items-center gap-2 flex-wrap">
              {[{n:'500K+',l:'TikTok'},{n:'12K+',l:'students'},{n:'4.9★',l:'rating'},{n:'live',l:'sessions'}].map(s => (
                <div key={s.l} className="bg-[#1A1A1A] border border-[#2A1A0A] rounded-xl px-3 py-2 text-center">
                  <div className="text-sm font-bold text-white">{s.n}</div>
                  <div className="text-xs text-[#FFF0E8]/40">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Class Visual */}
          <div className="flex flex-col gap-3">
            <div className="bg-[#1A1A1A] border border-[#2A1A0A] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{activeTopic.icon}</span><span>{activeTopic.topic}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#FF4500] rounded-full animate-pulse"/>
                  <span className="text-xs font-bold text-[#FF4500]">LIVE</span>
                </div>
              </div>
              {/* Sound wave visualizer instead of progress bar */}
              <div className="flex items-end gap-1 h-8 mb-2">
                {Array.from({length:20}).map((_,i) => (
                  <div key={i}
                    className="sound-bar flex-1 bg-[#FF4500] rounded-full"
                    style={{
                      animationDelay: `${i*0.08}s`,
                      opacity: 0.3 + Math.random()*0.7,
                      height: `${4 + Math.sin(i*0.5 + topicProgress*0.1)*12}px`
                    }}/>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {CLASS_TOPICS.map((_,i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i===activeTopicIndex?'w-6 bg-[#FF4500]':'w-2 bg-[#2A1A0A]'}`}/>
                  ))}
                </div>
                <span className="text-xs text-[#FFF0E8]/40">{activeTopic.level} · {activeTopic.participants} students</span>
              </div>
            </div>

            {/* Live class card */}
            <div className="bg-[#1A1A1A] border border-[#2A1A0A] rounded-2xl p-4 shadow-lg shadow-[#FF4500]/5">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A1A0A] mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF4500] rounded-full animate-pulse"/>
                  <span className="text-xs font-bold text-white">Live Session — {activeTopic.icon} {activeTopic.topic}</span>
                </div>
                <span className="text-xs font-semibold text-[#FF4500] bg-[#2A1A0A] px-2 py-0.5 rounded-lg">👥 {activeTopic.participants}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {allAvatars.map((av,i) => (
                  <div key={i}
                    className={`av-cell ${visibleP.includes(i)?'show':''} aspect-square rounded-xl overflow-hidden relative bg-[#0A0A0A] ${
                      av.isDali ? 'dali-wrap' : speakingP === i ? 'anim-participate' : ANIM_CLASSES[i-1] || 'anim-bob'
                    }`}
                    style={{transitionDelay:`${i*0.08}s`, border: speakingP===i ? '2px solid #FF4500' : '1px solid #2A1A0A'}}>
                    <div dangerouslySetInnerHTML={{__html:av.svg}} className="w-full h-full"/>
                    {speakingP === i && (
                      <div className="speaking-ring absolute inset-0 rounded-xl border-2 border-[#FF4500]"/>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 text-center bg-black/60 backdrop-blur-sm text-[#FFF0E8] font-bold py-0.5 truncate px-1" style={{fontSize:'8px'}}>
                      {av.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live chat */}
              <div className="bg-[#0A0A0A] rounded-xl p-2.5 min-h-[72px] flex flex-col gap-1.5 border border-[#2A1A0A]">
                <div className="text-xs font-bold text-[#FFF0E8]/30 mb-0.5">live chat</div>
                {chatMsgs.map(msg => (
                  <div key={msg.id} className="chat-in flex items-start gap-1.5">
                    <span className={`text-xs font-bold flex-shrink-0 ${msg.isDali?'text-[#FF4500]':'text-[#FFF0E8]/40'}`}>{msg.from}:</span>
                    <span className="text-xs text-[#FFF0E8]/60 leading-relaxed">{msg.text}</span>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 mt-2.5 pt-2.5 border-t border-[#2A1A0A]">
                {[{icon:'🎤',l:'mute'},{icon:'📹',l:'video'},{icon:'✋',l:'hand'},{icon:'💬',l:'chat'}].map(c => (
                  <button key={c.l} className="flex flex-col items-center gap-0.5 group">
                    <div className="w-8 h-8 bg-[#0A0A0A] group-hover:bg-[#2A1A0A] rounded-xl flex items-center justify-center text-sm transition-colors border border-[#2A1A0A]">{c.icon}</div>
                    <span className="text-xs text-[#FFF0E8]/30">{c.l}</span>
                  </button>
                ))}
                <button className="ml-auto bg-[#2A1A0A] text-[#FF4500] border border-[#FF4500]/20 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#3A2A1A] transition-colors">leave</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOPICS ──────────────────────────────────────────── */}
      <section id="topics" ref={addRef(0)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-[#FF4500] uppercase tracking-widest mb-2">{t.topicsTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-1" style={{letterSpacing:'-0.02em'}}>{t.topicsH}</h2>
        <p className="text-[#FFF0E8]/50 text-sm mb-8">{t.topicsSub}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOPICS.map(tp => (
            <div key={tp.en} className="topic-card bg-[#1A1A1A] border border-[#2A1A0A] rounded-2xl px-4 py-5 flex items-center gap-3 cursor-pointer">
              <span className="text-2xl">{tp.icon}</span>
              <span className="text-sm font-bold text-[#FFF0E8]">{lang==='ar'?tp.ar:lang==='fr'?tp.fr:tp.en}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section ref={addRef(1)} className="reveal max-w-6xl mx-auto px-6 py-8">
        <div className="text-xs font-bold text-[#FF4500] uppercase tracking-widest mb-2">{t.howTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-1" style={{letterSpacing:'-0.02em'}}>{t.howH}</h2>
        <p className="text-[#FFF0E8]/50 text-sm mb-8">{t.howSub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.steps.map(s => (
            <div key={s.n} className="bg-[#1A1A1A] border border-[#2A1A0A] rounded-2xl p-6 hover:border-[#FF4500]/30 transition-all">
              <div className="text-xs font-bold text-[#FF4500]/30 mb-3">{s.n}</div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-sm font-bold text-white mb-2">{s.t}</div>
              <div className="text-xs text-[#FFF0E8]/50 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────────────────────── */}
      <section id="classes" ref={addRef(2)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-[#FF4500] uppercase tracking-widest mb-2">{t.classesTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-1" style={{letterSpacing:'-0.02em'}}>{t.classesH}</h2>
        <p className="text-[#FFF0E8]/50 text-sm mb-8">{t.classesSub}</p>

        {/* Coming soon banner */}
        <div className="bg-[#1A1A1A] border border-[#2A1A0A] rounded-3xl p-8 text-center mb-10 relative overflow-hidden">
          <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at center, rgba(255,69,0,0.05) 0%, transparent 70%)'}}/>
          <div className="flex justify-center gap-3 mb-5 flex-wrap relative z-10">
            {['🗞️','🎙️','🌍','📊','🤖','🏛️','💰','🎬'].map((icon,i) => (
              <div key={i} className="w-11 h-11 bg-[#0A0A0A] border border-[#2A1A0A] rounded-xl flex items-center justify-center text-lg float-word"
                style={{'--r':'0deg',animationDuration:`${3+i*.4}s`,animationDelay:`${i*.15}s`} as React.CSSProperties}>
                {icon}
              </div>
            ))}
          </div>
          <h3 className="text-xl font-black text-white mb-2 relative z-10" style={{letterSpacing:'-0.02em'}}>{t.comingSoon}</h3>
          <p className="text-[#FFF0E8]/50 text-sm mb-6 max-w-sm mx-auto relative z-10">{t.comingSoonSub}</p>
          <a href="#signup"
            className="inline-flex items-center gap-2 bg-[#FF4500] text-white px-8 py-3 rounded-xl hover:bg-[#FF5722] active:scale-95 transition-all text-sm font-bold shadow-lg shadow-[#FF4500]/25 relative z-10"
            style={{textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>
            {t.notifyBtn} →
          </a>
        </div>

        {/* Tier badges row */}
        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          {['Free','Starter','Core','Pro','Elite'].map((tier,i) => (
            <div key={tier}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                i===3
                  ? 'bg-[#FF4500] text-white border-[#FF4500] shadow-lg shadow-[#FF4500]/20'
                  : i===4
                  ? 'bg-[#2A1A0A] text-[#FF5722] border-[#FF5722]/30'
                  : 'bg-[#1A1A1A] text-[#FFF0E8]/40 border-[#2A1A0A]'
              }`}>
              {tier}
              {i===3 && <span className="ml-1">← target B2</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.packages.map((pkg) => (
            <div key={pkg.id}
              className={`pkg-card bg-[#1A1A1A] rounded-2xl p-6 border ${
                (pkg as any).popular
                  ? 'border-[#FF4500]/40 ring-1 ring-[#FF4500]/20'
                  : (pkg as any).premium
                  ? 'border-[#FF5722]/30'
                  : 'border-[#2A1A0A]'
              } relative`}>
              {(pkg as any).popular && (
                <div className="absolute -top-3 left-6 bg-[#FF4500] text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg shadow-[#FF4500]/20">
                  most popular
                </div>
              )}
              {(pkg as any).premium && (
                <div className="absolute -top-3 left-6 bg-[#FF5722] text-white text-xs px-3 py-1 rounded-full font-bold">
                  limited spots
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0A0A0A] border border-[#2A1A0A] rounded-2xl flex items-center justify-center text-2xl">{pkg.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-base font-bold text-white">{pkg.name}</div>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#2A1A0A] text-[#FF4500]">{(pkg as any).tier}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#FF7A3D]">{pkg.tagline}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">${pkg.price[activePrice]}<span className="text-sm font-normal text-[#FFF0E8]/40">/mo</span></div>
                  <div className="text-xs font-semibold text-[#FF7A3D]">≈ {pkg.tnd[activePrice]} TND</div>
                </div>
              </div>
              <p className="text-xs text-[#FFF0E8]/50 leading-relaxed mb-4">{pkg.desc}</p>
              <div className="grid grid-cols-2 gap-1.5 mb-5">
                {pkg.features.map(f => (
                  <div key={f} className="flex items-start gap-1.5 text-xs text-[#FFF0E8]/60">
                    <span className="text-[#FF4500] font-bold mt-0.5 flex-shrink-0">✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="#signup"
                className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  (pkg as any).popular
                    ? 'bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20 hover:bg-[#FF5722]'
                    : (pkg as any).premium
                    ? 'bg-[#2A1A0A] text-[#FF5722] border border-[#FF5722]/30 hover:bg-[#3A2A1A]'
                    : 'bg-[#0A0A0A] text-[#FFF0E8] border border-[#2A1A0A] hover:border-[#FF4500]/30 hover:bg-[#2A1A0A]'
                }`}
                style={(pkg as any).popular ? {textShadow:'0 1px 2px rgba(0,0,0,0.2)'} : {}}>
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="text-sm text-[#FFF0E8]/50">{t.monthly}</span>
          <button onClick={()=>setActivePrice(p=>p==='m'?'y':'m')}
            className={`w-12 h-6 rounded-full transition-colors relative ${activePrice==='y'?'bg-[#FF4500]':'bg-[#2A1A0A]'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${activePrice==='y'?'left-6':'left-0.5'}`}/>
          </button>
          <span className={`text-sm font-semibold ${activePrice==='y'?'text-[#FF4500]':'text-[#FFF0E8]/50'}`}>{t.yearly}</span>
        </div>
        <p className="text-xs text-[#FFF0E8]/40 text-center mt-4">
          {t.notSure} <a href="https://wa.me/216XXXXXXXX" target="_blank" className="text-[#FF7A3D] font-bold hover:underline">{t.waLink}</a>
        </p>
      </section>

      {/* ── LIVE ────────────────────────────────────────────── */}
      <section id="live" ref={addRef(3)} className="reveal max-w-6xl mx-auto px-6 py-8">
        <div className="text-xs font-bold text-[#FF4500] uppercase tracking-widest mb-2">{t.liveTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-1" style={{letterSpacing:'-0.02em'}}>{t.liveH}</h2>
        <p className="text-[#FFF0E8]/50 text-sm mb-6">{t.liveSub}</p>
        <div className="bg-[#1A1A1A] border border-[#2A1A0A] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF4500] to-[#FF5722] rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-[#FF4500]/20">🎙️</div>
            <div>
              <div className="text-sm font-bold text-white">friday live session</div>
              <div className="text-xs text-[#FFF0E8]/50 mt-0.5">every week · 8:00 PM Tunisia time</div>
              <div className="text-xs text-[#FF4500] font-bold mt-1">TikTok Live & Instagram Live</div>
            </div>
          </div>
          <div className="flex gap-2">
            {[{v:countdown.d,l:t.days},{v:countdown.h,l:t.hours},{v:countdown.m,l:t.min},{v:countdown.s,l:t.sec}].map(ct => (
              <div key={ct.l} className="bg-[#0A0A0A] border border-[#2A1A0A] rounded-xl px-3 py-2 min-w-[52px] text-center">
                <div className="text-lg font-black text-[#FF4500]">{String(ct.v).padStart(2,'0')}</div>
                <div className="text-xs text-[#FFF0E8]/40">{ct.l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank"
              className="flex items-center gap-2 bg-[#0A0A0A] border border-[#2A1A0A] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#2A1A0A] active:scale-95 transition-all">
              🎵 tiktok
            </a>
            <a href="https://www.instagram.com/ielts.tn" target="_blank"
              className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all"
              style={{background:'linear-gradient(135deg,#FF4500,#FF5722,#FF7A3D)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg>
              instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ───────────────────────────────────────── */}
      <section id="community" ref={addRef(4)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-[#FF4500] uppercase tracking-widest mb-2">{t.communityTag}</div>
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-1" style={{letterSpacing:'-0.02em'}}>{t.communityH}</h2>
        <p className="text-[#FFF0E8]/50 text-sm mb-6">{t.communitySub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {href:'https://www.instagram.com/ielts.tn', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>, label:'instagram', sub:'DM @ielts.tn', style:{background:'linear-gradient(135deg,#FF4500,#FF5722,#FF7A3D)'}},
            {href:'https://wa.me/216XXXXXXXX', icon:'💬', label:'whatsapp', sub:'message directly', style:{background:'#FF4500'}},
            {href:'https://www.tiktok.com/@ielts.tn', icon:'🎵', label:'tiktok', sub:'@ielts.tn · 500K+', style:{background:'#0A0A0A', border:'1px solid #2A1A0A'}},
          ].map((s,i) => (
            <a key={i} href={s.href} target="_blank"
              className="flex items-center gap-4 bg-[#1A1A1A] border border-[#2A1A0A] rounded-2xl p-5 hover:border-[#FF4500]/30 hover:shadow-lg hover:shadow-[#FF4500]/5 transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0" style={s.style}>{s.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{s.label}</div>
                <div className="text-xs text-[#FFF0E8]/40 mt-0.5">{s.sub}</div>
              </div>
              <span className="text-[#FF4500] group-hover:translate-x-1 transition-transform">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── SIGNUP ──────────────────────────────────────────── */}
      <section id="signup" ref={addRef(5)} className="reveal py-16 px-6">
        <div className="max-w-6xl mx-auto bg-[#1A1A1A] rounded-3xl p-8 md:p-12 border border-[#2A1A0A] relative overflow-hidden">
          <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at center, rgba(255,69,0,0.04) 0%, transparent 70%)'}}/>
          <div className="max-w-sm mx-auto relative z-10">
            <div className="text-xs font-bold text-[#FF4500] uppercase tracking-widest mb-2 text-center">{t.signupTag}</div>
            <h2 className="text-2xl font-black text-white mb-1 text-center" style={{letterSpacing:'-0.02em'}}>{t.signupH}</h2>
            <p className="text-sm text-[#FFF0E8]/50 text-center mb-8">{t.signupSub}</p>
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#2A1A0A] flex flex-col gap-3">
              <input type="text" placeholder={t.namePH} value={name} onChange={e=>setName(e.target.value)}
                className="border border-[#2A1A0A] rounded-xl px-4 py-3 text-sm w-full bg-[#0A0A0A] text-white placeholder-[#FFF0E8]/30 focus:outline-none focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/10 transition-all"/>
              <input type="email" placeholder={t.emailPH} value={email} onChange={e=>setEmail(e.target.value)}
                className="border border-[#2A1A0A] rounded-xl px-4 py-3 text-sm w-full bg-[#0A0A0A] text-white placeholder-[#FFF0E8]/30 focus:outline-none focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/10 transition-all"/>
              <input type="password" placeholder={t.passPH} value={password} onChange={e=>setPassword(e.target.value)}
                className="border border-[#2A1A0A] rounded-xl px-4 py-3 text-sm w-full bg-[#0A0A0A] text-white placeholder-[#FFF0E8]/30 focus:outline-none focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/10 transition-all"/>
              {message && <p className="text-sm text-center text-[#FF7A3D] font-semibold">{message}</p>}
              <button onClick={handleSignup} disabled={loading}
                className="bg-[#FF4500] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#FF5722] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-[#FF4500]/25"
                style={{textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>
                {loading ? t.creating : t.signupBtn2}
              </button>
              <p className="text-xs text-[#FFF0E8]/40 text-center">
                {t.loginQ} <a href="/login" className="text-[#FF4500] font-bold hover:underline">{t.loginLink}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-[#2A1A0A] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <B2Logo className="text-sm" />
          <div className="flex gap-5 text-sm text-[#FFF0E8]/40 flex-wrap justify-center">
            <a href="#" className="hover:text-[#FF4500] transition-colors">privacy</a>
            <a href="#" className="hover:text-[#FF4500] transition-colors">terms</a>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank" className="hover:text-[#FF4500] transition-colors">tiktok ↗</a>
            <a href="https://www.instagram.com/ielts.tn" target="_blank" className="hover:text-[#FF4500] transition-colors">instagram ↗</a>
          </div>
          <div className="text-xs text-[#FFF0E8]/20">© 2026 B2Please</div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ───────────────────────────────── */}
      <a href="https://wa.me/216XXXXXXXX" target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FF4500] hover:bg-[#FF5722] rounded-full flex items-center justify-center text-2xl shadow-xl shadow-[#FF4500]/30 hover:scale-110 active:scale-95 transition-all">
        💬
      </a>
    </main>
  )
}