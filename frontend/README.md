# L'Étoile Dorée — Haute Gastronomie Restaurant Web Application

A production-ready, highly polished web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **Lenis Smooth Scroll**, and **Zod**. Designed with a dark luxury aesthetic (gold & amber accents on obsidian background).

---

## 🌟 Tech Stack & Vibe-Coder Integrations

- **Framework**: Next.js 16.3.0 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";`, `@theme` directives)
- **Animations & Micro-interactions**:
  - **Framer Motion**: Smooth page transitions, layout morphing, modal dialogs.
  - **Lenis Smooth Scroll**: Buttery soft scrolling and scroll-based effects.
- **Form Validation & API**: Server-side route handlers validated with **Zod** (`/api/reservation`).
- **Icons & Typography**: Lucide React icons, Google Fonts (`Playfair Display`, `Geist Sans`, `Geist Mono`).

### Integrated Vibe Coder Tools Framework
1. **Motion Primitives / Framer Motion**: Interactive animated components, hover effects, modal transitions.
2. **Manus Backend Architecture**: API route structure prepared for full-stack DB and payment integrations.
3. **Haikei SVG Backgrounds**: Custom SVG overlay utilities and dark glassmorphism backdrops (`.glass`).
4. **Real Time Colors**: Design token palette curated in `src/lib/theme.ts`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm**: v9+

### Installation & Development Server

```bash
# Clone the repository
git clone <repository-url>
cd resturant_site

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application live.

---

## 📁 Project Structure

```text
resturant_site/
├── public/                # Static assets & icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── reservation/
│   │   │       └── route.ts # POST reservation API (Zod validation)
│   │   ├── about/
│   │   │   └── page.tsx    # Story, philosophy, chef team bios
│   │   ├── menu/
│   │   │   └── page.tsx    # Interactive filtered menu (Starters, Mains, Desserts, Drinks)
│   │   ├── reservation/
│   │   │   └── page.tsx    # Table reservation form with real server API integration
│   │   ├── globals.css     # Tailwind v4 theme setup & glassmorphism utilities
│   │   ├── layout.tsx      # Root layout with Google Fonts & SmoothScroll wrapper
│   │   └── page.tsx        # Landing hero, signature specials & video background
│   ├── components/
│   │   ├── Footer.tsx      # Multi-column luxury footer
│   │   ├── Navbar.tsx      # Glassmorphism navigation bar
│   │   └── SmoothScroll.tsx# Lenis smooth scrolling provider
│   └── lib/
│       └── theme.ts        # Color palette & font design tokens
├── next.config.ts          # Remote image domain configurations (Unsplash)
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## 🧪 Production Verification Commands

```bash
# Run ESLint check
npm run lint

# Run Next.js production build
npm run build

# Start production server
npm start
```

---

## 🔒 Security & Best Practices

- **Zero Hardcoded Secrets**: All backend endpoints validate inputs via Zod.
- **Accessibility**: Semantic HTML5 elements (`<nav>`, `<main>`, `<footer>`, `<section>`), proper `aria-label` tags, focus outlines.
- **SEO Ready**: Custom Open Graph metadata, semantic heading hierarchy (`h1`, `h2`, `h3`).
