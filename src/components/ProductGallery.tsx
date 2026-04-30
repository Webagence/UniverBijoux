import { useEffect, useRef, useState, useCallback } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight, Plus, Minus, Maximize2 } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
}

/**
 * Galerie produit avec zoom-loupe au survol (desktop)
 * et lightbox plein écran avancé : zoom molette, pinch tactile, pan, double-tap,
 * navigation prev/next, miniatures, fermeture ESC.
 */
const ProductGallery = ({ images, alt }: Props) => {
  const [active, setActive] = useState(0);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [lightbox, setLightbox] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const openLightbox = () => setLightbox(true);

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden bg-cream aspect-square cursor-zoom-in group"
        onMouseEnter={() => setHoverZoom(true)}
        onMouseLeave={() => setHoverZoom(false)}
        onMouseMove={handleMove}
        onClick={openLightbox}
      >
        <img
          src={images[active]}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 hidden md:block"
          style={{
            transform: hoverZoom ? "scale(2)" : "scale(1)",
            transformOrigin: origin,
          }}
        />
        <img
          src={images[active]}
          alt={alt}
          className="w-full h-full object-cover md:hidden"
        />
        <div className="absolute bottom-4 right-4 bg-ivory/90 backdrop-blur-sm p-2 text-bordeaux md:opacity-0 md:group-hover:opacity-100 transition-smooth">
          <Maximize2 className="h-4 w-4" />
        </div>
        <div className="absolute top-4 left-4 bg-ivory/90 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-luxe uppercase text-bordeaux md:opacity-0 md:group-hover:opacity-100 transition-smooth">
          <span className="hidden md:inline">Survoler pour zoomer · Cliquer pour plein écran</span>
          <span className="md:hidden">Toucher pour agrandir</span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden bg-cream border-2 transition-smooth ${
                active === i ? "border-gold" : "border-transparent hover:border-gold/40"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          images={images}
          alt={alt}
          index={active}
          setIndex={setActive}
          onClose={() => setLightbox(false)}
        />
      )}
    </div>
  );
};

/* ======================================================================== */

