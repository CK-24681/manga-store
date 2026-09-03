import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  X,
  Menu,
  Flame,
  Globe,
  Check,
} from 'lucide-react';
import { Logo } from './Logo';
import { Language, MangaCategory, CATEGORIES_LIST } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  selectedCategory: MangaCategory;
  onSelectCategory: (cat: MangaCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenReadingGuide: () => void;
  onOpenBestSellers: () => void;
  onResetHome: () => void;
  onNavigate: (view: 'home' | 'releases' | 'deals' | 'sell' | 'reading-guide') => void;
  currentView: 'home' | 'releases' | 'deals' | 'sell' | 'reading-guide';
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenReadingGuide,
  onOpenBestSellers,
  onResetHome,
  onNavigate,
  currentView,
}) => {
  const { language, setLanguage, t, translateCategory } = useLanguage();
  const [searchCat, setSearchCat] = useState<string>('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languagesList: Array<{ code: Language; label: string; flag: string; native: string }> = [
    { code: 'pt', label: 'Português (Brasil)', flag: '🇧🇷', native: 'Português - PT' },
    { code: 'en', label: 'English (United States)', flag: '🇺🇸', native: 'English - EN' },
    { code: 'es', label: 'Español (España)', flag: '🇪🇸', native: 'Español - ES' },
    { code: 'ja', label: '日本語 (Japan)', flag: '🇯🇵', native: '日本語 - JA' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCat !== 'All' && searchCat !== selectedCategory) {
      onSelectCategory(searchCat as MangaCategory);
    }
    setIsMobileSearchOpen(false);
  };

  return (
    <header id="mangazon-header" className="sticky top-0 z-40 w-full flex flex-col font-sans">

      {/* ── Top Bar ── */}
      <div className="bg-[#131921] text-white px-3 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

        {/* Logo */}
        <div
          onClick={onResetHome}
          className="rounded cursor-pointer flex-shrink-0 transition-opacity hover:opacity-80"
        >
          <Logo size="md" />
        </div>

        {/* ── Search Bar (desktop & tablet) ── */}
        <form
          onSubmit={handleSearchSubmit}
          className={`hidden sm:flex flex-1 items-center rounded-md overflow-hidden h-10 ${
            isSearchFocused ? 'ring-2 ring-[#FF9900]' : ''
          }`}
        >
          {/* Category dropdown */}
          <div className="relative bg-[#E6E6E6] text-gray-800 text-xs font-medium h-full flex items-center px-2.5 border-r border-gray-300 hover:bg-gray-300 flex-shrink-0 focus-within:ring-2 focus-within:ring-[#FF9900] rounded-l-md transition-colors">
            <select
              id="search-category-select"
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              className="bg-transparent border-none text-xs text-gray-800 font-medium cursor-pointer pr-5 focus:outline-none appearance-none outline-none z-10 w-auto min-w-[120px]"
            >
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? t.allManga : translateCategory(cat as MangaCategory)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-1.5 text-gray-600 z-0" />
          </div>

          {/* Text input */}
          <div className="relative flex-1 h-full bg-white flex items-center min-w-0">
            <input
              id="manga-search-input"
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-full px-3 text-sm text-black placeholder-gray-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                id="search-clear-btn"
                onClick={() => onSearchChange('')}
                className="p-1 mr-2 text-gray-400 hover:text-gray-700 cursor-pointer flex-shrink-0"
                title={t.clearSearch}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            id="manga-search-submit-btn"
            type="submit"
            className="bg-[#FEBD69] hover:bg-[#F3A847] text-gray-900 h-full px-4 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <Search className="w-5 h-5 text-gray-900" />
          </button>
        </form>

        {/* Mobile search toggle */}
        <button
          className="sm:hidden ml-auto p-2 rounded hover:ring-1 hover:ring-white cursor-pointer text-white flex-shrink-0"
          onClick={() => setIsMobileSearchOpen((v) => !v)}
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1 md:gap-2 text-xs flex-shrink-0 ml-auto sm:ml-0">

          {/* Language dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              id="nav-language-selector-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 p-1.5 rounded hover:ring-1 hover:ring-white cursor-pointer text-white font-medium"
              title="Change Language / Mudar Idioma"
            >
              <span className="text-base">{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-bold text-xs uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-2xl border border-gray-200 py-2 z-50 animate-fade-in text-left">
                <div className="px-3 py-1.5 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#FF9900]" />
                  <span>Idioma de Preferência</span>
                </div>
                {languagesList.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-amber-50 cursor-pointer transition ${
                      language === item.code ? 'bg-amber-100/70 font-bold text-amber-900' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{item.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{item.label}</span>
                        <span className="text-[10px] text-gray-500">{item.native}</span>
                      </div>
                    </div>
                    {language === item.code && <Check className="w-4 h-4 text-[#FF9900]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="flex items-center gap-1 p-1.5 rounded hover:ring-1 hover:ring-white cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <span
                id="cart-badge-count"
                className="absolute -top-1 left-3 bg-[#FF9900] text-black font-black text-[11px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow"
              >
                {cartCount}
              </span>
            </div>
            <span className="hidden md:inline font-bold text-white text-[13px] self-end mb-0.5">
              {t.cart}
            </span>
          </button>
        </div>
        </div>
      </div>

      {/* ── Mobile Search Bar (expandable) ── */}
      {isMobileSearchOpen && (
        <div className="sm:hidden bg-[#131921] px-3 pb-3">
          <div className="max-w-7xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center rounded-md overflow-hidden h-10 ${
              isSearchFocused ? 'ring-2 ring-[#FF9900]' : ''
            }`}
          >
            <div className="relative flex-1 h-full bg-white flex items-center min-w-0">
              <input
                id="mobile-search-input"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                autoFocus
                className="w-full h-full px-3 text-sm text-black placeholder-gray-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 mr-1 text-gray-400 hover:text-gray-700 cursor-pointer flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#FEBD69] hover:bg-[#F3A847] text-gray-900 h-full px-4 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            >
              <Search className="w-5 h-5 text-gray-900" />
            </button>
          </form>
          </div>
        </div>
      )}

      {/* ── Sub Navigation Bar ── */}
      <nav className="bg-[#232F3E] text-white px-3 md:px-6 py-1.5 border-b border-gray-700 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium whitespace-nowrap">
        <button
          id="subnav-all-btn"
          onClick={() => onSelectCategory('All')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded hover:ring-1 hover:ring-white cursor-pointer flex-shrink-0 ${
            selectedCategory === 'All' && currentView === 'home' ? 'bg-[#37475A] font-bold text-[#FF9900]' : 'text-gray-200'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>{t.allManga}</span>
        </button>

        <button
          id="subnav-best-sellers-btn"
          onClick={onOpenBestSellers}
          className="flex items-center gap-1 px-2.5 py-1 rounded hover:ring-1 hover:ring-white text-gray-200 hover:text-white cursor-pointer flex-shrink-0"
        >
          <Flame className="w-4 h-4 text-[#FF9900]" />
          <span className="font-bold text-[#FF9900]">{t.bestSellers}</span>
        </button>

        <button
          onClick={() => onNavigate('releases')}
          className={`px-2.5 py-1 rounded hover:ring-1 hover:ring-white transition-colors cursor-pointer flex-shrink-0 ${
            currentView === 'releases'
              ? 'ring-1 ring-white text-white font-bold'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Lançamentos
        </button>

        <button
          onClick={() => onNavigate('deals')}
          className={`px-2.5 py-1 rounded hover:ring-1 hover:ring-white transition-colors cursor-pointer flex-shrink-0 ${
            currentView === 'deals'
              ? 'ring-1 ring-white text-white font-bold'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Ofertas
        </button>

        <button
          onClick={() => onNavigate('reading-guide')}
          className={`px-2.5 py-1 rounded hover:ring-1 hover:ring-white transition-colors cursor-pointer flex-shrink-0 ${
            currentView === 'reading-guide'
              ? 'ring-1 ring-white text-white font-bold'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Guia de Leitura
        </button>

        <button
          onClick={() => onNavigate('sell')}
          className={`px-2.5 py-1 rounded hover:ring-1 hover:ring-white transition-colors cursor-pointer flex-shrink-0 ${
            currentView === 'sell'
              ? 'ring-1 ring-white text-white font-bold'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Venda na Mangazon
        </button>
        </div>
      </nav>
    </header>
  );
};
