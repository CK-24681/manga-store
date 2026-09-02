import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { BestSellersRankGrid } from './components/BestSellersRankGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LookInsideModal } from './components/LookInsideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReadingGuideModal } from './components/ReadingGuideModal';
import { Footer } from './components/Footer';
import { SellPage } from './components/SellPage';
import { CartItem, MangaCategory, MangaFormat, MangaItem, OrderItem } from './types';
import { useLanguage } from './context/LanguageContext';
import { Check, ArrowRight, BookOpen, Truck, Star } from 'lucide-react';

export default function App() {
  const { t, formatPrice, translateFormat, translateCategory } = useLanguage();
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [bestSellers, setBestSellers] = useState<MangaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MangaCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<'rank' | 'rating' | 'price-low' | 'price-high'>('rank');
  const [isLoading, setIsLoading] = useState(true);

  // Routing state
  const [currentView, setCurrentView] = useState<'home' | 'releases' | 'deals' | 'sell'>('home');

  // Modals state
  const [selectedManga, setSelectedManga] = useState<MangaItem | null>(null);
  const [lookInsideManga, setLookInsideManga] = useState<MangaItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReadingGuideOpen, setIsReadingGuideOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchManga = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '20'
    });
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    
    // Custom sort based on view
    let currentSort = sortBy;
    if (currentView === 'releases') currentSort = 'rank'; // Actually we'd sort by date but rank is fine for mock
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
  }, [currentPage, searchQuery, selectedCategory, sortBy, currentView]);

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

  const handleNavigate = (view: 'home' | 'releases' | 'deals' | 'sell') => {
    setCurrentView(view);
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Handlers
  const handleAddToCart = (manga: MangaItem, format: MangaFormat, qty = 1) => {
    const formatObj = manga.formats?.find((f) => f.format === format) || manga.formats?.[0] || { format, price: 9.99 };
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.mangaId === manga.id && item.format === format
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
            volumeNumber: manga.currentVolume,
          },
        ];
      }
    });

    setToastMessage(`"${manga.title}" (${translateFormat(format)}) ${t.addedToCart}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = (manga: MangaItem, format: MangaFormat) => {
    handleAddToCart(manga, format, 1);
    setSelectedManga(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (mangaId: string, format: MangaFormat, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(mangaId, format);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.mangaId === mangaId && item.format === format
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (mangaId: string, format: MangaFormat) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.mangaId === mangaId && item.format === format))
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#EAEDED] text-gray-900 flex flex-col font-sans selection:bg-[#FF9900] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131921] text-white border-2 border-[#FF9900] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-bold">
          <Check className="w-4 h-4 text-[#FF9900]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#FF9900] text-black px-2.5 py-1 rounded text-[11px] font-black hover:bg-[#e68a00] cursor-pointer"
          >
            {t.viewCart}
          </button>
        </div>
      )}

      {/* Amazon Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenReadingGuide={() => setIsReadingGuideOpen(true)}
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
              onOpenReadingGuide={() => setIsReadingGuideOpen(true)}
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

      <ReadingGuideModal
        isOpen={isReadingGuideOpen}
        onClose={() => setIsReadingGuideOpen(false)}
        allManga={mangaList}
        onSelectManga={setSelectedManga}
      />

      {/* Amazon Footer */}
      <Footer />
    </div>
  );
}
