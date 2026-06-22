'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

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
    monthly: 'monthly',
    yearly: 'yearly (-20%)',
    signupTag: 'get started',
    signupH: 'create your free account',
    signupSub: 'free account · first class included',
    namePH: 'full name',
    emailPH: 'email address',
    passPH: 'password',
    signupBtn2: 'create account — first class free',
    creating: 'creating account...',
    loginQ: 'already have an account?',
    loginLink: 'log in',
    notSure: 'not sure which package?',
    waLink: 'ask on whatsapp ↗',
    nextLive: 'next live',
    days: 'd', hours: 'h', min: 'm', sec: 's',
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
    joinBtn: "rejoindre un cours",
    dmBtn: "DM sur instagram",
    waBtn: "écrire sur whatsapp",
    topicsTag: "ce qu'on discute",
    topicsH: "vrais sujets. vrai anglais.",
    topicsSub: "chaque cours est ancré dans l'actualité mondiale du moment",
    howTag: "comment ça marche",
    howH: "rejoins, parle, progresse",
    howSub: "trois étapes — sans manuel scolaire",
    steps: [
      { n:'01', icon:'🎯', t:'choisis ton cours', d:"Parcours les sessions en direct par thème. Actualité, finance, culture — réserve ta place sur ce qui t'intéresse." },
      { n:'02', icon:'🎙️', t:'rejoins & parle', d:"Intègre le cours vidéo en direct. Dali anime la conversation en anglais, tu participes, tu poses des questions, tu fais des erreurs — c'est ça l'idée." },
      { n:'03', icon:'🚀', t:'suis ta progression', d:"Vois ton vocabulaire s'élargir, reçois des retours personnalisés après chaque cours et observe ta confiance grandir semaine après semaine." },
    ],
    classesTag: "cours en direct",
    classesH: "choisis ton programme",
    classesSub: "des programmes structurés autour de tes besoins réels",
    comingSoon: "Premiers cours bientôt disponibles",
    comingSoonSub: "Inscris-toi maintenant et sois le premier à réserver. Les premiers membres obtiennent leur premier cours gratuit.",
    notifyBtn: "réserver ma place — gratuit",
    liveTag: "prochaine session",
    liveH: "rejoins le prochain live",
    liveSub: "chaque vendredi à 20h heure tunisienne — ouvert à tous",
    communityTag: "contacter dali",
    communityH: "écrire directement",
    communitySub: "questions sur un cours ? pas sûr du programme ? Dali répond personnellement.",
    monthly: "mensuel",
    yearly: "annuel (-20%)",
    signupTag: "commencer",
    signupH: "créer ton compte gratuit",
    signupSub: "compte gratuit · premier cours inclus",
    namePH: "nom complet",
    emailPH: "adresse email",
    passPH: "mot de passe",
    signupBtn2: "créer un compte — premier cours offert",
    creating: "création en cours...",
    loginQ: "déjà un compte ?",
    loginLink: "se connecter",
    notSure: "pas sûr du programme ?",
    waLink: "demander sur whatsapp ↗",
    nextLive: "prochain live",
    days: "j", hours: "h", min: "m", sec: "s",
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
    joinBtn: 'احجز درسك',
    dmBtn: 'راسلنا على انستغرام',
    waBtn: 'تحدّث على واتساب',
    topicsTag: 'شنو نحكيو فيه',
    topicsH: 'مواضيع حقيقية. إنجليزية حقيقية.',
    topicsSub: 'كل درس مبني على شيء يصير في العالم هذا الوقت',
    howTag: 'كيفاش يخدم',
    howH: 'انضم، تكلّم، تطوّر',
    howSub: 'ثلاث خطوات — بلا كتب ولا حفظ',
    steps: [
      { n:'٠١', icon:'🎯', t:'اختار درسك', d:'شوف الجلسات المباشرة حسب الموضوع. أحداث راهنة، فلوس، ثقافة — احجز مكانك في اللي يهمّك.' },
      { n:'٠٢', icon:'🎙️', t:'انضم وتكلّم', d:'ادخل الدرس المباشر. الأستاذ دالي يقود النقاش بالإنجليزية، أنت تشارك وتسأل وتغلط — هذا هو المطلوب.' },
      { n:'٠٣', icon:'🚀', t:'تابع تطوّرك', d:'شوف كيف تتوسّع مفرداتك، خذ ملاحظات شخصية بعد كل درس، وراقب ثقتك تكبر أسبوع بأسبوع.' },
    ],
    classesTag: 'الدروس المباشرة',
    classesH: 'اختار برنامجك',
    classesSub: 'برامج مهيكلة حسب احتياجاتك الحقيقية',
    comingSoon: 'أوّل الدروس قريبًا',
    comingSoonSub: 'سجّل هالوقت وكن أوّل من يحجز. الأعضاء الأوائل يأخذون أوّل درس مجّانًا.',
    notifyBtn: 'احجز مكاني — مجّانًا',
    liveTag: 'الجلسة القادمة',
    liveH: 'انضم للبث القادم',
    liveSub: 'كل جمعة الساعة 8 مساءً بتوقيت تونس — مفتوح للجميع',
    communityTag: 'تواصل مع دالي',
    communityH: 'راسل مباشرة',
    communitySub: 'عندك سؤال على درس؟ ما عرفتش تختار؟ الأستاذ دالي يردّ شخصيًا.',
    monthly: 'شهري',
    yearly: 'سنوي (-20%)',
    signupTag: 'ابدأ الرحلة',
    signupH: 'أنشئ حسابك المجاني',
    signupSub: 'حساب مجاني · أوّل درس مشمول',
    namePH: 'الاسم الكامل',
    emailPH: 'البريد الإلكتروني',
    passPH: 'كلمة المرور',
    signupBtn2: 'أنشئ حساب — أوّل درس مجّاني',
    creating: 'جاري إنشاء الحساب...',
    loginQ: 'عندك حساب بالفعل؟',
    loginLink: 'تسجيل الدخول',
    notSure: 'ما عرفتش تختار؟',
    waLink: 'اسأل على واتساب ↗',
    nextLive: 'البث القادم',
    days: 'أيام', hours: 'ساعات', min: 'دق', sec: 'ثا',
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
  cyan:  {bg:'bg-cyan-50',  text:'text-cyan-600',  border:'border-cyan-200',  ring:'ring-cyan-100',  btn:'bg-cyan-500 hover:bg-cyan-600 text-white',    shadow:'shadow-cyan-200'},
  violet:{bg:'bg-violet-50',text:'text-violet-600',border:'border-violet-200',ring:'ring-violet-100',btn:'bg-violet-600 hover:bg-violet-700 text-white',shadow:'shadow-violet-200'},
  pink:  {bg:'bg-pink-50',  text:'text-pink-600',  border:'border-pink-200',  ring:'ring-pink-100',  btn:'bg-pink-500 hover:bg-pink-600 text-white',    shadow:'shadow-pink-200'},
  blue:  {bg:'bg-blue-50',  text:'text-blue-600',  border:'border-blue-100',  ring:'',btn:'',shadow:''},
  red:   {bg:'bg-red-50',   text:'text-red-500',   border:'border-red-100',   ring:'',btn:'',shadow:''},
  purple:{bg:'bg-purple-50',text:'text-purple-600',border:'border-purple-100',ring:'',btn:'',shadow:''},
  amber: {bg:'bg-amber-50', text:'text-amber-600', border:'border-amber-100', ring:'',btn:'',shadow:''},
  green: {bg:'bg-green-50', text:'text-green-600', border:'border-green-100', ring:'',btn:'',shadow:''},
}

