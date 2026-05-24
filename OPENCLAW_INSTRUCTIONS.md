# Instrucciones para OpenClaw — Mission Control

Pega este prompt completo a otro bot (OpenClaw, Claude Code, Cursor, etc.) para que reproduzca este dashboard desde cero. Sigue la receta paso a paso — no improvises orden, ni nombres, ni paleta.

---

## Objetivo

Construir un dashboard llamado **Mission Control** con:
- Layout estilo **Linear** (sidebar fijo + main scrollable, tipografía limpia, mucha respiración)
- Branding **Lonely Octopus** en estética **pixel art retro** (8×8 SVG, sin imágenes externas)
- Stack: **Next.js 16** (App Router + Turbopack) + **React 19** + **TypeScript** + **Tailwind CSS v4**

## Reglas duras

1. **No uses imágenes externas.** Todo el pixel art se dibuja con `<rect>` dentro de `<svg viewBox="0 0 8 8">`.
2. **No uses librerías de iconos** (lucide, heroicons, etc.). Los iconos son grids 8×8 hechos a mano.
3. **No uses shadcn ni component libraries.** Solo Tailwind + componentes propios.
4. **No agregues backend.** Datos hardcodeados en el archivo de cada página por ahora.
5. **Respeta la paleta exacta** (ver tabla abajo). Nada de morados al azar.
6. **Tipografía mono** para todo lo que parezca dato/sistema (stats, status, %, versión, timestamps).
7. **No agregues atribución de IA** en commits ni en archivos (sin "Generated with…", sin Co-Authored-By).

## Paleta (CSS variables en `globals.css`)

```css
:root {
  --background: #ffffff;
  --surface:    #f5f5f5;
  --border:     #e5e5e5;
  --foreground: #1a1a2e;
  --muted:      #6b7280;
  --primary:    #6b21a8;
  --accent:     #a855f7;
  --highlight:  #e9d5ff;
}
```

Más utilidades en `globals.css`:

```css
.mono { font-family: var(--font-geist-mono), ui-monospace, monospace; }
.pixelated { image-rendering: pixelated; shape-rendering: crispEdges; }
.pixel-grid {
  background-image:
    linear-gradient(to right, rgba(107,33,168,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(107,33,168,0.04) 1px, transparent 1px);
  background-size: 8px 8px;
}
@keyframes blink { 0%,60%{opacity:1} 61%,100%{opacity:0.35} }
.blink { animation: blink 1.6s infinite; }
```

## Setup

```bash
npx create-next-app@latest mission-control \
  --typescript --tailwind --app --eslint --src-dir --turbopack \
  --import-alias "@/*" --use-npm --yes
cd mission-control
```

Dev server en puerto 3030:

```bash
npm run dev -- -p 3030
```

## Estructura de archivos a crear

```
src/
├── app/
│   ├── globals.css   ← agregar tokens + utilidades (no borrar lo existente)
│   ├── layout.tsx    ← envolver children en sidebar + main
│   └── page.tsx      ← pantalla Overview
└── components/
    ├── PixelOctopus.tsx
    ├── PixelIcon.tsx
    └── Sidebar.tsx   ← 'use client'
```

## Componentes — copiar tal cual

### `src/components/PixelOctopus.tsx`

```tsx
type Props = { size?: number; color?: string; className?: string };

export default function PixelOctopus({ size = 24, color = '#6b21a8', className = '' }: Props) {
  const grid = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,1,0],
    [0,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,0,1],
    [1,0,0,1,1,0,0,1],
    [0,1,0,0,0,0,1,0],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 8 8"
         className={`pixelated ${className}`} aria-label="octopus">
      {grid.map((row, y) => row.map((cell, x) =>
        cell ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} /> : null
      ))}
    </svg>
  );
}
```

### `src/components/PixelIcon.tsx`

Cinco iconos como grids 8×8: `home`, `agents`, `tasks`, `logs`, `settings`. Cada uno es un array `number[][]` donde `1`=píxel relleno, `0`=vacío. Render igual que PixelOctopus pero seleccionando el grid por `name`.

### `src/components/Sidebar.tsx` (Client Component)

- Ancho fijo `w-60`, `h-screen`, border derecho, `bg-white`
- Top: PixelOctopus 24px + "Lonely Octopus" / "Mission Control"
- Debajo: status `AGENT ONLINE` con PixelOctopus 10px verde parpadeante
- Nav: 5 botones (Overview, Agents, Tasks, Logs, Settings) con `useState` para el activo
- Activo: `bg-[color:var(--highlight)]` + texto `var(--primary)`
- Bottom: `v0.1.0 · build #0001` en mono

### `src/app/layout.tsx`

Wrapper: `<div class="flex min-h-screen"><Sidebar /><main class="flex-1 overflow-y-auto">{children}</main></div>`

### `src/app/page.tsx` (Overview)

Dos secciones:

1. **Header** con título "Overview", subtítulo `MISSION_CONTROL · ALL_SYSTEMS_NOMINAL` en mono, fondo `pixel-grid`, botones "Refresh" (outline) y "New mission" (primary)
2. **Stats**: grid 4 cols con cards (Active agents, Tasks in flight, Avg latency, Uptime)
3. **Agents table**: header con PixelOctopus + "Agents" + total, tabla con columnas Agent / Status / Tasks / Load
   - Status: dot 2×2 (verde/amarillo/gris, verde parpadea) + texto mono uppercase
   - Load: barra de 16 celdas pixeladas (`var(--primary)` los primeros 2/3, `var(--accent)` el último 1/3, `var(--border)` vacías) + porcentaje

## Datos mock

```ts
const AGENTS = [
  { name: 'Vega',       status: 'online',  tasks: 7, load: 62 },
  { name: 'Polaris',    status: 'idle',    tasks: 2, load: 18 },
  { name: 'Orion',      status: 'online',  tasks: 4, load: 41 },
  { name: 'Cassiopeia', status: 'offline', tasks: 0, load: 0  },
];

const STATS = [
  { label: 'Active agents',   value: '03',     hint: '+1 today' },
  { label: 'Tasks in flight', value: '13',     hint: '4 queued' },
  { label: 'Avg latency',     value: '184',    hint: 'ms · p50' },
  { label: 'Uptime',          value: '99.97%', hint: '30d'      },
];
```

## Detalles de estilo (no negociables)

- Tamaños de texto chicos: títulos `text-[13px]–text-[18px]`, labels `text-[10px]` mono uppercase tracking-wider
- Bordes finos `border-[color:var(--border)]`, `rounded-md`
- Cards de stat: hover cambia border a `--accent`
- Filas de tabla: hover `bg-[color:var(--surface)]`
- Header de página y header del card "Agents" usan `pixel-grid` de fondo

## Verificación

Cuando termines:

```bash
npm run build   # debe pasar sin warnings
npm run dev -- -p 3030
```

Abre `http://localhost:3030` y confirma:
- ✦ Sidebar a la izquierda con pulpo morado
- ✦ Dot verde parpadeando junto a "AGENT ONLINE"
- ✦ 4 cards de stats arriba, números en mono
- ✦ Tabla de 4 agentes con barras de carga pixeladas
- ✦ Cualquier botón de nav cambia el activo (texto morado + fondo lila claro)

## Próximas pantallas (no implementar todavía)

`Agents`, `Tasks`, `Logs`, `Settings` — agregar una por una bajo `src/app/<slug>/page.tsx` siguiendo el mismo estilo y conectar el `active` del sidebar con `usePathname()` cuando se haga el routing real.
