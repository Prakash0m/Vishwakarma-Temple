import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Nepali as explicitly requested
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('temple_language') || 'ne';
  });

  useEffect(() => {
    localStorage.setItem('temple_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ne' ? 'en' : 'ne'));
  };

  // Helper function to get translation key using dot notation (e.g. 'nav.home')
  const t = (keyPath, defaultVal = '') => {
    const keys = keyPath.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if missing in current language
        let fallback = translations['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return defaultVal || keyPath;
          }
        }
        return fallback;
      }
    }

    return current;
  };

  // Helper function to pick localized field from a MongoDB object
  const getLocalized = (item, nepaliField, englishField) => {
    if (!item) return '';
    if (language === 'ne') {
      return item[nepaliField] || item[englishField] || '';
    } else {
      return item[englishField] || item[nepaliField] || '';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
