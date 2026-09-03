import React from 'react';
import { Logo } from './Logo';
import { Globe, DollarSign } from 'lucide-react';
import { Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export interface FooterProps {
  onOpenFAQ?: (tab?: 'faq' | 'human', category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFAQ }) => {
  const { t, language, setLanguage } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languagesList: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'pt', label: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'es', label: 'Español (ES)', flag: '🇪🇸' },
    { code: 'ja', label: '日本語 (JP)', flag: '🇯🇵' },
  ];

  const handleLinkClick = (link: string, colIdx: number, linkIdx: number) => {
    if (!onOpenFAQ) return;

    // Coluna 4 é a coluna de suporte/ajuda ("Deixe-nos Ajudar Você")
    if (colIdx === 3) {
      if (linkIdx === 1) {
        onOpenFAQ('faq', 'entrega'); // Fretes & Prazos
      } else if (linkIdx === 2) {
        onOpenFAQ('faq', 'arrependimento'); // Devoluções & Trocas
      } else {
        onOpenFAQ('human'); // SAC e Atendimento Humano
      }
    }
  };

  const footerCols = [
    { title: t.col1Title, links: [t.col1L1, t.col1L2, t.col1L3, t.col1L4] },
    { title: t.col2Title, links: [t.col2L1, t.col2L2, t.col2L3, t.col2L4] },
    { title: t.col3Title, links: [t.col3L1, t.col3L2, t.col3L3, t.col3L4] },
    { title: t.col4Title, links: [t.col4L1, t.col4L2, t.col4L3, t.col4L4] },
  ];

  return (
    <footer id="mangazon-footer" className="w-full bg-[#131921] text-white text-xs font-sans mt-10 sm:mt-12">

      {/* Back to top */}
      <button
        id="back-to-top-btn"
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-gray-200 py-3 text-center font-bold text-xs cursor-pointer transition-colors block"
      >
        {t.backToTop}
      </button>

      {/* 4-column directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-left border-b border-gray-700">
        {footerCols.map((col, idx) => (
          <div key={idx}>
            <h4
              onClick={() => idx === 3 && onOpenFAQ && onOpenFAQ('human')}
              className={`font-bold text-white text-sm mb-3 ${idx === 3 ? 'cursor-pointer hover:text-[#FF9900] transition-colors' : ''}`}
            >
              {col.title}
            </h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              {col.links.map((link, li) => (
                <li
                  key={li}
                  onClick={() => handleLinkClick(link, idx, li)}
                  className="hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Brand / language bar */}
      <div className="py-5 sm:py-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 border-b border-gray-800 px-4">
        <Logo size="sm" />

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Language pills */}
          <div className="flex items-center gap-1 bg-black/40 border border-gray-700 rounded-lg p-1">
            <Globe className="w-4 h-4 text-gray-400 ml-1 mr-0.5" />
            {languagesList.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1 ${
                  language === l.code
                    ? 'bg-[#FF9900] text-black font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Currency */}
          <div className="flex items-center gap-1.5 border border-gray-600 rounded-lg px-3 py-1.5 text-gray-300">
            <DollarSign className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>{t.currencySelector}</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-5 sm:py-6 text-center text-[11px] text-gray-400 space-y-1.5 px-4 bg-[#0F1111]">
        <p>{t.copyrightNotice}</p>
      </div>
    </footer>
  );
};
