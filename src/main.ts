type Locale = 'zh-TW' | 'en';

const supportedLocales: Locale[] = ['zh-TW', 'en'];
const localeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-locale]'));
const portfolioLink = document.querySelector<HTMLAnchorElement>('[data-portfolio-link]');
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

  const viewport = gallery.querySelector<HTMLElement>('.life-gallery-viewport');
  const track = gallery.querySelector<HTMLOListElement>('.life-gallery-track');
  const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-life-gallery-slide]'));
  const previousButton = gallery.querySelector<HTMLButtonElement>('[data-life-gallery-action="prev"]');
  const nextButton = gallery.querySelector<HTMLButtonElement>('[data-life-gallery-action="next"]');
  const status = gallery.querySelector<HTMLElement>('[data-life-gallery-status]');

  if (!track || slides.length === 0 || !previousButton || !nextButton || !status || !viewport) {
    return;
  }

  let activeIndex = 0;

  const render = () => {
    viewport.scrollLeft = 0;
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

  const isZh = locale === 'zh-TW';

  const titleZh = '絵夢羽さ沂的窗邊手記';
  const titleEn = "Emu-Rabbit's Window Notes";
  const descZh = '絵夢羽さ沂的窗邊手記：溫柔、自由、舒適，也保留一點兔子的可愛與任性。';
  const descEn = "Emu-Rabbit's Window Notes: gentle, free, and comfortable — with a touch of rabbit whimsy.";
  const imgAltZh = '絵夢羽さ沂的窗邊手記 — gentle・free・comfortable';
  const imgAltEn = "Emu-Rabbit's Window Notes — gentle・free・comfortable";

  const title = isZh ? titleZh : titleEn;
  const desc = isZh ? descZh : descEn;
  const imgAlt = isZh ? imgAltZh : imgAltEn;

  if (portfolioLink) {
    const localizedHref = isZh ? portfolioLink.dataset.hrefZh : portfolioLink.dataset.hrefEn;

    if (localizedHref) {
      portfolioLink.href = localizedHref;
    }
  }

  // Browser tab title
  document.title = title;

  // Standard description
  (document.getElementById('meta-description') as HTMLMetaElement | null)?.setAttribute('content', desc);

  // Open Graph
  (document.getElementById('meta-og-site-name') as HTMLMetaElement | null)?.setAttribute('content', title);
  (document.getElementById('meta-og-title') as HTMLMetaElement | null)?.setAttribute('content', title);
  (document.getElementById('meta-og-description') as HTMLMetaElement | null)?.setAttribute('content', desc);
  (document.getElementById('meta-og-image-alt') as HTMLMetaElement | null)?.setAttribute('content', imgAlt);
  (document.getElementById('meta-og-locale') as HTMLMetaElement | null)?.setAttribute('content', isZh ? 'zh_TW' : 'en_US');

  // Twitter / X
  (document.getElementById('meta-twitter-title') as HTMLMetaElement | null)?.setAttribute('content', title);
  (document.getElementById('meta-twitter-description') as HTMLMetaElement | null)?.setAttribute('content', desc);
  (document.getElementById('meta-twitter-image-alt') as HTMLMetaElement | null)?.setAttribute('content', imgAlt);
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
