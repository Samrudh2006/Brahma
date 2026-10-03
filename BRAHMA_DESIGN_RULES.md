# BRAHMA Design System — Canonical Rules
## The Single Source of Truth for Every Visual, UX & Motion Decision

> **Rule #0**: If it's not in this document, ask before implementing.
> This document is the constitution. No exceptions.

---

## 1. COLORS

### Primary Palette (Obsidian Dark — Default)
| Token | Value | Usage |
|---|---|---|
| `--bg-dark-master` | `#06080c` | App root background |
| `--bg-dark-surface` | `#0a0e17` | Cards, panels |
| `--bg-dark-card` | `rgba(14, 20, 32, 0.75)` | Glass cards |
| `--bg-dark-sidebar` | `rgba(8, 12, 20, 0.92)` | Sidebar |
| `--bg-glass-border` | `rgba(212, 175, 55, 0.22)` | Card borders |
| `--accent-gold-bright` | `#f5d77f` | Primary text accent |
| `--accent-gold` | `#d4af37` | Borders, icons |
| `--accent-gold-deep` | `#b38e2d` | Shadows, glows |
| `--accent-gold-glow` | `rgba(212, 175, 55, 0.25)` | Box shadows |
| `--text-primary` | `#f8f6f0` | Body text |
| `--text-secondary` | `#c5c9d6` | Secondary text |
| `--text-muted` | `#7e879e` | Placeholder, captions |

### Alternate Teal Theme
| Token | Value |
|---|---|
| `--bg-dark-master` | `#041416` |
| `--bg-dark-surface` | `#081e22` |
| `--accent-gold` | `#f1c40f` |
| `--accent-gold-glow` | `rgba(43, 182, 189, 0.35)` |

### Identity Accent Colors (Dynamic via `--identity-accent`)
| Identity | Accent Color |
|---|---|
| BRAHMA | `#d4af37` (gold) |
| SARASWATI | `#e5c07b` (warm gold) |
| GANESHA | `#e5a04b` (amber) |
| VISHWAKARMA | `#4ca3dd` (steel blue) |
| HANUMAN | `#e05638` (saffron red) |
| SHIVA | `#5eb3c0` (teal) |
| DURGA | `#d64161` (crimson) |
| LAKSHMI | `#f1b82d` (bright gold) |
| KRISHNA | `#3a80db` (sapphire) |
| AGNI | `#f36f21` (fire orange) |
| VARUNA | `#2bb6bd` (ocean teal) |
| SURYA | `#faa61a` (sunlight amber) |
| KALI | `#9b51e0` (deep violet) |

### Action Card Colors
| Card | Background | Border | Icon |
|---|---|---|---|
| Start a task | `rgba(88, 40, 160, 0.35)` | `rgba(140, 80, 220, 0.5)` | `#b88df8` |
| Search & research | `rgba(20, 60, 140, 0.38)` | `rgba(60, 120, 220, 0.5)` | `#7ab3f8` |
| Create something | `rgba(18, 100, 90, 0.38)` | `rgba(40, 180, 160, 0.5)` | `#5ee8cc` |
| Plan & organize | `rgba(110, 70, 10, 0.38)` | `rgba(212, 140, 30, 0.5)` | `#f5c842` |

---

## 2. TYPOGRAPHY

| Font | Variable | Usage |
|---|---|---|
| Cinzel | `--font-display` | Identity names, major titles, modal headers |
| Playfair Display | `--font-serif` | Editorial subheadings, hero text |
| Inter | `--font-sans` | All UI body text, labels, pills, buttons |
| JetBrains Mono | `--font-mono` | Code blocks, terminal output, JSON |

### Scale
| Size | Value | Usage |
|---|---|---|
| xs | `0.7rem` | Captions, domain text, timestamps |
| sm | `0.8rem` | Badge text, pill labels |
| base | `0.95rem` | Body text, chat bubbles |
| lg | `1.05rem` | Prompt textarea |
| xl | `1.35rem` | Modal titles |
| 2xl | `1.8rem` | Section headings |
| 3xl | `2.6rem` | Hero title "How can I help?" |

---