// ── GENMOJI-STYLE SVG AVATARS ────────────────────────────────────────────────
const DALI_SVG = `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="bgD" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#3730A3"/></radialGradient>
  <radialGradient id="skD" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE4C8"/><stop offset="60%" stop-color="#FBBF7A"/><stop offset="100%" stop-color="#E8965A"/></radialGradient>
  <radialGradient id="eyeD" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#6B4226"/><stop offset="100%" stop-color="#3D1F0A"/></radialGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.25"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bgD)"/>
<!-- whiteboard -->
<rect x="8" y="10" width="88" height="55" rx="6" fill="white" opacity=".22" filter="url(#shadow)"/>
<rect x="8" y="10" width="88" height="55" rx="6" fill="none" stroke="white" stroke-width="1.5" opacity=".5"/>
<line x1="18" y1="28" x2="68" y2="28" stroke="white" stroke-width="1.8" opacity=".55" stroke-linecap="round"/>
<line x1="18" y1="38" x2="56" y2="38" stroke="white" stroke-width="1.8" opacity=".55" stroke-linecap="round"/>
<line x1="18" y1="48" x2="74" y2="48" stroke="#67E8F9" stroke-width="2.5" opacity=".8" stroke-linecap="round"/>
<text x="18" y="56" font-size="7" fill="#67E8F9" opacity=".9" font-family="monospace">displace ≠ replace</text>
<!-- pointer arm -->
<line x1="118" y1="80" x2="94" y2="50" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity=".75"/>
<circle cx="94" cy="50" r="4" fill="#06B6D4"/>
<!-- neck -->
<ellipse cx="112" cy="110" rx="12" ry="8" fill="#FBBF7A"/>
<!-- face -->
<ellipse cx="112" cy="82" rx="30" ry="32" fill="url(#skD)" filter="url(#shadow)"/>
<!-- hair — dark, parted -->
<path d="M84 72 Q86 52 112 50 Q138 52 140 72 Q135 60 112 58 Q89 60 84 72Z" fill="#1C1412"/>
<ellipse cx="84" cy="74" rx="7" ry="14" fill="#1C1412"/>
<ellipse cx="140" cy="74" rx="7" ry="14" fill="#1C1412"/>
<!-- ear -->
<ellipse cx="83" cy="83" rx="5" ry="7" fill="#E8965A"/>
<ellipse cx="141" cy="83" rx="5" ry="7" fill="#E8965A"/>
<!-- glasses frames — rounded rectangles -->
<rect x="93" y="77" width="17" height="13" rx="5" fill="rgba(20,20,40,.08)" stroke="#1C1412" stroke-width="2.2"/>
<rect x="114" y="77" width="17" height="13" rx="5" fill="rgba(20,20,40,.08)" stroke="#1C1412" stroke-width="2.2"/>
<line x1="110" y1="83" x2="114" y2="83" stroke="#1C1412" stroke-width="2"/>
<line x1="93" y1="83" x2="88" y2="84.5" stroke="#1C1412" stroke-width="2"/>
<line x1="131" y1="83" x2="136" y2="84.5" stroke="#1C1412" stroke-width="2"/>
<!-- eyes -->
<circle cx="101.5" cy="83.5" r="4" fill="url(#eyeD)"/>
<circle cx="122.5" cy="83.5" r="4" fill="url(#eyeD)"/>
<circle cx="100.5" cy="82.2" r="1.6" fill="white"/>
<circle cx="121.5" cy="82.2" r="1.6" fill="white"/>
<circle cx="103" cy="84.5" r="1" fill="white" opacity=".5"/>
<circle cx="124" cy="84.5" r="1" fill="white" opacity=".5"/>
<!-- eyebrows -->
<path d="M94 75.5 Q101 73 108 75.5" stroke="#1C1412" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M115 75.5 Q122 73 129 75.5" stroke="#1C1412" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<!-- nose -->
<path d="M110 88 Q112 93 114 88" stroke="#C67A3A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<!-- stubble -->
<ellipse cx="112" cy="100" rx="16" ry="6" fill="#C4855A" opacity=".3"/>
<!-- smile -->
<path d="M100 96 Q112 104 124 96" stroke="#B45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<!-- body -->
<ellipse cx="112" cy="145" rx="30" ry="18" fill="#4338CA"/>
<path d="M96 128 L112 138 L128 128" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<!-- collar shirt -->
<ellipse cx="112" cy="128" rx="14" ry="6" fill="#6366F1"/>
</svg>`

