type Locale = 'zh-TW' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  'zh-TW': {
    skipLink: '跳到主要內容',
    navAbout: '關於',
    navWork: '方向',
    navContact: '聯絡',
    heroEyebrow: '靜態網頁 / 個人入口 / 小而清楚',
    heroLede: '把想法整理成快速、清楚、帶一點手作溫度的網頁與工具。',
    heroPrimary: '看目前方向',
    heroSecondary: 'GitHub',
    introStrip:
      '這裡會逐步收斂成一個更完整的自我介紹頁：身份、作品、工作方式與可被理解的個人風格。',
    aboutKicker: 'About',
    aboutTitle: '先做得輕，再做得有記憶點。',
    aboutBodyOne:
      '這個網站的第一版保留刻意的空間：不假裝已經有完整履歷資料，也不急著堆滿模板區塊。它先建立一個夠快、夠清楚、容易被改寫的基礎。',
    aboutBodyTwo:
      '後續可以加入作品、寫作、工具、研究或其他公開身份，但每一個區塊都應該服務「讓人更理解 Emu Rabbit」這件事。',
    workKicker: 'Direction',
    workTitle: '目前先留下三條清楚的線索。',
    directionOneTitle: '快速抵達',
    directionOneBody: '首屏內容直接在 HTML 中出現，TypeScript 只負責少量互動，讓頁面先被看見。',
    directionTwoTitle: '個人而非模板',
    directionTwoBody: '版面、色彩、節奏與文案都保留可塑性，避免變成制式履歷或卡片堆疊。',
    directionThreeTitle: '容易繼續長大',
    directionThreeBody:
      '未來新增語言、作品或頁面時，不需要推翻整個架構，也不先背負不必要的框架重量。',
    contactKicker: 'Next',
    contactTitle: '下一步是把真實內容放進來。',
    contactBody: '作品、簡介、社群連結與語氣都可以在這個輕量基底上逐步替換。現在的版本先確保入口快速、乾淨，而且可部署。',
    contactLink: '前往 GitHub',
    localeStatus: '目前語言：繁體中文'
  },
  en: {
    skipLink: 'Skip to main content',
    navAbout: 'About',
    navWork: 'Direction',
    navContact: 'Contact',
    heroEyebrow: 'Static site / Personal entry / Small and clear',
    heroLede: 'A fast, legible personal web space for tools, ideas, and carefully shaped work.',
    heroPrimary: 'See direction',
    heroSecondary: 'GitHub',
    introStrip:
      'This will gradually become a fuller self-introduction: identity, work, process, and a personal voice visitors can actually recognize.',
    aboutKicker: 'About',
    aboutTitle: 'Keep it light first, then make it memorable.',
    aboutBodyOne:
      'The first version leaves intentional room. It does not pretend the full profile is already written, and it does not rush into template sections. It starts with a foundation that is fast, clear, and easy to reshape.',
    aboutBodyTwo:
      'Projects, writing, tools, research, or other public identities can be added later, as long as each section helps people understand Emu Rabbit more clearly.',
    workKicker: 'Direction',
    workTitle: 'For now, the site keeps three clear signals.',
    directionOneTitle: 'Arrive quickly',
    directionOneBody: 'First-view content is present in HTML. TypeScript only adds small interactions after the page is already readable.',
    directionTwoTitle: 'Personal, not templated',
    directionTwoBody: 'Layout, color, rhythm, and copy stay flexible so the page does not become a generic resume or stacked-card portfolio.',
    directionThreeTitle: 'Ready to grow',
    directionThreeBody:
      'Future languages, projects, or pages can be added without rebuilding the whole site or carrying unnecessary framework weight.',
    contactKicker: 'Next',
    contactTitle: 'The next step is replacing placeholders with real material.',
    contactBody:
      'Projects, biography, social links, and tone can all evolve on this lightweight base. This version makes sure the entry point is fast, clean, and deployable.',
    contactLink: 'Go to GitHub',
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
