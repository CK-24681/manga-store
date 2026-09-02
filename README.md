# 🥭 Mangazon — Manga Store

Loja de mangás estilo Amazon, construída como projeto acadêmico de **Inteligência Artificial / Engenharia de Software**.

---

## 🏗️ Estrutura do Monorepo

```
MangaStore/
├── manga-store/          ← Frontend React + Vite + Express
└── manga-store-api/      ← Backend Java 21 + Spring Boot 3.3
```

---

## 📦 manga-store (Frontend)

### Stack
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 18 | UI declarativa |
| Vite | 5 | Build/dev server |
| TypeScript | 5 | Tipagem |
| Tailwind CSS | 4 (via `@tailwindcss/vite`) | Estilização responsiva |
| Express | 4 | API server + proxy Vite |
| Lucide React | — | Ícones |

### Funcionalidades
- 🎠 **Hero Carousel** — 3 slides com autoplay, navegação por setas e dots
- 🛍️ **Product Grid** — Bento layout `1col → 2col → 3col` (mobile/tablet/desktop)
- 📊 **Best Sellers Rank** — Top 10 com filtro por categoria e ordenação
- 🔍 **Busca** — Busca em tempo real por título, autor, tags e sinopse
- 🛒 **Cart Drawer** — Carrinho lateral com atualização de quantidade
- 💳 **Checkout** — Modal completo com códigos promocionais e rastreio
- 🌐 **i18n** — 4 idiomas: PT 🇧🇷 · EN 🇺🇸 · ES 🇪🇸 · JA 🇯🇵
- 📖 **Look Inside** — Preview de páginas do mangá
- ⭐ **Reviews** — Avaliações com rating, verificação de compra

### Responsividade
| Breakpoint | Layout |
|-----------|--------|
| `< 640px` (mobile) | 1 coluna, busca colapsável, hamburger menu |
| `640px-768px` (sm) | 2 colunas, busca expandida |
| `768px-1024px` (md/lg) | 2–3 colunas, navegação completa |
| `> 1024px` (desktop) | 3 colunas, sidebar visível |

### Categorias disponíveis
`Shonen` · `Seinen` · `Dark Fantasy` · `Romance & Shojo` · `Sci-Fi & Cyberpunk` · `Isekai & Fantasy` · `Box Sets & Special Editions` · `Classic & Award Winners`

### Como rodar

```bash
cd manga-store

# Instalar dependências
npm install

# Rodar servidor de desenvolvimento (porta 3000)
npm run dev

# Build de produção
npm run build && npm start
```

### API (Express — porta 3000)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/manga` | Lista mangás (`?category=` `?q=` `?sortBy=` `?maxPrice=`) |
| `GET` | `/api/manga/best-sellers` | Top 10 por rank |
| `GET` | `/api/manga/:id` | Detalhe por ID |
| `POST` | `/api/manga/:id/reviews` | Adicionar review |
| `POST` | `/api/cart/checkout` | Finalizar pedido |

**Verificação rápida:**
```bash
# Todos os mangás
curl http://localhost:3000/api/manga | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"count\"]} mangás')"

# Filtrar categoria
curl "http://localhost:3000/api/manga?category=Shonen&sortBy=rating"

# Checkout com promo
curl -X POST http://localhost:3000/api/cart/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[{"mangaId":"one-piece-vol-105","format":"Paperback","price":11.99,"quantity":1,"volumeNumber":105}],"promoCode":"MANGA20"}'
```

**Códigos promocionais:**
| Código | Desconto |
|--------|----------|
| `MANGA20` | 20% |
| `OTAKU10` | 10% |

> Frete grátis em pedidos acima de **$35**.

---

## ☕ manga-store-api (Backend Spring Boot)

