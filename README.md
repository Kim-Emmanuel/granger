# Granger | The Future of Sportainment

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg?logo=tailwind-css)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02.svg?logo=greensock)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-8E75B2.svg?logo=google)

**Granger** is a high-performance, immersive landing page representing the intersection of premium wellness and digital innovation ("Sportainment"). It leverages the **Google Gemini API** for personalized fitness coaching and utilizes **GSAP** for complex, timeline-driven animations and scroll interactions.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Generative AI Integration](#-generative-ai-integration)
- [Animation Strategy](#-animation-strategy)
- [Project Structure](#-project-structure)
- [Design System](#-design-system)

---

## 🚀 Features

### 1. Immersive User Experience
- **Parallax Hero Section**: Orchestrated entrance animations with scroll-scrubbing text layers.
- **Glassmorphism UI**: Modern frosted glass aesthetics applied to cards, navigation, and overlays using backdrop filters.
- **Dark/Light Mode**: Fully responsive theme switching with persisted state and smooth color transitions.

### 2. AI-Powered Personalization (Gemini 2.5)
- **Daily Challenge Generator**: A "Coach" agent that generates unique, high-intensity micro-challenges on demand.
- **Activity Insight Engine**: Analyzes static health data to provide encouraging, elite-level sports motivation.

### 3. Interactive Components
- **Finite Program Slider**: A custom-built, touch-enabled horizontal slider with finite boundary logic (no infinite loop jarring) and sticky headers on mobile.
- **Data Visualization**: Animated SVG charts that draw themselves upon scrolling into view.
- **Event Booking System**: Interactive list items that expand to reveal booking status and real-time "spots left" indicators.

---

## 🏗 Architecture & Tech Stack

This project is built using a modern frontend architecture focusing on performance and type safety.

- **Framework**: **React 19** with **TypeScript**.
- **Styling**: **Tailwind CSS** (via CDN for preview) for utility-first styling, utilizing extensive `group-hover` and `dark:` modifiers.
- **Animation Engine**: **GSAP (GreenSock)**. We utilize `ScrollTrigger` for viewport-based interactions and `Tween` for micro-interactions.
- **Icons**: **Lucide React** for consistent, lightweight SVG iconography.
- **AI SDK**: **@google/genai** for direct communication with Google's LLMs.

### Key Architectural Decisions

1.  **GSAP Context in React**: All animations are wrapped in `gsap.context()` within `useLayoutEffect`. This ensures proper cleanup of ScrollTriggers and animations when components unmount or re-render, preventing memory leaks and "ghost" animations in React Strict Mode.
2.  **Service Layer Pattern**: AI logic is segregated into `services/geminiService.ts`. This keeps UI components clean and separates the prompt engineering logic from the view layer.
3.  **Component Composition**: Large sections (Hero, Program, Events) are modularized. Data (like events or programs) is typed via TypeScript interfaces to ensure consistency.

---

## 🧠 Generative AI Integration

The application uses the **Google Gemini 2.5 Flash** model to provide real-time, context-aware content.

### Implementation Details
The AI client is initialized with a secure API key handling strategy. We employ a **Persona-based Prompt Engineering** strategy.

**Example: Daily Challenge Prompt**
```typescript
const prompt = `You are an intense elite sports coach. Give me a single, short, punchy, specific daily fitness challenge... Output ONLY the challenge text. Max 15 words.`;
```

**Handling Latency**:
- Custom loading states ("Coaching...", "Formulating...") provide visual feedback while the LLM processes the request.
- Fallback logic ensures the UI never breaks, even if the API quota is exceeded or offline.

---

## 📂 Project Structure

```
/
├── components/
│   ├── Features.tsx       # AI Challenge & Benefits grid
│   ├── Program.tsx        # Complex slider with filtering
│   ├── Events.tsx         # Interactive booking list
│   ├── Tracking.tsx       # SVG Charts & Analytics
│   ├── Hero.tsx           # Parallax entry
│   ├── Navbar.tsx         # Responsive Nav
│   ├── Footer.tsx         # Scroll-scrubbed footer
│   ├── ScrollToTop.tsx    # SVG progress circle button
│   └── SplashScreen.tsx   # Initial load sequence
├── services/
│   └── geminiService.ts   # AI API abstraction
├── types.ts               # TypeScript interfaces
├── App.tsx                # Layout composition
├── index.tsx              # Entry point
└── index.html             # HTML entry & Styles
```

---

## 🛠 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file in the root and add your Gemini API key (Note: In this demo environment, `process.env.API_KEY` is injected automatically).
    ```env
    API_KEY=your_google_genai_api_key
    ```
4.  **Run Development Server**:
    ```bash
    npm start
    ```

---

---

## 🎨 Design System

- **Colors**:
    - `brand-orange`: `#ea580c` (Action, Energy)
    - `brand-blue`: `#4aa5d6` (Trust, Technology)
    - `brand-dark`: `#0f0f11` (Premium Background)
    - `brand-mint`: `#a3e635` (Accents, Success)
- **Typography**: `Inter` (Google Fonts) for clean, legible, high-DPI friendly text.
- **Textures**: SVG Noise filters and CSS gradients are used to break up flat colors and add a tangible "premium paper" feel to dark cards.

---

© 2025 Granger Sportainment. Built with passion and code.