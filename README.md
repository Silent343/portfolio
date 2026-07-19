# Portafolio · Gabriel

Landing page migrada de HTML/JS vanilla a **React + Vite + TypeScript + Tailwind**.

## Correr en local
```bash
npm install
npm run dev
```
Abre la URL que muestra Vite (por defecto http://localhost:5173).

## Build de producción
```bash
npm run build      # genera /dist
npm run preview    # sirve el build localmente
```

## Novedades de esta versión
- Migración completa a componentes React (nav, hero, about, proyectos, stack, servicios, contacto, footer).
- **Contacto:** se quitó el formulario. Ahora tiene el robot 3D de **Spline** (donde iba el form) y el shader **GLSL de olas** como fondo animado.
- **Proyectos:** rediseño con tarjetas numeradas (número, flecha, placeholder de imagen y tags).
- Se conservan el gato 3D del hero (Three.js), el toggle ES/EN y las 5 paletas de color.

## Estructura
- `src/components/ui/` — componentes shadcn/integrados: `card`, `spotlight`, `splite` (Spline), `glsl-hills`.
- `src/components/` — secciones de la página.
- `src/data/` — textos ES/EN, proyectos, stack, paletas.
- `src/context/AppContext.tsx` — idioma + paleta.
- `public/cat.glb`, `public/cat-scene.js` — modelo y animación del gato 3D.
- `legacy/index-bundle.html` — respaldo del bundle vanilla original.
