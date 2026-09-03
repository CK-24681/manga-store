# 🥭 Mangazon — Manga Store

E-commerce de mangás de alta fidelidade visual inspirado na Amazon, construído com arquitetura monorepo moderna, integração com IA e backend robusto em **Java 21 + Spring Boot 3.3** e frontend em **React 19 + TypeScript + Tailwind CSS 4**.

---

## 🏗️ Estrutura do Monorepo

```
MangaStore/
├── manga-store/                  ← Frontend React 19 + Vite 6 + Express Server
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           ← Header, Footer, Logo, HeroCarousel
│   │   │   ├── catalog/          ← ProductCard, BestSellersRankGrid
│   │   │   ├── cart/             ← CartDrawer
│   │   │   ├── modals/           ← ProductDetailModal, LookInsideModal, CheckoutModal, AIAssistantModal
│   │   │   └── index.ts          ← Barrel Export centralizado
│   │   ├── pages/                ← Páginas completas (ReadingGuidePage, SellPage)
│   │   ├── context/              ← Contextos React (LanguageContext)
│   │   ├── i18n/                 ← Traduções e internacionalização (PT, EN, ES, JA)
│   │   ├── types.ts              ← Tipagem TypeScript centralizada
│   │   ├── App.tsx               ← Orquestrador de estado e navegação
│   │   ├── main.tsx              ← Ponto de montagem React
│   │   └── index.css             ← Estilos globais e tokens Tailwind
│   ├── server.ts                 ← Servidor Node.js Express + Middleware Vite + Endpoint IA
│   ├── vite.config.ts            ← Configuração Vite com proxy inteligente para o Spring Boot
│   └── package.json
│
├── manga-store-api/              ← Backend Java 21 LTS + Spring Boot 3.3
│   ├── src/main/java/com/mangazon/api/
│   │   ├── controller/           ← MangaController, CartController, AIController
│   │   ├── service/              ← MangaService, CartService
│   │   ├── repository/           ← JsonFileRepository, OrderRepository, ReviewRepository
│   │   ├── model/                ← Manga, MangaFormat, CartItem, Order, Review
│   │   ├── data/                 ← MangaDexService (integração real com MangaDex API)
│   │   ├── config/               ← CorsConfig (CORS seguro para frontend)
│   │   └── MangaStoreApiApplication.java
│   └── src/test/java/com/mangazon/api/
│       ├── MangaStoreApiApplicationTests.java ← Teste de integridade do contexto
│       └── AIControllerTest.java              ← Testes automatizados do endpoint de IA
│
├── requests/                     ← Coleções HTTP organizadas para testes
│   ├── requests.http             ← Requisições prontas para VS Code REST Client / IntelliJ
│   └── collection.yml            ← Coleção Bruno / Insomnia
│
├── .env                          ← Variáveis de ambiente protegidas (ignorado pelo git)
├── .env.example                  ← Modelo seguro de variáveis de ambiente
├── .gitignore                    ← Proteção de credenciais e arquivos de build
└── README.md                     ← Documentação do projeto
```

---

## ⚡ Como Executar o Projeto

### 1. Pré-requisitos
- **Node.js** (v18+) e **npm**
- **Java 21 JDK** (OpenJDK ou similar)
- **Apache Maven** (3.9+)

---

### 2. Executando o Backend (Java Spring Boot)
O backend gerencia os dados dos mangás, persistência de pedidos/avaliações e consome a MangaDex API.

```bash
cd manga-store-api

# Executar aplicação Spring Boot (Porta 8080)
mvn spring-boot:run

# Executar a suíte de testes automatizados
mvn test
```

> **Endpoint de Saúde:** `http://localhost:8080/actuator/health` ➔ `{"status":"UP"}`

---

### 3. Executando o Frontend (React + Vite + Express)
O frontend consome os endpoints do Spring Boot e provê a interface com seletor de volumes, IA e carrinho em tempo real.

```bash
cd manga-store

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Porta 5173)
npm run dev

# Validação de tipos (Lint)
npm run lint

# Build de produção
npm run build
```

> **Aplicação Web:** Acesse no navegador em `http://localhost:5173`

---

## 🤖 Conformidade: Aula 02 - Pré-requisitos do Projeto de E-Commerce

O projeto cumpre integralmente os 4 pilares exigidos na disciplina de Inteligência Artificial:

