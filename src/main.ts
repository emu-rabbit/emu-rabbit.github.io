type Locale = 'zh-TW' | 'en';

const supportedLocales: Locale[] = ['zh-TW', 'en'];
const localeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-locale]'));
const localeStorageKey = 'emuu-sai-locale';

document.documentElement.classList.add('is-enhanced');

function setupHeroPhotoLoading(): void {
  const heroImage = document.querySelector<HTMLImageElement>('.hero-photo img');

  if (!heroImage) {
    return;
  }

  const photoFrame = heroImage.closest('.hero-photo');
  const markLoaded = () => {
    heroImage.classList.add('is-loaded');
    photoFrame?.classList.add('is-loaded');
  };

  if (heroImage.complete && heroImage.naturalWidth > 0) {
    markLoaded();
    return;
  }

  heroImage.addEventListener('load', markLoaded, { once: true });
  window.addEventListener('load', () => {
    if (heroImage.complete && heroImage.naturalWidth > 0) {
      markLoaded();
    }
  });
}

function getStoredLocale(): Locale | null {
  const storedLocale = window.localStorage.getItem(localeStorageKey);
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
  localeButtons.forEach((button) => {
    const isActive = button.dataset.locale === locale;
    button.setAttribute('aria-pressed', String(isActive));
  });

  document.documentElement.lang = locale === 'zh-TW' ? 'zh-Hant' : 'en';
  document.documentElement.dataset.locale = locale;
  window.localStorage.setItem(localeStorageKey, locale);
}

localeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const locale = supportedLocales.find((candidate) => candidate === button.dataset.locale);

    if (locale) {
      applyLocale(locale);
    }
  });
});

applyLocale(getInitialLocale());
setupHeroPhotoLoading();

export {};
