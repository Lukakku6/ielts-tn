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
    joinBtn: 'join a class',
    dmBtn: 'DM on instagram',
    waBtn: 'chat on whatsapp',
    topicsTag: 'what we discuss',
    topicsH: 'real topics. real english.',
    topicsSub: 'every class is built around something happening in the world right now',
    howTag: 'how it works',
    howH: 'join, speak, improve',
    howSub: 'three steps — no textbooks needed',
    steps: [
      { n:'01', icon:'🎯', t:'pick your class', d:'Browse live sessions by topic. Current events, finance, culture — pick what you care about and book your spot.' },
      { n:'02', icon:'🎙️', t:'join & speak', d:"Join the live video class. Dali leads the conversation in English, you participate, ask questions, make mistakes — that's the point." },
      { n:'03', icon:'🚀', t:'track your progress', d:'See your vocabulary grow, get personalised feedback after each class, and watch your confidence build week by week.' },
    ],
    classesTag: 'live classes',
    classesH: 'pick your package',
    classesSub: 'structured programmes designed around what you actually need',
    comingSoon: 'First classes launching soon',
    comingSoonSub: 'Join now and be the first to book. Early members get their first class free.',
    notifyBtn: "reserve my spot — it's free",
    liveTag: 'next session',
    liveH: 'join the next live',
    liveSub: 'every friday at 8PM Tunisia time — open to all',
    communityTag: 'reach dali',
    communityH: 'message directly',
    communitySub: 'questions about a class? not sure which package? Dali replies personally.',
    monthly: 'monthly', yearly: 'yearly (-20%)',
    signupTag: 'get started', signupH: 'create your free account', signupSub: 'free account · first class included',
    namePH: 'full name', emailPH: 'email address', passPH: 'password',
    signupBtn2: 'create account — first class free', creating: 'creating account...',
    loginQ: 'already have an account?', loginLink: 'log in',
    notSure: 'not sure which package?', waLink: 'ask on whatsapp ↗',
    nextLive: 'next live', days: 'd', hours: 'h', min: 'm', sec: 's',
    packages: [
      { id:'ielts', icon:'🏆', name:'IELTS Prep', tagline:'Band 7+ in 3 months', desc:'Intensive live classes focused on all four IELTS skills — speaking, writing, reading, listening — taught through real exam topics.', price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 live classes/month','Speaking mock tests','Writing task corrections','Exam vocabulary deep-dives','Personal score tracking'], cta:'start IELTS prep', accent:'indigo', popular:true },
      { id:'comms', icon:'💬', name:'Communication', tagline:'Sound like a native speaker', desc:'Weekly live discussions on trending topics — current events, culture, tech, finance. Build confidence and fluency through real conversation.', price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 live discussions/month','Topic vocabulary sheets','Pronunciation coaching','Weekly news breakdown','Replay access'], cta:'join conversations', accent:'cyan' },
      { id:'business', icon:'💼', name:'Business English', tagline:'English for your career', desc:'Live classes built around real workplace situations — presentations, negotiations, emails, interviews. For professionals who need English at work.', price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 live classes/month','CV & interview practice','Presentation coaching','Business vocabulary','LinkedIn profile review'], cta:'grow professionally', accent:'violet' },
      { id:'1on1', icon:'🎓', name:'1-on-1 with Dali', tagline:'Personalised coaching', desc:'Private sessions with Dali. Custom curriculum, direct feedback, and the fastest way to improve. Limited spots available each month.', price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 private sessions/month','Custom study plan','Unlimited WhatsApp access','Priority booking','Certificate on completion'], cta:'book private sessions', accent:'pink', premium:true },
    ],
  },
  fr: {
    tagline: "conçu pour les apprenants tunisiens",
    hero1: "arrête de bachoter.",
    hero2: "commence à parler",
    sub: "Des cours en ligne en direct avec Prof. Dali — apprends l'anglais à travers de vraies conversations sur l'actualité, la culture et les tendances du moment.",
    joinBtn: "rejoindre un cours", dmBtn: "DM sur instagram", waBtn: "écrire sur whatsapp",
    topicsTag: "ce qu'on discute", topicsH: "vrais sujets. vrai anglais.", topicsSub: "chaque cours est ancré dans l'actualité mondiale du moment",
    howTag: "comment ça marche", howH: "rejoins, parle, progresse", howSub: "trois étapes — sans manuel scolaire",
    steps: [
      { n:'01', icon:'🎯', t:'choisis ton cours', d:"Parcours les sessions en direct par thème. Actualité, finance, culture — réserve ta place sur ce qui t'intéresse." },
      { n:'02', icon:'🎙️', t:'rejoins & parle', d:"Intègre le cours vidéo en direct. Dali anime la conversation en anglais, tu participes, tu poses des questions, tu fais des erreurs — c'est ça l'idée." },
      { n:'03', icon:'🚀', t:'suis ta progression', d:"Vois ton vocabulaire s'élargir, reçois des retours personnalisés après chaque cours et observe ta confiance grandir semaine après semaine." },
    ],
    classesTag: "cours en direct", classesH: "choisis ton programme", classesSub: "des programmes structurés autour de tes besoins réels",
    comingSoon: "Premiers cours bientôt disponibles", comingSoonSub: "Inscris-toi maintenant et sois le premier à réserver. Les premiers membres obtiennent leur premier cours gratuit.",
    notifyBtn: "réserver ma place — gratuit",
    liveTag: "prochaine session", liveH: "rejoins le prochain live", liveSub: "chaque vendredi à 20h heure tunisienne — ouvert à tous",
    communityTag: "contacter dali", communityH: "écrire directement", communitySub: "questions sur un cours ? pas sûr du programme ? Dali répond personnellement.",
    monthly: "mensuel", yearly: "annuel (-20%)",
    signupTag: "commencer", signupH: "créer ton compte gratuit", signupSub: "compte gratuit · premier cours inclus",
    namePH: "nom complet", emailPH: "adresse email", passPH: "mot de passe",
    signupBtn2: "créer un compte — premier cours offert", creating: "création en cours...",
    loginQ: "déjà un compte ?", loginLink: "se connecter",
    notSure: "pas sûr du programme ?", waLink: "demander sur whatsapp ↗",
    nextLive: "prochain live", days: "j", hours: "h", min: "m", sec: "s",
    packages: [
      { id:'ielts', icon:'🏆', name:'Prépa IELTS', tagline:'Band 7+ en 3 mois', desc:"Cours en direct intensifs sur les quatre compétences IELTS enseignés à travers de vrais sujets d'examen.", price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 cours en direct/mois','Tests oraux simulés','Corrections écrites','Vocabulaire examen','Suivi de score'], cta:'commencer la prépa', accent:'indigo', popular:true },
      { id:'comms', icon:'💬', name:'Communication', tagline:'Parle comme un natif', desc:"Discussions en direct hebdomadaires sur les sujets d'actualité — culture, tech, finance.", price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 discussions/mois','Fiches vocabulaire','Coaching prononciation',"Décryptage actualité",'Accès replays'], cta:'rejoindre les discussions', accent:'cyan' },
      { id:'business', icon:'💼', name:'Anglais Pro', tagline:"L'anglais pour ta carrière", desc:"Cours en direct autour de situations professionnelles réelles — présentations, négociations, entretiens.", price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 cours en direct/mois','Prépa CV et entretiens','Coaching présentation','Vocabulaire pro','Revue LinkedIn'], cta:'progresser pro', accent:'violet' },
      { id:'1on1', icon:'🎓', name:'1-pour-1 avec Dali', tagline:'Coaching personnalisé', desc:"Sessions privées avec Dali. Programme sur mesure, retours directs. Places limitées chaque mois.", price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 sessions privées/mois',"Plan d'étude personnalisé",'Accès WhatsApp illimité','Réservation prioritaire','Certificat'], cta:'réserver sessions privées', accent:'pink', premium:true },
    ],
  },
  ar: {
    tagline: 'مصمّم للمتعلّمين التونسيين',
    hero1: 'توقّف عن الحفظ.',
    hero2: 'ابدأ تتكلّم',
    sub: 'دروس مباشرة أونلاين مع الأستاذ دالي — تعلّم الإنجليزية من خلال نقاشات حقيقية حول الأحداث الراهنة والثقافة والتريندات.',
    joinBtn: 'احجز درسك', dmBtn: 'راسلنا على انستغرام', waBtn: 'تحدّث على واتساب',
    topicsTag: 'شنو نحكيو فيه', topicsH: 'مواضيع حقيقية. إنجليزية حقيقية.', topicsSub: 'كل درس مبني على شيء يصير في العالم هذا الوقت',
    howTag: 'كيفاش يخدم', howH: 'انضم، تكلّم، تطوّر', howSub: 'ثلاث خطوات — بلا كتب ولا حفظ',
    steps: [
      { n:'٠١', icon:'🎯', t:'اختار درسك', d:'شوف الجلسات المباشرة حسب الموضوع. أحداث راهنة، فلوس، ثقافة — احجز مكانك في اللي يهمّك.' },
      { n:'٠٢', icon:'🎙️', t:'انضم وتكلّم', d:'ادخل الدرس المباشر. الأستاذ دالي يقود النقاش بالإنجليزية، أنت تشارك وتسأل وتغلط — هذا هو المطلوب.' },
      { n:'٠٣', icon:'🚀', t:'تابع تطوّرك', d:'شوف كيف تتوسّع مفرداتك، خذ ملاحظات شخصية بعد كل درس، وراقب ثقتك تكبر أسبوع بأسبوع.' },
    ],
    classesTag: 'الدروس المباشرة', classesH: 'اختار برنامجك', classesSub: 'برامج مهيكلة حسب احتياجاتك الحقيقية',
    comingSoon: 'أوّل الدروس قريبًا', comingSoonSub: 'سجّل هالوقت وكن أوّل من يحجز. الأعضاء الأوائل يأخذون أوّل درس مجّانًا.',
    notifyBtn: 'احجز مكاني — مجّانًا',
    liveTag: 'الجلسة القادمة', liveH: 'انضم للبث القادم', liveSub: 'كل جمعة الساعة 8 مساءً بتوقيت تونس — مفتوح للجميع',
    communityTag: 'تواصل مع دالي', communityH: 'راسل مباشرة', communitySub: 'عندك سؤال على درس؟ ما عرفتش تختار؟ الأستاذ دالي يردّ شخصيًا.',
    monthly: 'شهري', yearly: 'سنوي (-20%)',
    signupTag: 'ابدأ الرحلة', signupH: 'أنشئ حسابك المجاني', signupSub: 'حساب مجاني · أوّل درس مشمول',
    namePH: 'الاسم الكامل', emailPH: 'البريد الإلكتروني', passPH: 'كلمة المرور',
    signupBtn2: 'أنشئ حساب — أوّل درس مجّاني', creating: 'جاري إنشاء الحساب...',
    loginQ: 'عندك حساب بالفعل؟', loginLink: 'تسجيل الدخول',
    notSure: 'ما عرفتش تختار؟', waLink: 'اسأل على واتساب ↗',
    nextLive: 'البث القادم', days: 'أيام', hours: 'ساعات', min: 'دق', sec: 'ثا',
    packages: [
      { id:'ielts', icon:'🏆', name:'تحضير IELTS', tagline:'Band 7+ في 3 أشهر', desc:'دروس مباشرة مكثّفة على المهارات الأربع من خلال مواضيع الامتحان الحقيقية.', price:{m:'29',y:'23'}, tnd:{m:'90',y:'72'}, features:['4 دروس مباشرة/شهر','اختبارات تحدّث تجريبية','تصحيح التعبير الكتابي','مفردات الامتحان','متابعة النقاط'], cta:'ابدأ تحضير IELTS', accent:'indigo', popular:true },
      { id:'comms', icon:'💬', name:'مهارات التواصل', tagline:'تكلّم كالناطق الأصلي', desc:'نقاشات مباشرة أسبوعية حول أبرز المواضيع — أحداث راهنة، ثقافة، تكنولوجيا، اقتصاد.', price:{m:'19',y:'15'}, tnd:{m:'59',y:'47'}, features:['4 نقاشات/شهر','قوائم مفردات الموضوع','تدريب على النطق','شرح أخبار الأسبوع','الوصول للتسجيلات'], cta:'انضم للنقاشات', accent:'cyan' },
      { id:'business', icon:'💼', name:'الإنجليزية المهنية', tagline:'الإنجليزية لمسيرتك', desc:'دروس مباشرة حول مواقف مهنية حقيقية — عروض تقديمية، مفاوضات، مقابلات عمل.', price:{m:'24',y:'19'}, tnd:{m:'75',y:'60'}, features:['4 دروس مباشرة/شهر','تحضير السيرة والمقابلات','تدريب على العروض','مفردات مهنية','مراجعة LinkedIn'], cta:'تطوّر مهنيًا', accent:'violet' },
      { id:'1on1', icon:'🎓', name:'جلسات فردية مع دالي', tagline:'تدريب شخصي', desc:'جلسات خاصة مع الأستاذ دالي. منهج مخصّص، ملاحظات مباشرة. أماكن محدودة كل شهر.', price:{m:'59',y:'47'}, tnd:{m:'185',y:'148'}, features:['4 جلسات خاصة/شهر','خطة دراسية مخصّصة','وصول واتساب غير محدود','حجز أولوية','شهادة إتمام'], cta:'احجز جلسات خاصة', accent:'pink', premium:true },
    ],
  },
}

const TOPICS = [
  { icon:'🌍', en:'World Events', fr:'Actualité Mondiale', ar:'أحداث العالم', color:'blue' },
  { icon:'📰', en:'Breaking News', fr:'Actualités', ar:'أخبار عاجلة', color:'red' },
  { icon:'🎬', en:'Pop Culture', fr:'Culture Pop', ar:'الثقافة الشعبية', color:'purple' },
  { icon:'💰', en:'Finance & Markets', fr:'Finance & Marchés', ar:'المال والأسواق', color:'amber' },
  { icon:'🤖', en:'Tech & AI', fr:'Tech & IA', ar:'التكنولوجيا والذكاء الاصطناعي', color:'cyan' },
  { icon:'🏆', en:'Sports', fr:'Sport', ar:'الرياضة', color:'green' },
  { icon:'🎵', en:'Music & Entertainment', fr:'Musique & Divertissement', ar:'الموسيقى والترفيه', color:'pink' },
  { icon:'🌐', en:'Social Trends', fr:'Tendances Sociales', ar:'الاتجاهات الاجتماعية', color:'indigo' },
]

const COLOR_MAP: Record<string,{bg:string,text:string,border:string,ring:string,btn:string,shadow:string}> = {
  indigo:{bg:'bg-indigo-50',text:'text-indigo-600',border:'border-indigo-200',ring:'ring-indigo-100',btn:'bg-indigo-600 hover:bg-indigo-700 text-white',shadow:'shadow-indigo-200'},
  cyan:  {bg:'bg-cyan-50',  text:'text-cyan-600',  border:'border-cyan-200',  ring:'ring-cyan-100',  btn:'bg-cyan-500 hover:bg-cyan-600 text-white',  shadow:'shadow-cyan-200'},
  violet:{bg:'bg-violet-50',text:'text-violet-600',border:'border-violet-200',ring:'ring-violet-100',btn:'bg-violet-600 hover:bg-violet-700 text-white',shadow:'shadow-violet-200'},
  pink:  {bg:'bg-pink-50',  text:'text-pink-600',  border:'border-pink-200',  ring:'ring-pink-100',  btn:'bg-pink-500 hover:bg-pink-600 text-white',  shadow:'shadow-pink-200'},
  blue:  {bg:'bg-blue-50',  text:'text-blue-600',  border:'border-blue-100',  ring:'',btn:'',shadow:''},
  red:   {bg:'bg-red-50',   text:'text-red-500',   border:'border-red-100',   ring:'',btn:'',shadow:''},
  purple:{bg:'bg-purple-50',text:'text-purple-600',border:'border-purple-100',ring:'',btn:'',shadow:''},
  amber: {bg:'bg-amber-50', text:'text-amber-600', border:'border-amber-100', ring:'',btn:'',shadow:''},
  green: {bg:'bg-green-50', text:'text-green-600', border:'border-green-100', ring:'',btn:'',shadow:''},
}

const CLASS_TOPICS = [
  { topic:'AI & The Future of Work', icon:'🤖', participants:8, level:'B2–C1' },
  { topic:'The US Elections 2024',   icon:'🗳️', participants:12, level:'B1–C1' },
  { topic:'Climate Change Debate',   icon:'🌱', participants:6,  level:'B2–C1' },
  { topic:'Social Media & Society',  icon:'📱', participants:10, level:'B1–B2' },
]

// ── MEMOJI-STYLE SVG AVATARS ──────────────────────────────────────────────────
// Each avatar is a self-contained SVG with Apple Memoji aesthetic:
// soft 3D shading, expressive eyes with highlight dots, detailed hair, accessories

// Dali — young, slick-back hair, moustache, polo, cheerful, animated with whiteboard stick
const DALI_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgDali" cx="50%" cy="0%" r="100%">
    <stop offset="0%" stop-color="#818CF8"/>
    <stop offset="100%" stop-color="#3730A3"/>
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
    <stop offset="0%" stop-color="#F0F9FF"/>
    <stop offset="100%" stop-color="#E0F2FE"/>
  </radialGradient>
  <filter id="faceShad" x="-15%" y="-15%" width="130%" height="130%">
    <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.22"/>
  </filter>
  <filter id="boardShad" x="-5%" y="-5%" width="110%" height="110%">
    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
  </filter>
</defs>

<!-- Background -->
<rect width="200" height="200" fill="url(#bgDali)" rx="18"/>

<!-- Whiteboard -->
<rect x="8" y="12" width="105" height="68" rx="7" fill="url(#boardGrad)" filter="url(#boardShad)"/>
<rect x="8" y="12" width="105" height="68" rx="7" fill="none" stroke="#BAE6FD" stroke-width="1.8"/>
<!-- Board content -->
<text x="16" y="32" font-size="8.5" fill="#0369A1" font-family="monospace" font-weight="bold">displace ≠ replace</text>
<line x1="16" y1="42" x2="82" y2="42" stroke="#0284C7" stroke-width="1.5" stroke-linecap="round"/>
<text x="16" y="53" font-size="7.5" fill="#0369A1" font-family="monospace">→ "AI may displace</text>
<text x="16" y="63" font-size="7.5" fill="#0369A1" font-family="monospace">   some roles..."</text>
<line x1="16" y1="70" x2="60" y2="70" stroke="#7DD3FC" stroke-width="1" stroke-linecap="round" opacity=".6"/>
<!-- Eraser at bottom of board -->
<rect x="88" y="72" width="16" height="6" rx="2" fill="#E2E8F0"/>

<!-- Animated pointer/stick arm -->
<g id="dali-arm">
  <line x1="148" y1="108" x2="108" y2="58" stroke="#E8965A" stroke-width="5" stroke-linecap="round"/>
  <line x1="148" y1="108" x2="108" y2="58" stroke="#FACA8A" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
  <!-- Pointer tip -->
  <circle cx="108" cy="58" r="4.5" fill="#06B6D4"/>
  <circle cx="108" cy="58" r="2" fill="white" opacity=".7"/>
  <!-- Hand holding stick -->
  <ellipse cx="152" cy="112" rx="9" ry="7" fill="#FACA8A"/>
  <ellipse cx="155" cy="110" rx="4" ry="3" fill="#FFE8CC"/>
</g>

<!-- Neck -->
<rect x="88" y="147" width="24" height="18" rx="5" fill="#FACA8A"/>
<!-- Neck shadow -->
<rect x="88" y="150" width="24" height="8" rx="3" fill="#E8965A" opacity=".3"/>

<!-- Face -->
<ellipse cx="100" cy="115" rx="42" ry="44" fill="url(#skinDali)" filter="url(#faceShad)"/>

<!-- Ear left -->
<ellipse cx="58" cy="115" rx="7" ry="10" fill="#E8965A"/>
<ellipse cx="59" cy="115" rx="4" ry="6" fill="#D4814A"/>

<!-- Ear right -->
<ellipse cx="142" cy="115" rx="7" ry="10" fill="#E8965A"/>
<ellipse cx="141" cy="115" rx="4" ry="6" fill="#D4814A"/>

<!-- Slick-back hair — full coverage, no recession -->
<path d="M58 100 Q60 68 100 65 Q140 68 142 100 Q138 78 100 74 Q62 78 58 100Z" fill="#2D1E0F"/>
<!-- Hair volume on top -->
<ellipse cx="100" cy="74" rx="36" ry="14" fill="#2D1E0F"/>
<!-- Hair sheen -->
<path d="M72 70 Q88 66 104 68" stroke="#4A3520" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
<path d="M78 67 Q92 63 106 65" stroke="#5C4433" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>
<!-- Hair sides — full, no thinning -->
<ellipse cx="60" cy="98" rx="8" ry="18" fill="#2D1E0F"/>
<ellipse cx="140" cy="98" rx="8" ry="18" fill="#2D1E0F"/>

<!-- Eyebrows — expressive, slightly raised (cheerful) -->
<path d="M72 101 Q82 97 92 100" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M108 100 Q118 97 128 101" stroke="#1C1007" stroke-width="3.5" fill="none" stroke-linecap="round"/>

<!-- Eyes — big, expressive Apple Memoji style -->
<ellipse cx="82" cy="112" rx="10" ry="11" fill="white"/>
<ellipse cx="118" cy="112" rx="10" ry="11" fill="white"/>
<!-- Iris -->
<circle cx="82.5" cy="112.5" r="7.5" fill="url(#eyeDali)"/>
<circle cx="118.5" cy="112.5" r="7.5" fill="url(#eyeDali)"/>
<!-- Pupil -->
<circle cx="83" cy="113" r="4" fill="#0D0600"/>
<circle cx="119" cy="113" r="4" fill="#0D0600"/>
<!-- Main highlight -->
<circle cx="79.5" cy="109.5" r="3" fill="white"/>
<circle cx="115.5" cy="109.5" r="3" fill="white"/>
<!-- Small highlight -->
<circle cx="85" cy="115" r="1.5" fill="white" opacity=".6"/>
<circle cx="121" cy="115" r="1.5" fill="white" opacity=".6"/>

<!-- Nose -->
<path d="M96 122 Q100 129 104 122" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="100" cy="124" rx="7" ry="3" fill="#D4814A" opacity=".2"/>

<!-- Moustache — neat, stylish -->
<path d="M82 133 Q90 128 100 130 Q110 128 118 133" stroke="#1C1007" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<path d="M82 133 Q90 130 100 132 Q110 130 118 133" fill="#2D1E0F" stroke="#2D1E0F" stroke-width="1"/>

<!-- Big cheerful smile -->
<path d="M78 140 Q100 158 122 140" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- Teeth -->
<path d="M80 140 Q100 155 120 140" fill="white"/>
<!-- Smile lines (cheek dimples) -->
<path d="M73 136 Q70 140 72 145" stroke="#C87940" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5"/>
<path d="M127 136 Q130 140 128 145" stroke="#C87940" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5"/>
<!-- Cheek blush (cheerful) -->
<ellipse cx="68" cy="128" rx="10" ry="6" fill="#FF8C69" opacity=".22"/>
<ellipse cx="132" cy="128" rx="10" ry="6" fill="#FF8C69" opacity=".22"/>

<!-- Polo shirt collar -->
<path d="M70 168 L86 158 L100 165 L114 158 L130 168" fill="#4338CA" stroke="#3730A3" stroke-width="1"/>
<!-- Polo body -->
<ellipse cx="100" cy="185" rx="42" ry="22" fill="#4338CA"/>
<!-- Polo collar fold -->
<path d="M86 158 L100 168 L114 158" fill="#3730A3" opacity=".6"/>
<!-- Polo button line -->
<line x1="100" y1="165" x2="100" y2="188" stroke="#3730A3" stroke-width="1.5" opacity=".5"/>
<!-- Polo buttons -->
<circle cx="100" cy="170" r="2" fill="#312E81"/>
<circle cx="100" cy="178" r="2" fill="#312E81"/>
</svg>`

// Student avatars — Apple Memoji style, diverse, Mediterranean/North African focused
const AVATARS = [
  {
    name: 'Amira',
    emoji: '✨',
    // Girl, space buns, earrings, big eyes, warm skin
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA1" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#F9A8D4"/><stop offset="100%" stop-color="#9D174D"/></radialGradient>
  <radialGradient id="skA1" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA1" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#2D0E00"/></radialGradient>
  <filter id="fA1" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA1)" rx="18"/>
<!-- Face -->
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA1)" filter="url(#fA1)"/>
<!-- Ears -->
<ellipse cx="54" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<ellipse cx="146" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<!-- Hair base -->
<ellipse cx="100" cy="90" rx="50" ry="30" fill="#1C0E06"/>
<!-- Space bun left -->
<circle cx="62" cy="75" r="20" fill="#1C0E06"/>
<circle cx="62" cy="75" r="13" fill="#EC4899"/>
<circle cx="62" cy="75" r="8" fill="#BE185D"/>
<circle cx="62" cy="75" r="4" fill="#9D174D"/>
<!-- Space bun right -->
<circle cx="138" cy="75" r="20" fill="#1C0E06"/>
<circle cx="138" cy="75" r="13" fill="#EC4899"/>
<circle cx="138" cy="75" r="8" fill="#BE185D"/>
<circle cx="138" cy="75" r="4" fill="#9D174D"/>
<!-- Hair wisp at top -->
<path d="M72 82 Q100 72 128 82" stroke="#1C0E06" stroke-width="8" fill="none" stroke-linecap="round"/>
<!-- Gold earrings -->
<ellipse cx="54" cy="130" rx="5" ry="7" fill="#FCD34D" stroke="#D97706" stroke-width="1.5"/>
<ellipse cx="146" cy="130" rx="5" ry="7" fill="#FCD34D" stroke="#D97706" stroke-width="1.5"/>
<!-- Eyes whites -->
<ellipse cx="84" cy="114" rx="12" ry="13" fill="white"/>
<ellipse cx="116" cy="114" rx="12" ry="13" fill="white"/>
<!-- Iris -->
<circle cx="84.5" cy="114.5" r="9" fill="url(#eyA1)"/>
<circle cx="116.5" cy="114.5" r="9" fill="url(#eyA1)"/>
<!-- Pupil -->
<circle cx="85" cy="115" r="5" fill="#0A0400"/>
<circle cx="117" cy="115" r="5" fill="#0A0400"/>
<!-- Highlights -->
<circle cx="81" cy="111" r="3.5" fill="white"/>
<circle cx="113" cy="111" r="3.5" fill="white"/>
<circle cx="87" cy="117" r="1.8" fill="white" opacity=".55"/>
<circle cx="119" cy="117" r="1.8" fill="white" opacity=".55"/>
<!-- Lashes top -->
<path d="M74 107 Q79 103 84 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M106 107 Q111 103 116 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<!-- Eyebrows -->
<path d="M72 107 Q84 103 96 107" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M104 107 Q116 103 128 107" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- Nose -->
<path d="M96 126 Q100 132 104 126" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- Blush -->
<ellipse cx="70" cy="128" rx="12" ry="7" fill="#F9A8D4" opacity=".55"/>
<ellipse cx="130" cy="128" rx="12" ry="7" fill="#F9A8D4" opacity=".55"/>
<!-- Big smile -->
<path d="M76 138 Q100 158 124 138" stroke="#B45309" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 138 Q100 156 124 138" fill="white" opacity=".75"/>
<!-- Body -->
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#BE185D"/>
</svg>`,
  },
  {
    name: 'Sami',
    emoji: '🎧',
    // Guy, fade cut, earring, gold skin, big grin
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA2" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#064E3B"/></radialGradient>
  <radialGradient id="skA2" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE4A0"/><stop offset="40%" stop-color="#FBBF7A"/><stop offset="100%" stop-color="#D4800A"/></radialGradient>
  <radialGradient id="eyA2" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA2" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA2)" rx="18"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA2)" filter="url(#fA2)"/>
<ellipse cx="54" cy="118" rx="7" ry="10" fill="#D4800A"/>
<ellipse cx="146" cy="118" rx="7" ry="10" fill="#D4800A"/>
<!-- Fade haircut -->
<path d="M54 104 Q56 72 100 68 Q144 72 146 104 Q140 80 100 76 Q60 80 54 104Z" fill="#1C0E06"/>
<rect x="54" y="100" width="92" height="14" rx="4" fill="#1C0E06"/>
<rect x="54" y="112" width="14" height="18" rx="4" fill="#2D1E0F" opacity=".75"/>
<rect x="132" y="112" width="14" height="18" rx="4" fill="#2D1E0F" opacity=".75"/>
<!-- Gold stud earring -->
<circle cx="54" cy="126" r="5" fill="#FCD34D" stroke="#D97706" stroke-width="1.5"/>
<!-- Eyes -->
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
<!-- Thick eyebrows -->
<path d="M72 106 Q84 101 96 105" stroke="#1C0E06" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<path d="M104 105 Q116 101 128 106" stroke="#1C0E06" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<!-- Nose -->
<ellipse cx="100" cy="128" rx="7" ry="4" fill="#C87940" opacity=".3"/>
<path d="M94 126 Q100 132 106 126" stroke="#B46220" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- Huge grin -->
<path d="M72 140 Q100 163 128 140" stroke="#78350F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M72 140 Q100 160 128 140" fill="white" opacity=".8"/>
<!-- Body -->
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#059669"/>
<path d="M76 172 L100 184 L124 172" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: 'Nour',
    emoji: '🌸',
    // Hijabi girl, purple hijab, almond eyes, long lashes
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA3" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#A78BFA"/><stop offset="100%" stop-color="#4C1D95"/></radialGradient>
  <radialGradient id="skA3" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA3" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA3" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA3)" rx="18"/>
<ellipse cx="100" cy="118" rx="44" ry="46" fill="url(#skA3)" filter="url(#fA3)"/>
<!-- Hijab outer shape -->
<ellipse cx="100" cy="90" rx="55" ry="38" fill="#7C3AED"/>
<ellipse cx="100" cy="122" rx="60" ry="38" fill="#7C3AED"/>
<ellipse cx="42" cy="128" rx="16" ry="36" fill="#6D28D9"/>
<ellipse cx="158" cy="128" rx="16" ry="36" fill="#6D28D9"/>
<!-- Hijab inner depth/fold -->
<ellipse cx="100" cy="92" rx="40" ry="26" fill="#6D28D9"/>
<path d="M60 92 Q100 80 140 92" stroke="#8B5CF6" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>
<!-- Hijab highlight -->
<ellipse cx="84" cy="80" rx="22" ry="12" fill="#8B5CF6" opacity=".5"/>
<!-- Eyes — almond shaped -->
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
<!-- Long dramatic lashes -->
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
<!-- Nose -->
<path d="M96 120 Q100 126 104 120" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- Blush -->
<ellipse cx="70" cy="122" rx="12" ry="7" fill="#DDD6FE" opacity=".5"/>
<ellipse cx="130" cy="122" rx="12" ry="7" fill="#DDD6FE" opacity=".5"/>
<!-- Warm smile -->
<path d="M76 132 Q100 148 124 132" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M76 132 Q100 146 124 132" fill="white" opacity=".6"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#5B21B6"/>
</svg>`,
  },
  {
    name: 'Mehdi',
    emoji: '🔥',
    // Guy, large afro, wide smile, warm brown skin
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA4" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FCD34D"/><stop offset="100%" stop-color="#78350F"/></radialGradient>
  <radialGradient id="skA4" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE4A0"/><stop offset="40%" stop-color="#FBBF7A"/><stop offset="100%" stop-color="#B45309"/></radialGradient>
  <radialGradient id="eyA4" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#4A2912"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA4" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA4)" rx="18"/>
<ellipse cx="100" cy="120" rx="46" ry="48" fill="url(#skA4)" filter="url(#fA4)"/>
<ellipse cx="54" cy="120" rx="7" ry="10" fill="#B45309"/>
<ellipse cx="146" cy="120" rx="7" ry="10" fill="#B45309"/>
<!-- Big Afro -->
<circle cx="100" cy="82" r="42" fill="#1C0E06"/>
<circle cx="64" cy="96" r="24" fill="#1C0E06"/>
<circle cx="136" cy="96" r="24" fill="#1C0E06"/>
<circle cx="72" cy="72" r="22" fill="#1C0E06"/>
<circle cx="128" cy="72" r="22" fill="#1C0E06"/>
<!-- Afro texture -->
<circle cx="80" cy="62" r="10" fill="#2D1E0F" opacity=".6"/>
<circle cx="100" cy="56" r="12" fill="#2D1E0F" opacity=".6"/>
<circle cx="120" cy="62" r="10" fill="#2D1E0F" opacity=".6"/>
<circle cx="64" cy="80" r="8" fill="#2D1E0F" opacity=".5"/>
<circle cx="136" cy="80" r="8" fill="#2D1E0F" opacity=".5"/>
<!-- Eyes -->
<ellipse cx="84" cy="116" rx="12" ry="13" fill="white"/>
<ellipse cx="116" cy="116" rx="12" ry="13" fill="white"/>
<circle cx="84.5" cy="116.5" r="9" fill="url(#eyA4)"/>
<circle cx="116.5" cy="116.5" r="9" fill="url(#eyA4)"/>
<circle cx="85" cy="117" r="5" fill="#0A0400"/>
<circle cx="117" cy="117" r="5" fill="#0A0400"/>
<circle cx="81" cy="113" r="3.5" fill="white"/>
<circle cx="113" cy="113" r="3.5" fill="white"/>
<circle cx="87" cy="119" r="1.8" fill="white" opacity=".55"/>
<circle cx="119" cy="119" r="1.8" fill="white" opacity=".55"/>
<!-- Brows -->
<path d="M72 109 Q84 104 96 108" stroke="#1C0E06" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M104 108 Q116 104 128 109" stroke="#1C0E06" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<!-- Wide nose -->
<ellipse cx="100" cy="130" rx="9" ry="5" fill="#C87940" opacity=".35"/>
<path d="M92 128 Q100 135 108 128" stroke="#A0622A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<!-- Massive grin -->
<path d="M70 144 Q100 168 130 144" stroke="#78350F" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M70 144 Q100 166 130 144" fill="white" opacity=".85"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#D97706"/>
<path d="M76 172 L100 184 L124 172" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: 'Karim',
    emoji: '😎',
    // Guy, sideways cap, shield sunglasses, smirk
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA5" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#1E3A8A"/></radialGradient>
  <radialGradient id="skA5" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <filter id="fA5" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA5)" rx="18"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA5)" filter="url(#fA5)"/>
<ellipse cx="54" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<ellipse cx="146" cy="118" rx="7" ry="10" fill="#E8A06A"/>
<!-- Sideways snapback cap -->
<ellipse cx="108" cy="88" rx="52" ry="20" fill="#1D4ED8"/>
<ellipse cx="108" cy="85" rx="52" ry="18" fill="#1E40AF"/>
<!-- Brim tilted right -->
<ellipse cx="148" cy="98" rx="28" ry="10" fill="#1D4ED8" transform="rotate(-20 148 98)"/>
<!-- Cap logo -->
<circle cx="98" cy="83" r="9" fill="#3B82F6" opacity=".85"/>
<text x="93.5" y="87" font-size="9" fill="white" font-weight="bold" font-family="Arial">NY</text>
<!-- Hair under cap -->
<ellipse cx="60" cy="100" rx="14" ry="10" fill="#1C0E06"/>
<!-- Shield sunglasses -->
<rect x="62" y="106" width="76" height="24" rx="12" fill="#111827" opacity=".94"/>
<rect x="62" y="106" width="76" height="24" rx="12" fill="none" stroke="#374151" stroke-width="2"/>
<!-- Lens shine -->
<path d="M70 113 Q80 110 90 113" stroke="white" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>
<path d="M110 113 Q120 110 130 113" stroke="white" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>
<!-- Nose -->
<path d="M96 132 Q100 138 104 132" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- Smirk -->
<path d="M76 145 Q96 158 118 148" stroke="#92400E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 145 Q96 157 118 148" fill="white" opacity=".55"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#1D4ED8"/>
<path d="M76 172 L100 184 L124 172" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: 'Rania',
    emoji: '🎵',
    // Girl, long auburn hair, headphones, bright smile
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA6" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#F9A8D4"/><stop offset="100%" stop-color="#831843"/></radialGradient>
  <radialGradient id="skA6" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA6" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA6" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA6)" rx="18"/>
<!-- Long hair back -->
<rect x="52" y="88" width="18" height="70" rx="9" fill="#7C2D12"/>
<rect x="130" y="88" width="18" height="70" rx="9" fill="#7C2D12"/>
<ellipse cx="100" cy="118" rx="46" ry="48" fill="url(#skA6)" filter="url(#fA6)"/>
<!-- Hair top -->
<ellipse cx="100" cy="82" rx="48" ry="22" fill="#7C2D12"/>
<!-- Headphone arc -->
<path d="M52 106 Q52 66 100 62 Q148 66 148 106" stroke="#1C1412" stroke-width="7" fill="none"/>
<!-- Headphone cups -->
<rect x="40" y="100" width="24" height="36" rx="10" fill="#1C1412"/>
<rect x="136" y="100" width="24" height="36" rx="10" fill="#1C1412"/>
<ellipse cx="52" cy="118" rx="10" ry="14" fill="#374151"/>
<ellipse cx="148" cy="118" rx="10" ry="14" fill="#374151"/>
<ellipse cx="50" cy="112" rx="4" ry="3" fill="white" opacity=".18"/>
<ellipse cx="146" cy="112" rx="4" ry="3" fill="white" opacity=".18"/>
<!-- Eyes -->
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
<!-- Lashes -->
<path d="M74 107 Q79 103 84 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M106 107 Q111 103 116 107" stroke="#1C0E06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<!-- Brows -->
<path d="M72 106 Q84 102 96 106" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M104 106 Q116 102 128 106" stroke="#1C0E06" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- Nose -->
<path d="M96 124 Q100 130 104 124" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- Blush -->
<ellipse cx="70" cy="126" rx="12" ry="7" fill="#F9A8D4" opacity=".55"/>
<ellipse cx="130" cy="126" rx="12" ry="7" fill="#F9A8D4" opacity=".55"/>
<!-- Smile -->
<path d="M76 136 Q100 154 124 136" stroke="#B45309" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 136 Q100 152 124 136" fill="white" opacity=".7"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#DB2777"/>
</svg>`,
  },
  {
    name: 'Sara',
    emoji: '🧕',
    // Hijabi girl, teal hijab, almond eyes, warm smile
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgA7" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#2DD4BF"/><stop offset="100%" stop-color="#0F4C45"/></radialGradient>
  <radialGradient id="skA7" cx="42%" cy="32%" r="62%"><stop offset="0%" stop-color="#FFE8CC"/><stop offset="40%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A06A"/></radialGradient>
  <radialGradient id="eyA7" cx="30%" cy="25%" r="75%"><stop offset="0%" stop-color="#6B3A1F"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
  <filter id="fA7" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/></filter>
</defs>
<rect width="200" height="200" fill="url(#bgA7)" rx="18"/>
<ellipse cx="100" cy="118" rx="44" ry="46" fill="url(#skA7)" filter="url(#fA7)"/>
<!-- Teal hijab -->
<ellipse cx="100" cy="90" rx="58" ry="42" fill="#0D9488"/>
<ellipse cx="100" cy="126" rx="64" ry="42" fill="#0D9488"/>
<ellipse cx="38" cy="132" rx="18" ry="40" fill="#0F766E"/>
<ellipse cx="162" cy="132" rx="18" ry="40" fill="#0F766E"/>
<ellipse cx="100" cy="92" rx="42" ry="28" fill="#0F766E"/>
<!-- Hijab highlight fold -->
<path d="M58 90 Q100 76 142 90" stroke="#14B8A6" stroke-width="3.5" fill="none" opacity=".65" stroke-linecap="round"/>
<ellipse cx="82" cy="80" rx="26" ry="14" fill="#14B8A6" opacity=".38"/>
<!-- Eyes — almond -->
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
<!-- Long dramatic lashes -->
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
<!-- Nose -->
<path d="M96 120 Q100 126 104 120" stroke="#C87940" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- Blush teal tinted -->
<ellipse cx="68" cy="122" rx="12" ry="7" fill="#99F6E4" opacity=".42"/>
<ellipse cx="132" cy="122" rx="12" ry="7" fill="#99F6E4" opacity=".42"/>
<!-- Warm smile -->
<path d="M76 132 Q100 150 124 132" stroke="#B45309" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M76 132 Q100 148 124 132" fill="white" opacity=".65"/>
<ellipse cx="100" cy="188" rx="50" ry="18" fill="#0D9488"/>
</svg>`,
  },
]

// ── PARTICIPANT ANIMATION STATES ──────────────────────────────────────────────
// Each participant gets a random idle animation: bob, think, nod, lean
const ANIM_CLASSES = [
  'anim-bob',
  'anim-think',
  'anim-nod',
  'anim-lean',
  'anim-bob',
  'anim-nod',
  'anim-think',
]

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

  // Typewriter
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
    {text:'This class is incredible 🙌', from:'Sami', isDali:false},
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
    <main className="min-h-screen bg-[#F8F9FF] font-sans" dir={isAr?'rtl':'ltr'}>
      <style>{`
        /* ── Reveal ── */
        .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}

        /* ── Blobs ── */
        .blob{position:absolute;border-radius:50%;filter:blur(65px);}
        .b1{animation:b1 10s ease-in-out infinite;}
        .b2{animation:b2 13s ease-in-out infinite;}
        .b3{animation:b3 8s ease-in-out infinite;}
        @keyframes b1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(30px,20px) scale(1.1);}66%{transform:translate(-10px,30px) scale(.95);}}
        @keyframes b2{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(-25px,-20px) scale(1.05);}66%{transform:translate(15px,-10px) scale(1.1);}}
        @keyframes b3{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(20px,-15px) scale(1.15);}}

        /* ── Float words ── */
        .float-word{animation:fw linear infinite;}
        @keyframes fw{0%,100%{transform:translateY(0) rotate(var(--r));}50%{transform:translateY(-10px) rotate(var(--r));}}

        /* ── Dali whiteboard animation ── */
        .dali-wrap svg #dali-arm{
          animation:pointArm 3s ease-in-out infinite;
          transform-origin: 148px 108px;
        }
        @keyframes pointArm{
          0%,100%{transform:rotate(0deg);}
          25%{transform:rotate(-12deg) translateY(-4px);}
          50%{transform:rotate(8deg) translateY(2px);}
          75%{transform:rotate(-6deg) translateY(-2px);}
        }
        .dali-wrap{animation:daliFloat 4s ease-in-out infinite;}
        @keyframes daliFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}

        /* ── Speaking ring ── */
        .speaking-ring{animation:sp 1.2s ease-in-out infinite;}
        @keyframes sp{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.5);}50%{box-shadow:0 0 0 7px rgba(99,102,241,0);}}

        /* ── Participant idle animations ── */
        .anim-bob{animation:avBob 3.5s ease-in-out infinite;}
        @keyframes avBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}

        .anim-think{animation:avThink 4s ease-in-out infinite;}
        @keyframes avThink{0%,100%{transform:rotate(0deg) translateY(0);}30%{transform:rotate(-6deg) translateY(-3px);}70%{transform:rotate(4deg) translateY(-1px);}}

        .anim-nod{animation:avNod 2.8s ease-in-out infinite;}
        @keyframes avNod{0%,100%{transform:translateY(0) scaleY(1);}40%{transform:translateY(-6px) scaleY(1.02);}80%{transform:translateY(-2px) scaleY(.99);}}

        .anim-lean{animation:avLean 5s ease-in-out infinite;}
        @keyframes avLean{0%,100%{transform:rotate(0deg);}35%{transform:rotate(5deg);}70%{transform:rotate(-3deg);}}

        /* ── Avatar pop-in ── */
        .av-cell{opacity:0;transform:scale(0);transition:opacity .3s ease,transform .4s cubic-bezier(.34,1.56,.64,1);}
        .av-cell.show{opacity:1;transform:scale(1);}

        /* ── Chat message ── */
        .chat-in{animation:cin .35s ease forwards;}
        @keyframes cin{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}

        /* ── Progress bar ── */
        .progress-fill{transition:width .1s linear;}

        /* ── Topic card ── */
        .topic-card{transition:all .25s ease;}
        .topic-card:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(0,0,0,.06);}

        /* ── Package card ── */
        .pkg-card{transition:all .3s ease;}
        .pkg-card:hover{transform:translateY(-4px);}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-indigo-50">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="tracking-tight whitespace-nowrap leading-none">
              <span className="text-lg font-black text-indigo-600">English</span>
              <span className="text-base font-light text-gray-400"> with </span>
              <span className="text-lg font-bold text-indigo-500">Dali</span>
            </span>
            <span className="text-xl leading-none">🇹🇳</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex gap-0.5 items-center">
            {['topics','classes','live','community'].map(item => (
              <a key={item} href={`#${item}`} className="px-3 py-2 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium capitalize">{item}</a>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg">
              {(['en','fr','ar'] as const).map(l => (
                <button key={l} onClick={()=>setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${lang===l?'bg-white text-indigo-600 shadow-sm':'text-gray-400 hover:text-gray-600'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank"
              className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse flex-shrink-0"/>
              {t.nextLive}: {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
            </a>
            <a href="#signup" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-sm font-bold shadow-md shadow-indigo-200 whitespace-nowrap">
              {t.joinBtn}
            </a>
          </div>

          <button className="md:hidden border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium" onClick={()=>setMenuOpen(!menuOpen)}>
            {menuOpen?'✕':'☰'}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-indigo-50 px-5 py-4 flex flex-col gap-2">
            <div className="flex gap-1 mb-2">
              {(['en','fr','ar'] as const).map(l => (
                <button key={l} onClick={()=>{setLang(l);setMenuOpen(false)}}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${lang===l?'bg-indigo-600 text-white':'bg-gray-100 text-gray-500'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {['topics','classes','live','community'].map(item => (
              <a key={item} href={`#${item}`} onClick={()=>setMenuOpen(false)}
                className="px-3 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-medium capitalize">{item}</a>
            ))}
            <a href="#signup" className="bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold text-center mt-1 shadow-md shadow-indigo-200">{t.joinBtn}</a>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 25% 50%,rgba(99,102,241,.09) 0%,transparent 55%),radial-gradient(ellipse at 75% 30%,rgba(6,182,212,.07) 0%,transparent 50%)'}}/>
        <div className="blob b1 w-72 h-72 bg-indigo-200/20 absolute -top-20 -left-20"/>
        <div className="blob b2 w-56 h-56 bg-cyan-200/15 absolute -bottom-10 -right-10"/>
        <div className="blob b3 w-44 h-44 bg-purple-200/15 absolute top-1/2 left-1/3"/>

        {/* Floating words — safely inside right half */}
        {[
          {text:'current events 🌍', top:'8%',  left:'58%', color:'#6366F1', bg:'#EEF2FF', r:'-3deg', dur:'4s'},
          {text:'trending 🔥',       top:'14%', left:'74%', color:'#DC2626', bg:'#FEF2F2', r:'2deg',  dur:'5s',   delay:'.5s'},
          {text:'live class 🎙️',    top:'70%', left:'57%', color:'#065F46', bg:'#DCFCE7', r:'-2deg', dur:'4.5s', delay:'1s'},
          {text:'speak freely 💬',   top:'78%', left:'74%', color:'#6D28D9', bg:'#EDE9FE', r:'3deg',  dur:'5.5s', delay:'.3s'},
          {text:'real english 🎯',   top:'48%', left:'56%', color:'#B45309', bg:'#FEF3C7', r:'-1deg', dur:'6s',   delay:'.8s'},
        ].map((w,i) => (
          <div key={i} className="float-word absolute text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap z-10 hidden lg:block"
            style={{top:w.top, left:w.left, color:w.color, background:w.bg, '--r':w.r, animationDuration:w.dur, animationDelay:(w as any).delay||'0s'} as React.CSSProperties}>
            {w.text}
          </div>
        ))}

        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-500 text-xs px-3 py-1.5 rounded-full mb-5 font-semibold">
              <span>🇹🇳</span>{t.tagline}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-950 leading-tight mb-3 tracking-tight">
              {t.hero1}<br/>
              {t.hero2}<br/>
              <span className="text-indigo-500">{displayed}</span>
              <span className="text-cyan-400 animate-pulse">|</span>
            </h1>
            <p className="text-gray-400 text-base mb-7 leading-relaxed max-w-md">{t.sub}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <a href="#classes"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 text-sm font-bold whitespace-nowrap">
                {t.joinBtn} →
              </a>
              <a href="https://www.instagram.com/ielts.tn" target="_blank"
                className="inline-flex items-center gap-2 bg-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm whitespace-nowrap"
                style={{border:'1.5px solid transparent',background:'linear-gradient(white,white) padding-box, linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045) border-box'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <defs><linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F59E0B"/><stop offset="50%" stopColor="#EF4444"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
                  <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#igGrad)" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="url(#igGrad)" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="#EF4444"/>
                </svg>
                <span style={{background:'linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  {t.dmBtn}
                </span>
              </a>
            </div>
            <a href="https://wa.me/216XXXXXXXX" target="_blank"
              className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-xl hover:bg-green-100 active:scale-95 transition-all text-sm font-semibold">
              💬 {t.waBtn}
            </a>
            <div className="mt-7 flex items-center gap-2 flex-wrap">
              {[{n:'500K+',l:'TikTok'},{n:'12K+',l:'students'},{n:'4.9★',l:'rating'},{n:'live',l:'classes'}].map(s => (
                <div key={s.l} className="bg-white border border-indigo-50 rounded-xl px-3 py-2 text-center shadow-sm">
                  <div className="text-sm font-bold text-indigo-950">{s.n}</div>
                  <div className="text-xs text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Class Visual */}
          <div className="flex flex-col gap-3">
            {/* Progress bar cycling topics */}
            <div className="bg-white border border-indigo-50 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                  <span>{activeTopic.icon}</span><span>{activeTopic.topic}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/>
                  <span className="text-xs font-bold text-red-500">LIVE</span>
                </div>
              </div>
              <div className="h-2 bg-indigo-50 rounded-full overflow-hidden mb-2">
                <div className="progress-fill h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{width:`${topicProgress}%`}}/>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {CLASS_TOPICS.map((_,i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i===activeTopicIndex?'w-6 bg-indigo-500':'w-2 bg-indigo-100'}`}/>
                  ))}
                </div>
                <span className="text-xs text-gray-400">{activeTopic.level} · {activeTopic.participants} students</span>
              </div>
            </div>

            {/* Live class card */}
            <div className="bg-white border border-indigo-50 rounded-2xl p-4 shadow-lg shadow-indigo-100/50">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-50 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
                  <span className="text-xs font-bold text-indigo-950">Live Class — {activeTopic.icon} {activeTopic.topic}</span>
                </div>
                <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">👥 {activeTopic.participants}</span>
              </div>

              {/* Avatar grid */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {allAvatars.map((av,i) => (
                  <div key={i}
                    className={`av-cell ${visibleP.includes(i)?'show':''} aspect-square rounded-xl overflow-hidden relative ${av.isDali ? 'dali-wrap' : ANIM_CLASSES[i-1] || 'anim-bob'}`}
                    style={{transitionDelay:`${i*0.08}s`}}>
                    <div dangerouslySetInnerHTML={{__html:av.svg}} className="w-full h-full"/>
                    {speakingP === i && (
                      <div className="speaking-ring absolute inset-0 rounded-xl border-2 border-indigo-400"/>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 text-center bg-black/40 backdrop-blur-sm text-white font-bold py-0.5 truncate px-1" style={{fontSize:'8px'}}>
                      {av.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live chat */}
              <div className="bg-gray-50 rounded-xl p-2.5 min-h-[72px] flex flex-col gap-1.5">
                <div className="text-xs font-bold text-gray-400 mb-0.5">live chat</div>
                {chatMsgs.map(msg => (
                  <div key={msg.id} className="chat-in flex items-start gap-1.5">
                    <span className={`text-xs font-bold flex-shrink-0 ${msg.isDali?'text-indigo-600':'text-gray-500'}`}>{msg.from}:</span>
                    <span className="text-xs text-gray-600 leading-relaxed">{msg.text}</span>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 mt-2.5 pt-2.5 border-t border-indigo-50">
                {[{icon:'🎤',l:'mute'},{icon:'📹',l:'video'},{icon:'✋',l:'hand'},{icon:'💬',l:'chat'}].map(c => (
                  <button key={c.l} className="flex flex-col items-center gap-0.5 group">
                    <div className="w-8 h-8 bg-gray-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center text-sm transition-colors">{c.icon}</div>
                    <span className="text-xs text-gray-400">{c.l}</span>
                  </button>
                ))}
                <button className="ml-auto bg-red-50 text-red-500 border border-red-100 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">leave</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOPICS ──────────────────────────────────────────── */}
      <section id="topics" ref={addRef(0)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">{t.topicsTag}</div>
        <h2 className="text-2xl font-bold text-indigo-950 mb-1">{t.topicsH}</h2>
        <p className="text-gray-400 text-sm mb-8">{t.topicsSub}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOPICS.map(tp => {
            const c = COLOR_MAP[tp.color]
            return (
              <div key={tp.en} className={`topic-card border-2 ${c.border} ${c.bg} rounded-2xl px-4 py-5 flex items-center gap-3 cursor-pointer`}>
                <span className="text-2xl">{tp.icon}</span>
                <span className={`text-sm font-bold ${c.text}`}>{lang==='ar'?tp.ar:lang==='fr'?tp.fr:tp.en}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section ref={addRef(1)} className="reveal max-w-6xl mx-auto px-6 py-8">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">{t.howTag}</div>
        <h2 className="text-2xl font-bold text-indigo-950 mb-1">{t.howH}</h2>
        <p className="text-gray-400 text-sm mb-8">{t.howSub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.steps.map(s => (
            <div key={s.n} className="bg-white border border-indigo-50 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="text-xs font-bold text-indigo-200 mb-3">{s.n}</div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-sm font-bold text-indigo-950 mb-2">{s.t}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────────────────────── */}
      <section id="classes" ref={addRef(2)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">{t.classesTag}</div>
        <h2 className="text-2xl font-bold text-indigo-950 mb-1">{t.classesH}</h2>
        <p className="text-gray-400 text-sm mb-8">{t.classesSub}</p>

        {/* Coming soon banner */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 border border-indigo-100 rounded-3xl p-8 text-center mb-10">
          <div className="flex justify-center gap-3 mb-5 flex-wrap">
            {['🗞️','🎙️','🌍','📊','🤖','🏛️','💰','🎬'].map((icon,i) => (
              <div key={i} className="w-11 h-11 bg-white border border-indigo-100 rounded-xl flex items-center justify-center text-lg shadow-sm float-word"
                style={{'--r':'0deg',animationDuration:`${3+i*.4}s`,animationDelay:`${i*.15}s`} as React.CSSProperties}>
                {icon}
              </div>
            ))}
          </div>
          <h3 className="text-xl font-bold text-indigo-950 mb-2">{t.comingSoon}</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">{t.comingSoonSub}</p>
          <a href="#signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-sm font-bold shadow-lg shadow-indigo-200">
            {t.notifyBtn} →
          </a>
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.packages.map((pkg) => {
            const c = COLOR_MAP[pkg.accent]
            return (
              <div key={pkg.id} className={`pkg-card bg-white rounded-2xl p-6 border-2 ${c.border} relative ${(pkg as any).popular?`ring-2 ${c.ring}`:''}`}>
                {(pkg as any).popular && <div className={`absolute -top-3 left-6 ${c.btn.split(' ')[0]} text-white text-xs px-3 py-1 rounded-full font-bold`}>most popular</div>}
                {(pkg as any).premium && <div className="absolute -top-3 left-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-bold">limited spots</div>}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${c.bg} border ${c.border} rounded-2xl flex items-center justify-center text-2xl`}>{pkg.icon}</div>
                    <div>
                      <div className="text-base font-bold text-indigo-950">{pkg.name}</div>
                      <div className={`text-xs font-semibold ${c.text}`}>{pkg.tagline}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-950">${pkg.price[activePrice]}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                    <div className={`text-xs font-semibold ${c.text}`}>≈ {pkg.tnd[activePrice]} TND</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{pkg.desc}</p>
                <div className="grid grid-cols-2 gap-1.5 mb-5">
                  {pkg.features.map(f => (
                    <div key={f} className="flex items-start gap-1.5 text-xs text-gray-500">
                      <span className={`${c.text} font-bold mt-0.5 flex-shrink-0`}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href="#signup" className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md ${c.shadow} ${c.btn}`}>{pkg.cta}</a>
              </div>
            )
          })}
        </div>

        {/* Price toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="text-sm text-gray-400">{t.monthly}</span>
          <button onClick={()=>setActivePrice(p=>p==='m'?'y':'m')}
            className={`w-12 h-6 rounded-full transition-colors relative ${activePrice==='y'?'bg-indigo-600':'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${activePrice==='y'?'left-6':'left-0.5'}`}/>
          </button>
          <span className={`text-sm font-semibold ${activePrice==='y'?'text-indigo-600':'text-gray-400'}`}>{t.yearly}</span>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          {t.notSure} <a href="https://wa.me/216XXXXXXXX" target="_blank" className="text-green-600 font-bold hover:underline">{t.waLink}</a>
        </p>
      </section>

      {/* ── LIVE ────────────────────────────────────────────── */}
      <section id="live" ref={addRef(3)} className="reveal max-w-6xl mx-auto px-6 py-8">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">{t.liveTag}</div>
        <h2 className="text-2xl font-bold text-indigo-950 mb-1">{t.liveH}</h2>
        <p className="text-gray-400 text-sm mb-6">{t.liveSub}</p>
        <div className="bg-white border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center text-2xl shadow-md shadow-indigo-200">🎙️</div>
            <div>
              <div className="text-sm font-bold text-indigo-950">friday live session</div>
              <div className="text-xs text-gray-400 mt-0.5">every week · 8:00 PM Tunisia time</div>
              <div className="text-xs text-indigo-500 font-bold mt-1">TikTok Live & Instagram Live</div>
            </div>
          </div>
          <div className="flex gap-2">
            {[{v:countdown.d,l:t.days},{v:countdown.h,l:t.hours},{v:countdown.m,l:t.min},{v:countdown.s,l:t.sec}].map(ct => (
              <div key={ct.l} className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 min-w-[52px] text-center">
                <div className="text-lg font-bold text-indigo-600">{String(ct.v).padStart(2,'0')}</div>
                <div className="text-xs text-gray-400">{ct.l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank" className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all">🎵 tiktok</a>
            <a href="https://www.instagram.com/ielts.tn" target="_blank"
              className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all"
              style={{background:'linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg>
              instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ───────────────────────────────────────── */}
      <section id="community" ref={addRef(4)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">{t.communityTag}</div>
        <h2 className="text-2xl font-bold text-indigo-950 mb-1">{t.communityH}</h2>
        <p className="text-gray-400 text-sm mb-6">{t.communitySub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {href:'https://www.instagram.com/ielts.tn', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>, label:'instagram', sub:'DM @ielts.tn', style:{background:'linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)'}, hover:'hover:border-pink-200'},
            {href:'https://wa.me/216XXXXXXXX', icon:'💬', label:'whatsapp', sub:'message directly', bg:'bg-green-500', hover:'hover:border-green-200'},
            {href:'https://www.tiktok.com/@ielts.tn', icon:'🎵', label:'tiktok', sub:'@ielts.tn · 500K+', bg:'bg-black', hover:'hover:border-gray-300'},
          ].map((s,i) => (
            <a key={i} href={s.href} target="_blank"
              className={`flex items-center gap-4 bg-white border border-indigo-50 rounded-2xl p-5 ${s.hover} hover:shadow-md transition-all group`}>
              <div className={`w-12 h-12 ${(s as any).bg||''} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`} style={(s as any).style||{}}>{s.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-indigo-950">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
              </div>
              <span className="text-gray-300 group-hover:translate-x-1 transition-transform">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── SIGNUP ──────────────────────────────────────────── */}
      <section id="signup" ref={addRef(5)} className="reveal py-16 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-3xl p-8 md:p-12 border border-indigo-100">
          <div className="max-w-sm mx-auto">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 text-center">{t.signupTag}</div>
            <h2 className="text-2xl font-bold text-indigo-950 mb-1 text-center">{t.signupH}</h2>
            <p className="text-sm text-gray-400 text-center mb-8">{t.signupSub}</p>
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-indigo-100/50 flex flex-col gap-3">
              <input type="text" placeholder={t.namePH} value={name} onChange={e=>setName(e.target.value)}
                className="border border-indigo-100 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-gray-50 transition-all"/>
              <input type="email" placeholder={t.emailPH} value={email} onChange={e=>setEmail(e.target.value)}
                className="border border-indigo-100 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-gray-50 transition-all"/>
              <input type="password" placeholder={t.passPH} value={password} onChange={e=>setPassword(e.target.value)}
                className="border border-indigo-100 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-gray-50 transition-all"/>
              {message && <p className="text-sm text-center text-indigo-500 font-semibold">{message}</p>}
              <button onClick={handleSignup} disabled={loading}
                className="bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200">
                {loading ? t.creating : t.signupBtn2}
              </button>
              <p className="text-xs text-gray-400 text-center">
                {t.loginQ} <a href="/login" className="text-indigo-500 font-bold hover:underline">{t.loginLink}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-indigo-50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="tracking-tight">
              <span className="text-base font-black text-indigo-600">English</span>
              <span className="text-sm font-light text-gray-400"> with </span>
              <span className="text-base font-bold text-indigo-500">Dali</span>
            </span>
            <span>🇹🇳</span>
          </div>
          <div className="flex gap-5 text-sm text-gray-400 flex-wrap justify-center">
            <a href="#" className="hover:text-indigo-500 transition-colors">privacy</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">terms</a>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank" className="hover:text-indigo-500 transition-colors">tiktok ↗</a>
            <a href="https://www.instagram.com/ielts.tn" target="_blank" className="hover:text-indigo-500 transition-colors">instagram ↗</a>
          </div>
          <div className="text-xs text-gray-300">© 2026 English with Dali</div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ───────────────────────────────── */}
      <a href="https://wa.me/216XXXXXXXX" target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-2xl shadow-xl shadow-green-200 hover:scale-110 active:scale-95 transition-all">
        💬
      </a>
    </main>
  )
}