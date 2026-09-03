import React, { useState, useEffect, useCallback } from 'react';
import {
  Header,
  HeroCarousel,
  BestSellersRankGrid,
  ProductDetailModal,
  LookInsideModal,
  CartDrawer,
  CheckoutModal,
  AIAssistantModal,
  Footer,
} from './components';
import { ReadingGuidePage, SellPage } from './pages';
import { CartItem, MangaCategory, MangaFormat, MangaItem, OrderItem } from './types';
import { useLanguage } from './context/LanguageContext';
import { Check, ArrowRight, BookOpen, Truck, Star, X, Bot, Sparkles } from 'lucide-react';

export default function App() {
  const { t, formatPrice, translateFormat, translateCategory } = useLanguage();
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [bestSellers, setBestSellers] = useState<MangaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MangaCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<'rank' | 'rating' | 'price-low' | 'price-high'>('rank');
  const [isLoading, setIsLoading] = useState(true);

  // Routing state
  const [currentView, setCurrentView] = useState<'home' | 'releases' | 'deals' | 'sell' | 'reading-guide'>('home');

  // Modals state
  const [selectedManga, setSelectedManga] = useState<MangaItem | null>(null);
  const [lookInsideManga, setLookInsideManga] = useState<MangaItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchManga = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '32'
    });
    if (debouncedSearch) params.append('q', debouncedSearch);
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    
    // Custom sort based on view
    let currentSort = sortBy;
    if (currentView === 'releases') currentSort = 'releases';
    if (currentView === 'deals') currentSort = 'price-low';
    
    if (currentSort) params.append('sortBy', currentSort);

    fetch(`/api/manga?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setMangaList(data.data);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.total || 0);
        }
      })
      .finally(() => setIsLoading(false));
  }, [currentPage, debouncedSearch, selectedCategory, sortBy, currentView]);

  // Load from API on mount & on dependencies change
  useEffect(() => {
    fetchManga();
  }, [fetchManga]);

  useEffect(() => {
    // Fetch Best Sellers for the Hero Carousel
    fetch('/api/manga/best-sellers')
      .then((res) => res.json())
      .then((data) => {
        if (data.bestSellers) setBestSellers(data.bestSellers);
      });
  }, []);

  // When changing search/filters, reset to page 1
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
    if (currentView !== 'home') setCurrentView('home');
  };
  const handleCategoryChange = (cat: MangaCategory) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (currentView !== 'home') setCurrentView('home');
  };

  const handleNavigate = (view: 'home' | 'releases' | 'deals' | 'sell' | 'reading-guide') => {
    setCurrentView(view);
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Handlers
  const handleAddToCart = (manga: MangaItem, format: MangaFormat, qty = 1, volumeNumber = 1) => {
    const formatObj = manga.formats?.find((f) => f.format === format) || manga.formats?.[0] || { format, price: 9.99 };
    const volNum = volumeNumber || 1;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.mangaId === manga.id && item.format === format && item.volumeNumber === volNum
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            mangaId: manga.id,
            manga,
            format,
            price: formatObj.price,
            quantity: qty,
            volumeNumber: volNum,
          },
        ];
      }
    });

    setToastMessage(`"${manga.title}" — Vol. ${volNum} (${translateFormat(format)}) ${t.addedToCart}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBuyNow = (manga: MangaItem, format: MangaFormat, volumeNumber = 1) => {
    handleAddToCart(manga, format, 1, volumeNumber);
    setSelectedManga(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (mangaId: string, format: MangaFormat, volumeNumber: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(mangaId, format, volumeNumber);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.mangaId === mangaId && item.format === format && item.volumeNumber === volumeNumber
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (mangaId: string, format: MangaFormat, volumeNumber: number) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.mangaId === mangaId && item.format === format && item.volumeNumber === volumeNumber))
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#EAEDED] text-gray-900 flex flex-col font-sans selection:bg-[#FF9900] selection:text-black">

      {/* Amazon Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenReadingGuide={() => handleNavigate('reading-guide')}
        onNavigate={handleNavigate}
        currentView={currentView}
        onOpenBestSellers={() => {
          handleNavigate('home');
          setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 100);
        }}
        onResetHome={() => handleNavigate('home')}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col animate-fade-in" key={currentView}>
        {currentView === 'sell' ? (
          <SellPage />
        ) : currentView === 'reading-guide' ? (
          <ReadingGuidePage onSelectManga={setSelectedManga} />
        ) : (
          <>
            {/* View Headers */}
            {currentView === 'releases' && (
              <div className="bg-white border-b border-gray-200 py-4 px-6 mb-4 shadow-sm text-center">
                <h1 className="text-2xl font-black text-gray-900">Novos Lançamentos em Mangás</h1>
                <p className="text-sm text-gray-600 mt-1">Os títulos mais quentes que acabaram de chegar na Mangazon.</p>
              </div>
            )}
            
            {currentView === 'deals' && (
              <div className="bg-gradient-to-r from-[#CC0C39] to-[#E67A00] py-4 px-6 mb-4 shadow-sm text-center text-white">
                <h1 className="text-2xl font-black flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 fill-current" />
                  Ofertas Imperdíveis
                  <Star className="w-6 h-6 fill-current" />
                </h1>
                <p className="text-sm font-medium mt-1 text-white/90">Aproveite descontos especiais em coleções e volumes avulsos.</p>
              </div>
            )}

            {/* Hero Carousel (Only on home) */}
            {currentView === 'home' && !searchQuery && bestSellers.length > 0 && (
              <HeroCarousel
                allManga={bestSellers}
                onSelectManga={setSelectedManga}
                onOpenBestSellers={() => {
                  setSelectedCategory('All');
                  window.scrollTo({ top: 450, behavior: 'smooth' });
                }}
              />
            )}

            {/* Best Sellers Grid & Product Listings */}
            <BestSellersRankGrid
              mangaList={mangaList}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              onSelectManga={setSelectedManga}
              onAddToCart={handleAddToCart}
              onOpenLookInside={setLookInsideManga}
              onOpenReadingGuide={() => handleNavigate('reading-guide')}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              sortBy={sortBy}
              onSortChange={setSortBy}
              isLoading={isLoading}
            />
          </>
        )}
      </main>

      {/* Modals */}
      {selectedManga && (
        <ProductDetailModal
          manga={selectedManga}
          allManga={mangaList}
          onClose={() => setSelectedManga(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onOpenLookInside={setLookInsideManga}
          onSelectRelatedManga={setSelectedManga}
        />
      )}

      {lookInsideManga && (
        <LookInsideModal
          manga={lookInsideManga}
          onClose={() => setLookInsideManga(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onClearCart={() => setCartItems([])}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={(order) => {
          // order placed
        }}
        onClearCart={() => setCartItems([])}
      />


      {/* Botão Flutuante do Assistente (Design Clean & Robusto) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-ai-assistant-btn"
          onClick={() => setIsAIOpen(true)}
          className="relative w-14 h-14 rounded-full bg-[#131921] hover:bg-[#232F3E] text-[#FF9900] border border-gray-700 hover:border-[#FF9900] shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#FF9900]/40"
          title="Fale com o Assistente Mangazon"
          aria-label="Abrir Assistente Mangazon"
        >
          {/* Ícone com toque minimalista */}
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#FF9900] group-hover:rotate-12 transition-transform duration-300" />
          </div>

          {/* Indicador de Status Discreto */}
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#131921]" />

          {/* Tooltip Clean no Desktop */}
          <div className="hidden lg:block absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <div className="bg-[#131921] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-700 shadow-xl flex items-center gap-1.5">
              <span>Assistente Mangazon</span>
            </div>
          </div>
        </button>
      </div>

      {/* AI Assistant Modal (Requisito 1: Interface Funcional) */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div 
          id="cart-toast-notification"
          className="fixed bottom-24 sm:bottom-28 right-6 z-50 bg-[#131921] text-white px-4 py-3.5 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3.5 max-w-md animate-bounce-subtle"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Item Adicionado</div>
            <div className="text-xs text-gray-200 font-medium truncate mt-0.5">{toastMessage}</div>
          </div>
          <button
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold text-xs px-3 py-1.5 rounded-full flex-shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            {t.viewCart}
          </button>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Amazon Footer */}
      <Footer />
    </div>
  );
}
