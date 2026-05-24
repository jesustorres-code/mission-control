# Mission Control

Dashboard estilo Linear con branding pixel-art de Lonely Octopus para monitorear agentes y misiones.

Built with **Next.js 16** (App Router + Turbopack), **React 19**, **TypeScript** y **Tailwind CSS v4**.

## Preview

- Sidebar con marca Lonely Octopus (pulpo pixel-art SVG 8×8)
- Indicador `AGENT ONLINE` con dot parpadeante
- Pantalla *Overview*: 4 stat cards + tabla de agentes con barras de carga pixeladas
- Iconografía: home / agents / tasks / logs / settings dibujados como grids 8×8

## Paleta

| Token | Hex |
|---|---|
| `--primary` | `#6B21A8` |
| `--accent` | `#A855F7` |
| `--highlight` | `#E9D5FF` |
| `--foreground` | `#1A1A2E` |

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000
# o en otro puerto:
npm run dev -- -p 3030
```

## Build

```bash
npm run build
npm start
```

## Estructura

```
src/
├── app/
│   ├── globals.css       # tokens + utilidades pixel-grid/blink
│   ├── layout.tsx        # sidebar + main
│   └── page.tsx          # Overview
└── components/
    ├── PixelOctopus.tsx  # marca 8×8
    ├── PixelIcon.tsx     # iconos nav 8×8
    └── Sidebar.tsx       # nav + estado
```

## Pantallas planeadas

- [x] Overview
- [ ] Agents
- [ ] Tasks
- [ ] Logs
- [ ] Settings

## Replicar con OpenClaw

Ver [`OPENCLAW_INSTRUCTIONS.md`](./OPENCLAW_INSTRUCTIONS.md) para el prompt completo que reproduce este dashboard en otro bot.
