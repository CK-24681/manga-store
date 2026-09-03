import React, { useState, useMemo } from 'react';
import { 
  Flame, Filter, BookOpen, Star, X, RotateCcw, Check, 
  Sparkles, Tag, CheckCircle2, ChevronRight, SlidersHorizontal, Truck
} from 'lucide-react';
import { MangaCategory, MangaFormat, MangaItem, CATEGORIES_LIST } from '../../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';

interface BestSellersRankGridProps {
  mangaList: MangaItem[];
  selectedCategory: MangaCategory;
  onSelectCategory: (cat: MangaCategory) => void;
  onSelectManga: (manga: MangaItem) => void;
  onAddToCart: (manga: MangaItem, format: MangaFormat, volumeNumber?: number) => void;
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

type PriceFilterType = 'all' | 'under-50' | '50-80' | '80-120' | 'above-120' | 'custom';

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
  const { t, translateCategory, translateFormat, formatPrice } = useLanguage();

  // ── Estados dos Filtros Aprofundados ──
  const [selectedFormats, setSelectedFormats] = useState<MangaFormat[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilterType>('all');
  const [customMinInput, setCustomMinInput] = useState('');
  const [customMaxInput, setCustomMaxInput] = useState('');
  const [appliedCustomMin, setAppliedCustomMin] = useState<number | null>(null);
  const [appliedCustomMax, setAppliedCustomMax] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyFreeShipping, setOnlyFreeShipping] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Toggle para seleção de formatos múltiplos
  const handleToggleFormat = (format: MangaFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseFloat(customMinInput);
    const max = parseFloat(customMaxInput);
    setAppliedCustomMin(!isNaN(min) ? min : null);
    setAppliedCustomMax(!isNaN(max) ? max : null);
    setPriceFilter('custom');
  };

  const handleSelectPricePreset = (preset: PriceFilterType) => {
    setPriceFilter(preset);
    if (preset !== 'custom') {
      setAppliedCustomMin(null);
      setAppliedCustomMax(null);
      setCustomMinInput('');
      setCustomMaxInput('');
    }
  };

  const clearAllFilters = () => {
    onSelectCategory('All');
    setSelectedFormats([]);
    setPriceFilter('all');
    setCustomMinInput('');
    setCustomMaxInput('');
    setAppliedCustomMin(null);
    setAppliedCustomMax(null);
    setMinRating(0);
    setOnlyFreeShipping(false);
    setOnlyInStock(false);
    setOnlyDeals(false);
  };

  // Contagem de filtros ativos
  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedFormats.length +
    (priceFilter !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyFreeShipping ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyDeals ? 1 : 0);

