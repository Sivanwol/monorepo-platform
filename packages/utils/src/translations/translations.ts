/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Namespaces, Translations } from "./type";

const locales = ["en"];
// Remove the duplicate declaration of 'defaultLng'
const defaultLng = "en";

let currentLng: string = defaultLng;
const translations: Translations = {
  en: {
    home: {},
    dashboardLayout: {},
    support: {},
  },
} as Record<string, Record<string, any>>;
export let translationsLoaded = false;
export const initTranslation = async (lng: string) => {
  if (!locales.includes(lng)) {
    console.warn(`Language ${lng} is not supported`);
    currentLng = defaultLng; // Fallback to default language
  } else {
    currentLng = lng;
  }
  console.log(`Initializing translations for ${currentLng}`);
  translationsLoaded = false;
  console.log(`Loading translations for ${currentLng}`);
  translations[currentLng] = {
    home: (await import(`./locales/${currentLng}/home`)).default,
    dashboardLayout: (await import(`./locales/${currentLng}/dashboard-layout`))
      .default,
    support: (await import(`./locales/${currentLng}/support`)).default,
    userHistory: (await import(`./locales/${currentLng}/user-history`)).default,
  };
  console.log(`Translations loaded for ${currentLng}`);
};

export const t = (
  ns: Namespaces,
  key: string,
  options?: Record<string, string | number>,
): string => {
  if (!currentLng) {
    console.warn("Language or namespace not initialized");
    return key; // Return the key if any part of the nested path is not found
  }

  const translationsForLng = translations[currentLng];
  if (!translationsForLng) {
    console.warn(`No translations found for language ${currentLng}`);
    return key; // Return the key if any part of the nested path is not found
  }
  // Assuming `ns` is defined somewhere in your code
  // Split the key by dots to handle nested structures
  console.log(`t ${currentLng}-${ns}-${key}`);
  const keys = key.split(".");
  let translation = translationsForLng[ns];
  for (const k of keys) {
    if (typeof translation === "object" && k in translation) {
      translation = translation[k] as Record<string, Record<string, any>>;
    } else {
      console.warn(`No translation found for key ${currentLng}-${ns}-${key}`);
      return key; // Return the key if any part of the nested path is not found
    }
  }
  if (typeof translation === "function") {
    return (
      translation as (options?: Record<string, string | number>) => string
    )(options ?? {});
  }

  return translation as unknown as string;
};
