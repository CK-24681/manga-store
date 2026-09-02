import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5173;

app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// RESTful Manga API Endpoints (Java Spring Controller Parity)
// ----------------------------------------------------
// REDIRECTED TO SPRING BOOT:
// The endpoints below have been commented out so that Express does not intercept them.
// Instead, Vite proxy (in vite.config.ts) will forward all /api requests to http://localhost:8080

/*
// GET /api/manga - List manga with filters
app.get('/api/manga', (req, res) => {
  const { category, q, sortBy, maxPrice } = req.query;
  let results = [...liveMangaList];

  if (category && category !== 'All') {
    results = results.filter(
      (m) => m.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (q) {
    const query = (q as string).toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.japaneseTitle.toLowerCase().includes(query) ||
        m.author.toLowerCase().includes(query) ||
        m.tags.some((t) => t.toLowerCase().includes(query)) ||
        m.synopsis.toLowerCase().includes(query)
    );
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) {
      results = results.filter((m) => m.formats.some((f) => f.price <= max));
    }
  }

  if (sortBy === 'price-low') {
    results.sort((a, b) => (a.formats[0]?.price || 0) - (b.formats[0]?.price || 0));
  } else if (sortBy === 'price-high') {
    results.sort((a, b) => (b.formats[0]?.price || 0) - (a.formats[0]?.price || 0));
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
  } else {
    // default rank
    results.sort((a, b) => a.rank - b.rank);
  }

  res.json({
    status: 200,
    count: results.length,
    data: results,
  });
});

// GET /api/manga/best-sellers
app.get('/api/manga/best-sellers', (req, res) => {
  const bestSellers = [...liveMangaList].sort((a, b) => a.rank - b.rank).slice(0, 10);
  res.json({
    status: 200,
    timestamp: new Date().toISOString(),
    bestSellers,
  });
});

// GET /api/manga/:id
app.get('/api/manga/:id', (req, res) => {
  const item = liveMangaList.find((m) => m.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Manga not found' });
    return;
  }
  res.json({ status: 200, data: item });
});

// POST /api/manga/:id/reviews
app.post('/api/manga/:id/reviews', (req, res) => {
  const { author, rating, title, content, formatPurchased } = req.body;
  const itemIndex = liveMangaList.findIndex((m) => m.id === req.params.id);
  if (itemIndex === -1) {
    res.status(404).json({ error: 'Manga not found' });
    return;
  }

  const newReview = {
    id: `r_${Date.now()}`,
    author: author || 'Otaku Reviewer',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author || 'Otaku')}`,
    rating: Number(rating) || 5,
    date: `Verified Purchase on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    title: title || 'Incredible manga volume!',
    content: content || 'Arrived fast and in mint collector condition.',
    verifiedPurchase: true,
    helpfulCount: 0,
    formatPurchased: formatPurchased || 'Paperback',
  };

  const updatedManga = { ...liveMangaList[itemIndex] };
  updatedManga.reviews = [newReview, ...updatedManga.reviews];
  updatedManga.ratingCount += 1;
  liveMangaList[itemIndex] = updatedManga;

  res.json({ status: 201, review: newReview, manga: updatedManga });
});

// POST /api/cart/checkout
app.post('/api/cart/checkout', (req, res) => {
  const { items, shippingAddress, paymentMethod, promoCode } = req.body;
  
  if (!items || !items.length) {
    res.status(400).json({ error: 'Cart is empty' });
    return;
  }

  const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const discountRate = promoCode?.toUpperCase() === 'MANGA20' ? 0.20 : promoCode?.toUpperCase() === 'OTAKU10' ? 0.10 : 0;
  const discount = subtotal * discountRate;
  const shipping = subtotal > 35 ? 0 : 4.99;
  const total = Math.max(0, subtotal - discount + shipping);

  const orderId = `MGZ-JPA-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
  const trackingNumber = `937488969${Math.floor(100000000 + Math.random() * 900000000)}`;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 1); // Prime Next-Day

  const order = {
    orderId,
    date: new Date().toISOString(),
    items,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
    shippingAddress: shippingAddress || {
      fullName: 'Alex Vance',
      street: '424 Akihabara Blvd Suite 700',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States',
    },
    deliveryEstimate: `Tomorrow by 9:00 PM (${deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`,
    trackingNumber,
    paymentMethod: paymentMethod || 'MangaPrime 1-Click Card (ending in 8892)',
    status: 'Processing',
  };

  res.json({ status: 200, success: true, order });
});
*/

// ----------------------------------------------------
// Vite Middleware setup for development & production
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mangazon Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