interface LBProps {
  images: string[];
  alt: string;
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;

const Lightbox = ({ images, alt, index, setIndex, onClose }: LBProps) => {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const lastTap = useRef<number>(0);

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  // Reset on image change
  useEffect(() => {
    reset();
  }, [index, reset]);

  // Body scroll lock + ESC + arrows
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((index - 1 + images.length) % images.length);
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  const clampOffset = (s: number, x: number, y: number) => {
    const c = containerRef.current;
    const img = imgRef.current;
    if (!c || !img) return { x, y };
    const cw = c.clientWidth;
    const ch = c.clientHeight;
    const iw = img.clientWidth * s;
    const ih = img.clientHeight * s;
    const maxX = Math.max(0, (iw - cw) / 2);
    const maxY = Math.max(0, (ih - ch) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const applyScale = (next: number, focal?: { x: number; y: number }) => {
    const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    if (focal && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Maintain focal point under cursor
      const dx = focal.x - cx - tx;
      const dy = focal.y - cy - ty;
      const k = ns / scale;
      const newTx = focal.x - cx - dx * k;
      const newTy = focal.y - cy - dy * k;
      const cl = clampOffset(ns, newTx, newTy);
      setTx(cl.x);
      setTy(cl.y);
    } else {
      const cl = clampOffset(ns, tx, ty);
      setTx(cl.x);
      setTy(cl.y);
    }
    setScale(ns);
  };

  const zoomIn = () => applyScale(+(scale + 0.5).toFixed(2));
  const zoomOut = () => {
    const ns = Math.max(MIN_SCALE, +(scale - 0.5).toFixed(2));
    if (ns === 1) reset();
    else applyScale(ns);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    applyScale(scale * (1 + delta), { x: e.clientX, y: e.clientY });
  };

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    dragStart.current = { x: e.clientX, y: e.clientY, tx, ty };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const cl = clampOffset(
      scale,
      dragStart.current.tx + (e.clientX - dragStart.current.x),
      dragStart.current.ty + (e.clientY - dragStart.current.y)
    );
    setTx(cl.x);
    setTy(cl.y);
  };
  const onMouseUp = () => {
    dragStart.current = null;
  };

  // Touch: drag + pinch + double-tap
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart.current = { dist: Math.hypot(dx, dy), scale };
    } else if (e.touches.length === 1) {
      // double tap detection
      const now = Date.now();
      if (now - lastTap.current < 300) {
        if (scale > 1) reset();
        else
          applyScale(2.5, {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          });
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
      if (scale > 1) {
        dragStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          tx,
          ty,
        };
      }
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchStart.current.dist;
      const focal = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      applyScale(pinchStart.current.scale * ratio, focal);
    } else if (e.touches.length === 1 && dragStart.current) {
      e.preventDefault();
      const cl = clampOffset(
        scale,
        dragStart.current.tx + (e.touches[0].clientX - dragStart.current.x),
        dragStart.current.ty + (e.touches[0].clientY - dragStart.current.y)
      );
      setTx(cl.x);
      setTy(cl.y);
    }
  };
  const onTouchEnd = () => {
    pinchStart.current = null;
    dragStart.current = null;
  };

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[100] bg-bordeaux/95 backdrop-blur-sm flex flex-col select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 text-ivory shrink-0">
        <div className="text-[11px] tracking-luxe uppercase opacity-80">
          {index + 1} / {images.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            aria-label="Dézoomer"
            disabled={scale <= MIN_SCALE}
            className="h-9 w-9 flex items-center justify-center border border-ivory/40 hover:bg-ivory hover:text-bordeaux transition-smooth disabled:opacity-30"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="h-9 px-3 hidden sm:flex items-center border border-ivory/40 text-[11px] tracking-luxe min-w-[64px] justify-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            aria-label="Zoomer"
            disabled={scale >= MAX_SCALE}
            className="h-9 w-9 flex items-center justify-center border border-ivory/40 hover:bg-ivory hover:text-bordeaux transition-smooth disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={reset}
            className="h-9 px-3 hidden sm:flex items-center border border-ivory/40 hover:bg-ivory hover:text-bordeaux transition-smooth text-[11px] tracking-luxe uppercase"
          >
            Réinitialiser
          </button>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="h-9 w-9 flex items-center justify-center border border-ivory/40 hover:bg-ivory hover:text-bordeaux transition-smooth ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center touch-none"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          // Click on backdrop (not on image) closes — desktop only
          if (e.target === e.currentTarget && scale === 1) onClose();
        }}
      >
        <img
          ref={imgRef}
          src={images[index]}
          alt={alt}
          draggable={false}
          className="max-w-[92vw] max-h-full object-contain will-change-transform"
          style={{
            transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
            transition: dragStart.current || pinchStart.current ? "none" : "transform 0.2s ease-out",
            cursor: scale > 1 ? (dragStart.current ? "grabbing" : "grab") : "zoom-in",
          }}
          onDoubleClick={(e) => {
            if (scale > 1) reset();
            else applyScale(2.5, { x: e.clientX, y: e.clientY });
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Précédent"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 flex items-center justify-center bg-ivory/10 hover:bg-ivory text-ivory hover:text-bordeaux border border-ivory/40 transition-smooth"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Suivant"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 flex items-center justify-center bg-ivory/10 hover:bg-ivory text-ivory hover:text-bordeaux border border-ivory/40 transition-smooth"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="shrink-0 px-4 py-3 md:py-4 flex items-center justify-center gap-2 md:gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`shrink-0 h-14 w-14 md:h-16 md:w-16 overflow-hidden border-2 transition-smooth ${
                i === index ? "border-gold" : "border-ivory/30 hover:border-ivory/70"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-ivory/50 text-[10px] tracking-luxe uppercase hidden md:block pointer-events-none">
        Molette pour zoomer · Glisser pour déplacer · Échap pour fermer
      </div>
    </div>
  );
};

export default ProductGallery;
