---
name: brand-revamp
description: Tracks and applies brand design tokens, visual references, pixel-perfect layout conventions, and front-end component guidelines for the Auto-City website revamp.
---

# Auto-City Brand Revamp Skill

This skill guides the design, development, and maintenance of the Auto-City front-end website revamp.

## Core Brand Standards

### 1. Color Palette Architecture (70 / 20 / 10 Rule)
- **70% White / Light Clean Space**:
  - Foundation canvas (`#ffffff`), light surface elevations (`#f8fafc`), and subtle borders (`#e2e8f0`).
  - Dark mode option uses Obsidian neutral scale (`#090d16`, `#0d1322`, `#131c31`, `#1e293b`).
- **20% Darkened Cobalt Blue Structure**:
  - Signature Darkened Cobalt Blue: `#1d4ed8` (`var(--color-blue-600)` / `var(--color-brand-blue)`).
  - Complete 11-step scale: `#f0f6ff` (50) to `#061226` (950).
  - Used for navigation framing, structural badges, secondary buttons, icons, and focus outlines.
- **10% Racing Red Accent**:
  - Official Accent Red: `#e10021` (`var(--color-accent-red)`).
  - Hover: `#c5001d`, Active: `#a80018`, Glow: `rgba(225, 0, 33, 0.25)`.
  - Reserved strictly for primary action CTAs (`.btn-primary`), urgent status indicators, and energetic accents.

### 2. Typography Rules (Single Source of Truth & Zero Monospace)
- **Single Source of Truth (SSoT)**: All typography imports and font variables are strictly governed by `css/brand-tokens.css`. Any future font change in `css/brand-tokens.css` automatically updates the entire project.
- **Display Headings**: **Creato Display** (`font-weight: 400, 500, 700`).
- **Body & Subtitles**: **Switzer** from Fontshare (`font-weight: 400, 500, 600, 700`).
- **STRICT RULE - Weight Ceiling**: Never go past **Bold (700 max)** anywhere in the project. Weights 800 and 900 are prohibited.
- **Data / Numeric Specimens**: Use Switzer with `font-variant-numeric: tabular-nums; font-feature-settings: 'tnum', 'zero';`.
- **STRICT RULE - Zero Monospace**: Do NOT use `JetBrains Mono` or ANY monospace font throughout the website.

### 3. Official Vector Logo Insignia
- Authentic brand vector mark with dual-tone gold baseline underlines (`#DABA57`, `#E6D3AD`) and brand red (`#D02A2F`), with the `(R)` symbol omitted and transparent letter counters:
  - `Graphic/AutoCityLogo NEW.svg` / `Graphic/auto-city-logo.svg` : Primary vector mark (187x38, viewBox `0 0 187 38`) with transparent counter cutouts.
  - `Graphic/auto-city-logo-white.svg` : Inverted white vector mark with gold underlines for dark/cobalt backgrounds.
- Minimum clear space clearance: 1.0x Capital "A" height (minimum 32px on all sides).

## Responsibilities

1. **Pixel-Perfect Implementation**:
   - Translate visual mockups, screenshots, and live URL references into clean HTML5/CSS3.
   - Use fluid responsive sizing (`clamp()`, flexbox, CSS grid).
   - Ensure visual consistency across viewports (Mobile: 375px–430px, Tablet: 768px–1024px, Desktop: 1280px–1920px).

2. **Living Documentation**:
   - Maintain `brand-guidelines.html` with color palettes, typography scale, buttons, form controls, and cards.
   - Maintain `research.html` with data matrices, competitor research, and market insights.
   - Update `index.html` showcase portal whenever new HTML templates or pages are created.

3. **Component Architecture**:
   - Store reusable component modules in `components/`.
   - Store shared stylesheet tokens in `css/main.css` and `css/header.css`.
   - Keep JavaScript interactions lightweight and vanilla in `js/main.js`.

### 4. Floating Pill Navigation Standards (Habitline Reference)
- **3-Island Architecture**:
  - Left: Brand pill (18px compact logo, zero subtags, no "Penang").
  - Center: Single-line menu row (strict `white-space: nowrap !important;`, 0 breaks).
  - Right: Action card (circular map button + Racing Red `#e10021` CTA pill inside a full border-radius `9999px` stadium capsule).
- **Modern Radii & Button Standard**:
  - Outer containers: `12px` (`--hl-radius-outer`) for Brand and Center Nav.
  - Action Card (Map & Plan Your Visit): **Full border radius** (`border-radius: 9999px !important;`) stadium capsule.
  - Inner menu links: `8px` (`--hl-radius-inner`).
  - **Universal Button Standard**: All action buttons (`.btn`, `.island-cta-btn`, `.island-squircle-btn`, `.ac-social-btn`, `.events-all-btn`, `.banner-cta-btn`, etc.) MUST use full border radius (`border-radius: 9999px` / `var(--radius-pill)` or `50%` for circular icon buttons) instead of squarish borders.
  - **Dark Gray Hover Rule**: Whenever a button uses a dark gray / charcoal / dark navy background (`#0f172a`, `#1e293b`, `rgba(18, 22, 32)`, `rgba(10, 31, 68)`), on `:hover` it MUST dynamically transition to Racing Red (`var(--color-accent-red, #e10021)`) with calibrated red shadow glow.
