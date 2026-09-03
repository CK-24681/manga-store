import { Language, MangaCategory, MangaFormat } from '../types';

export interface TranslationDictionary {
  // Top Banner & Header
  topBannerNotice: string;
  primeDealBadge: string;
  javaArchTop: string;
  deliverTo: string;
  locationName: string;
  searchPlaceholder: string;
  allCategories: string;
  bestSellers: string;
  top10: string;
  cart: string;
  allManga: string;
  readingGuides: string;
  boxSetsNav: string;
  todayDeals: string;
  searchAll: string;
  searchResultsFor: string;
  clearSearch: string;
  noMangaFound: string;
  resetFilters: string;

  // Hero Banners
  heroSlide1Title: string;
  heroSlide1Sub: string;
  heroSlide1Cta: string;
  heroSlide1Badge: string;

  heroSlide2Title: string;
  heroSlide2Sub: string;
  heroSlide2Cta: string;
  heroSlide2Badge: string;

  heroSlide3Title: string;
  heroSlide3Sub: string;
  heroSlide3Cta: string;
  heroSlide3Badge: string;

  heroBadgeAuthentic: string;
  heroBadgeReturns: string;
  heroExploreGuide: string;

  // Bento Cards
  bento1Rank: string;
  bento1Title: string;
  bento1Save: string;
  bento1Link: string;

  bento2Badge: string;
  bento2Title: string;
  bento2Desc: string;
  bento2Link: string;

  bento3Badge: string;
  bento3Title: string;
  bento3Desc: string;
  bento3Link: string;

  bento4Badge: string;
  bento4Title: string;
  bento4Desc: string;
  bento4Link: string;

  // Best Sellers Section
  bestSellersTitle: string;
  bestSellersSubtitle: string;
  bestSellersLeaderboard: string;
  primeClubTitle: string;
  primeClubSub: string;
  primeClubBadge: string;
  showingCount: string;
  categoryLabel: string;
  sortByLabel: string;
  sortRank: string;
  sortRating: string;
  sortPriceLow: string;
  sortPriceHigh: string;

  // Product Card & Badges
  bestSellerRankBadge: string;
  amazonsChoice: string;
  choice: string;
  lookInside: string;
  primeBadge: string;
  savePercent: string;
  listPrice: string;
  inStock: string;
  onlyLeft: string;
  freeDeliveryTomorrow: string;
  addToCart: string;
  addedToCart: string;
  quickView: string;

  // Product Detail Modal
  booksBreadcrumb: string;
  authorBy: string;
  artistBy: string;
  ratingsCount: string;
  formatSelectTitle: string;
  tabOverview: string;
  tabReadingGuide: string;
  tabSpecs: string;
  tabReviews: string;
  quantityLabel: string;
  buyNow1Click: string;
  shipsFrom: string;
  soldBy: string;
  officialPublisher: string;
  returnsLabel: string;
  returnPolicy30Days: string;
  paymentLabel: string;
  secureSsl: string;
  frequentlyBoughtTogether: string;
  bundleTotalPrice: string;
  bundleSaveNotice: string;
  addAllBundleToCart: string;
  publicationDetails: string;
  isbnLabel: string;
  printLengthLabel: string;
  pagesLabel: string;
  ageRatingLabel: string;
  releaseDateLabel: string;
  animeStatusTitle: string;
  officialTranslationBadge: string;
  volumeChronologyTitle: string;
  volumeChronologySub: string;
  keyArcsMilestones: string;
  animeSyncTitle: string;
  readingTipsTitle: string;
  featuredQuoteLabel: string;

  // Reviews
  customerReviewsTitle: string;
  outOf5Stars: string;
  globalRatings: string;
  starLabel: string;
  writeReviewTitle: string;
  reviewerNamePlaceholder: string;
  reviewTitlePlaceholder: string;
  reviewRatingLabel: string;
  reviewContentPlaceholder: string;
  submitReview: string;
  submittingReview: string;
  verifiedPurchaseBadge: string;
  reviewedOn: string;
  formatPurchasedLabel: string;

  // Look Inside Modal
  lookInsideTitle: string;
  pageOf: string;
  readingDirectionHint: string;
  officialPreviewTitle: string;
  zoomIn: string;
  zoomOut: string;

  // Reading Guide Modal
  readingGuideModalTitle: string;
  readingGuideModalSub: string;
  readingGuideAllSeries: string;
  chronologicalOrder: string;
  recommendedOrder: string;
  arcSummary: string;
  episodesSync: string;

  // Cart Drawer
  shoppingCartTitle: string;
  freeShippingNeeded: string;
  freeShippingUnlocked: string;
  emptyCartTitle: string;
  emptyCartSub: string;
  subtotalLabel: string;
  proceedToCheckout: string;
  deleteItem: string;
  quantity: string;
  viewCart: string;
  exploreVolume: string;
  readingGuideBtn: string;
  freeDeliverySub: string;
  exploreBestSellers: string;
  orderSummary: string;

  // Checkout Modal
  checkoutTitle: string;
  stepAddress: string;
  stepPayment: string;
  stepReview: string;
  fullNameLabel: string;
  streetLabel: string;
  cityLabel: string;
  stateLabel: string;
  zipCodeLabel: string;
  paymentSelectTitle: string;
  cardPayment: string;
  oneClickPayment: string;
  promoCodeLabel: string;
  applyPromo: string;
  promoApplied: string;
  shippingFee: string;
  freeShipping: string;
  taxLabel: string;
  grandTotal: string;
  placeOrderBtn: string;
  processingOrder: string;
  orderSuccessTitle: string;
  orderSuccessSub: string;
  trackingNumberLabel: string;
  deliveryDateLabel: string;
  orderTimeline: string;
  statusProcessing: string;
  continueShopping: string;

  // Java Architecture Modal
  javaArchTitle: string;
  javaArchSub: string;
  tabController: string;
  tabService: string;
  tabEntity: string;
  tabApiTester: string;
  testEndpointsTitle: string;
  callEndpointBtn: string;
  copyCodeBtn: string;
  copiedCodeBtn: string;
  backendArchitectureNote: string;

  // Footer
  backToTop: string;
  col1Title: string;
  col1L1: string;
  col1L2: string;
  col1L3: string;
  col1L4: string;
  col2Title: string;
  col2L1: string;
  col2L2: string;
  col2L3: string;
  col2L4: string;
  col3Title: string;
  col3L1: string;
  col3L2: string;
  col3L3: string;
  col3L4: string;
  col4Title: string;
  col4L1: string;
  col4L2: string;
  col4L3: string;
  col4L4: string;
  currencySelector: string;
  copyrightNotice: string;
}

