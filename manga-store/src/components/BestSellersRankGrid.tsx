import React, { useState } from 'react';
import { Flame, Filter, BookOpen } from 'lucide-react';
import { MangaCategory, MangaFormat, MangaItem, CATEGORIES_LIST } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface BestSellersRankGridProps {
  mangaList: MangaItem[];
  selectedCategory: MangaCategory;
  onSelectCategory: (cat: MangaCategory) => void;
  onSelectManga: (manga: MangaItem) => void;
  onAddToCart: (manga: MangaItem, format: MangaFormat) => void;
  onOpenLookInside: (manga: MangaItem) => void;
  onOpenReadingGuide: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  onSortChange: (sort: 'rank' | 'rating' | 'price-low' | 'price-high') => void;
  isLoading: boolean;
}

export const BestSellersRankGrid: React.FC<BestSellersRankGridProps> = ({
  mangaList,
  selectedCategory,
  onSelectCategory,
  onSelectManga,
  onAddToCart,
  onOpenLookInside,
  onOpenReadingGuide,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  sortBy,
  onSortChange,
  isLoading,
}) => {
  const { t, translateCategory } = useLanguage();

  let sortedList = [...mangaList];
  if (sortBy === 'price-low') {
    sortedList.sort((a, b) => (a.formats[0]?.price || 0) - (b.formats[0]?.price || 0));
  } else if (sortBy === 'price-high') {
    sortedList.sort((a, b) => (b.formats[0]?.price || 0) - (a.formats[0]?.price || 0));
  }

  return (
    <section id="best-sellers-section" className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6 font-sans">
      
      {/* ── Header Banner ── */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {t.bestSellersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{t.bestSellersSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar Filters (lg+) ── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">{t.categoryLabel}</h3>
            <ul className="space-y-1.5 mb-6">
              {CATEGORIES_LIST.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className={`w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-[#FFF8E7] text-[#B12704] font-bold border-l-4 border-[#FF9900]' 
                        : 'text-gray-700 hover:text-[#B12704] hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    {cat === 'All' ? t.allManga : translateCategory(cat)}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mock Filters for UI presentation */}
            <h3 className="font-bold text-gray-900 mb-3">Formatos</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#B12704]">
                  <input type="checkbox" className="rounded text-[#FF9900] focus:ring-[#FF9900] w-4 h-4 cursor-pointer" />
                  <span>Físico (Paperback)</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#B12704]">
                  <input type="checkbox" className="rounded text-[#FF9900] focus:ring-[#FF9900] w-4 h-4 cursor-pointer" />
                  <span>Digital (Kindle)</span>
                </label>
              </li>
            </ul>

            <h3 className="font-bold text-gray-900 mb-3">Disponibilidade</h3>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#B12704]">
                  <input type="checkbox" className="rounded text-[#FF9900] focus:ring-[#FF9900] w-4 h-4 cursor-pointer" defaultChecked />
                  <span>Em Estoque</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#B12704]">
                  <input type="checkbox" className="rounded text-[#FF9900] focus:ring-[#FF9900] w-4 h-4 cursor-pointer" />
                  <span>Pré-Venda</span>
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* ── Filter & Sort Bar ── */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-sm">
            {/* Count */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">
                {totalItems > 0 ? t.showingCount.replace('{count}', totalItems.toString()) : 'Loading...'}
              </span>
            </div>

            {/* Sort select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-gray-600 font-medium text-xs whitespace-nowrap">
                {t.sortByLabel}
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="border border-gray-300 rounded bg-gray-50 px-2 py-1 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-[#FF9900] focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="rank">{t.sortRank}</option>
                <option value="rating">{t.sortRating}</option>
                <option value="price-low">{t.sortPriceLow}</option>
                <option value="price-high">{t.sortPriceHigh}</option>
              </select>
            </div>
          </div>

          {/* ── Product Grid ── */}
          {isLoading ? (
            <div className="bg-white rounded-lg p-10 sm:p-12 text-center border border-gray-200 shadow-sm flex-1 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF9900]"></div>
              <p className="text-sm font-medium text-gray-600 mt-4">Carregando catálogo...</p>
            </div>
          ) : sortedList.length === 0 ? (
            <div className="bg-white rounded-lg p-10 sm:p-12 text-center border border-gray-200 shadow-sm flex-1 flex flex-col justify-center items-center">
              <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-base font-medium text-gray-600">{t.noMangaFound}</p>
              <button
                onClick={() => onSelectCategory('All')}
                className="mt-4 bg-[#FF9900] text-white font-bold px-5 py-2 rounded shadow hover:bg-[#e68a00] cursor-pointer transition-colors"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {sortedList.map((manga) => (
                  <ProductCard
                    key={manga.id}
                    manga={manga}
                    onSelectManga={onSelectManga}
                    onAddToCart={(format) => onAddToCart(manga, format)}
                    onOpenLookInside={() => onOpenLookInside(manga)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 sm:gap-4 mt-8 sm:mt-10 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-40 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed cursor-pointer"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-40 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed cursor-pointer"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