| Requisito | Especificação do Projeto | Implementação Técnica |
| :--- | :--- | :--- |
| **1. Frontend Funcional** | Campo de texto para a pergunta, botão de envio via JavaScript e espaço reservado (`<div>`/`<ul>`) para injeção da resposta da IA. | Componente `AIAssistantModal.tsx` com mascote oficial exclusivo Mangazon e design clean estilo Amazon: `<input id="ai-question-input">`, `<button id="ai-submit-button">` capturando evento de formulário, parser inteligente de Markdown (sem asteriscos literais) e `<div id="ai-response-container">` com renderização dinâmica. Acesso direto pelo botão flutuante com o avatar do mascote (`#floating-ai-assistant-btn`). |
| **2. Servidor Seguro** | Backend configurado (Node.js/Spring) para intermediar chamadas à IA de forma segura sem expor credenciais. | Rota `POST /api/ai/ask` configurada tanto no servidor Express (`server.ts`) com o SDK oficial `@google/genai` quanto no Spring Boot (`AIController.java`). A chave de API nunca é exposta no cliente. A IA possui inteligência contextual completa da Mangazon Store (catálogo, editoras, previsão de lançamentos como Frieren/One Piece, Seletor de Volumes e 'Espiar por Dentro'), eliminando introduções robóticas e respostas genéricas. |
| **3. Variáveis de Ambiente** | Arquivo `.env` na raiz do projeto e biblioteca `dotenv` instalada para guardar e carregar tokens. | Arquivo único canônico [`.env`](.env) na raiz com `GEMINI_API_KEY`, carregado via biblioteca `dotenv` no backend Node.js e gerenciado via propriedades de ambiente no Spring Boot. |
| **4. Controle Seguro** | Arquivo `.gitignore` configurado desde o início com a linha `.env`. | [`.gitignore`](.gitignore) único e centralizado na raiz protegendo `.env*`, builds (`target/`, `dist/`) e dependências contra vazamentos no repositório. |

---

## 🛍️ Principais Funcionalidades do E-Commerce

### 1. Seletor de Volumes e Capítulos
- Cada obra no catálogo permite selecionar o **volume específico** (ex: *One Piece Vol. 1* ao *108*, *Berserk Vol. 1* ao *41*).
- Indicação clara da faixa de **capítulos inclusos** em cada volume (ex: *Vol. 1: Capítulos 1–9*).
- O carrinho e o checkout suportam múltiplos volumes diferentes do mesmo título no mesmo pedido.

### 2. Look Inside ("Espiar por Dentro")
- Permite pré-visualizar as páginas iniciais do mangá diretamente no navegador antes da compra, com controles de zoom e leitura oriental (da direita para a esquerda).
- Botão acessível tanto via hover no desktop quanto por toque direto no mobile.

### 3. Guia de Leitura Interativo
- Página completa com arcos canônicos, equivalência entre capítulos do mangá e episódios do anime, e chips de acesso rápido para as séries mais populares.

### 4. Carrinho e Checkout Completo
- Gaveta lateral com cálculo dinâmico de frete grátis, cupons (`MANGA20`, `OTAKU10`), comprovante de pedido e código de rastreio simulado.

### 5. Internacionalização (i18n)
- 4 idiomas suportados em tempo real sem recarregar a página: **Português (PT)**, **Inglês (EN)**, **Espanhol (ES)** e **Japonês (JA)**.

---

## 📡 Tabela de Endpoints RESTful

| Método | Endpoint | Origem | Descrição |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/manga` | Spring Boot | Catálogo de mangás com paginação, filtros e ordenação |
| `GET` | `/api/manga/best-sellers` | Spring Boot | Ranking Top 10 mais vendidos |
| `GET` | `/api/manga/{id}` | Spring Boot | Detalhes de um mangá por ID |
| `POST` | `/api/manga/{id}/reviews` | Spring Boot | Adicionar avaliação com verificação de compra |
| `POST` | `/api/cart/checkout` | Spring Boot | Finalização de pedido com cálculo de frete e cupom |
| `POST` | `/api/ai/ask` | Node/Spring | Endpoint seguro de consulta à Inteligência Artificial |
| `GET` | `/api/ai/status` | Node/Spring | Diagnóstico de status e chave de API do módulo de IA |
| `GET` | `/actuator/health` | Spring Boot | Verificação de integridade do servidor Java |

---

## 🧪 Como Testar via Terminal (Exemplos Práticos)

```bash
# 1. Health check do Spring Boot
curl http://localhost:8080/actuator/health

# 2. Status do módulo de IA
curl http://localhost:5173/api/ai/status

# 3. Fazer uma pergunta para a IA via Backend
curl -X POST http://localhost:5173/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Em qual volume de One Piece o Luffy usa o Gear 5?"}'

# 4. Listar primeiros 5 mangás do catálogo
curl "http://localhost:8080/api/manga?page=1&limit=5"
```