export const CATEGORY_TRANSLATIONS: Record<Language, Record<MangaCategory, string>> = {
  pt: {
    'All': 'Todos os Mangás',
    'Shonen': 'Shonen',
    'Seinen': 'Seinen',
    'Dark Fantasy': 'Fantasia Sombria',
    'Romance & Shojo': 'Romance & Shojo',
    'Sci-Fi & Cyberpunk': 'Ficção Científica & Cyberpunk',
    'Isekai & Fantasy': 'Isekai & Fantasia',
    'Box Sets & Special Editions': 'Boxes & Edições Especiais',
    'Classic & Award Winners': 'Clássicos & Premiados',
  },
  en: {
    'All': 'All Manga',
    'Shonen': 'Shonen',
    'Seinen': 'Seinen',
    'Dark Fantasy': 'Dark Fantasy',
    'Romance & Shojo': 'Romance & Shojo',
    'Sci-Fi & Cyberpunk': 'Sci-Fi & Cyberpunk',
    'Isekai & Fantasy': 'Isekai & Fantasy',
    'Box Sets & Special Editions': 'Box Sets & Special Editions',
    'Classic & Award Winners': 'Classic & Award Winners',
  },
  es: {
    'All': 'Todos los Mangas',
    'Shonen': 'Shonen',
    'Seinen': 'Seinen',
    'Dark Fantasy': 'Fantasía Oscura',
    'Romance & Shojo': 'Romance & Shojo',
    'Sci-Fi & Cyberpunk': 'Ciencia Ficción y Cyberpunk',
    'Isekai & Fantasy': 'Isekai y Fantasía',
    'Box Sets & Special Editions': 'Cofres y Ediciones Especiales',
    'Classic & Award Winners': 'Clásicos y Premiados',
  },
  ja: {
    'All': 'すべてのマンガ',
    'Shonen': '少年漫画',
    'Seinen': '青年漫画',
    'Dark Fantasy': 'ダークファンタジー',
    'Romance & Shojo': '少女・恋愛',
    'Sci-Fi & Cyberpunk': 'SF・サイバーパンク',
    'Isekai & Fantasy': '異世界・ファンタジー',
    'Box Sets & Special Editions': '限定ボックスセット・愛蔵版',
    'Classic & Award Winners': '名作・受賞作',
  },
};

