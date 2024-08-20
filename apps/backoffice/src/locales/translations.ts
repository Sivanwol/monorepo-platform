import { getConstantValue } from 'typescript';
import type { Namespaces, Translations } from '~/type';

const locales = ['en'];
// Remove the duplicate declaration of 'defaultLng'
const defaultLng = 'en';
const defaultNs: Namespaces = 'home';

let currentNs: Namespaces = defaultNs;
let currentLng: string = defaultLng;
const translations: Translations = {
  en: {
    home: {},
    dashboardLayout: {}
  }
} as Record<string, Record<string, any>>;

export const initTranslation = async (lng: string, ns: Namespaces) => {
  if (!locales.includes(lng)) {
    console.warn(`Language ${lng} is not supported`);
    currentLng = defaultLng; // Fallback to default language
  } else {
    currentLng = lng;
  }
  currentNs = ns;

  // Asynchronously load translations
  translations[currentLng] = {
    home: (await import(`./${currentLng}/home`)).default,
    dashboardLayout: (await import(`./${currentLng}/dashboard-layout`)).default,
  };
};

export const t = (key: string, options?: Record<string, string | number>): string => {
  if (!currentLng || !currentNs) {
    console.warn("Language or namespace not initialized");
    return key; // Return the key if any part of the nested path is not found
  }

  const translationsForLng = translations[currentLng];;
  console.log('translationsForLng', translationsForLng)
  if (!translationsForLng) {
    console.warn(`No translations found for language ${currentLng}`);
    return key; // Return the key if any part of the nested path is not found
  }
  // Assuming `currentNs` is defined somewhere in your code
  // Split the key by dots to handle nested structures
  const keys = key.split('.');
  let translation = translationsForLng[currentNs];
  console.log('translation', translation, keys);
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
