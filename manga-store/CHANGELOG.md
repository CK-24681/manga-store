# Changelog — Mangazon

## [2026-08-27] Simplificação Visual da UI

### Objetivo
Reduzir a poluição visual da interface, removendo elementos desnecessários e duplicados, e remover completamente o módulo de Arquitetura Java simulada (outro desenvolvedor cuidará do backend real).

---

### 🗑️ Removido

#### Módulo Java Architecture (completo)
- **`src/components/JavaArchitectureModal.tsx`** — Arquivo deletado
- **`server.ts`** — Endpoint `GET /api/java/architecture` removido
- **`src/App.tsx`** — Import, state (`isJavaArchOpen`), renderização do modal e props relacionadas removidos
- **`src/components/Header.tsx`** — Botão "Arquitetura Java 21 + Spring Boot" no top banner e pill "Java 21 Spring REST" na sub-nav removidos; prop `onOpenJavaArchitecture` removida da interface
- **`src/components/Footer.tsx`** — Link destacado "Java Architecture" na coluna 4 do footer removido (substituído por link padrão); prop `onOpenJavaArchitecture` removida da interface

#### Top Banner (barra de promoções)
- **`src/components/Header.tsx`** — Barra inteira "OFERTA PRIME · Frete GRÁTIS amanhã..." removida (incluía o seletor rápido de idiomas e o botão de Java)

#### Botões duplicados de "Guias de Leitura"
- **`src/components/Header.tsx`** — Pill "Guias de Leitura" na sub-nav removido (já existe como botão no header principal)
- **`src/components/HeroCarousel.tsx`** — Botão "Ver Guias de Leitura" no carousel removido (já existe no header)

#### Trust Badges
- **`src/components/HeroCarousel.tsx`** — Barra de badges ("100% Original e Oficial", "30 Dias de Devolução Gratuita", "Tradução Oficial") removida abaixo do carousel

---

### ✏️ Modificado

#### Bento Grid (cards de destaque)
- **`src/App.tsx`** — Grid ajustado de `lg:grid-cols-4` → `lg:grid-cols-3` (3 cards restantes: Best Seller #1, Guia de Leitura, MangaPrime Delivery)

#### Imports limpados
- **`src/App.tsx`** — Removidos imports não utilizados (`Coffee`, `JavaArchitectureModal`)
- **`src/components/Header.tsx`** — Removido import `Coffee`
- **`src/components/Footer.tsx`** — Removido import `Coffee`
- **`src/components/HeroCarousel.tsx`** — Removidos imports `BookOpen`, `ShieldCheck`, `Package`

---

### ✅ Não alterado
- Funcionalidades de e-commerce (carrinho, checkout, produto)
- Sistema de internacionalização (i18n)
- Dados de mangá (`mangaData.ts`)
- Modais: Look Inside, Reading Guide, Product Detail
- Product cards e grid de best sellers
- Identidade visual (cores, fontes, layout geral)
