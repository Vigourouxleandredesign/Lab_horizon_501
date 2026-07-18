import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, animate } from "motion/react";
import {
  Search,
  ChevronRight,
  ArrowRight,
  FlaskConical,
  BookOpen,
  Users,
  Globe2,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";
import imgRectangle1 from "figma:asset/96c04909bf783ce70133c3ad592920568158fbad.png";
import imgRectangle4 from "figma:asset/c64b1609c2182a399a2d4d04ebf791b7976bbf4f.png";
import imgRectangle5 from "figma:asset/a626e8c6e783012c9c008477392ddd30c47c6822.png";
import imgRectangle3 from "figma:asset/d2c43d3dcead8471ee456ce266c6d3e66f140f77.png";
import pilluleBiologie from "../../imports/Pillule_Biologie.png";
import heroBiologie from "../../imports/Hero_Biologie.png";
import { researchers, stats } from "./data/mockData";
import svgPaths from "../../imports/svg-lobuut7rx9";

const categorySlides = [
  { id: 1, name: "Biologie", image: imgRectangle1, color: "#5B8EB8", tag: "24 publications" },
  { id: 2, name: "Chimie", image: imgRectangle5, color: "#E8A135", tag: "18 publications" },
  { id: 3, name: "Droit", image: imgRectangle3, color: "#032f58", tag: "12 publications" },
  { id: 4, name: "Physique", image: imgRectangle4, color: "#29359B", tag: "9 publications" },
  { id: 5, name: "Océanographie", image: imgRectangle1, color: "#007A8C", tag: "21 publications" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Infinite carousel ────────────────────────────────────────────────
  const SPACING = 168;
  const N = categorySlides.length;
  const getCat = (vi: number) => categorySlides[((vi % N) + N) % N];
  const [centerIndex, setCenterIndex] = useState(0);
  const centerIndexRef = useRef(0);
  useEffect(() => { centerIndexRef.current = centerIndex; }, [centerIndex]);

  const activeCatIndex = ((centerIndex % N) + N) % N;

  const dragMV = useMotionValue(0);
  const [dragDisplay, setDragDisplay] = useState(0);
  const isAnimRef = useRef(false);
  const ptrRef = useRef<{ x: number; startVal: number } | null>(null);

  useEffect(() => dragMV.on("change", setDragDisplay), [dragMV]);

  // Snap using ref to avoid stale closures in document listeners
  const snapToVI = (targetVI: number) => {
    if (isAnimRef.current) return;
    isAnimRef.current = true;
    const ci = centerIndexRef.current;
    animate(dragMV, -(targetVI - ci) * SPACING, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: () => {
        dragMV.set(0);
        setCenterIndex(targetVI);
        isAnimRef.current = false;
      },
    });
  };

  const navToCat = (catIdx: number) => {
    let diff = catIdx - ((centerIndexRef.current % N) + N) % N;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    snapToVI(centerIndexRef.current + diff);
  };

  // Document-level drag listeners — no setPointerCapture so child onClick fires normally
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!ptrRef.current) return;
      dragMV.set(ptrRef.current.startVal + (e.clientX - ptrRef.current.x));
    };
    const handleUp = (e: PointerEvent) => {
      if (!ptrRef.current) return;
      const off = dragMV.get();
      const moved = Math.abs(e.clientX - ptrRef.current.x);
      ptrRef.current = null;
      if (moved < 8) return; // simple clic → laisser onClick agir
      if (isAnimRef.current) return;
      isAnimRef.current = true;
      const ci = centerIndexRef.current;
      const targetVI = ci - Math.round(off / SPACING);
      animate(dragMV, -(targetVI - ci) * SPACING, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          dragMV.set(0);
          setCenterIndex(targetVI);
          isAnimRef.current = false;
        },
      });
    };
    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };
  }, []); // eslint-disable-line — intentional: all mutable values via refs

  // ── Zoom : séquence impérative async/await ─────────────────────────
  const [zoomActive, setZoomActive]   = useState(false);
  const [zoomTarget, setZoomTarget]   = useState("");
  const [zoomInitStyle, setZoomInitStyle] = useState<React.CSSProperties>({});
  const zoomPillRef   = useRef<HTMLImageElement>(null);
  const zoomHeroRef   = useRef<HTMLImageElement>(null);
  const isZoomingRef  = useRef(false);
  const centerPillRef = useRef<HTMLImageElement>(null);

  // ── Préchargement anticipé des images ─────────────────────────────
  useEffect(() => {
    [pilluleBiologie, heroBiologie].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const handleCenterClick = async (catName: string) => {
    if (isAnimRef.current || isZoomingRef.current) return;
    const pillEl = centerPillRef.current;
    // Attendre que l'image soit chargée (naturalWidth = 0 si pas encore chargée)
    if (!pillEl?.complete || pillEl.naturalWidth === 0) return;

    const rect = pillEl.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;

    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    // Centre de la pillule dans le viewport
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    // Scale pour que la pillule couvre 100 % du viewport
    const scaleToFill = Math.max(vpW / rect.width, vpH / rect.height) * 1.05;
    // Translation pour amener le centre de la pillule au centre du viewport
    const tx = vpW / 2 - cx;
    const ty = vpH / 2 - cy;

    isZoomingRef.current = true;
    setZoomTarget(catName);
    // L'overlay pillule démarre aux coordonnées EXACTES de la pillule du carousel
    setZoomInitStyle({
      position:   "fixed",
      left:       rect.left,
      top:        rect.top,
      width:      rect.width,
      height:     rect.height,
      objectFit:  "cover",
      zIndex:     9997,
      pointerEvents: "none",
      willChange: "transform",
    });
    setZoomActive(true);

    // Double RAF : laisser le DOM peindre l'overlay avant d'animer
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const pillOverlay = zoomPillRef.current;
    const heroOverlay = zoomHeroRef.current;
    if (!pillOverlay || !heroOverlay) {
      isZoomingRef.current = false;
      setZoomActive(false);
      return;
    }

    // Phase 1 — Pillule zoome de sa position carousel vers le plein écran
    await animate(
      pillOverlay,
      { x: [0, tx], y: [0, ty], scale: [1, scaleToFill] },
      { duration: 0.72, ease: [0.4, 0, 0.2, 1] }
    );

    // Phase 2 — Hero image fondue par-dessus
    await animate(
      heroOverlay,
      { opacity: [0, 1] },
      { duration: 0.42, ease: "easeInOut" }
    );

    // Navigation — séquence terminée
    navigate(`/recherche?category=${catName}`, { state: { fromZoom: true } });
    isZoomingRef.current = false;
    setZoomActive(false);
  };
  // ─────────────────────────────────────────────────────────────────────

  // useScroll sur la fenêtre (pas un conteneur custom) — évite l'avertissement position non-statique
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -60]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div ref={containerRef} className="overflow-x-hidden relative">

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY }}
        className="relative px-5 pt-10 pb-6 overflow-hidden"
      >
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full blur-3xl opacity-60"
            style={{ background: "radial-gradient(circle, rgba(91,142,184,0.35) 0%, transparent 70%)" }} />
          <div className="absolute top-10 -right-20 w-80 h-80 rounded-full blur-3xl opacity-50"
            style={{ background: "radial-gradient(circle, rgba(232,161,53,0.25) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, rgba(41,53,155,0.2) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5B8EB8]/25 mb-5"
              style={{
                background: "rgba(91,142,184,0.1)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Globe2 className="w-3.5 h-3.5 text-[#5B8EB8]" />
              <p style={{ fontSize: "0.75rem", color: "#5B8EB8", fontWeight: 600 }}>
                Plateforme de recherche scientifique
              </p>
            </div>

            <h1
              className="text-[#1A2340] mb-4 max-w-lg mx-auto"
              style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2 }}
            >
              Connectez-vous avec la recherche calédonienne
            </h1>
            <p className="text-[#4A5280] max-w-md mx-auto" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
              Découvrez des publications, explorez des domaines de recherche et collaborez avec des experts.
            </p>

            {/* Folder hint */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full border border-[#E8A135]/30"
              style={{
                background: "linear-gradient(135deg, rgba(244,234,214,0.7) 0%, rgba(232,161,53,0.12) 100%)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles className="w-3 h-3 text-[#E8A135]" />
              <span style={{ fontSize: "0.72rem", color: "#6B5530", fontWeight: 600 }}>
                Chercheur ? Dépliez le dossier en haut de l'écran ↑
              </span>
            </motion.div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto"
          >
            {[
              { label: "Chercheurs", value: stats.researchers, Icon: Users, color: "#5B8EB8", gradFrom: "rgba(91,142,184,0.18)", gradTo: "rgba(91,142,184,0.06)" },
              { label: "Publications", value: stats.publications, Icon: BookOpen, color: "#E8A135", gradFrom: "rgba(232,161,53,0.18)", gradTo: "rgba(232,161,53,0.06)" },
              { label: "Catégories", value: stats.categories, Icon: FlaskConical, color: "#007A8C", gradFrom: "rgba(0,122,140,0.18)", gradTo: "rgba(0,122,140,0.06)" },
              { label: "Institutions", value: stats.institutions, Icon: Globe2, color: "#29359B", gradFrom: "rgba(41,53,155,0.18)", gradTo: "rgba(41,53,155,0.06)" },
            ].map(({ label, value, Icon, color, gradFrom, gradTo }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl p-4 border border-white/60 flex flex-col items-start gap-2"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 4px 24px rgba(2,34,63,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-[#1A2340]" style={{ fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 }}>
                    {value}+
                  </p>
                  <p className="text-[#7B82A8]" style={{ fontSize: "0.7rem" }}>
                    {label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="px-5 py-8"
      >
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch}>
            <div
              className="relative flex items-center rounded-full border border-white/70 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(2,34,63,0.12), 0 1px 0 rgba(255,255,255,1) inset",
              }}
            >
              <div className="pl-4 pr-2">
                <div
                  className="hidden md:flex w-9 h-9 rounded-full items-center justify-center border border-white/50"
                  style={{ background: "linear-gradient(135deg, #F0F2FA 0%, #E8ECF5 100%)" }}
                >
                  <svg fill="none" viewBox="0 0 17.9679 18" className="w-4 h-4">
                    <path d={svgPaths.p39c60100} stroke="#5F5F5F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d={svgPaths.p3a85fa00} stroke="#5F5F5F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un thème ou un sujet…"
                className="flex-1 pr-4 py-3.5 bg-transparent focus:outline-none text-[#1A2340] placeholder:text-[#9586a8]"
                style={{ fontSize: "0.9rem" }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mr-2 text-white rounded-full px-3 py-2 md:px-5 text-sm flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #02223F 0%, #29359B 100%)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 16px rgba(41,53,155,0.35)",
                }}
              >
                {/* Loupe sur mobile, texte sur desktop */}
                <Search className="w-4 h-4 md:hidden" />
                <span className="hidden md:inline">Rechercher</span>
              </motion.button>
            </div>
          </form>
          <div className="flex gap-3 mt-3 px-1">
            <button
              onClick={() => navigate("/recherche?filtres=1")}
              className="text-xs text-[#5B8EB8] hover:text-[#29359B] transition-colors"
            >
              Filtres avancés (dispo · catégorie · institution)
            </button>
          </div>
        </div>
      </motion.section>

      {/* Categories Carousel */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="py-6"
      >
        <div className="px-5 mb-6 flex items-center justify-between max-w-screen-xl mx-auto">
          <h2 className="text-[#1A2340]" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Explorez par domaine
          </h2>
          <button
            onClick={() => navigate("/recherche")}
            className="flex items-center gap-1 text-[#5B8EB8] hover:text-[#29359B] transition-colors text-sm"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Infinite coverflow */}
        <div
          className="relative w-full overflow-hidden select-none"
          style={{ height: 390, touchAction: "none", cursor: "grab" }}
          onPointerDown={(e) => {
            if (isAnimRef.current) return;
            ptrRef.current = { x: e.clientX, startVal: dragMV.get() };
            // NO setPointerCapture — child onClick must remain reachable
          }}
        >
          {([-3, -2, -1, 0, 1, 2, 3] as const).map((slotOffset) => {
            const vi = centerIndex + slotOffset;
            const cat = getCat(vi);
            const vx = slotOffset * SPACING + dragDisplay;
            const absD = Math.min(Math.abs(vx) / SPACING, 3.5);
            const scale = Math.max(0.36, 1 - absD * 0.26);
            const opacity = Math.max(0, 1 - absD * 0.42);
            const zIdx = Math.round(30 - absD * 8);
            const isCenter = absD < 0.35;

            return (
              <div
                key={slotOffset}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  transform: `translateX(calc(-50% + ${vx}px)) scale(${scale})`,
                  transformOrigin: "center top",
                  opacity,
                  zIndex: zIdx,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  willChange: "transform, opacity",
                  pointerEvents: opacity < 0.04 ? "none" : "auto",
                }}
              >
                {/* Pill image — dedicated click zone */}
                <img
                  src={pilluleBiologie}
                  alt={cat.name}
                  draggable={false}
                  ref={slotOffset === 0 ? centerPillRef : undefined}
                  onClick={() => {
                    if (isCenter) {
                      handleCenterClick(cat.name);
                    } else {
                      snapToVI(vi);
                    }
                  }}
                  style={{
                    height: 280,
                    width: "auto",
                    filter: isCenter
                      ? "drop-shadow(0 20px 48px rgba(2,34,63,0.32))"
                      : "drop-shadow(0 4px 14px rgba(2,34,63,0.1))",
                    userSelect: "none",
                    cursor: isCenter ? "pointer" : "pointer",
                  }}
                />
                <div
                  style={{
                    opacity: Math.max(0, 1 - absD * 5),
                    textAlign: "center",
                    transition: "opacity 0.15s",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1A2340" }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#5B8EB8", marginTop: 2 }}>
                    {cat.tag}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-1">
          {categorySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => navToCat(i)}
              style={{
                height: 8,
                width: i === activeCatIndex ? 24 : 8,
                borderRadius: 4,
                background: i === activeCatIndex ? "#29359B" : "#5B8EB8",
                opacity: i === activeCatIndex ? 1 : 0.32,
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, background 0.3s",
              }}
            />
          ))}
        </div>

        {/* Adjacent category hints */}
        <div className="flex items-center justify-between px-10 mt-4">
          <button
            onClick={() => snapToVI(centerIndex - 1)}
            className="flex items-center gap-1 text-[#9596B8] hover:text-[#5B8EB8] transition-colors"
            style={{ fontSize: "0.73rem" }}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180 flex-shrink-0" />
            {getCat(centerIndex - 1).name}
          </button>
          <button
            onClick={() => snapToVI(centerIndex + 1)}
            className="flex items-center gap-1 text-[#9596B8] hover:text-[#5B8EB8] transition-colors"
            style={{ fontSize: "0.73rem" }}
          >
            {getCat(centerIndex + 1).name}
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
        </div>
      </motion.section>

      {/* ── Overlay zoom pillule → hero (séquence impérative) ─────── */}
      {zoomActive && (
        <>
          {/* Pillule — démarre à la position exacte du carousel, zoome en plein écran */}
          <img
            ref={zoomPillRef}
            src={pilluleBiologie}
            draggable={false}
            alt=""
            style={zoomInitStyle}
          />
          {/* Hero — invisible au départ, fondu après le zoom */}
          <img
            ref={zoomHeroRef}
            src={heroBiologie}
            draggable={false}
            alt=""
            style={{
              position: "fixed", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: 0,
              zIndex: 9998,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Researchers Preview */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="px-5 py-8"
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[#1A2340]" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              Les chercheurs
            </h2>
            <button
              onClick={() => navigate("/chercheurs")}
              className="flex items-center gap-1 text-sm text-[#5B8EB8] hover:text-[#29359B] transition-colors"
            >
              Voir l'annuaire <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {researchers.slice(0, 3).map((researcher, index) => (
              <motion.div
                key={researcher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl p-4 border border-white/60 cursor-pointer group"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 4px 20px rgba(2,34,63,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
                  transition: "box-shadow 0.3s ease",
                }}
                onClick={() => navigate(`/chercheurs/${researcher.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-xl p-0.5"
                      style={{ background: "linear-gradient(135deg, #5B8EB8 0%, #29359B 100%)" }}
                    >
                      <img
                        src={researcher.photo}
                        alt={researcher.name}
                        className="w-full h-full rounded-[10px] object-cover"
                      />
                    </div>
                    {researcher.available && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A2340] truncate" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                      {researcher.name}
                    </p>
                    <p className="text-[#5A607A] truncate" style={{ fontSize: "0.72rem" }}>
                      {researcher.institution}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-white"
                        style={{ fontSize: "0.6rem", fontWeight: 600, background: "linear-gradient(135deg, #5B8EB8 0%, #4278A8 100%)" }}
                      >
                        {researcher.category}
                      </span>
                      {researcher.available && (
                        <span
                          className="px-2 py-0.5 rounded-full bg-green-50 text-green-700"
                          style={{ fontSize: "0.6rem", fontWeight: 600 }}
                        >
                          Disponible
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9596B8] group-hover:text-[#5B8EB8] transition-colors flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About teaser */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="px-5 py-12 mx-5 mb-8 rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #02223F 0%, #1A2680 50%, #29359B 100%)",
          boxShadow: "0 16px 64px rgba(41,53,155,0.35)",
        }}
      >
        {/* Ambient orbs inside banner */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, rgba(232,161,53,0.6) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, rgba(91,142,184,0.5) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border border-white/10"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            <Globe2 className="w-3.5 h-3.5 text-[#E8A135]" />
            <span style={{ fontSize: "0.72rem", color: "#E8A135", fontWeight: 600, letterSpacing: "0.05em" }}>
              NOTRE MISSION
            </span>
          </div>

          <h2
            className="text-white mb-4"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, lineHeight: 1.3 }}
          >
            Une communauté scientifique mondiale ancrée en Nouvelle-Calédonie
          </h2>
          <p className="text-white/65 mb-8 max-w-lg mx-auto" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
            Lab Horizon rassemble chercheurs, étudiants et professionnels autour d'une plateforme collaborative de partage des connaissances scientifiques.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/a-propos")}
            className="inline-flex items-center gap-2 bg-white text-[#02223F] px-8 py-3 rounded-full"
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,1) inset",
            }}
          >
            Découvrir qui nous sommes
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}