# Detersur — Tienda online

Demo funcional de e-commerce para una distribuidora de productos químicos y de
limpieza de Zona Sur (GBA). Catálogo, carrito, checkout y seguimiento de pedido
funcionando de punta a punta, sin backend.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # bundle de producción en dist/
npm run lint     # chequeo de tipos (tsc --noEmit)
```

## Stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 4 · Material Symbols.
Sin dependencias de runtime más allá de React.

## Cómo está organizado

```
src/
  data/        catálogo (24 productos) y contenido editorial
  lib/         pricing, formato de pesos, localStorage
  hooks/       routing por hash, scroll reveal, contadores, media queries
  context/     StoreContext: carrito, favoritos, toasts, pedido
  components/  header, footer, carruseles, tarjetas, drawer, modales
  views/       inicio, catálogo, producto, carrito, checkout, confirmación
```

### Routing

La vista vive en el hash de la URL, así que el botón atrás del navegador
funciona y cada pantalla se puede linkear:

| URL | Pantalla |
|---|---|
| `#/inicio` | Home |
| `#/catalogo?cat=sueltos&q=lavandina` | Catálogo con filtros aplicados |
| `#/producto/lavandina-55g` | Ficha de producto |
| `#/carrito` · `#/checkout` · `#/confirmacion` | Flujo de compra |

### Reglas comerciales

Toda la matemática vive en [`src/lib/pricing.ts`](src/lib/pricing.ts), que es la
única fuente de verdad para el drawer, el carrito, el checkout y el comprobante.
Los descuentos se acumulan en este orden:

1. **Escalón mayorista** sobre el subtotal — +10 unidades 15%, +30 unidades 25%
2. **Plan Canje** — $430 de crédito por envase retornable declarado
3. **Medio de pago** — 10% extra por transferencia o efectivo
4. **Envío** — gratis desde $25.000; si no, express $3.200 / programado $1.900 / retiro $0

El IVA (21%) se muestra como monto contenido, siguiendo la convención argentina
de precios finales. Los parámetros están en [`src/data/content.ts`](src/data/content.ts).

### Persistencia

Carrito, favoritos, búsquedas recientes, dirección y último pedido se guardan en
`localStorage`. Los accesos están envueltos en try/catch
([`src/lib/storage.ts`](src/lib/storage.ts)) porque el almacenamiento falla en
ventanas privadas; si no está disponible, la app sigue funcionando en memoria.

El carrito se guarda por id de producto y se rehidrata contra el catálogo, de
modo que un cambio de precio siempre le gana a un carrito viejo guardado.

## Animaciones

Los keyframes y las utilidades `animate-*` están en
[`src/index.css`](src/index.css). Hay tres mecanismos:

- **Entrada al hacer scroll** — `<Reveal>` usa IntersectionObserver + una
  transición CSS, así que no cuesta nada mientras está quieto.
- **Decorativas en bucle** — burbujas, flotación, marquee, ondas, brillo.
- **De estado** — toasts, badges, barras de progreso, contadores, el check
  dibujado del pedido confirmado.

Todo respeta `prefers-reduced-motion`: con la preferencia activada, el
movimiento decorativo se apaga y sólo quedan los cambios de opacidad.

## Carruseles

Tres componentes reutilizables en [`src/components/Carousel.tsx`](src/components/Carousel.tsx):

- **`ScrollCarousel`** — scroll-snap con flechas, arrastre con el mouse, swipe,
  teclado, dots y barra de progreso. Se usa en los rieles de productos.
- **`SlideCarousel`** — un slide por vez, con autoplay que se pausa al pasar el
  mouse, al enfocar, al salir del viewport y al ocultarse la pestaña. Variantes
  de deslizamiento y de fundido. Se usa en el hero y en los testimonios.
- **`Marquee`** — cinta infinita que se pausa al hover.

## Notas

- Las imágenes de producto se sirven desde un CDN remoto cuyos enlaces pueden
  expirar. `SmartImage` detecta la falla y dibuja un glifo de marca en lugar del
  ícono de imagen rota.
- No hay backend: el pago y el seguimiento están simulados con temporizadores.
- Para probar el checkout rápido hay dos atajos: **"Cargar pedido de ejemplo"**
  en el carrito vacío y **"Completar con datos de ejemplo"** en el checkout.