- **Inward-Closing Motion Physics**:
  - Duration: `1.15s` (`--hl-motion-duration`).
  - Curve: `cubic-bezier(0.32, 0.72, 0, 1)` (feathered Apple/Framer deceleration, zero abrupt jumps).
  - Scrolled contraction: `1260px` -> `1070px` numeric `max-width` with GPU layer promotion (`transform: translate3d(0, 0, 0);`), centering all 3 islands with exact balanced 12px gaps.
  - Scroll hysteresis buffer: trigger closed at `scrollY > 45px`, expand at `scrollY < 15px`.

### 5. Version 2 Sequence Flow Standards (Mandatory Architecture)
The Version 2 homepage (`pages/home.html`) strictly follows this 7-section narrative flow:

1. **Section 1: Hero Video Showcase & Discovery Chips** (`#heroSection`)
   - Title: `RIVERPARK AUTO-CITY` (Creato Display Medium/Bold, uppercase).
   - Subtitle: `Eco Tourism Lifestyle Destination` (Switzer Medium, sentence case, smaller font size).
   - 5 Category Stadium Pills (Lucide icons): `Attractions & Tours` (`#mustTry`), `Activities & Experiences` (`#activities`), `50+ Dining Hotspots` (`#dining`), `30+ Auto Brands` (`#automotive`), `Event & Promotions` (`#events`).
   - Body lead description and search capsule bar removed.
2. **Section 2: Must Try** (`#mustTry`)
   - 3 signature destination cards (Theme Park, Nadi Glamping, River Cruise).
   - Inset photography with 16px all-around padding (zero edge bleed), subtle hover lift, rAF scroll parallax + 3D mouse tilt.
3. **Section 3: What's On** (`#whatsOn`)
   - 4-card festival & event highlight grid with inset padding.
   - Replaces old Upcoming Events & Deals. Category tags removed; keeps strictly Title, Description, and Event Date.
   - **Mobile Optimization Note**: Sections 2 & 3 are engineered as horizontal snap carousels (cards ~240px wide) allowing both sections to fit simultaneously on a single smartphone viewport (~625px total height).
4. **Section 4: Parallax Activity Highlight** (`#activitiesParallaxSection`)
   - Interactive full-viewport dual-plane Swiper parallax slider highlighting: Mini Zoo, River Cruise, Fun Fair, Mangrove Eco Boardwalk, and Pickleball Sports Club.
5. **Section 5: Discover our spaces and services.** (`#moreThingsToDo`)
   - Temlis Acelia tabbed interactive split showcase with horizontal curtain reveal transitions.
   - Title: `Discover our spaces and services.`
   - 4 Core Offerings: `Team Building`, `Event Spaces`, `Accomodation`, and `Hubbiz - Office Space`.
6. **Section 6: Directory ("World-Class Brands at Auto-City")** (`#brandsShowcase`)
   - Westfield London-inspired continuous marquee carousel with Set A & Set B tracks for 60fps infinite loop.
   - Dual-edge progressive blur curtains and centered "Browse Directory" CTA button (`#browseDirectoryBtn`).
7. **Section 7: App Download CTA** (`#appDownload`)
   - Friendly 3-column layout: light atmospheric sky backdrop, 3D CSS iPhone 16 Pro hardware chassis with 100% live HTML/CSS Auto-City app screen, real-time mouse parallax 3D tilt, and high-contrast QR app store download card.
8. **Footer: Enclosed Island Footer** (`#siteFooter`)
   - Orchid Security-inspired floating 32px rounded enclosure, official brandmark, destination navigation columns, 3x2 authentic government & tourism accreditation badge grid, and legal links.

*Pruned Sections*: "Join in the fun" (social reels), the Habitline quote section, and the Level.ai 4 pillars accordion have been fully retired from the homepage.

### 6. Prototype-First Principles (Core Mandate)
- **Scope Restriction**: This codebase is exclusively a visual and interactive front-end prototype.
- **Do Not Over-Engineer**: Avoid diving deep into back-end architectures, complex mock API layers, or deep business logic abstractions.
- **Top Execution Priorities**:
  1. **Visual Design**: High-end craft, crisp typography, clean token adherence, pixel-perfect alignment.
  2. **Animation & Motion**: Fluid micro-interactions, responsive hover/active tactile states, smooth scroll dynamics.
  3. **Layout & Cleanliness**: Resilient responsive layouts (mobile to desktop), neat modular components, and immediate presentation-readiness.
