import type { Namespaces, Translations } from './type';

const locales = ['en'];
// Remove the duplicate declaration of 'defaultLng'
const defaultLng = 'en';
const defaultNs: Namespaces = 'home';

let currentNs: Namespaces = defaultNs;
let currentLng: string = defaultLng;
const translations: Translations = {
  en: {
    home: {},
    dashboardLayout: {},
    support: {}
  }
} as Record<string, Record<string, any>>;
export let translationsLoaded = false;
export const initTranslation = async (lng: string, ns: Namespaces) => {
  if (!locales.includes(lng)) {
    console.warn(`Language ${lng} is not supported`);
    currentLng = defaultLng; // Fallback to default language
  } else {
    currentLng = lng;
  }
  console.log(`Initializing translations for ${currentLng}-${ns}`);
  // Asynchronously load translations
  if (!translationsLoaded || currentNs !== ns) {
    translationsLoaded = false;
    currentNs = ns;
    console.log(`Loading translations for ${currentLng}-${currentNs}`);
    translations[currentLng] = {
      home: (await import(`./locales/${currentLng}/home`)).default,
      dashboardLayout: (await import(`./locales/${currentLng}/dashboard-layout`)).default,
      support: (await import(`./locales/${currentLng}/support`)).default,
    };
    translationsLoaded = true;
    console.log(`Translations loaded for ${currentLng}-${currentNs}`);
  }
};

export const t = (key: string, options?: Record<string, string | number>): string => {
  if (!currentLng || !currentNs) {
    console.warn("Language or namespace not initialized");
    return key; // Return the key if any part of the nested path is not found
  }

  const translationsForLng = translations[currentLng];;
  if (!translationsForLng) {
    console.warn(`No translations found for language ${currentLng}`);
    return key; // Return the key if any part of the nested path is not found
  }
  // Assuming `currentNs` is defined somewhere in your code
  // Split the key by dots to handle nested structures
  const keys = key.split('.');
  let translation = translationsForLng[currentNs];
  for (const k of keys) {
    if (typeof translation === 'object' && translation !== null && k in translation) {
      translation = translation[k] as Record<string, Record<string, any>>;
    } else {
      console.warn(`No translation found for key ${currentLng}-${currentNs}-${key}`);
      return key; // Return the key if any part of the nested path is not found
    }
  }
  if (typeof translation === 'function') {
    return (translation as (options?: Record<string, string | number>) => string)(options || {});
  }

  return translation as unknown as string;
};