  // ── Filtragem e Ordenação dos Mangás ──
  const filteredAndSortedList = useMemo(() => {
    const list = mangaList.filter((manga) => {
      // 1. Categoria (verificação adicional)
      if (selectedCategory !== 'All' && manga.category !== selectedCategory) {
        return false;
      }

      // 2. Formatos de Publicação
      if (selectedFormats.length > 0) {
        const hasMatchingFormat = manga.formats.some((f) => selectedFormats.includes(f.format));
        if (!hasMatchingFormat) return false;
      }

      // 3. Faixa de Preço (baseada no valor em BRL: preço * 5.4)
      const relevantFormat = selectedFormats.length > 0
        ? manga.formats.find((f) => selectedFormats.includes(f.format)) || manga.formats[0]
        : manga.formats[0];
      const priceBRL = (relevantFormat?.price ?? 0) * 5.4;

      if (priceFilter === 'under-50' && priceBRL > 50) return false;
      if (priceFilter === '50-80' && (priceBRL < 50 || priceBRL > 80)) return false;
      if (priceFilter === '80-120' && (priceBRL < 80 || priceBRL > 120)) return false;
      if (priceFilter === 'above-120' && priceBRL < 120) return false;
      if (priceFilter === 'custom') {
        if (appliedCustomMin !== null && priceBRL < appliedCustomMin) return false;
        if (appliedCustomMax !== null && priceBRL > appliedCustomMax) return false;
      }

      // 4. Avaliação Mínima
      if (minRating > 0 && manga.rating < minRating) {
        return false;
      }

      // 5. Frete Grátis
      if (onlyFreeShipping && !manga.isPrimeEligible) {
        return false;
      }

      // 6. Disponibilidade em Estoque
      if (onlyInStock) {
        const hasStock = manga.formats.some((f) => f.inStock);
        if (!hasStock) return false;
      }

      // 7. Apenas Ofertas / Descontos
      if (onlyDeals) {
        const hasDiscount = manga.formats.some((f) => f.savingsPercent > 0);
        if (!hasDiscount) return false;
      }

      return true;
    });

    // Ordenação
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.formats[0]?.price || 0) - (b.formats[0]?.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.formats[0]?.price || 0) - (a.formats[0]?.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rank') {
      list.sort((a, b) => a.rank - b.rank);
    }

    return list;
  }, [
    mangaList,
    selectedCategory,
    selectedFormats,
    priceFilter,
    appliedCustomMin,
    appliedCustomMax,
    minRating,
    onlyFreeShipping,
    onlyInStock,
    onlyDeals,
    sortBy,
  ]);

  // Componente de conteúdo de filtros (usado tanto no sidebar desktop quanto no drawer mobile)
  const FilterControlsContent = () => (
    <div className="space-y-6 text-sm text-gray-800">
      {/* ── Categorias ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
            {t.categoryLabel}
          </h3>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="text-[11px] text-[#007185] hover:text-[#C7511F] hover:underline"
            >
              Limpar
            </button>
          )}
        </div>
        <ul className="space-y-1">
          {CATEGORIES_LIST.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FFF8E7] text-[#B12704] font-bold border-l-4 border-[#FF9900]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#B12704] border-l-4 border-transparent'
                }`}
              >
                <span>{cat === 'All' ? t.allManga : translateCategory(cat)}</span>
                {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-[#FF9900]" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-200" />

      {/* ── Faixa de Preço ── */}
      <div>
        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Faixa de Preço
        </h3>
        <ul className="space-y-1.5 text-xs">
          {[
            { id: 'all', label: 'Todos os preços' },
            { id: 'under-50', label: 'Até R$ 50' },
            { id: '50-80', label: 'R$ 50 a R$ 80' },
            { id: '80-120', label: 'R$ 80 a R$ 120' },
            { id: 'above-120', label: 'Acima de R$ 120' },
          ].map((item) => (
            <li key={item.id}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#B12704] select-none py-0.5">
                <input
                  type="radio"
                  name="priceFilterPreset"
                  checked={priceFilter === item.id}
                  onChange={() => handleSelectPricePreset(item.id as PriceFilterType)}
                  className="text-[#FF9900] focus:ring-[#FF9900] cursor-pointer"
                />
                <span className={priceFilter === item.id ? 'font-bold text-[#B12704]' : 'text-gray-700'}>
                  {item.label}
                </span>
              </label>
            </li>
          ))}
        </ul>

        {/* Custom Price Inputs */}
        <form onSubmit={handleApplyCustomPrice} className="mt-3 pt-2 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">R$</span>
              <input
                type="number"
                placeholder="Mín"
                value={customMinInput}
                onChange={(e) => setCustomMinInput(e.target.value)}
                className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
              />
            </div>
            <span className="text-gray-400 text-xs">a</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">R$</span>
              <input
                type="number"
                placeholder="Máx"
                value={customMaxInput}
                onChange={(e) => setCustomMaxInput(e.target.value)}
                className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              Ir
            </button>
          </div>
        </form>
      </div>

      <hr className="border-gray-200" />

      {/* ── Formatos ── */}
      <div>
        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Formatos de Edição
        </h3>
        <ul className="space-y-1.5 text-xs">
          {(['Paperback', 'Deluxe Hardcover', 'Kindle / Digital', 'Collector Box Set'] as MangaFormat[]).map(
            (fmt) => {
              const isChecked = selectedFormats.includes(fmt);
              return (
                <li key={fmt}>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#B12704] select-none py-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleFormat(fmt)}
                      className="rounded text-[#FF9900] focus:ring-[#FF9900] cursor-pointer"
                    />
                    <span className={isChecked ? 'font-bold text-[#B12704]' : 'text-gray-700'}>
                      {translateFormat(fmt)}
                    </span>
                  </label>
                </li>
              );
            }
          )}
        </ul>
      </div>

      <hr className="border-gray-200" />

      {/* ── Avaliação Mínima ── */}
      <div>
        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Avaliação dos Leitores
        </h3>
        <ul className="space-y-1.5 text-xs">
          {[4, 3].map((stars) => (
            <li key={stars}>
              <button
                onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                className={`flex items-center gap-1.5 w-full text-left py-1 px-1.5 rounded transition-colors cursor-pointer ${
                  minRating === stars ? 'bg-amber-50 font-bold text-[#B12704]' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex text-[#FF9900]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= stars ? 'fill-[#FF9900] text-[#FF9900]' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px]">& ou mais</span>
              </button>
            </li>
          ))}
          {minRating > 0 && (
            <li>
              <button
                onClick={() => setMinRating(0)}
                className="text-[11px] text-[#007185] hover:text-[#C7511F] hover:underline pt-1 block"
              >
                Ver todas as avaliações
              </button>
            </li>
          )}
        </ul>
      </div>

      <hr className="border-gray-200" />

      {/* ── Benefícios e Condições Especiais ── */}
      <div>
        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Vantagens & Ofertas
        </h3>
        <ul className="space-y-2 text-xs">
          <li>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyFreeShipping}
                onChange={(e) => setOnlyFreeShipping(e.target.checked)}
                className="rounded text-[#007185] focus:ring-[#007185] cursor-pointer"
              />
              <span className="flex items-center gap-1.5 text-gray-700">
                <Truck className="w-3.5 h-3.5 text-[#007185]" />
                <span>Frete Grátis Disponível</span>
              </span>
            </label>
          </li>
          <li>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyDeals}
                onChange={(e) => setOnlyDeals(e.target.checked)}
                className="rounded text-[#CC0C39] focus:ring-[#CC0C39] cursor-pointer"
              />
              <span className="flex items-center gap-1.5 text-gray-700">
                <Tag className="w-3.5 h-3.5 text-[#CC0C39]" />
                <span>Somente com Desconto</span>
              </span>
            </label>
          </li>
          <li>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-600 cursor-pointer"
              />
              <span className="flex items-center gap-1.5 text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Em Estoque Imediato</span>
              </span>
            </label>
          </li>
        </ul>
      </div>

      {/* Botão para limpar filtros caso haja algum ativo */}
      {activeFiltersCount > 0 && (
        <div className="pt-2">
          <button
            onClick={clearAllFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
            <span>Limpar Todos os Filtros ({activeFiltersCount})</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section id="best-sellers-section" className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6 font-sans">
      
      {/* ── Header Banner ── */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>{t.bestSellersTitle}</span>
              {selectedCategory !== 'All' && (
                <span className="text-[#FF9900] text-lg font-bold">
                  — {translateCategory(selectedCategory)}
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{t.bestSellersSubtitle}</p>
          </div>
          <button
            onClick={onOpenReadingGuide}
            className="self-start sm:self-auto bg-[#FFF8E7] hover:bg-[#FFEEC2] border border-[#FF9900] text-[#B12704] font-bold px-4 py-2 rounded-full text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>Ver Guia de Leitura & Cronologia</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar Filters (Desktop lg+) ── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
                <Filter className="w-4 h-4 text-[#FF9900]" />
                <span>Filtros do Catálogo</span>
              </div>
              {activeFiltersCount > 0 && (
                <span className="bg-[#FF9900] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <FilterControlsContent />
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* ── Top Bar: Controles de Ordenação & Botão de Filtros Mobile ── */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-sm">
            
            {/* Contagem & Botão Mobile */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <span className="font-bold text-gray-800">
                {isLoading ? (
                  'Carregando mangás...'
                ) : (
                  <>
                    Exibindo <span className="text-[#B12704]">{filteredAndSortedList.length}</span> título(s)
                    {filteredAndSortedList.length !== mangaList.length && (
                      <span className="text-gray-400 font-normal text-xs ml-1">
                        (de {mangaList.length})
                      </span>
                    )}
                  </>
                )}
              </span>

              {/* Botão Filtros para Mobile / Tablet */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-bold px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF9900]" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#FF9900] text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label htmlFor="sort-select" className="text-gray-600 font-medium text-xs whitespace-nowrap">
                {t.sortByLabel}
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="border border-gray-300 rounded bg-gray-50 px-2.5 py-1.5 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-[#FF9900] focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="rank">{t.sortRank}</option>
                <option value="rating">{t.sortRating}</option>
                <option value="price-low">{t.sortPriceLow}</option>
                <option value="price-high">{t.sortPriceHigh}</option>
              </select>
            </div>
          </div>

          {/* ── Chips de Filtros Ativos (Pills) ── */}
          {activeFiltersCount > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-600 font-bold mr-1">Filtros ativos:</span>

              {/* Categoria */}
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => onSelectCategory('All')}
                  className="bg-white border border-amber-300 text-gray-800 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                >
                  <span>Categoria: {translateCategory(selectedCategory)}</span>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                </button>
              )}

              {/* Formatos */}
              {selectedFormats.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleToggleFormat(fmt)}
                  className="bg-white border border-amber-300 text-gray-800 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                >
                  <span>{translateFormat(fmt)}</span>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                </button>
              ))}

              {/* Preço */}
              {priceFilter !== 'all' && (
                <button
                  onClick={() => handleSelectPricePreset('all')}
                  className="bg-white border border-amber-300 text-gray-800 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                >
                  <span>
                    Preço:{' '}
                    {priceFilter === 'under-50'
                      ? 'Até R$ 50'
                      : priceFilter === '50-80'
                      ? 'R$ 50 a R$ 80'
                      : priceFilter === '80-120'
                      ? 'R$ 80 a R$ 120'
                      : priceFilter === 'above-120'
                      ? 'Acima de R$ 120'
                      : `R$ ${appliedCustomMin ?? 0} - R$ ${appliedCustomMax ?? '∞'}`}
                  </span>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                </button>
              )}

              {/* Avaliação */}
              {minRating > 0 && (
                <button
                  onClick={() => setMinRating(0)}
                  className="bg-white border border-amber-300 text-gray-800 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                >
                  <span>{minRating}★ ou mais</span>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                </button>
              )}

              {/* Frete Grátis */}
              {onlyFreeShipping && (
                <button
                  onClick={() => setOnlyFreeShipping(false)}
                  className="bg-white border border-teal-300 text-teal-800 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                >
                  <Truck className="w-3 h-3 text-teal-700" />
                  <span>Frete Grátis</span>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                </button>
              )}

              {/* Ofertas */}
              {onlyDeals && (
                <button
                  onClick={() => setOnlyDeals(false)}
                  className="bg-white border border-red-300 text-[#CC0C39] px-2.5 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <span>Com Desconto</span>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                </button>
              )}

              {/* Estoque */}
              {onlyInStock && (
                <button
                  onClick={() => setOnlyInStock(false)}
                  className="bg-white border border-emerald-300 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <span>Em Estoque</span>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-600" />
                </button>
              )}

              {/* Botão Limpar Tudo */}
              <button
                onClick={clearAllFilters}
                className="text-[#007185] hover:text-[#C7511F] hover:underline font-bold text-xs ml-auto transition-colors cursor-pointer"
              >
                Limpar todos
              </button>
            </div>
          )}

          {/* ── Grade de Mangás ── */}
          {isLoading ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200 shadow-sm flex-1 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF9900]"></div>
              <p className="text-sm font-medium text-gray-600 mt-4">Carregando catálogo de mangás...</p>
            </div>
          ) : filteredAndSortedList.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200 shadow-sm flex-1 flex flex-col justify-center items-center space-y-3">
              <BookOpen className="w-14 h-14 text-gray-300" />
              <h3 className="text-base font-bold text-gray-800">Nenhum mangá encontrado para estes filtros</h3>
              <p className="text-xs text-gray-500 max-w-md">
                Tente ajustar a faixa de preço, desmarcar formatos específicos ou redefinir todos os filtros aplicados para visualizar mais obras.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-5 py-2 rounded-full text-xs shadow-sm transition-colors cursor-pointer"
              >
                Redefinir Todos os Filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredAndSortedList.map((manga) => (
                  <ProductCard
                    key={manga.id}
                    manga={manga}
                    onSelectManga={onSelectManga}
                    onAddToCart={(format, volumeNumber) => onAddToCart(manga, format, volumeNumber)}
                    onOpenLookInside={() => onOpenLookInside(manga)}
                  />
                ))}
              </div>

              {/* Controles de Paginação */}
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

      {/* ── Modal / Drawer de Filtros para Mobile ── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header do Drawer */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
                <Filter className="w-4 h-4 text-[#FF9900]" />
                <span>Filtros do Catálogo</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#FF9900] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo Rolável */}
            <div className="p-5 overflow-y-auto flex-1">
              <FilterControlsContent />
            </div>

            {/* Footer com Botão de Ação */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-full text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Limpar Todos
                </button>
              )}
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold py-2.5 px-4 rounded-full text-xs shadow-sm transition-colors cursor-pointer text-center"
              >
                Ver {filteredAndSortedList.length} Mangás
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