Backend REST API que espelha todos os endpoints do Express, com **dados reais da [MangaDex API](https://api.mangadex.org)**.

### Stack
| Tecnologia | Versão |
|-----------|--------|
| Java | 21 |
| Spring Boot | 3.3.4 |
| Spring Web (REST) | — |
| Jackson | — |
| Maven | 3.9+ |

### Dados
- **Primários**: MangaDex API v5 — títulos reais, capas oficiais, autores, ratings
- **Fallback**: 10 mangás curados em memória (se API offline)

### Requisitos

```bash
# Ubuntu/Debian
sudo apt-get install -y openjdk-21-jdk maven

# Verificar instalação
java -version   # openjdk 21.x.x
mvn -version    # Apache Maven 3.x.x
```

### Como rodar

```bash
cd manga-store-api

# Com dados reais da MangaDex (padrão)
mvn spring-boot:run

# Modo offline (dados mockados)
mvn spring-boot:run -Dmangadex.enabled=false

# Build JAR executável
mvn package -DskipTests
java -jar target/manga-store-api-1.0.0-SNAPSHOT.jar
```

> Roda na porta **8080** por padrão.

### API (Spring Boot — porta 8080)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/manga` | Lista mangás com filtros |
| `GET` | `/api/manga/best-sellers` | Top 10 por rank |
| `GET` | `/api/manga/{id}` | Detalhe por ID (UUID MangaDex) |
| `POST` | `/api/manga/{id}/reviews` | Adicionar review |
| `POST` | `/api/manga/reload` | Recarrega dados da MangaDex API |
| `POST` | `/api/cart/checkout` | Finalizar pedido |
| `GET` | `/actuator/health` | Health check |

### Verificação rápida

```bash
# Listar mangás reais
curl http://localhost:8080/api/manga | jq '.count, .data[0].title'

# Forçar recarga da MangaDex
curl -X POST http://localhost:8080/api/manga/reload

# Health check
curl http://localhost:8080/actuator/health
```

### Configuração

```properties
# application.properties
mangadex.enabled=true     # false = sempre usa dados mockados
mangadex.timeout=10000    # timeout em ms para chamadas externas
server.port=8080
```

### Integração com o Frontend

Para usar o Spring Boot como backend em vez do Express:

1. Inicie o Spring Boot: `mvn spring-boot:run` (porta 8080)
2. No `vite.config.ts`, adicione proxy:
```ts
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```
3. O frontend continua rodando em `:3000` (Vite) — as chamadas `/api/*` serão redirecionadas para `:8080`.

---

## 🧪 Resultados dos Testes (Spring Boot + MangaDex API)

Todos os endpoints testados e funcionando nativamente, consumindo dados diretamente da MangaDex API:

```
✅ GET  /api/manga               → 25 mangás retornados (dados reais)
✅ GET  /api/manga/best-sellers  → top 10 por rank (dados reais)
✅ GET  /api/manga?category=Shonen → filtro por categoria
✅ GET  /api/manga?q=one+piece   → busca textual
✅ GET  /api/manga?sortBy=price-low → ordenação por preço
✅ GET  /api/manga/{id}          → detalhe por ID do MangaDex
✅ POST /api/manga/:id/reviews   → review criada localmente
✅ POST /api/cart/checkout       → pedido com frete grátis (> $35)
✅ POST /api/cart/checkout (MANGA20) → 20% de desconto aplicado
✅ POST /api/cart/checkout (items:[]) → 400 { error: "Cart is empty" }
```

---

## 📁 Componentes Frontend

| Componente | Descrição |
|-----------|-----------|
| `Header.tsx` | Navbar sticky, busca colapsável no mobile, seletor de idioma |
| `HeroCarousel.tsx` | Carousel com 3 slides, autoplay 6.5s, altura adaptativa |
| `ProductCard.tsx` | Card de produto com formato selecionável e add-to-cart |
| `BestSellersRankGrid.tsx` | Grade de best sellers com filtros e ordenação |
| `CartDrawer.tsx` | Carrinho lateral animado (`slide-in-right`) |
| `CheckoutModal.tsx` | Modal de checkout completo com endereço e pagamento |
| `ProductDetailModal.tsx` | Detalhe completo do mangá com reviews e formatos |
| `LookInsideModal.tsx` | Preview de páginas do mangá |
| `ReadingGuideModal.tsx` | Guia de leitura de mangá |
| `Footer.tsx` | Rodapé responsivo 2→4 colunas |

---

## 🗂️ Dados Mockados (Express/TypeScript)

12 mangás no `mangaData.ts`, incluindo:
- One Piece Vol. 105 · Jujutsu Kaisen Vol. 24 · Berserk Deluxe Vol. 1
- Frieren Vol. 1 · Dandadan Vol. 1 · Chainsaw Man Vol. 15
- Vinland Saga · Blue Lock · Spy x Family · Demon Slayer Box Set
- My Hero Academia Vol. 40 · Dungeon Meshi (Delicious in Dungeon)

---

## 👨‍💻 Desenvolvido para

**Inteligência Artificial** — Faculdade  
Projeto: Aplicação web com backend RESTful e frontend responsivo

# Mangazon API — Spring Boot Backend

Backend REST API para o projeto Manga Store, implementado em **Java 21 + Spring Boot 3.3**.
Busca dados **reais** da [MangaDex API](https://api.mangadex.org) ao inicializar.
Fallback automático para dados mockados se a API estiver offline.

## Fontes de Dados

| Fonte | Quando usa |
|-------|-----------|
| 🌐 **MangaDex API** (dados reais) | `mangadex.enabled=true` (padrão) + API disponível |
| 📦 **Mock data** (10 mangás curados) | API indisponível ou `mangadex.enabled=false` |

### O que vem da MangaDex API
- Títulos reais (japonês + inglês)
- Autores e artistas reais  
- Capas oficiais em alta resolução (`https://uploads.mangadex.org/covers/...`)
- Sinopses originais
- Tags/gêneros reais
- Datas de lançamento reais
- Ratings (convertidos da escala 1-10 para 1-5)
- Top mangás por número de seguidores

## Estrutura

```
src/main/java/com/mangazon/api/
├── MangaStoreApiApplication.java
├── config/
│   └── CorsConfig.java              ← CORS + RestTemplate bean com timeout
├── controller/
│   ├── MangaController.java         ← GET/POST /api/manga/** + POST /api/manga/reload
│   └── CartController.java          ← POST /api/cart/checkout
├── service/
│   ├── MangaService.java            ← Filtros, ordenação, reviews
│   └── CartService.java             ← Checkout com promo codes
├── data/
│   ├── MangaDexService.java         ← Cliente MangaDex API (dados reais)
│   ├── MangaDexDto.java             ← DTOs para deserializar respostas
│   └── MangaDataStore.java          ← Cache em memória + fallback mockado
└── model/
    ├── Manga.java, MangaFormat.java, Review.java
    ├── CartItem.java, Order.java
```

## Requisitos

```bash
# Ubuntu/Debian
sudo apt-get install -y openjdk-21-jdk maven
```

## Como Executar

```bash
cd manga-store-api

# Rodar com dados reais da MangaDex (padrão)
mvn spring-boot:run

# Rodar com dados mockados (offline/desenvolvimento)
mvn spring-boot:run -Dmangadex.enabled=false

# Build JAR
mvn package -DskipTests
java -jar target/manga-store-api-1.0.0-SNAPSHOT.jar
```

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/manga` | Lista mangás com filtros |
| GET | `/api/manga/best-sellers` | Top 10 mais vendidos |
| GET | `/api/manga/{id}` | Detalhes (por ID MangaDex UUID) |
| POST | `/api/manga/{id}/reviews` | Adicionar avaliação |
| POST | `/api/manga/reload` | Recarrega dados da MangaDex API |
| POST | `/api/cart/checkout` | Finalizar pedido |

### Filtros — GET /api/manga

| Param | Tipo | Exemplo |
|-------|------|---------|
| `category` | string | `Shonen`, `Seinen`, `Dark Fantasy` |
| `q` | string | Busca em título, autor, tags, sinopse |
| `sortBy` | string | `rank`, `rating`, `price-low`, `price-high` |
| `maxPrice` | number | `15.00` |

### Códigos Promocionais — checkout

| Código | Desconto |
|--------|----------|
| `MANGA20` | 20% |
| `OTAKU10` | 10% |

Frete grátis em pedidos acima de **$35**.

## Testar com curl

```bash
# Listar todos (dados reais da MangaDex)
curl http://localhost:8080/api/manga | jq '.count, .data[0].title'

# Forçar recarga dos dados
curl -X POST http://localhost:8080/api/manga/reload

# Best Sellers
curl http://localhost:8080/api/manga/best-sellers | jq '.bestSellers[0].title'

# Buscar por gênero
curl "http://localhost:8080/api/manga?category=Shonen"

# Adicionar review (use o UUID do MangaDex como ID)
curl -X POST http://localhost:8080/api/manga/c52b2ce3-7f95-469c-96b0-479524fb7a1a/reviews \
  -H "Content-Type: application/json" \
  -d '{"author":"João","rating":5,"title":"Épico!","content":"Melhor manga!","formatPurchased":"Paperback"}'

# Checkout com promo
curl -X POST http://localhost:8080/api/cart/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[{"mangaId":"abc","format":"Paperback","price":11.99,"quantity":1,"volumeNumber":1}],"promoCode":"MANGA20"}'
```

## Configuração (application.properties)

```properties
mangadex.enabled=true         # false = sempre usa mock data
mangadex.timeout=10000        # timeout em ms para chamadas à MangaDex API
```