// Genmoji-style photorealistic illustrated avatars
const AVATARS = [
  {
    name:'Amira ✨',
    svg:`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
<radialGradient id="bg1" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#F9A8D4"/><stop offset="100%" stop-color="#9D174D"/></radialGradient>
<radialGradient id="sk1" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE4C8"/><stop offset="60%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A86A"/></radialGradient>
<radialGradient id="eye1" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#5C3317"/><stop offset="100%" stop-color="#2D1505"/></radialGradient>
<filter id="sh1" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bg1)"/>
<ellipse cx="80" cy="92" rx="34" ry="36" fill="url(#sk1)" filter="url(#sh1)"/>
<!-- hair — space buns -->
<ellipse cx="80" cy="66" rx="32" ry="18" fill="#1A0E08"/>
<circle cx="52" cy="58" r="15" fill="#1A0E08"/>
<circle cx="108" cy="58" r="15" fill="#1A0E08"/>
<!-- bun circles -->
<circle cx="52" cy="58" r="10" fill="#EC4899"/>
<circle cx="108" cy="58" r="10" fill="#EC4899"/>
<circle cx="52" cy="58" r="6" fill="#BE185D"/>
<circle cx="108" cy="58" r="6" fill="#BE185D"/>
<!-- ears -->
<ellipse cx="46" cy="93" rx="6" ry="8" fill="#E8A86A"/>
<ellipse cx="114" cy="93" rx="6" ry="8" fill="#E8A86A"/>
<!-- eyes -->
<ellipse cx="68" cy="88" rx="7" ry="8" fill="white"/>
<ellipse cx="92" cy="88" rx="7" ry="8" fill="white"/>
<circle cx="68.5" cy="88.5" r="5.2" fill="url(#eye1)"/>
<circle cx="92.5" cy="88.5" r="5.2" fill="url(#eye1)"/>
<circle cx="66.8" cy="86.8" r="2.2" fill="white"/>
<circle cx="90.8" cy="86.8" r="2.2" fill="white"/>
<circle cx="70.5" cy="90.5" r="1" fill="white" opacity=".5"/>
<circle cx="94.5" cy="90.5" r="1" fill="white" opacity=".5"/>
<!-- lashes -->
<path d="M61 82 Q64 79 67 82" stroke="#1A0E08" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M85 82 Q88 79 91 82" stroke="#1A0E08" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<!-- brows -->
<path d="M61 83.5 Q68 81 75 83.5" stroke="#1A0E08" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M85 83.5 Q92 81 99 83.5" stroke="#1A0E08" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- nose -->
<path d="M77 95 Q80 100 83 95" stroke="#C67A3A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<!-- blush -->
<ellipse cx="58" cy="98" rx="8" ry="5" fill="#F9A8D4" opacity=".55"/>
<ellipse cx="102" cy="98" rx="8" ry="5" fill="#F9A8D4" opacity=".55"/>
<!-- big smile -->
<path d="M64 104 Q80 116 96 104" stroke="#B45309" stroke-width="2.8" fill="none" stroke-linecap="round"/>
<path d="M64 104 Q80 115 96 104" fill="#FDE68A" opacity=".3"/>
<!-- earrings -->
<circle cx="46" cy="102" r="3" fill="#FCD34D"/>
<circle cx="114" cy="102" r="3" fill="#FCD34D"/>
<!-- body -->
<ellipse cx="80" cy="148" rx="30" ry="16" fill="#BE185D"/>
</svg>`,
  },
  {
    name:'Sami 🎧',
    svg:`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
<radialGradient id="bg2" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#064E3B"/></radialGradient>
<radialGradient id="sk2" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE0A0"/><stop offset="60%" stop-color="#FBBF7A"/><stop offset="100%" stop-color="#D97706"/></radialGradient>
<radialGradient id="eye2" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#5C3317"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
<filter id="sh2" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bg2)"/>
<ellipse cx="80" cy="92" rx="34" ry="36" fill="url(#sk2)" filter="url(#sh2)"/>
<!-- fade haircut -->
<path d="M46 75 Q48 52 80 50 Q112 52 114 75 Q108 60 80 58 Q52 60 46 75Z" fill="#1A0E08"/>
<rect x="46" y="73" width="68" height="10" fill="#1A0E08"/>
<rect x="46" y="81" width="10" height="14" fill="#2D1F12" rx="3" opacity=".8"/>
<rect x="104" y="81" width="10" height="14" fill="#2D1F12" rx="3" opacity=".8"/>
<!-- ears -->
<ellipse cx="46" cy="93" rx="6" ry="8" fill="#D97706"/>
<ellipse cx="114" cy="93" rx="6" ry="8" fill="#D97706"/>
<!-- gold earring -->
<circle cx="46" cy="100" r="3.5" fill="#FCD34D" stroke="#D97706" stroke-width="1"/>
<!-- eyes -->
<ellipse cx="68" cy="88" rx="7" ry="8" fill="white"/>
<ellipse cx="92" cy="88" rx="7" ry="8" fill="white"/>
<circle cx="68.5" cy="88.5" r="5.2" fill="url(#eye2)"/>
<circle cx="92.5" cy="88.5" r="5.2" fill="url(#eye2)"/>
<circle cx="66.8" cy="86.8" r="2.2" fill="white"/>
<circle cx="90.8" cy="86.8" r="2.2" fill="white"/>
<!-- thick brows -->
<path d="M60 82 Q68 79 76 82" stroke="#1A0E08" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M84 82 Q92 79 100 82" stroke="#1A0E08" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- nose -->
<path d="M77 95 Q80 100 83 95" stroke="#B45309" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<!-- big smile with teeth -->
<path d="M63 104 Q80 116 97 104" stroke="#92400E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M63 104 Q80 115 97 104" fill="white" opacity=".7"/>
<!-- body -->
<ellipse cx="80" cy="148" rx="30" ry="16" fill="#059669"/>
<path d="M66 132 L80 142 L94 132" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name:'Nour 🌸',
    svg:`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
<radialGradient id="bg3" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#A78BFA"/><stop offset="100%" stop-color="#4C1D95"/></radialGradient>
<radialGradient id="sk3" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE4C8"/><stop offset="60%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A86A"/></radialGradient>
<radialGradient id="eye3" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#5C3317"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
<filter id="sh3" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bg3)"/>
<ellipse cx="80" cy="92" rx="34" ry="36" fill="url(#sk3)" filter="url(#sh3)"/>
<!-- hijab outer -->
<ellipse cx="80" cy="70" rx="40" ry="30" fill="#6D28D9"/>
<ellipse cx="80" cy="96" rx="44" ry="28" fill="#6D28D9"/>
<!-- hijab drape sides -->
<ellipse cx="42" cy="95" rx="12" ry="24" fill="#5B21B6"/>
<ellipse cx="118" cy="95" rx="12" ry="24" fill="#5B21B6"/>
<!-- hijab inner depth -->
<ellipse cx="80" cy="72" rx="30" ry="20" fill="#5B21B6"/>
<!-- hijab highlight -->
<ellipse cx="72" cy="62" rx="15" ry="8" fill="#7C3AED" opacity=".6"/>
<!-- eyes — almond shape -->
<path d="M58 87 Q68 81 78 87 Q68 93 58 87Z" fill="white"/>
<path d="M82 87 Q92 81 102 87 Q92 93 82 87Z" fill="white"/>
<circle cx="68" cy="87" r="5.5" fill="url(#eye3)"/>
<circle cx="92" cy="87" r="5.5" fill="url(#eye3)"/>
<circle cx="66.5" cy="85.5" r="2.2" fill="white"/>
<circle cx="90.5" cy="85.5" r="2.2" fill="white"/>
<!-- long lashes -->
<path d="M58 84.5 L56 81" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<path d="M63 82.5 L62 79" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<path d="M68 82 L67 78.5" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<path d="M73 82.5 L73 79" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<path d="M82 84.5 L80 81" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<path d="M87 82.5 L86 79" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<path d="M92 82 L91 78.5" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<path d="M97 82.5 L97 79" stroke="#1A0E08" stroke-width="1.5" stroke-linecap="round"/>
<!-- nose -->
<path d="M77 95 Q80 100 83 95" stroke="#C67A3A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<!-- blush -->
<ellipse cx="56" cy="96" rx="9" ry="5" fill="#DDD6FE" opacity=".5"/>
<ellipse cx="104" cy="96" rx="9" ry="5" fill="#DDD6FE" opacity=".5"/>
<!-- smile -->
<path d="M64 104 Q80 115 96 104" stroke="#B45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M64 104 Q80 114 96 104" fill="white" opacity=".5"/>
<!-- body -->
<ellipse cx="80" cy="148" rx="30" ry="16" fill="#5B21B6"/>
</svg>`,
  },
  {
    name:'Mehdi 🔥',
    svg:`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
<radialGradient id="bg4" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#FCD34D"/><stop offset="100%" stop-color="#78350F"/></radialGradient>
<radialGradient id="sk4" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE0A0"/><stop offset="60%" stop-color="#FBBF7A"/><stop offset="100%" stop-color="#B45309"/></radialGradient>
<radialGradient id="eye4" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#4A2912"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
<filter id="sh4" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bg4)"/>
<ellipse cx="80" cy="92" rx="34" ry="36" fill="url(#sk4)" filter="url(#sh4)"/>
<!-- afro fro -->
<circle cx="80" cy="66" r="30" fill="#1A0E08"/>
<circle cx="54" cy="74" r="18" fill="#1A0E08"/>
<circle cx="106" cy="74" r="18" fill="#1A0E08"/>
<circle cx="60" cy="58" r="16" fill="#1A0E08"/>
<circle cx="100" cy="58" r="16" fill="#1A0E08"/>
<circle cx="80" cy="52" r="18" fill="#1A0E08"/>
<!-- afro texture highlights -->
<circle cx="66" cy="55" r="7" fill="#2D1F12" opacity=".6"/>
<circle cx="94" cy="55" r="7" fill="#2D1F12" opacity=".6"/>
<circle cx="80" cy="50" r="8" fill="#2D1F12" opacity=".6"/>
<!-- ears -->
<ellipse cx="46" cy="93" rx="6" ry="8" fill="#B45309"/>
<ellipse cx="114" cy="93" rx="6" ry="8" fill="#B45309"/>
<!-- eyes — wide expressive -->
<ellipse cx="67" cy="88" rx="8" ry="9" fill="white"/>
<ellipse cx="93" cy="88" rx="8" ry="9" fill="white"/>
<circle cx="67.5" cy="88.5" r="5.8" fill="url(#eye4)"/>
<circle cx="93.5" cy="88.5" r="5.8" fill="url(#eye4)"/>
<circle cx="65.6" cy="86.6" r="2.4" fill="white"/>
<circle cx="91.6" cy="86.6" r="2.4" fill="white"/>
<!-- brows -->
<path d="M59 81 Q67 78 75 81" stroke="#1A0E08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M85 81 Q93 78 101 81" stroke="#1A0E08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<!-- nose wide -->
<ellipse cx="80" cy="98" rx="5" ry="3" fill="#C67A3A" opacity=".5"/>
<path d="M74 96 Q80 101 86 96" stroke="#C67A3A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<!-- huge grin -->
<path d="M60 106 Q80 122 100 106" stroke="#78350F" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M60 106 Q80 121 100 106" fill="white" opacity=".75"/>
<!-- body -->
<ellipse cx="80" cy="148" rx="30" ry="16" fill="#D97706"/>
<path d="M66 132 L80 142 L94 132" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name:'Karim 😎',
    svg:`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
<radialGradient id="bg5" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#1E3A8A"/></radialGradient>
<radialGradient id="sk5" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE4C8"/><stop offset="60%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A86A"/></radialGradient>
<filter id="sh5" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bg5)"/>
<ellipse cx="80" cy="92" rx="34" ry="36" fill="url(#sk5)" filter="url(#sh5)"/>
<!-- sideways cap -->
<ellipse cx="84" cy="67" rx="34" ry="15" fill="#1D4ED8"/>
<ellipse cx="84" cy="65" rx="34" ry="13" fill="#1E40AF"/>
<!-- brim tilted -->
<ellipse cx="114" cy="75" rx="20" ry="7" fill="#1D4ED8" transform="rotate(-18 114 75)"/>
<!-- cap logo -->
<circle cx="76" cy="64" r="6" fill="#3B82F6" opacity=".8"/>
<text x="73" y="67" font-size="7" fill="white" font-weight="bold" font-family="sans-serif">NY</text>
<!-- hair peeking under cap -->
<ellipse cx="50" cy="78" rx="10" ry="7" fill="#1A0E08"/>
<!-- ears -->
<ellipse cx="46" cy="93" rx="6" ry="8" fill="#E8A86A"/>
<ellipse cx="114" cy="93" rx="6" ry="8" fill="#E8A86A"/>
<!-- sunglasses — shield style -->
<rect x="55" y="82" width="50" height="16" rx="8" fill="#111827" opacity=".92"/>
<rect x="55" y="82" width="50" height="16" rx="8" fill="none" stroke="#374151" stroke-width="1.5"/>
<!-- lens shine -->
<path d="M60 86 Q65 84 70 86" stroke="white" stroke-width="1.2" fill="none" opacity=".4" stroke-linecap="round"/>
<path d="M90 86 Q95 84 100 86" stroke="white" stroke-width="1.2" fill="none" opacity=".4" stroke-linecap="round"/>
<!-- nose -->
<path d="M77 101 Q80 106 83 101" stroke="#C67A3A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<!-- smirk -->
<path d="M67 108 Q80 116 93 108" stroke="#92400E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M67 108 Q80 115 93 108" fill="white" opacity=".5"/>
<!-- body -->
<ellipse cx="80" cy="148" rx="30" ry="16" fill="#1D4ED8"/>
<path d="M66 132 L80 142 L94 132" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name:'Rania 🎵',
    svg:`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