export const FORMAT_TRANSLATIONS: Record<Language, Record<MangaFormat, string>> = {
  pt: {
    'Paperback': 'Capa Comum (Físico)',
    'Deluxe Hardcover': 'Capa Dura de Luxo',
    'Kindle / Digital': 'Kindle / eBook Digital',
    'Collector Box Set': 'Box Colecionador Completo',
  },
  en: {
    'Paperback': 'Paperback',
    'Deluxe Hardcover': 'Deluxe Hardcover',
    'Kindle / Digital': 'Kindle / Digital',
    'Collector Box Set': 'Collector Box Set',
  },
  es: {
    'Paperback': 'Tapa Blanda',
    'Deluxe Hardcover': 'Tapa Dura Deluxe',
    'Kindle / Digital': 'Kindle / Digital',
    'Collector Box Set': 'Cofre Coleccionista',
  },
  ja: {
    'Paperback': 'ペーパーバック / 単行本',
    'Deluxe Hardcover': '愛蔵版 / ハードカバー',
    'Kindle / Digital': 'Kindle / 電子書籍',
    'Collector Box Set': 'コレクターボックスセット',
  },
};

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  pt: {
    topBannerNotice: '⚡ Frete GRÁTIS amanhã em pedidos de mangás acima de R$ 150',
    primeDealBadge: 'OFERTA ESPECIAL',
    javaArchTop: 'Arquitetura Java 21 + Spring Boot',
    deliverTo: 'Enviar para',
    locationName: 'São Paulo 01310-100',
    searchPlaceholder: 'Buscar mangás mais vendidos, autores, Luffy Gear 5, Berserk...',
    allCategories: 'Todas as Categorias',
    bestSellers: 'Mais Vendidos',
    top10: 'Top #10',
    cart: 'Carrinho',
    allManga: 'Todos os Mangás',
    readingGuides: 'Guias de Leitura',
    boxSetsNav: 'Boxes de Colecionador',
    todayDeals: 'Ofertas do Dia',
    searchAll: 'Tudo',
    searchResultsFor: 'Resultados da busca por',
    clearSearch: 'Limpar busca',
    noMangaFound: 'Nenhum mangá encontrado com os filtros selecionados.',
    resetFilters: 'Redefinir Filtros',

    heroSlide1Title: 'Festival de Mangás • Até 40% OFF nos Mais Vendidos',
    heroSlide1Sub: 'Gear 5 de Luffy, Jujutsu Kaisen e Berserk Deluxe em estoque com Frete Grátis.',
    heroSlide1Cta: 'Ver Mais Vendidos',
    heroSlide1Badge: 'Oferta por Tempo Limitado',

    heroSlide2Title: 'Lançamentos: Frieren & Dandadan Edições Especiais',
    heroSlide2Sub: 'Explore os mangás premiados com o leitor interativo "Espiar por Dentro" e guias de leitura detalhados.',
    heroSlide2Cta: 'Explorar Lançamentos',
    heroSlide2Badge: 'Em Alta no Momento',

    heroSlide3Title: 'Boxes de Colecionador & Edições em Capa Dura',
    heroSlide3Sub: 'Coleções completas com posters oficiais, artbooks exclusivos e acabamento premium para sua estante.',
    heroSlide3Cta: 'Ver Boxes de Luxo',
    heroSlide3Badge: 'Edição de Colecionador',

    heroBadgeAuthentic: '100% Edições Oficiais das Editoras',
    heroBadgeReturns: 'Devolução Grátis em até 30 Dias',
    heroExploreGuide: 'Ver Guias de Leitura',

    bento1Rank: '#1 Mais Vendido Global',
    bento1Title: "One Piece: Despertar do Gear 5 de Luffy",
    bento1Save: 'Economize 20% Hoje',
    bento1Link: 'Explorar Volume 105',

    bento2Badge: 'GUIA DO COLECIONADOR',
    bento2Title: 'Ordem de Leitura & Cronologia',
    bento2Desc: 'Confira a linha do tempo dos volumes, arcos canônicos e correspondência exata com o anime.',
    bento2Link: 'Abrir Guia de Arcos',

    bento3Badge: 'BOXES & EDIÇÕES ESPECIAIS',
    bento3Title: 'Coleções Completas em Caixas',
    bento3Desc: 'Boxes luxuosos com sobrecapas metalizadas, brindes oficiais e pôsteres exclusivos de coleção.',
    bento3Link: 'Ver Boxes de Coleção',

    bento4Badge: 'INTEGRAÇÃO ENTERPRISE',
    bento4Title: 'Arquitetura Java Spring Boot',
    bento4Desc: 'Consulte os endpoints REST em Java 21 LTS + Spring Data JPA para catálogo, estoque e pagamentos.',
    bento4Link: 'Ver Código Fonte Java',

    bestSellersTitle: 'Mais Vendidos em Mangás & Graphic Novels',
    bestSellersSubtitle: 'Nossos produtos mais populares baseados em vendas. Atualizado a cada hora com estoque verificado.',
    bestSellersLeaderboard: 'Ranking de Mais Vendidos Mangazon',
    primeClubTitle: 'Clube de Vantagens Mangazon',
    primeClubSub: 'Entrega rápida e frete grátis garantido em todo o catálogo',
    primeClubBadge: 'BENEFÍCIO MANGAZON',
    showingCount: 'Exibindo {count} Mais Vendidos',
    categoryLabel: 'Categoria',
    sortByLabel: 'Ordenar por:',
    sortRank: 'Destaques Mais Vendidos (Rank #1-12)',
    sortRating: 'Avaliação dos Clientes (Maior primeiro)',
    sortPriceLow: 'Preço: Menor para Maior',
    sortPriceHigh: 'Preço: Maior para Menor',

    bestSellerRankBadge: '#{rank} Mais Vendido',
    amazonsChoice: 'Escolha da',
    choice: 'Mangazon',
    lookInside: 'Espiar por Dentro ↗',
    primeBadge: 'Frete Grátis',
    savePercent: 'Economize {percent}%',
    listPrice: 'De: ',
    inStock: 'Em estoque',
    onlyLeft: 'Apenas {count} restantes em estoque - peça rápido',
    freeDeliveryTomorrow: 'Entrega GRÁTIS amanhã',
    addToCart: 'Adicionar ao Carrinho',
    addedToCart: 'Adicionado!',
    quickView: 'Ver Detalhes',

    booksBreadcrumb: 'Mangazon Mangás',
    authorBy: 'Por',
    artistBy: 'Arte de',
    ratingsCount: 'avaliações verificadas',
    formatSelectTitle: 'Selecione o Formato:',
    tabOverview: 'Visão Geral & Sinopse',
    tabReadingGuide: 'Guia de Leitura & Cronologia',
    tabSpecs: 'Detalhes Técnicos & Edição',
    tabReviews: 'Avaliações de Clientes',
    quantityLabel: 'Quantidade:',
    buyNow1Click: 'Comprar Agora com 1-Clique',
    shipsFrom: 'Enviado por',
    soldBy: 'Vendido por',
    officialPublisher: 'Editora Oficial Licenciada',
    returnsLabel: 'Devoluções',
    returnPolicy30Days: 'Devolução grátis em até 30 dias',
    paymentLabel: 'Pagamento',
    secureSsl: 'Transação Segura SSL 256-bit',
    frequentlyBoughtTogether: 'Frequentemente comprados juntos',
    bundleTotalPrice: 'Preço total do conjunto:',
    bundleSaveNotice: 'Economize 10% adicionais ao adquirir a trilogia recomendada.',
    addAllBundleToCart: 'Adicionar os {count} itens ao Carrinho',
    publicationDetails: 'Detalhes da Publicação',
    isbnLabel: 'ISBN-13',
    printLengthLabel: 'Número de Páginas',
    pagesLabel: 'páginas',
    ageRatingLabel: 'Classificação Indicativa',
    releaseDateLabel: 'Data de Lançamento',
    animeStatusTitle: 'Adaptação em Anime & Streaming',
    officialTranslationBadge: '✓ Tradução oficial revisada e aprovada pelo mangaká original.',
    volumeChronologyTitle: 'Linha do Tempo & Arcos da Obra',
    volumeChronologySub: 'Posicionamento oficial deste volume na história principal.',
    keyArcsMilestones: 'Principais Acontecimentos do Arco',
    animeSyncTitle: 'Correspondência com o Anime',
    readingTipsTitle: 'Dicas de Leitura do Colecionador',
    featuredQuoteLabel: 'Citação em Destaque:',

    customerReviewsTitle: 'Avaliações dos Clientes',
    outOf5Stars: 'de 5 estrelas',
    globalRatings: 'avaliações globais',
    starLabel: 'estrelas',
    writeReviewTitle: 'Escrever uma Avaliação de Cliente',
    reviewerNamePlaceholder: 'Seu Nome / Pseudônimo',
    reviewTitlePlaceholder: 'Título da sua avaliação',
    reviewRatingLabel: 'Sua Nota:',
    reviewContentPlaceholder: 'O que achou da arte, do ritmo da história ou da qualidade gráfica?',
    submitReview: 'Enviar Avaliação',
    submittingReview: 'Enviando...',
    verifiedPurchaseBadge: '✓ Compra Verificada',
    reviewedOn: 'Avaliado em',
    formatPurchasedLabel: 'Formato:',

    lookInsideTitle: 'Espiar por Dentro',
    pageOf: 'Página {current} de {total}',
    readingDirectionHint: 'Formato Mangá: Leitura da Direita para a Esquerda ◀',
    officialPreviewTitle: 'Prévia Oficial do Volume',
    zoomIn: 'Ampliar',
    zoomOut: 'Reduzir',

    readingGuideModalTitle: 'Guia de Leitura & Ordem Cronológica',
    readingGuideModalSub: 'Entenda a divisão de arcos, sagas e equivalência entre os capítulos do mangá e episódios do anime.',
    readingGuideAllSeries: 'Séries em Destaque',
    chronologicalOrder: 'Ordem Cronológica Recomendada',
    recommendedOrder: 'Ordem de Leitura',
    arcSummary: 'Resumo do Arco',
    episodesSync: 'Episódios no Anime',

    shoppingCartTitle: 'Carrinho de Compras',
    freeShippingNeeded: 'Adicione mais {amount} em itens para ganhar FRETE GRÁTIS',
    freeShippingUnlocked: 'Parabéns! Seu pedido ganhou FRETE EXPRESSO GRÁTIS!',
    emptyCartTitle: 'Seu carrinho Mangazon está vazio.',
    emptyCartSub: 'Confira as séries consagradas como One Piece, Berserk e Jujutsu Kaisen!',
    subtotalLabel: 'Subtotal',
    proceedToCheckout: 'Fechar Pedido (1-Clique)',
    deleteItem: 'Excluir',
    quantity: 'Qtd:',
    viewCart: 'Ver Carrinho',
    exploreVolume: 'Explorar Volume 105',
    readingGuideBtn: 'Abrir Guia de Arcos',
    freeDeliverySub: 'Receba seus mangás favoritos amanhã com embalagem reforçada para colecionador.',
    exploreBestSellers: 'Explorar Mais Vendidos',
    orderSummary: 'Resumo do Pedido',

    checkoutTitle: 'Finalização de Pedido Segura Mangazon',
    stepAddress: '1. Endereço de Entrega',
    stepPayment: '2. Forma de Pagamento',
    stepReview: '3. Revisão do Pedido',
    fullNameLabel: 'Nome Completo',
    streetLabel: 'Endereço e Número',
    cityLabel: 'Cidade',
    stateLabel: 'Estado',
    zipCodeLabel: 'CEP',
    paymentSelectTitle: 'Selecione o Método de Pagamento',
    cardPayment: 'Cartão de Crédito / Débito',
    oneClickPayment: 'Compra Rápida em 1-Clique',
    promoCodeLabel: 'Cupom de Desconto',
    applyPromo: 'Aplicar',
    promoApplied: 'Cupom aplicado!',
    shippingFee: 'Frete',
    freeShipping: 'GRÁTIS',
    taxLabel: 'Impostos estimados',
    grandTotal: 'Total do Pedido:',
    placeOrderBtn: 'Confirmar e Finalizar Pedido',
    processingOrder: 'Processando pedido com segurança...',
    orderSuccessTitle: 'Pedido Realizado com Sucesso!',
    orderSuccessSub: 'Obrigado por comprar na Mangazon. Enviamos a confirmação para seu e-mail.',
    trackingNumberLabel: 'Código de Rastreamento:',
    deliveryDateLabel: 'Previsão de Entrega:',
    orderTimeline: 'Status da Entrega:',
    statusProcessing: 'Em Separação e Embalagem',
    continueShopping: 'Continuar Comprando',

    javaArchTitle: 'Showcase de Arquitetura Java 21 Spring Boot',
    javaArchSub: 'Estrutura enterprise de microsserviços REST com Spring Data JPA, Hibernate e Caching.',
    tabController: 'Controlador REST',
    tabService: 'Camada de Serviço',
    tabEntity: 'Entidades JPA',
    tabApiTester: 'Testador de API ao Vivo',
    testEndpointsTitle: 'Executar Chamadas de API ao Backend',
    callEndpointBtn: 'Testar Endpoint',
    copyCodeBtn: 'Copiar Código Java',
    copiedCodeBtn: 'Copiado!',
    backendArchitectureNote: 'Os endpoints exibidos refletem a arquitetura de backend Spring Boot integrada com o ecossistema React.',

    backToTop: 'Voltar ao início',
    col1Title: 'Conheça-nos',
    col1L1: 'Sobre a Mangazon Books',
    col1L2: 'Fundo de Apoio aos Mangakás',
    col1L3: 'Parceria Oficial Shueisha e Kodansha',
    col1L4: 'Sustentabilidade & Papel Certificado',
    col2Title: 'Ganhe Dinheiro Conosco',
    col2L1: 'Publique na Mangazon Direct',
    col2L2: 'Programa de Afiliados Otaku',
    col2L3: 'Anuncie seus Mangás',
    col2L4: 'Logística Mangazon (FBM)',
    col3Title: 'Pagamentos & Vantagens',
    col3L1: 'Cartão de Benefícios Mangazon',
    col3L2: 'Pague com Pontos Otaku',
    col3L3: 'Recarga de Saldo',
    col3L4: 'Conversor de Moedas',
    col4Title: 'Deixe-nos Ajudar Você',
    col4L1: 'Sua Conta & Pré-vendas',
    col4L2: 'Fretes & Prazos de Entrega',
    col4L3: 'Devoluções & Trocas',
    col4L4: 'Arquitetura Java 21 Spring',
    currencySelector: 'BRL - Real Brasileiro',
    copyrightNotice: '© 1996-2026, Mangazon.com, Inc. ou suas afiliadas. Plataforma de e-commerce de mangás inspirada no ecossistema Amazon. Desenvolvido com React, TypeScript e Java 21 REST.',
  },
  en: {
    topBannerNotice: '⚡ Free Next-Day Delivery on all Manga orders over $35',
    primeDealBadge: 'SPECIAL DEAL',
    javaArchTop: 'Java 21 + Spring Boot Architecture',
    deliverTo: 'Deliver to',
    locationName: 'Los Angeles 90001',
    searchPlaceholder: 'Search best-selling manga, authors, Luffy Gear 5, Berserk...',
    allCategories: 'All Categories',
    bestSellers: 'Best Sellers',
    top10: 'Top #10',
    cart: 'Cart',
    allManga: 'All Manga',
    readingGuides: 'Reading Guides',
    boxSetsNav: 'Collector Box Sets',
    todayDeals: "Today's Deals",
    searchAll: 'All',
    searchResultsFor: 'Search results for',
    clearSearch: 'Clear search',
    noMangaFound: 'No manga found matching your current filter.',
    resetFilters: 'Reset Filters',

    heroSlide1Title: 'Manga Festival • Up to 40% Off Best Sellers',
    heroSlide1Sub: 'Gear 5 Luffy, Gojo vs Sukuna, and Berserk Deluxe in stock with Free Express Delivery.',
    heroSlide1Cta: 'Shop Best Sellers',
    heroSlide1Badge: 'Limited Time Deal',

    heroSlide2Title: 'New Release: Frieren & Dandadan Collector Editions',
    heroSlide2Sub: 'Explore award-winning manga with our interactive Look Inside reader & volume guides.',
    heroSlide2Cta: 'Explore New Releases',
    heroSlide2Badge: 'Trending Now',

    heroSlide3Title: 'Collector Box Sets & Premium Hardcover Editions',
    heroSlide3Sub: 'Complete collections with exclusive artbooks, official posters, and luxury slipcases for your bookshelf.',
    heroSlide3Cta: 'Explore Box Sets',
    heroSlide3Badge: 'Collector Edition',

    heroBadgeAuthentic: '100% Authentic Publisher Editions',
    heroBadgeReturns: '30-Day Free Returns',
    heroExploreGuide: 'Explore Reading Guides',

    bento1Rank: '#1 Global Best Seller',
    bento1Title: "One Piece: Luffy's Gear 5 Awakening",
    bento1Save: 'Save 20% Today',
    bento1Link: 'Explore Volume 105',

    bento2Badge: 'COLLECTOR GUIDE',
    bento2Title: "Reading Order & Arc Timeline",
    bento2Desc: 'Check volume timelines, canon story arcs, and exact synchronization with anime episodes.',
    bento2Link: 'Open Arc Guide',

    bento3Badge: 'BOX SETS & SPECIAL EDITIONS',
    bento3Title: 'Complete Collections in Box Sets',
    bento3Desc: 'Deluxe box sets with foiled slipcases, official artbooks, and exclusive collectible bonus posters.',
    bento3Link: 'Explore Box Sets',

    bento4Badge: 'ENTERPRISE INTEGRATION',
    bento4Title: 'Java Spring Architecture',
    bento4Desc: 'Inspect simulated Java 21 LTS + Spring Data JPA REST microservice endpoints for catalog and orders.',
    bento4Link: 'View Java Source Code',

    bestSellersTitle: 'Best Sellers in Manga & Graphic Novels',
    bestSellersSubtitle: 'Our most popular products based on sales. Updated hourly with verified stock.',
    bestSellersLeaderboard: 'Mangazon Bestsellers Leaderboard',
    primeClubTitle: 'Mangazon Benefits Club',
    primeClubSub: 'Fast next-day delivery and free shipping guaranteed across the full catalog',
    primeClubBadge: 'MANGAZON BENEFIT',
    showingCount: 'Showing {count} Best Sellers',
    categoryLabel: 'Category',
    sortByLabel: 'Sort by:',
    sortRank: 'Featured Best Sellers (Rank #1-12)',
    sortRating: 'Customer Review Rating (Highest First)',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',

    bestSellerRankBadge: '#{rank} Best Seller',
    amazonsChoice: "Mangazon's",
    choice: 'Choice',
    lookInside: 'Look Inside ↗',
    primeBadge: 'Free Shipping',
    savePercent: 'Save {percent}%',
    listPrice: 'List Price: ',
    inStock: 'In Stock',
    onlyLeft: 'Only {count} left in stock - order soon',
    freeDeliveryTomorrow: 'FREE Next-Day Delivery',
    addToCart: 'Add to Cart',
    addedToCart: 'Added!',
    quickView: 'View Details',

    booksBreadcrumb: 'Mangazon Books',
    authorBy: 'By',
    artistBy: 'Art by',
    ratingsCount: 'verified ratings',
    formatSelectTitle: 'Select Format:',
    tabOverview: 'Overview & Synopsis',
    tabReadingGuide: 'Reading Guide & Chronology',
    tabSpecs: 'Technical Details & Specs',
    tabReviews: 'Customer Reviews',
    quantityLabel: 'Quantity:',
    buyNow1Click: 'Buy Now with 1-Click',
    shipsFrom: 'Ships from',
    soldBy: 'Sold by',
    officialPublisher: 'Official Licensed Publisher',
    returnsLabel: 'Returns',
    returnPolicy30Days: '30-Day Free Returns',
    paymentLabel: 'Payment',
    secureSsl: 'Secure 256-bit SSL Encrypted',
    frequentlyBoughtTogether: 'Frequently bought together',
    bundleTotalPrice: 'Total Price for Bundle:',
    bundleSaveNotice: 'Save an extra 10% when purchasing the recommended trilogy together.',
    addAllBundleToCart: 'Add all {count} to Cart',
    publicationDetails: 'Publication Details',
    isbnLabel: 'ISBN-13',
    printLengthLabel: 'Print Length',
    pagesLabel: 'pages',
    ageRatingLabel: 'Age Rating',
    releaseDateLabel: 'Release Date',
    animeStatusTitle: 'Anime Adaptation & Streaming',
    officialTranslationBadge: '✓ Official translation supervised and approved by original Japanese mangaka.',
    volumeChronologyTitle: 'Volume Timeline & Story Arcs',
    volumeChronologySub: 'Official position of this volume in the main story chronology.',
    keyArcsMilestones: 'Key Arc Milestones & Climax',
    animeSyncTitle: 'Anime Episode Synchronization',
    readingTipsTitle: "Collector's Reading Tips",
    featuredQuoteLabel: 'Featured Quote:',

    customerReviewsTitle: 'Customer Reviews',
    outOf5Stars: 'out of 5 stars',
    globalRatings: 'global ratings',
    starLabel: 'star',
    writeReviewTitle: 'Write a Customer Review',
    reviewerNamePlaceholder: 'Your Name / Pen Name',
    reviewTitlePlaceholder: 'Headline / Review Title',
    reviewRatingLabel: 'Your Rating:',
    reviewContentPlaceholder: 'What did you love about the artwork, pacing, or print quality?',
    submitReview: 'Submit Review',
    submittingReview: 'Submitting...',
    verifiedPurchaseBadge: '✓ Verified Purchase',
    reviewedOn: 'Reviewed on',
    formatPurchasedLabel: 'Format:',

    lookInsideTitle: 'Look Inside',
    pageOf: 'Page {current} of {total}',
    readingDirectionHint: 'Manga Format: Read Right-to-Left ◀',
    officialPreviewTitle: 'Official Volume Preview',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',

    readingGuideModalTitle: 'Reading Guide & Volume Chronology',
    readingGuideModalSub: 'Understand story arcs, sagas, and chapter-to-episode synchronization.',
    readingGuideAllSeries: 'Featured Series',
    chronologicalOrder: 'Recommended Chronological Order',
    recommendedOrder: 'Reading Order',
    arcSummary: 'Arc Summary',
    episodesSync: 'Anime Episodes',

    shoppingCartTitle: 'Shopping Cart',
    freeShippingNeeded: 'Add {amount} of eligible items for FREE Delivery',
    freeShippingUnlocked: 'Your order qualifies for FREE Next-Day Delivery!',
    emptyCartTitle: 'Your Mangazon Cart is empty.',
    emptyCartSub: 'Explore best-selling series like One Piece, Berserk, and Jujutsu Kaisen!',
    subtotalLabel: 'Subtotal',
    proceedToCheckout: 'Proceed to 1-Click Checkout',
    deleteItem: 'Delete',
    quantity: 'Qty:',
    viewCart: 'View Cart',
    exploreVolume: 'Explore Volume 105',
    readingGuideBtn: 'Open Story Arcs Guide',
    freeDeliverySub: 'Receive your favorite manga tomorrow in reinforced collector packaging.',
    exploreBestSellers: 'Explore Best Sellers',
    orderSummary: 'Order Summary',

    checkoutTitle: 'Mangazon Secure Checkout',
    stepAddress: '1. Shipping Address',
    stepPayment: '2. Payment Method',
    stepReview: '3. Review Order',
    fullNameLabel: 'Full Name',
    streetLabel: 'Street Address',
    cityLabel: 'City',
    stateLabel: 'State',
    zipCodeLabel: 'ZIP Code',
    paymentSelectTitle: 'Select Payment Method',
    cardPayment: 'Credit / Debit Card',
    oneClickPayment: '1-Click Instant Checkout',
    promoCodeLabel: 'Promo Code',
    applyPromo: 'Apply',
    promoApplied: 'Promo code applied!',
    shippingFee: 'Shipping',
    freeShipping: 'FREE',
    taxLabel: 'Estimated Tax',
    grandTotal: 'Order Total:',
    placeOrderBtn: 'Place Your Order',
    processingOrder: 'Processing your order securely...',
    orderSuccessTitle: 'Order Placed Successfully!',
    orderSuccessSub: 'Thank you for shopping at Mangazon. A confirmation has been sent to your email.',
    trackingNumberLabel: 'Tracking Number:',
    deliveryDateLabel: 'Estimated Delivery:',
    orderTimeline: 'Delivery Status:',
    statusProcessing: 'Preparing for Shipment',
    continueShopping: 'Continue Shopping',

    javaArchTitle: 'Java 21 Spring Boot Architecture Showcase',
    javaArchSub: 'Enterprise REST microservice structure with Spring Data JPA, Hibernate, and Caching.',
    tabController: 'REST Controller',
    tabService: 'Service Layer',
    tabEntity: 'JPA Entities',
    tabApiTester: 'Live API Tester',
    testEndpointsTitle: 'Test Live Backend API Endpoints',
    callEndpointBtn: 'Execute Endpoint',
    copyCodeBtn: 'Copy Java Code',
    copiedCodeBtn: 'Copied!',
    backendArchitectureNote: 'Endpoints shown mirror the enterprise Spring Boot backend architecture.',

    backToTop: 'Back to top',
    col1Title: 'Get to Know Us',
    col1L1: 'About Mangazon Books',
    col1L2: 'Mangaka Creator Fund',
    col1L3: 'Official Shueisha & Kodansha Partner',
    col1L4: 'Sustainability & Certified Paper',
    col2Title: 'Make Money with Us',
    col2L1: 'Publish on Mangazon Direct',
    col2L2: 'Become an Otaku Affiliate',
    col2L3: 'Advertise Your Manga',
    col2L4: 'Fulfillment by Mangazon (FBM)',
    col3Title: 'Payments & Benefits',
    col3L1: 'Mangazon Rewards Card',
    col3L2: 'Shop with Otaku Points',
    col3L3: 'Reload Your Balance',
    col3L4: 'Currency Converter',
    col4Title: 'Let Us Help You',
    col4L1: 'Your Account & Pre-orders',
    col4L2: 'Shipping Rates & Policies',
    col4L3: 'Returns & Replacements',
    col4L4: 'Java 21 Spring Architecture',
    currencySelector: 'USD - U.S. Dollar',
    copyrightNotice: '© 1996-2026, Mangazon.com, Inc. or its affiliates. Amazon-inspired manga e-commerce platform. Built with React, TypeScript, and Java 21 Spring REST.',
  },
  es: {
    topBannerNotice: '⚡ Envío exprés GRATIS en pedidos de manga superiores a $35',
    primeDealBadge: 'OFERTA ESPECIAL',
    javaArchTop: 'Arquitectura Java 21 + Spring Boot',
    deliverTo: 'Enviar a',
    locationName: 'Madrid 28001',
    searchPlaceholder: 'Buscar mangas más vendidos, autores, Luffy Gear 5, Berserk...',
    allCategories: 'Todas las Categorías',
    bestSellers: 'Los Más Vendidos',
    top10: 'Top #10',
    cart: 'Cesta',
    allManga: 'Todos los Mangas',
    readingGuides: 'Guías de Lectura',
    boxSetsNav: 'Cofres de Colección',
    todayDeals: 'Ofertas del Día',
    searchAll: 'Todo',
    searchResultsFor: 'Resultados de búsqueda para',
    clearSearch: 'Borrar búsqueda',
    noMangaFound: 'No se encontraron mangas con los filtros seleccionados.',
    resetFilters: 'Restablecer Filtros',

    heroSlide1Title: 'Festival del Manga • Hasta 40% de Descuento',
    heroSlide1Sub: 'Luffy Gear 5, Jujutsu Kaisen y Berserk Deluxe en stock con Envío Rápido y Gratis.',
    heroSlide1Cta: 'Ver Más Vendidos',
    heroSlide1Badge: 'Oferta por Tiempo Limitado',

    heroSlide2Title: 'Novedades: Frieren y Dandadan Edición Especial',
    heroSlide2Sub: 'Descubre los mangas galardonados con nuestro visor interactivo y guías de lectura.',
    heroSlide2Cta: 'Explorar Novedades',
    heroSlide2Badge: 'Tendencia Actual',

    heroSlide3Title: 'Cofres de Colección y Ediciones de Tapa Dura',
    heroSlide3Sub: 'Colecciones completas con pósters oficiales, libros de arte exclusivos y estuches de lujo.',
    heroSlide3Cta: 'Ver Cofres de Lujo',
    heroSlide3Badge: 'Edición de Coleccionista',

    heroBadgeAuthentic: '100% Ediciones Oficiales de Editoriales',
    heroBadgeReturns: 'Devoluciones Gratis 30 Días',
    heroExploreGuide: 'Ver Guías de Lectura',

    bento1Rank: '#1 Más Vendido Global',
    bento1Title: "One Piece: Despertar de Gear 5 de Luffy",
    bento1Save: 'Ahorra 20% Hoy',
    bento1Link: 'Explorar Tomo 105',

    bento2Badge: 'GUÍA DEL COLECCIONISTA',
    bento2Title: 'Orden de Lectura y Cronología',
    bento2Desc: 'Consulta la cronología de tomos, arcos de la historia y equivalencia exacta con el anime.',
    bento2Link: 'Abrir Guía de Arcos',

    bento3Badge: 'COFRES Y EDICIONES ESPECIALES',
    bento3Title: 'Colecciones Completas en Cofre',
    bento3Desc: 'Estuches de lujo con acabados metalizados, extras oficiales y pósters coleccionables.',
    bento3Link: 'Explorar Cofres',

    bento4Badge: 'INTEGRACIÓN EMPRESARIAL',
    bento4Title: 'Arquitectura Java Spring Boot',
    bento4Desc: 'Consulta los endpoints REST en Java 21 LTS + Spring Data JPA para catálogo y pedidos.',
    bento4Link: 'Ver Código Java',

    bestSellersTitle: 'Los Más Vendidos en Manga y Novelas Gráficas',
    bestSellersSubtitle: 'Nuestros productos más populares basados en ventas. Actualizado cada hora.',
    bestSellersLeaderboard: 'Ranking de Más Vendidos Mangazon',
    primeClubTitle: 'Club de Ventajas Mangazon',
    primeClubSub: 'Envío exprés al día siguiente y devoluciones gratis en todo el catálogo',
    primeClubBadge: 'VENTAJA MANGAZON',
    showingCount: 'Mostrando {count} Más Vendidos',
    categoryLabel: 'Categoría',
    sortByLabel: 'Ordenar por:',
    sortRank: 'Más Vendidos Destacados (Rank #1-12)',
    sortRating: 'Valoración de Clientes (Mayor primero)',
    sortPriceLow: 'Precio: Menor a Mayor',
    sortPriceHigh: 'Precio: Mayor a Menor',

    bestSellerRankBadge: '#{rank} Más Vendido',
    amazonsChoice: 'Elección de',
    choice: 'Mangazon',
    lookInside: 'Echar un Vistazo ↗',
    primeBadge: 'Envío Gratis',
    savePercent: 'Ahorra {percent}%',
    listPrice: 'Precio recomendado: ',
    inStock: 'En stock',
    onlyLeft: 'Solo quedan {count} en stock - pide pronto',
    freeDeliveryTomorrow: 'Envío GRATIS mañana',
    addToCart: 'Añadir a la Cesta',
    addedToCart: '¡Añadido!',
    quickView: 'Ver Detalles',

    booksBreadcrumb: 'Mangazon Libros',
    authorBy: 'Por',
    artistBy: 'Arte de',
    ratingsCount: 'valoraciones verificadas',
    formatSelectTitle: 'Selecciona el Formato:',
    tabOverview: 'Visión General y Sinopsis',
    tabReadingGuide: 'Guía de Lectura y Cronología',
    tabSpecs: 'Detalles Técnicos y Edición',
    tabReviews: 'Opiniones de Clientes',
    quantityLabel: 'Cantidad:',
    buyNow1Click: 'Comprar Ya en 1-Clic',
    shipsFrom: 'Enviado por',
    soldBy: 'Vendido por',
    officialPublisher: 'Editorial Oficial Licenciada',
    returnsLabel: 'Devoluciones',
    returnPolicy30Days: 'Devolución gratis en 30 días',
    paymentLabel: 'Pago',
    secureSsl: 'Transacción Segura SSL 256-bit',
    frequentlyBoughtTogether: 'Comprados juntos habitualmente',
    bundleTotalPrice: 'Precio total del lote:',
    bundleSaveNotice: 'Ahorra un 10% adicional al comprar la trilogía recomendada.',
    addAllBundleToCart: 'Añadir los {count} a la Cesta',
    publicationDetails: 'Detalles de Publicación',
    isbnLabel: 'ISBN-13',
    printLengthLabel: 'Longitud de Impresión',
    pagesLabel: 'páginas',
    ageRatingLabel: 'Clasificación por Edad',
    releaseDateLabel: 'Fecha de Lanzamiento',
    animeStatusTitle: 'Adaptación al Anime y Streaming',
    officialTranslationBadge: '✓ Traducción oficial supervisada por el mangaka original.',
    volumeChronologyTitle: 'Cronología y Arcos de la Historia',
    volumeChronologySub: 'Posición oficial de este tomo en la historia principal.',
    keyArcsMilestones: 'Acontecimientos Clave del Arco',
    animeSyncTitle: 'Sincronización con el Anime',
    readingTipsTitle: 'Consejos de Lectura para Coleccionistas',
    featuredQuoteLabel: 'Cita Destacada:',

    customerReviewsTitle: 'Opiniones de Clientes',
    outOf5Stars: 'de 5 estrellas',
    globalRatings: 'valoraciones globales',
    starLabel: 'estrellas',
    writeReviewTitle: 'Escribir una Opinión',
    reviewerNamePlaceholder: 'Tu Nombre / Seudónimo',
    reviewTitlePlaceholder: 'Título de la opinión',
    reviewRatingLabel: 'Tu Calificación:',
    reviewContentPlaceholder: '¿Qué opinas sobre el arte, el ritmo de la trama o la calidad del tomo?',
    submitReview: 'Publicar Opinión',
    submittingReview: 'Publicando...',
    verifiedPurchaseBadge: '✓ Compra Verificada',
    reviewedOn: 'Opinión escrita el',
    formatPurchasedLabel: 'Formato:',

    lookInsideTitle: 'Echar un Vistazo',
    pageOf: 'Página {current} de {total}',
    readingDirectionHint: 'Formato Manga: Lectura de Derecha a Izquierda ◀',
    officialPreviewTitle: 'Muestra Oficial del Tomo',
    zoomIn: 'Aumentar',
    zoomOut: 'Reducir',

    readingGuideModalTitle: 'Guía de Lectura y Cronología de Tomos',
    readingGuideModalSub: 'Conoce los arcos, sagas y sincronización entre capítulos del manga y episodios del anime.',
    readingGuideAllSeries: 'Series Destacadas',
    chronologicalOrder: 'Orden Cronológico Recomendado',
    recommendedOrder: 'Orden de Lectura',
    arcSummary: 'Resumen del Arco',
    episodesSync: 'Episodios en el Anime',

    shoppingCartTitle: 'Cesta de Compra',
    freeShippingNeeded: 'Añade {amount} en productos para Envío GRATIS',
    freeShippingUnlocked: '¡Tu pedido tiene ENVÍO EXPRÉS GRATIS!',
    emptyCartTitle: 'Tu cesta de Mangazon está vacía.',
    emptyCartSub: '¡Explora series consagradas como One Piece, Berserk y Jujutsu Kaisen!',
    subtotalLabel: 'Subtotal',
    proceedToCheckout: 'Tramitar Pedido (1-Clic)',
    deleteItem: 'Eliminar',
    quantity: 'Cant:',
    viewCart: 'Ver Cesta',
    exploreVolume: 'Explorar Tomo 105',
    readingGuideBtn: 'Abrir Guía de Arcos',
    freeDeliverySub: 'Recibe tus mangas favoritos mañana en embalaje reforzado para coleccionistas.',
    exploreBestSellers: 'Explorar Más Vendidos',
    orderSummary: 'Resumen del Pedido',

    checkoutTitle: 'Tramitación Segura de Pedido Mangazon',
    stepAddress: '1. Dirección de Envío',
    stepPayment: '2. Método de Pago',
    stepReview: '3. Resumen del Pedido',
    fullNameLabel: 'Nombre Completo',
    streetLabel: 'Dirección y Número',
    cityLabel: 'Ciudad',
    stateLabel: 'Provincia / Estado',
    zipCodeLabel: 'Código Postal',
    paymentSelectTitle: 'Selecciona Método de Pago',
    cardPayment: 'Tarjeta de Crédito / Débito',
    oneClickPayment: 'Compra Rápida en 1-Clic',
    promoCodeLabel: 'Código Promocional',
    applyPromo: 'Aplicar',
    promoApplied: '¡Cupón aplicado con éxito!',
    shippingFee: 'Envío',
    freeShipping: 'GRATIS',
    taxLabel: 'Impuestos estimados',
    grandTotal: 'Total del Pedido:',
    placeOrderBtn: 'Confirmar y Realizar Pedido',
    processingOrder: 'Procesando tu pedido de forma segura...',
    orderSuccessTitle: '¡Pedido Realizado con Éxito!',
    orderSuccessSub: 'Gracias por comprar en Mangazon. Hemos enviado los detalles a tu correo.',
    trackingNumberLabel: 'Número de Seguimiento:',
    deliveryDateLabel: 'Fecha Estimada de Entrega:',
    orderTimeline: 'Estado de la Entrega:',
    statusProcessing: 'Preparando Paquete',
    continueShopping: 'Seguir Comprando',

    javaArchTitle: 'Showcase de Arquitectura Java 21 Spring Boot',
    javaArchSub: 'Estructura empresarial de microservicios REST con Spring Data JPA y Caching.',
    tabController: 'Controlador REST',
    tabService: 'Capa de Servicio',
    tabEntity: 'Entidades JPA',
    tabApiTester: 'Probador de API en Vivo',
    testEndpointsTitle: 'Ejecutar Llamadas al Backend',
    callEndpointBtn: 'Probar Endpoint',
    copyCodeBtn: 'Copiar Código Java',
    copiedCodeBtn: '¡Copiado!',
    backendArchitectureNote: 'Los endpoints reflejan la arquitectura backend Spring Boot integrada con React.',

    backToTop: 'Volver arriba',
    col1Title: 'Conócenos',
    col1L1: 'Sobre Mangazon Books',
    col1L2: 'Fondo para Mangakas',
    col1L3: 'Socio Oficial Shueisha y Kodansha',
    col1L4: 'Sostenibilidad y Papel Certificado',
    col2Title: 'Gana Dinero con Nosotros',
    col2L1: 'Publica en Mangazon Direct',
    col2L2: 'Programa de Afiliados Otaku',
    col2L3: 'Promociona tus Mangas',
    col2L4: 'Logística de Mangazon (FBM)',
    col3Title: 'Pagos y Ventajas',
    col3L1: 'Tarjeta Mangazon Rewards',
    col3L2: 'Compra con Puntos Otaku',
    col3L3: 'Recarga de Saldo',
    col3L4: 'Conversor de Moneda',
    col4Title: 'Podemos Ayudarte',
    col4L1: 'Tu Cuenta y Preventas',
    col4L2: 'Tarifas y Políticas de Envío',
    col4L3: 'Devoluciones y Reemplazos',
    col4L4: 'Arquitectura Java 21 Spring',
    currencySelector: 'EUR - Euro (€)',
    copyrightNotice: '© 1996-2026, Mangazon.com, Inc. o sus filiales. Plataforma de manga inspirada en Amazon. Creada con React, TypeScript y Java 21 Spring REST.',
  },
  ja: {
    topBannerNotice: '⚡ 3,500円以上のご注文でマンガ全品翌日無料配送',
    primeDealBadge: '特別セール',
    javaArchTop: 'Java 21 + Spring Boot 設計',
    deliverTo: 'お届け先',
    locationName: '東京都千代田区 100-0001',
    searchPlaceholder: 'ベストセラーマンガ、著者、ワンピース、ベルセルクを検索...',
    allCategories: 'すべてのカテゴリー',
    bestSellers: 'ベストセラー',
    top10: 'トップ #10',
    cart: 'カート',
    allManga: 'すべてのマンガ',
    readingGuides: '読書ガイド',
    boxSetsNav: '限定ボックス',
    todayDeals: '本日のセール',
    searchAll: 'すべて',
    searchResultsFor: '検索結果:',
    clearSearch: '検索をクリア',
    noMangaFound: '条件に一致するマンガが見つかりませんでした。',
    resetFilters: 'フィルターをリセット',

    heroSlide1Title: 'マンガ・フェスティバル • ベストセラー最大40%OFF',
    heroSlide1Sub: 'ルフィGear 5、呪術廻戦、ベルセルク愛蔵版が翌日無料配送でお手元に。',
    heroSlide1Cta: 'ベストセラーを見る',
    heroSlide1Badge: '期間限定セール',

    heroSlide2Title: '新刊登場: 葬送のフリーレン＆ダンダダン特装版',
    heroSlide2Sub: '試し読みビューアと詳細読書ガイドで話題の受賞作マンガをチェック。',
    heroSlide2Cta: '新刊をチェック',
    heroSlide2Badge: '今話題の注目作',

    heroSlide3Title: 'コレクターズ・ボックスセット＆豪華愛蔵版',
    heroSlide3Sub: '特製箔押し化粧箱、限定イラストカード付きの完全限定版コレクション。',
    heroSlide3Cta: 'ボックスセットを見る',
    heroSlide3Badge: 'コレクターズ限定版',

    heroBadgeAuthentic: '100% 出版社公式正規品',
    heroBadgeReturns: '30日間無料返品可能',
    heroExploreGuide: '読書ガイドを見る',

    bento1Rank: '#1 世界ベストセラー',
    bento1Title: 'ONE PIECE: ルフィ ギア5覚醒',
    bento1Save: '本日20%OFF',
    bento1Link: '第105巻を見る',

    bento2Badge: '公式ガイド',
    bento2Title: 'ストーリー構成・読む順番ガイド',
    bento2Desc: '単行本の発売順、ストーリー構成、アニメエピソードとの対応表を完全網羅。',
    bento2Link: '年代順ガイドを開く',

    bento3Badge: '特装版・愛蔵版ボックス',
    bento3Title: '限定ボックスセットコレクション',
    bento3Desc: '特製箔押し化粧箱、公式アートブック、限定ポスター付きの豪華セット。',
    bento3Link: 'ボックス一覧を見る',

    bento4Badge: 'エンタープライズ統合',
    bento4Title: 'Java Spring アーキテクチャ',
    bento4Desc: 'Java 21 LTS + Spring Data JPA による堅牢なRESTマイクロサービス設計。',
    bento4Link: 'Javaソースを確認',

    bestSellersTitle: 'マンガ・コミックのベストセラー',
    bestSellersSubtitle: '売上に基づく人気タイトルランキング。1時間ごとに更新・翌日配送対応。',
    bestSellersLeaderboard: 'Mangazon 売上ランキング',
    primeClubTitle: 'Mangazon 特典クラブ',
    primeClubSub: '全商品無料配送と限定クーポン特典',
    primeClubBadge: '会員特典',
    showingCount: '{count}件のベストセラーを表示中',
    categoryLabel: 'カテゴリー',
    sortByLabel: '並び替え:',
    sortRank: '注目のベストセラー (順位 #1-12)',
    sortRating: 'カスタマーレビュー評価順 (高い順)',
    sortPriceLow: '価格の安い順',
    sortPriceHigh: '価格の高い順',

    bestSellerRankBadge: 'ベストセラー #{rank}位',
    amazonsChoice: 'おすすめの',
    choice: 'イチオシ',
    lookInside: '試し読み ↗',
    primeBadge: '送料無料',
    savePercent: '{percent}% OFF',
    listPrice: '参考価格: ',
    inStock: '在庫あり',
    onlyLeft: '残り{count}点 - ご注文はお早めに',
    freeDeliveryTomorrow: '明日中にお届け・配送料無料',
    addToCart: 'カートに入れる',
    addedToCart: '追加完了！',
    quickView: '詳細を見る',

    booksBreadcrumb: 'Mangazon 本・コミック',
    authorBy: '著者:',
    artistBy: '作画:',
    ratingsCount: '件のカスタマー評価',
    formatSelectTitle: 'フォーマットを選択:',
    tabOverview: '概要・あらすじ',
    tabReadingGuide: '読書ガイド・巻構成',
    tabSpecs: '仕様・出版情報',
    tabReviews: 'カスタマーレビュー',
    quantityLabel: '数量:',
    buyNow1Click: '1-Clickで今すぐ買う',
    shipsFrom: '出荷元',
    soldBy: '販売元',
    officialPublisher: '公式ライセンス出版社',
    returnsLabel: '返品',
    returnPolicy30Days: '30日間返品無料',
    paymentLabel: 'お支払い',
    secureSsl: 'SSL暗号化による安全な決済',
    frequentlyBoughtTogether: 'よく一緒に購入されている商品',
    bundleTotalPrice: '合計価格:',
    bundleSaveNotice: 'セット購入でさらにお得にお買い求めいただけます。',
    addAllBundleToCart: '{count}点をすべてカートに入れる',
    publicationDetails: '出版情報・詳細',
    isbnLabel: 'ISBN-13',
    printLengthLabel: 'ページ数',
    pagesLabel: 'ページ',
    ageRatingLabel: '対象年齢',
    releaseDateLabel: '発売日',
    animeStatusTitle: 'アニメ化・配信情報',
    officialTranslationBadge: '✓ 原作者監修の公式正規品コミックです。',
    volumeChronologyTitle: '単行本・エピソード構成',
    volumeChronologySub: '本編ストーリーにおける本巻の位置づけ。',
    keyArcsMilestones: '収録エピソード・見どころ',
    animeSyncTitle: 'アニメエピソード対応表',
    readingTipsTitle: 'コレクター向け読書アドバイス',
    featuredQuoteLabel: '名セリフ:',

    customerReviewsTitle: 'カスタマーレビュー',
    outOf5Stars: '5つ星のうち',
    globalRatings: '件のグローバル評価',
    starLabel: '星',
    writeReviewTitle: 'レビューを書く',
    reviewerNamePlaceholder: 'お名前 / ペンネーム',
    reviewTitlePlaceholder: 'レビューのタイトル',
    reviewRatingLabel: '評価:',
    reviewContentPlaceholder: '作画、ストーリー展開、本の品質などについて感想をご記入ください',
    submitReview: 'レビューを投稿',
    submittingReview: '投稿中...',
    verifiedPurchaseBadge: '✓ Amazonで購入',
    reviewedOn: '投稿日:',
    formatPurchasedLabel: '購入形態:',

    lookInsideTitle: '試し読み',
    pageOf: 'ページ {current} / {total}',
    readingDirectionHint: 'マンガ形式: 右から左へ読む ◀',
    officialPreviewTitle: '公式試し読みプレビュー',
    zoomIn: '拡大',
    zoomOut: '縮小',

    readingGuideModalTitle: '読書ガイド・年代順ストーリー構成',
    readingGuideModalSub: '各作品のストーリー展開、サガ構成、アニメ対応表を確認できます。',
    readingGuideAllSeries: '注目タイトル一覧',
    chronologicalOrder: 'おすすめの読書順',
    recommendedOrder: '読む順番',
    arcSummary: 'あらすじ・解説',
    episodesSync: 'アニメ対応エピソード',

    shoppingCartTitle: 'ショッピングカート',
    freeShippingNeeded: 'あと{amount}でプライム無料配送対象になります',
    freeShippingUnlocked: 'このご注文は翌日無料配送の対象です！',
    emptyCartTitle: 'お客様のMangazonカートには商品がありません。',
    emptyCartSub: 'ワンピース、ベルセルク、呪術廻戦などの人気作品をチェックしましょう！',
    subtotalLabel: '小計',
    proceedToCheckout: 'レジに進む (1-Click)',
    deleteItem: '削除',
    quantity: '数量:',
    viewCart: 'カートを見る',
    exploreVolume: '第105巻を見る',
    readingGuideBtn: 'ストーリー構成ガイドを開く',
    freeDeliverySub: 'コレクター向け強化梱包で、お気に入りのマンガを明日お届けします。',
    exploreBestSellers: 'ベストセラーを見る',
    orderSummary: '注文内容の確認',

    checkoutTitle: 'Mangazon 安全な注文手続き',
    stepAddress: '1. お届け先住所',
    stepPayment: '2. お支払い方法',
    stepReview: '3. 注文内容の確認',
    fullNameLabel: '氏名',
    streetLabel: '住所・番地',
    cityLabel: '市区町村',
    stateLabel: '都道府県',
    zipCodeLabel: '郵便番号',
    paymentSelectTitle: 'お支払い方法を選択',
    cardPayment: 'クレジットカード / デビットカード',
    oneClickPayment: '1-Click (即時決済)',
    promoCodeLabel: 'プロモーションコード',
    applyPromo: '適用',
    promoApplied: 'クーポンが適用されました！',
    shippingFee: '配送料',
    freeShipping: '無料',
    taxLabel: '消費税',
    grandTotal: 'ご請求額:',
    placeOrderBtn: '注文を確定する',
    processingOrder: '安全に注文を処理しています...',
    orderSuccessTitle: 'ご注文が確定しました！',
    orderSuccessSub: 'Mangazonをご利用いただきありがとうございます。確認メールを送信しました。',
    trackingNumberLabel: 'お問い合わせ伝票番号:',
    deliveryDateLabel: 'お届け予定日:',
    orderTimeline: '配送ステータス:',
    statusProcessing: '出荷準備中',
    continueShopping: 'ショッピングを続ける',

    javaArchTitle: 'Java 21 Spring Boot アーキテクチャ',
    javaArchSub: 'Spring Data JPA、Hibernate、Redisキャッシュを活用したエンタープライズ設計。',
    tabController: 'RESTコントローラー',
    tabService: 'サービス層',
    tabEntity: 'JPAエンティティ',
    tabApiTester: 'APIテスト環境',
    testEndpointsTitle: 'バックエンドAPIエンドポイントの実行テスト',
    callEndpointBtn: 'APIを実行',
    copyCodeBtn: 'Javaコードをコピー',
    copiedCodeBtn: 'コピー完了！',
    backendArchitectureNote: '表示されているコードはSpring Bootバックエンドのアーキテクチャ設計です。',

    backToTop: 'トップへ戻る',
    col1Title: 'Mangazonについて',
    col1L1: 'Mangazonブックスについて',
    col1L2: 'マンガ家クリエイター支援基金',
    col1L3: '集英社・講談社公式パートナー',
    col1L4: '環境保護・認証紙プログラム',
    col2Title: 'Mangazonでビジネス',
    col2L1: 'Mangazon Directで出版',
    col2L2: 'アフィリエイトプログラム',
    col2L3: 'マンガ広告の掲載',
    col2L4: 'フルフィルメント by Mangazon',
    col3Title: 'お支払い・会員特典',
    col3L1: 'Mangazon リワードカード',
    col3L2: 'オタクポイントでお買い物',
    col3L3: 'ギフト券残高チャージ',
    col3L4: '通貨換算ツール',
    col4Title: 'ヘルプ＆カスタマーサービス',
    col4L1: 'アカウント＆予約注文',
    col4L2: '配送料・配送ポリシー',
    col4L3: '返品・交換',
    col4L4: 'Java 21 Spring 設計',
    currencySelector: 'JPY - 日本円 (¥)',
    copyrightNotice: '© 1996-2026, Mangazon.com, Inc. またはその関連会社。Amazon風マンガEコマースプラットフォーム。React、TypeScript、Java 21 Spring RESTで構築。',
  },
};
