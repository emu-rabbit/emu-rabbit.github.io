type Locale = 'zh-TW' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  'zh-TW': {
    skipLink: '跳到主要內容',
    navAbout: '關於',
    navVoice: '語氣',
    navContact: '靠近',
    heroEyebrow: '溫柔 / 自由 / 一點任性的兔子',
    heroTitle: '想把日子過成柔軟又自由的樣子',
    heroLede: '你好，我是繪夢。多端工程師，在台北生活，也是一隻努力愛與被愛的白耳兔。',
    heroPrimary: '慢慢認識我',
    heroSecondary: 'GitHub',
    rabbitNote:
      '本體是雙白色垂耳兔。怕寂寞、很色、很可愛，偶爾也有一點殘暴，但大多時候只是想被好好摸頭。',
    aboutKicker: 'About',
    aboutTitle: '不是很會把自己包裝成一份漂亮履歷。',
    aboutBodyOne:
      '我比較像是那種會慢慢把關係、工具、作品和生活整理到合適位置的人。會寫程式，也會寫很長很柔軟的話；喜歡把複雜的東西做得可以被理解，把冷冰冰的介面揉進一點人的溫度。',
    aboutBodyTwo:
      '我相信自由、自主和足夠誠實的界線。世界很大，我不是誰命中的唯一，也不希望誰被我困住；但如果我們剛好走在同一段路上，那就好好相處，把風景映在記憶裡。',
    aboutBodyThree:
      '努力去愛，也努力地被愛，這是我現在的目標。也許有點笨拙，但我會繼續讓自己幸福下去，同時也希望愛我的人可以從我這邊獲取幸福ヽ(*´＾`*)ﾉ',
    voiceKicker: 'Voice',
    voiceTitle: '這裡不是商業名片，是一扇可以靠近的窗。',
    voiceOneTitle: '溫柔但不模糊',
    voiceOneBody: '語氣可以親密、可愛、誠實，但不把重點藏進漂亮空話裡。',
    voiceTwoTitle: '自由但有界線',
    voiceTwoBody: '我喜歡關係有不同形狀，也相信每一段關係都能找到剛好舒服的位置。',
    voiceThreeTitle: '技術也要有人味',
    voiceThreeBody: '工具、網站和作品可以很清楚、很快，但不需要冷得像圖表或簡報。',
    contactKicker: 'Near',
    contactTitle: '如果你剛好在未來的某處遇見我。',
    contactBody:
      '也許是專案、文字、遊戲、關係，或只是某個普通的晚上。可以不用急著定義我們會成為什麼，先讓彼此好好地相遇。',
    contactLink: '看看我正在做什麼',
    localeStatus: '目前語言：繁體中文'
  },
  en: {
    skipLink: 'Skip to main content',
    navAbout: 'About',
    navVoice: 'Voice',
    navContact: 'Near',
    heroEyebrow: 'Tender / Free / A slightly willful rabbit',
    heroTitle: 'Trying to live softly, freely, and honestly',
    heroLede: 'Hi, I am Emu. A multi-platform engineer in Taipei, and a white-eared rabbit learning how to love and be loved.',
    heroPrimary: 'Get to know me slowly',
    heroSecondary: 'GitHub',
    rabbitNote:
      'The core form is a white lop-eared rabbit: lonely sometimes, cute often, a little dangerous on special days, but mostly hoping for gentle pats.',
    aboutKicker: 'About',
    aboutTitle: 'I am not very good at packaging myself as a polished resume.',
    aboutBodyOne:
      'I am closer to someone who slowly places relationships, tools, work, and everyday life where they can breathe. I write code, and I also write long tender words. I like making complex things understandable, and giving cold interfaces a little human warmth.',
    aboutBodyTwo:
      'I believe in freedom, autonomy, and honest boundaries. The world is wide. I am not anyone’s only fate, and I do not want to trap anyone. If we happen to share part of the road, I want us to walk it well and keep the scenery in memory.',
    aboutBodyThree:
      'To love, and to be loved well, is my goal for now. Maybe I am clumsy, but I will keep making myself happy, and I hope people who love me can also receive happiness from me.',
    voiceKicker: 'Voice',
    voiceTitle: 'This is not a business card. It is a window you can approach.',
    voiceOneTitle: 'Tender, not vague',
    voiceOneBody: 'The voice can be intimate, cute, and honest without hiding meaning behind pretty filler.',
    voiceTwoTitle: 'Free, with boundaries',
    voiceTwoBody: 'I like relationships having different shapes, and I believe each one can find its own comfortable place.',
    voiceThreeTitle: 'Technology with feeling',
    voiceThreeBody: 'Tools, websites, and projects can be clear and fast without feeling like charts or slide decks.',
    contactKicker: 'Near',
    contactTitle: 'If you meet me somewhere in the future.',
    contactBody:
      'Maybe through a project, a piece of writing, a game, a relationship, or just an ordinary evening. We do not have to define everything immediately. We can begin by meeting each other well.',
    contactLink: 'See what I am making',
    localeStatus: 'Current language: English'
  }
};

const supportedLocales: Locale[] = ['zh-TW', 'en'];
const localeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-locale]'));
const translatableNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-i18n]'));
const currentYear = document.querySelector<HTMLElement>('#current-year');

function getStoredLocale(): Locale | null {
  const storedLocale = window.localStorage.getItem('emu-rabbit-locale');
  return supportedLocales.find((locale) => locale === storedLocale) ?? null;
}

function getInitialLocale(): Locale {
  const storedLocale = getStoredLocale();

  if (storedLocale) {
    return storedLocale;
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en';
}

function applyLocale(locale: Locale): void {
  const localeCopy = translations[locale];

  translatableNodes.forEach((node) => {
    const key = node.dataset.i18n;

    if (!key) {
      return;
    }

    const text = localeCopy[key];

    if (text) {
      node.textContent = text;
    }
  });

  localeButtons.forEach((button) => {
    const isActive = button.dataset.locale === locale;
    button.setAttribute('aria-pressed', String(isActive));
  });

  document.documentElement.lang = locale === 'zh-TW' ? 'zh-Hant' : 'en';
  document.documentElement.dataset.locale = locale;
  window.localStorage.setItem('emu-rabbit-locale', locale);
}

localeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const locale = supportedLocales.find((candidate) => candidate === button.dataset.locale);

    if (locale) {
      applyLocale(locale);
    }
  });
});

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

applyLocale(getInitialLocale());

export {};