<radialGradient id="bg6" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#F9A8D4"/><stop offset="100%" stop-color="#831843"/></radialGradient>
<radialGradient id="sk6" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE4C8"/><stop offset="60%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A86A"/></radialGradient>
<radialGradient id="eye6" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#5C3317"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
<filter id="sh6" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bg6)"/>
<ellipse cx="80" cy="90" rx="34" ry="36" fill="url(#sk6)" filter="url(#sh6)"/>
<!-- long hair back layer -->
<rect x="44" y="72" width="14" height="55" rx="7" fill="#7C2D12"/>
<rect x="102" y="72" width="14" height="55" rx="7" fill="#7C2D12"/>
<!-- hair top -->
<ellipse cx="80" cy="63" rx="32" ry="17" fill="#7C2D12"/>
<!-- headphones arc -->
<path d="M46 82 Q46 56 80 54 Q114 56 114 82" stroke="#1C1412" stroke-width="4.5" fill="none"/>
<!-- headphone cups -->
<rect x="38" y="78" width="16" height="22" rx="7" fill="#1C1412"/>
<rect x="106" y="78" width="16" height="22" rx="7" fill="#1C1412"/>
<ellipse cx="46" cy="89" rx="7" ry="9" fill="#374151"/>
<ellipse cx="114" cy="89" rx="7" ry="9" fill="#374151"/>
<!-- cup shine -->
<ellipse cx="44" cy="85" rx="3" ry="2" fill="white" opacity=".2"/>
<ellipse cx="112" cy="85" rx="3" ry="2" fill="white" opacity=".2"/>
<!-- eyes -->
<ellipse cx="68" cy="86" rx="7" ry="8" fill="white"/>
<ellipse cx="92" cy="86" rx="7" ry="8" fill="white"/>
<circle cx="68.5" cy="86.5" r="5.2" fill="url(#eye6)"/>
<circle cx="92.5" cy="86.5" r="5.2" fill="url(#eye6)"/>
<circle cx="66.8" cy="84.8" r="2.2" fill="white"/>
<circle cx="90.8" cy="84.8" r="2.2" fill="white"/>
<!-- lashes -->
<path d="M61 80.5 Q64 77.5 67 80.5" stroke="#1A0E08" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M85 80.5 Q88 77.5 91 80.5" stroke="#1A0E08" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<!-- brows -->
<path d="M61 81.5 Q68 79 75 81.5" stroke="#1A0E08" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M85 81.5 Q92 79 99 81.5" stroke="#1A0E08" stroke-width="2" fill="none" stroke-linecap="round"/>
<!-- nose -->
<path d="M77 93 Q80 98 83 93" stroke="#C67A3A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<!-- blush -->
<ellipse cx="56" cy="96" rx="8" ry="5" fill="#F9A8D4" opacity=".6"/>
<ellipse cx="104" cy="96" rx="8" ry="5" fill="#F9A8D4" opacity=".6"/>
<!-- smile -->
<path d="M64 102 Q80 114 96 102" stroke="#B45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M64 102 Q80 113 96 102" fill="white" opacity=".5"/>
<!-- body -->
<ellipse cx="80" cy="148" rx="30" ry="16" fill="#DB2777"/>
</svg>`,
  },
  {
    name:'Sara 🧕',
    svg:`<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
