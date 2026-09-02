import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, MangaCategory, MangaFormat } from '../types';
import { 
  TRANSLATIONS, 
  CATEGORY_TRANSLATIONS, 
  FORMAT_TRANSLATIONS, 
  TranslationDictionary 
} from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  translateCategory: (cat: MangaCategory) => string;
  translateFormat: (format: MangaFormat) => string;
  formatPrice: (priceUSD: number) => string;
  currencyCode: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'mangazon_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'pt' || saved === 'en' || saved === 'es' || saved === 'ja') {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'pt'; // Default to Portuguese for smooth bilingual experience
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  const translateCategory = (cat: MangaCategory): string => {
    return CATEGORY_TRANSLATIONS[language]?.[cat] || cat;
  };

  const translateFormat = (format: MangaFormat): string => {
    return FORMAT_TRANSLATIONS[language]?.[format] || format;
  };

  const formatPrice = (priceUSD: number): string => {
    switch (language) {
      case 'pt': {
        // Approximate BRL (1 USD ≈ R$ 5.40)
        const brl = priceUSD * 5.4;
        return `R$ ${brl.toFixed(2).replace('.', ',')}`;
      }
      case 'ja': {
        // Approximate JPY (1 USD ≈ 155 JPY)
        const jpy = Math.round(priceUSD * 155);
        return `¥${jpy.toLocaleString('ja-JP')}`;
      }
      case 'es': {
        // Approximate EUR (1 USD ≈ 0.95 EUR)
        const eur = priceUSD * 0.95;
        return `${eur.toFixed(2).replace('.', ',')} €`;
      }
      case 'en':
      default:
        return `$${priceUSD.toFixed(2)}`;
    }
  };

  const currencyCode = {
    pt: 'BRL',
    en: 'USD',
    es: 'EUR',
    ja: 'JPY',
  }[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateCategory,
        translateFormat,
        formatPrice,
        currencyCode,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