## 3. SPACING SCALE
Uses 4px base unit. Always use multiples.
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`

---

## 4. BORDER RADIUS
| Token | Value | Usage |
|---|---|---|
| `--r-sm` | `8px` | Small elements (pills, badges) |
| `--r-md` | `14px` | Cards, identity cards |
| `--r-lg` | `18px` | Action cards |
| `--r-xl` | `24px` | Modals, prompt bar |
| `--r-full` | `50%` | Portrait circles |
| `--r-pill` | `9999px` | Pills, nav items |

---

## 5. SHADOWS
| Token | Value | Usage |
|---|---|---|
| Card shadow | `0 4px 18px rgba(0,0,0,0.45)` | Default card |
| Gold glow | `0 0 20px rgba(212,175,55,0.35)` | Highlighted element |
| Modal shadow | `0 20px 60px rgba(0,0,0,0.9)` | Modals |
| Identity accent glow | `0 0 15px var(--identity-accent)40` | Active identity element |

---

## 6. ANIMATION DURATIONS & EASING
| Name | Duration | Easing | Usage |
|---|---|---|---|
| Micro interaction | `150ms` | `ease` | Button hover states |
| Transition | `250ms` | `cubic-bezier(0.4,0,0.2,1)` | Card hover, sidebar |
| Spring bounce | `280ms` | `cubic-bezier(0.34,1.56,0.64,1)` | Cards, action items |
| Slow reveal | `500ms` | `ease-in-out` | Page transitions |
| Boot animation | `600ms` | `ease` | App entry |

### Named Keyframes (all defined in index.css)
- `cosmicBreathing` — background aura pulse (8s)
- `spinOrbit` — portrait orbit ring (60s)
- `glowBreathe` — portrait halo glow (4s)
- `floatUp` — element entry (500ms)
- `fadeSlideIn` — modal/panel slide in (300ms)
- `shimmerSweep` — card hover shimmer (550ms)
- `micPulse` — voice recording button (1.2s)
- `bootSpin` — boot loader ring (1s)
- `spin` — generic spinner (1.5s)

---

## 7. Z-INDEX LAYERS
| Layer | Value | Usage |
|---|---|---|
| Background | `0` | LivingBackground canvas |
| Content | `1` | Main workspace |
| Sidebar | `2` | Sidebar panel |
| Header | `5` | Top header |
| Prompt bar | `10` | Prompt input + cards |
| Dropdowns | `50` | Action popover |
| Modals | `1000` | Identity, Settings, Command modals |
| Boot loader | `99999` | Initial boot screen |

---

## 8. COMPONENT RULES

### Portrait Circle
- Size: `148×148px` in hero, `64×64px` in identity modal, `40×40px` in chat, `26×26px` in header pill, `34×34px` in sidebar
- Border: `2.5px solid var(--accent-gold)` (hero), `2px` (modal), `1.5px` (chat/header)
- `border-radius: 50%` always
- Orbit ring: `::before` pseudoelement, dashed, spins 60s
- Glow halo: `::after` pseudoelement, breathes 4s

### Action Cards
- NEVER make them all the same color
- Purple → task, Blue → research, Teal → create, Amber → plan
- Column layout: icon-wrapper + title stacked, arrow at bottom-right
- Shimmer sweep on hover

### Identity Modal
- 4-column grid on desktop, 3 on tablet, 2 on mobile
- Center-aligned column layout per card
- Selected card has gold checkmark badge on portrait
- Filter search bar at top

### Prompt Bar
- max-width: `760px`
- Gold border (1.5px), thicker glow on focus
- Pills: `+`, Attach, Search, Code, Think
- Right side: Mic + Send button

---

## 9. WHAT WE NEVER DO
- ❌ No redesigning deity logos or portraits
- ❌ No cyberpunk or gaming aesthetics  
- ❌ No hardcoded colors in components (always use CSS variables)
- ❌ No magic numbers for spacing (use multiples of 4px)
- ❌ No `z-index: 9999` (use the z-index table above)
- ❌ No `!important` except in absolute emergencies
- ❌ No inline styles except for dynamic values (identity accent color)
- ❌ No placeholder Lorem Ipsum — every text must be real BRAHMA copy
- ❌ No auto-generating deity artwork — use only supplied assets
