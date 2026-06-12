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

function setupLazyImageLoading(): void {
  const lazyImages = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'));

  lazyImages.forEach((image) => {
    const markLoaded = () => image.classList.add('is-loaded');

    if (image.complete && image.naturalWidth > 0) {
      markLoaded();
      return;
    }

    image.addEventListener('load', markLoaded, { once: true });
    image.addEventListener('error', markLoaded, { once: true });
  });
}

function setupLifeGallery(): void {
  const gallery = document.querySelector<HTMLElement>('[data-life-gallery]');

  if (!gallery) {
    return;
  }

  const track = gallery.querySelector<HTMLOListElement>('.life-gallery-track');
  const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-life-gallery-slide]'));
  const previousButton = gallery.querySelector<HTMLButtonElement>('[data-life-gallery-action="prev"]');
  const nextButton = gallery.querySelector<HTMLButtonElement>('[data-life-gallery-action="next"]');
  const status = gallery.querySelector<HTMLElement>('[data-life-gallery-status]');

  if (!track || slides.length === 0 || !previousButton || !nextButton || !status) {
    return;
  }

  let activeIndex = 0;

  const render = () => {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    status.textContent = `${activeIndex + 1} / ${slides.length}`;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
  };

  const goTo = (index: number) => {
    activeIndex = (index + slides.length) % slides.length;
    render();
  };

  previousButton.addEventListener('click', () => goTo(activeIndex - 1));
  nextButton.addEventListener('click', () => goTo(activeIndex + 1));

  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(activeIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  render();
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
setupLazyImageLoading();
setupLifeGallery();

export {};