<radialGradient id="bg7" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="#2DD4BF"/><stop offset="100%" stop-color="#0F4C45"/></radialGradient>
<radialGradient id="sk7" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE4C8"/><stop offset="60%" stop-color="#FDDCB5"/><stop offset="100%" stop-color="#E8A86A"/></radialGradient>
<radialGradient id="eye7" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#5C3317"/><stop offset="100%" stop-color="#1A0800"/></radialGradient>
<filter id="sh7" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter>
</defs>
<rect width="160" height="160" fill="url(#bg7)"/>
<ellipse cx="80" cy="92" rx="34" ry="36" fill="url(#sk7)" filter="url(#sh7)"/>
<!-- hijab — teal/emerald -->
<ellipse cx="80" cy="68" rx="42" ry="32" fill="#0D9488"/>
<ellipse cx="80" cy="96" rx="46" ry="30" fill="#0D9488"/>
<ellipse cx="38" cy="100" rx="14" ry="28" fill="#0F766E"/>
<ellipse cx="122" cy="100" rx="14" ry="28" fill="#0F766E"/>
<ellipse cx="80" cy="70" rx="30" ry="22" fill="#0F766E"/>
<!-- hijab highlight fold -->
<path d="M52 68 Q80 58 108 68" stroke="#14B8A6" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
<ellipse cx="68" cy="62" rx="18" ry="10" fill="#14B8A6" opacity=".35"/>
<!-- eyes — almond -->
<path d="M56 87 Q68 80 80 87 Q68 94 56 87Z" fill="white"/>
<path d="M80 87 Q92 80 104 87 Q92 94 80 87Z" fill="white"/>
<circle cx="68" cy="87" r="5.8" fill="url(#eye7)"/>
<circle cx="92" cy="87" r="5.8" fill="url(#eye7)"/>
<circle cx="66.3" cy="85.3" r="2.4" fill="white"/>
<circle cx="90.3" cy="85.3" r="2.4" fill="white"/>
<!-- long dramatic lashes -->
<path d="M56 84.5 L53 81" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<path d="M62 82.5 L60 78.5" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<path d="M68 82 L67 78" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<path d="M74 82.5 L74 78.5" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<path d="M80 84.5 L78 81" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<path d="M86 82.5 L85 78.5" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<path d="M92 82 L91 78" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<path d="M98 82.5 L98 78.5" stroke="#1A0E08" stroke-width="1.6" stroke-linecap="round"/>
<!-- nose -->
<path d="M77 95 Q80 100 83 95" stroke="#C67A3A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<!-- blush subtle -->
<ellipse cx="56" cy="96" rx="9" ry="5" fill="#99F6E4" opacity=".4"/>
<ellipse cx="104" cy="96" rx="9" ry="5" fill="#99F6E4" opacity=".4"/>
<!-- warm smile -->
<path d="M64 103 Q80 115 96 103" stroke="#B45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M64 103 Q80 114 96 103" fill="white" opacity=".5"/>
<!-- body -->
<ellipse cx="80" cy="148" rx="30" ry="16" fill="#0D9488"/>
</svg>`,
  },
]

const CLASS_TOPICS = [
  { topic:'AI & The Future of Work', icon:'🤖', participants:8, level:'B2–C1' },
  { topic:'The US Elections 2024', icon:'🗳️', participants:12, level:'B1–C1' },
  { topic:'Climate Change Debate', icon:'🌱', participants:6, level:'B2–C1' },
  { topic:'Social Media & Society', icon:'📱', participants:10, level:'B1–B2' },
]

function useCountdown(target: Date) {
  const [time, setTime] = useState({d:0,h:0,m:0,s:0})
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTime({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)})
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
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

  // Topic progress cycling
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

  // Participant + chat animation
  const [visibleP, setVisibleP] = useState<number[]>([])
  const [speakingP, setSpeakingP] = useState(0)
  const [chatMsgs, setChatMsgs] = useState<{id:number,text:string,from:string,isDali:boolean}[]>([])
  const chatSnippets = [
    {text:'Will AI replace all jobs eventually?', from:'Mehdi', isDali:false},
    {text:'Great question! Say "displace" not "replace" 💡', from:'Dali', isDali:true},
    {text:'AI might displace some roles...', from:'Nour', isDali:false},
    {text:'Perfect — Band 7+ vocab right there 🔥', from:'Dali', isDali:true},
    {text:'This class is incredible 🙌', from:'Sami', isDali:false},
  ]
  useEffect(() => {
    for (let i=0;i<8;i++) setTimeout(()=>setVisibleP(p=>[...p,i]), i*300)
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
    d.setDate(d.getDate()+days); d.setHours(20,0,0,0)
    return d
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
    ...AVATARS.map(a=>({svg:a.svg, name:a.name, isDali:false}))
  ]

  return (
    <main className="min-h-screen bg-[#F8F9FF] font-sans" dir={isAr?'rtl':'ltr'}>
      <style>{`
        .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .blob{position:absolute;border-radius:50%;filter:blur(65px);}
        .b1{animation:b1 10s ease-in-out infinite;}
        .b2{animation:b2 13s ease-in-out infinite;}
        .b3{animation:b3 8s ease-in-out infinite;}
        @keyframes b1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(30px,20px) scale(1.1);}66%{transform:translate(-10px,30px) scale(.95);}}
        @keyframes b2{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(-25px,-20px) scale(1.05);}66%{transform:translate(15px,-10px) scale(1.1);}}
        @keyframes b3{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(20px,-15px) scale(1.15);}}
        .float-word{animation:fw linear infinite;}
        @keyframes fw{0%,100%{transform:translateY(0) rotate(var(--r));}50%{transform:translateY(-10px) rotate(var(--r));}}
        .speaking-ring{animation:sp 1.2s ease-in-out infinite;}
        @keyframes sp{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.5);}50%{box-shadow:0 0 0 6px rgba(99,102,241,0);}}
        .dali-speaking{animation:dalisp 0.8s ease-in-out infinite;}
        @keyframes dalisp{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
        .progress-fill{transition:width .1s linear;}
        .topic-card{transition:all .25s ease;}
        .topic-card:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(0,0,0,.06);}
        .pkg-card{transition:all .3s ease;}
        .pkg-card:hover{transform:translateY(-4px);}
        .av-cell{opacity:0;transform:scale(0);transition:opacity .3s ease,transform .35s cubic-bezier(.34,1.56,.64,1);}
        .av-cell.show{opacity:1;transform:scale(1);}
        .chat-in{animation:cin .35s ease forwards;}
        @keyframes cin{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-indigo-50">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-base tracking-tight whitespace-nowrap">
              <span className="font-bold text-indigo-600">english</span>
              <span className="font-light text-gray-400">with</span>
              <span className="font-extrabold text-indigo-600 uppercase tracking-wide">DALI</span>
            </span>
            <span className="text-xl leading-none">🇹🇳</span>
          </div>
          <div className="hidden md:flex gap-0.5 items-center">
            {['topics','classes','live','community'].map(item => (
              <a key={item} href={`#${item}`} className="px-3 py-2 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium capitalize">{item}</a>
            ))}
          </div>
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

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 25% 50%,rgba(99,102,241,.09) 0%,transparent 55%),radial-gradient(ellipse at 75% 30%,rgba(6,182,212,.07) 0%,transparent 50%)'}}/>
        <div className="blob b1 w-72 h-72 bg-indigo-200/20 absolute -top-20 -left-20"/>
        <div className="blob b2 w-56 h-56 bg-cyan-200/15 absolute -bottom-10 -right-10"/>
        <div className="blob b3 w-44 h-44 bg-purple-200/15 absolute top-1/2 left-1/3"/>

        {/* Floating words — fixed positioning so they don't clip */}
        {[
          {text:'current events 🌍', top:'8%',  left:'58%', color:'#6366F1', bg:'#EEF2FF', r:'-3deg', dur:'4s'},
          {text:'trending 🔥',       top:'14%', left:'72%', color:'#DC2626', bg:'#FEF2F2', r:'2deg',  dur:'5s',   delay:'.5s'},
          {text:'live class 🎙️',    top:'70%', left:'56%', color:'#065F46', bg:'#DCFCE7', r:'-2deg', dur:'4.5s', delay:'1s'},
          {text:'speak freely 💬',   top:'80%', left:'72%', color:'#6D28D9', bg:'#EDE9FE', r:'3deg',  dur:'5.5s', delay:'.3s'},
          {text:'real english 🎯',   top:'50%', left:'55%', color:'#B45309', bg:'#FEF3C7', r:'-1deg', dur:'6s',   delay:'.8s'},
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
                  <defs><linearGradient id="igG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F59E0B"/><stop offset="50%" stopColor="#EF4444"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
                  <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#igG)" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="url(#igG)" strokeWidth="2"/>
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

          {/* Right */}
          <div className="flex flex-col gap-3">
            {/* Progress bar */}
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

            {/* Online class card */}
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
                    className={`av-cell ${visibleP.includes(i)?'show':''} aspect-square rounded-xl overflow-hidden relative ${av.isDali && speakingP===0?'dali-speaking':''}`}
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

              {/* Chat */}
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

      {/* TOPICS */}
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

      {/* HOW IT WORKS */}
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

      {/* PACKAGES */}
      <section id="classes" ref={addRef(2)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">{t.classesTag}</div>
        <h2 className="text-2xl font-bold text-indigo-950 mb-1">{t.classesH}</h2>
        <p className="text-gray-400 text-sm mb-8">{t.classesSub}</p>
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

      {/* LIVE */}
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

      {/* COMMUNITY */}
      <section id="community" ref={addRef(4)} className="reveal max-w-6xl mx-auto px-6 py-16">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">{t.communityTag}</div>
        <h2 className="text-2xl font-bold text-indigo-950 mb-1">{t.communityH}</h2>
        <p className="text-gray-400 text-sm mb-6">{t.communitySub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="https://www.instagram.com/ielts.tn" target="_blank"
            className="flex items-center gap-4 bg-white border border-indigo-50 rounded-2xl p-5 hover:border-pink-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>
            </div>
            <div className="flex-1"><div className="text-sm font-bold text-indigo-950">instagram</div><div className="text-xs text-gray-400 mt-0.5">DM @ielts.tn</div></div>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">↗</span>
          </a>
          <a href="https://wa.me/216XXXXXXXX" target="_blank"
            className="flex items-center gap-4 bg-white border border-indigo-50 rounded-2xl p-5 hover:border-green-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">💬</div>
            <div className="flex-1"><div className="text-sm font-bold text-indigo-950">whatsapp</div><div className="text-xs text-gray-400 mt-0.5">message directly</div></div>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">↗</span>
          </a>
          <a href="https://www.tiktok.com/@ielts.tn" target="_blank"
            className="flex items-center gap-4 bg-white border border-indigo-50 rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">🎵</div>
            <div className="flex-1"><div className="text-sm font-bold text-indigo-950">tiktok</div><div className="text-xs text-gray-400 mt-0.5">@ielts.tn · 500K+</div></div>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">↗</span>
          </a>
        </div>
      </section>

      {/* SIGNUP */}
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

      {/* FOOTER */}
      <footer className="border-t border-indigo-50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base tracking-tight">
              <span className="font-bold text-indigo-600">english</span>
              <span className="font-light text-gray-400">with</span>
              <span className="font-extrabold text-indigo-600 uppercase tracking-wide">DALI</span>
            </span>
            <span>🇹🇳</span>
          </div>
          <div className="flex gap-5 text-sm text-gray-400 flex-wrap justify-center">
            <a href="#" className="hover:text-indigo-500 transition-colors">privacy</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">terms</a>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank" className="hover:text-indigo-500 transition-colors">tiktok ↗</a>
            <a href="https://www.instagram.com/ielts.tn" target="_blank" className="hover:text-indigo-500 transition-colors">instagram ↗</a>
          </div>
          <div className="text-xs text-gray-300">© 2026 englishwithDALI</div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/216XXXXXXXX" target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-2xl shadow-xl shadow-green-200 hover:scale-110 active:scale-95 transition-all">
        💬
      </a>
    </main>
  )
}