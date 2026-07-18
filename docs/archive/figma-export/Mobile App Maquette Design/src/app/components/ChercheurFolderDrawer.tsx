import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
  useDragControls,
} from "motion/react";
import type { PanInfo } from "motion/react";
import {
  Sparkles,
  ChevronDown,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building2,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";

// ─── Taller folder path (body extended +200 units from original Figma shape)
// Original viewBox 0 0 458 610 → extended to 0 0 458 810
// Tab is centered at bottom: x=127–330, y=773–801
const FOLDER_PATH =
  "M9 7H449V761C449 767.627 443.627 773 437 773H334C331.791 773 330 774.791 330 777V789C330 795.627 324.627 801 318 801H139C132.373 801 127 795.627 127 789V777C127 774.791 125.209 773 123 773H21C14.3726 773 9 767.627 9 761V7Z";

const VB_W = 458;
const VB_H = 810;
// approx height of the sticky header (px-4 pt-3 pb-2 + inner div)
const HEADER_H = 70;

const STUDY_FIELDS = [
  "Biologie marine",
  "Chimie",
  "Droit",
  "Écologie",
  "Géologie",
  "Informatique",
  "Mathématiques",
  "Médecine",
  "Océanographie",
  "Physique",
  "Sciences humaines",
  "Sciences de la terre",
  "Autre",
];

// Paper rule lines inside the folder
const RULE_LINES = Array.from({ length: 18 }, (_, i) => 100 + i * 36);

export function ChercheurFolderDrawer() {
  const navigate = useNavigate();
  const dc = useDragControls();
  const [isOpen, setIsOpen] = useState(false);
  const [cardW, setCardW] = useState(0);
  const cardHRef = useRef(0);
  // Dynamic peek: HEADER_H + 2vh + ~tab notch height
  const peekPxRef = useRef(100);
  const y = useMotionValue(-9999);

  // form
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    labo: "",
    champ: "",
    email: "",
    pw: "",
  });
  const pf =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  // ─── Compute closed position: push up so only peekPx of the folder
  //     bottom is visible below the header
  const closedY = () => -(HEADER_H + cardHRef.current - peekPxRef.current);

  // ─── Compute open position: folder bottom stops at 60vh
  //     Kept ≤ 0 so Motion's bottom constraint stays non-negative from layout
  const openY = () =>
    Math.min(0, window.innerHeight * 0.6 - HEADER_H - cardHRef.current);

  useEffect(() => {
    const calc = () => {
      // At least 60vw, never wider than screen-16px
      const w = Math.min(
        window.innerWidth - 16,
        Math.max(window.innerWidth * 0.6, 390)
      );
      const h = (w / VB_W) * VB_H;
      // Mobile: just enough for the tab notch to peek under the header (~12px gap)
      // Desktop: larger reveal (8vh + padding)
      const isMobile = window.innerWidth < 768;
      const peek = isMobile
        ? HEADER_H + 12 + 28          // 12px gap + ~28px tab notch height
        : HEADER_H + Math.round(window.innerHeight * 0.08) + 30;
      peekPxRef.current = peek;
      setCardW(w);
      cardHRef.current = h;
      y.set(-(HEADER_H + h - peek));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const snapOpen = () => {
    animate(y, openY(), { type: "spring", stiffness: 210, damping: 26 });
    setIsOpen(true);
  };
  const snapClosed = () => {
    animate(y, closedY(), { type: "spring", stiffness: 210, damping: 26 });
    setIsOpen(false);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const curr = y.get();
    // Mid-point properly computed across the actual open↔close range
    // (38% from the closed/top end = biased toward staying closed)
    const mid = closedY() + (openY() - closedY()) * 0.38;
    if (info.velocity.y < -500 || curr < mid) {
      snapClosed();
    } else {
      snapOpen();
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => {
      navigate("/compte");
      snapClosed();
      setTimeout(() => setDone(false), 600);
    }, 2000);
  };

  if (cardW === 0) return null;

  const cardH = cardHRef.current;

  // ── Position percentages for the TAB notch inside the SVG
  const tabTopPct = (773 / VB_H) * 100;
  const tabHeightPct = ((801 - 773) / VB_H) * 100;
  const tabLeftPct = (127 / VB_W) * 100;
  const tabWidthPct = ((330 - 127) / VB_W) * 100;

  // ── The drag handle zone covers the entire visible peek area
  const peekTopPct = ((VB_H - peekPxRef.current * (VB_H / cardH)) / VB_H) * 100;

  // ── Content area starts far enough down so it clears the header when open.
  // At openY (e.g. -225), the card top is at (openY + HEADER_H) in viewport.
  // To be below the header (HEADER_H px), content must start at
  // at least (HEADER_H - (openY + HEADER_H)) = -openY px from card top, + 12px margin.
  const oy = openY();
  const contentTopPx = Math.max(40, Math.abs(oy) + 16);   // never less than 40px
  const contentTopPct = (contentTopPx / cardH) * 100;
  const contentBottomPct = ((VB_H - 755) / VB_H) * 100;

  return (
    <>
      {/* ── Backdrop when open ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[36]"
            style={{ background: "rgba(10,20,50,0.4)", backdropFilter: "blur(6px)" }}
            onClick={snapClosed}
          />
        )}
      </AnimatePresence>

      {/* ── Folder motion wrapper ── */}
      <motion.div
        className="fixed top-0 z-[38]"
        style={{
          left: `calc(50% - ${cardW / 2}px)`,
          width: cardW,
          y,
        }}
        drag="y"
        dragControls={dc}
        dragListener={false}
        dragConstraints={{ top: closedY(), bottom: openY() }}
        dragElastic={{ top: 0.04, bottom: 0.06 }}
        onDragEnd={onDragEnd}
      >
        {/* transparent spacer so that when y=0 (open), folder starts below header */}
        <div className="pointer-events-none" style={{ height: HEADER_H }} />

        {/* ── Folder card ── */}
        <div className="relative" style={{ height: cardH }}>

          {/* SVG shape with gradient fill */}
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="absolute inset-0 w-full h-full"
            style={{
              filter: "drop-shadow(0 12px 40px rgba(2,34,63,0.32)) drop-shadow(0 2px 8px rgba(0,0,0,0.12))",
            }}
          >
            <defs>
              <linearGradient id="folder-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFBF4" />
                <stop offset="60%" stopColor="#F8EED8" />
                <stop offset="100%" stopColor="#F1E2C6" />
              </linearGradient>
              <linearGradient id="accent-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E8A135" stopOpacity="0" />
                <stop offset="20%" stopColor="#E8A135" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#E8A135" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E8A135" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={FOLDER_PATH} fill="url(#folder-fill)" />

            {/* Top accent stripe – gradient */}
            <line
              x1="20" y1="50" x2="438" y2="50"
              stroke="url(#accent-line)"
              strokeWidth="1.5"
            />
            {/* Subtle top edge highlight */}
            <line
              x1="9" y1="7" x2="449" y2="7"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1"
            />

            {/* Ruled paper lines */}
            {RULE_LINES.map((ly) => (
              <line
                key={ly}
                x1="32" y1={ly} x2="426" y2={ly}
                stroke="#B8936A"
                strokeWidth="0.6"
                strokeOpacity="0.09"
              />
            ))}
          </svg>

          {/* ── Scrollable form content — hidden when drawer is closed ── */}
          <div
            className="absolute overflow-y-auto"
            style={{
              top: `${contentTopPct}%`,
              left: "5.5%",
              right: "5.5%",
              bottom: `${contentBottomPct}%`,
              touchAction: "pan-y",
              display: isOpen ? "block" : "none",
            }}
          >
            <AnimatePresence mode="wait">
              {done ? (
                /* ── Success ── */
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="flex flex-col items-center justify-center text-center gap-4"
                  style={{ minHeight: "100%" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.12, type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #02223F 0%, #29359B 100%)",
                      boxShadow: "0 8px 32px rgba(41,53,155,0.4)",
                    }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#E8A135]" />
                  </motion.div>
                  <div>
                    <h3
                      className="text-[#02223F]"
                      style={{ fontSize: "1.15rem", fontWeight: 800, lineHeight: 1.3 }}
                    >
                      Bienvenue dans
                      <br />
                      Lab Horizon !
                    </h3>
                    <p
                      className="text-[#6B5A3A] mt-2"
                      style={{ fontSize: "0.78rem", lineHeight: 1.6 }}
                    >
                      Votre espace chercheur est en cours de création…
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* ── Registration form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="space-y-3 pb-6 pt-3"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, #02223F 0%, #29359B 100%)",
                            boxShadow: "0 4px 12px rgba(41,53,155,0.3)",
                          }}
                        >
                          <FlaskConical className="w-4 h-4 text-[#E8A135]" />
                        </div>
                        <h3
                          className="text-[#02223F]"
                          style={{ fontSize: "1rem", fontWeight: 800 }}
                        >
                          Espace Chercheur
                        </h3>
                      </div>
                      <p className="text-[#7A6A50]" style={{ fontSize: "0.68rem" }}>
                        Créez votre profil Lab Horizon
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={snapClosed}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        background: "rgba(2,34,63,0.07)",
                        color: "rgba(2,34,63,0.45)",
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Prénom + Nom */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        { k: "prenom", label: "Prénom", ph: "Marie" },
                        { k: "nom", label: "Nom", ph: "Dupont" },
                      ] as const
                    ).map(({ k, label, ph }) => (
                      <div key={k}>
                        <label
                          className="block mb-1 text-[#4A3820]"
                          style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
                        >
                          {label}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={ph}
                          value={form[k]}
                          onChange={pf(k)}
                          className="w-full px-3 py-2.5 rounded-xl focus:outline-none text-[#2B2B2B] placeholder:text-[#C8B090] transition-all"
                          style={{
                            background: "rgba(255,255,255,0.6)",
                            border: "1px solid rgba(184,147,106,0.3)",
                            backdropFilter: "blur(8px)",
                            fontSize: "0.8rem",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04) inset",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Laboratoire */}
                  <div>
                    <label
                      className="block mb-1 text-[#4A3820]"
                      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                      Laboratoire / Institution
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B8936A]" />
                      <input
                        type="text"
                        required
                        placeholder="UNC, IRD, IFREMER…"
                        value={form.labo}
                        onChange={pf("labo")}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl focus:outline-none text-[#2B2B2B] placeholder:text-[#C8B090] transition-all"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(184,147,106,0.3)",
                          backdropFilter: "blur(8px)",
                          fontSize: "0.8rem",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04) inset",
                        }}
                      />
                    </div>
                  </div>

                  {/* Champ d'étude */}
                  <div>
                    <label
                      className="block mb-1 text-[#4A3820]"
                      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                      Champ d'étude
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B8936A] pointer-events-none" />
                      <select
                        required
                        value={form.champ}
                        onChange={pf("champ")}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl focus:outline-none text-[#2B2B2B] appearance-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(184,147,106,0.3)",
                          backdropFilter: "blur(8px)",
                          fontSize: "0.8rem",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04) inset",
                        }}
                      >
                        <option value="">Sélectionner un domaine…</option>
                        {STUDY_FIELDS.map((sf) => (
                          <option key={sf} value={sf}>
                            {sf}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B8936A] pointer-events-none" />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div>
                    <label
                      className="block mb-1 text-[#4A3820]"
                      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                      E-mail professionnel
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B8936A]" />
                      <input
                        type="email"
                        required
                        placeholder="marie@unc.nc"
                        value={form.email}
                        onChange={pf("email")}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl focus:outline-none text-[#2B2B2B] placeholder:text-[#C8B090] transition-all"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(184,147,106,0.3)",
                          backdropFilter: "blur(8px)",
                          fontSize: "0.8rem",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04) inset",
                        }}
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label
                      className="block mb-1 text-[#4A3820]"
                      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                      Créer un mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B8936A]" />
                      <input
                        type={showPw ? "text" : "password"}
                        required
                        placeholder="8 caractères minimum"
                        value={form.pw}
                        onChange={pf("pw")}
                        className="w-full pl-8 pr-9 py-2.5 rounded-xl focus:outline-none text-[#2B2B2B] placeholder:text-[#C8B090] transition-all"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(184,147,106,0.3)",
                          backdropFilter: "blur(8px)",
                          fontSize: "0.8rem",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04) inset",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((p) => !p)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B8936A] hover:text-[#7A5A30] transition-colors"
                      >
                        {showPw ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {form.pw.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-0.5 flex-1 rounded-full transition-all"
                            style={{
                              backgroundColor:
                                form.pw.length < 4
                                  ? i === 0
                                    ? "#E85858"
                                    : "rgba(184,147,106,0.2)"
                                  : form.pw.length < 8
                                  ? i <= 1
                                    ? "#E8A135"
                                    : "rgba(184,147,106,0.2)"
                                  : "#22C55E",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Legal */}
                  <p
                    className="text-[#A8906A]"
                    style={{ fontSize: "0.6rem", lineHeight: 1.5 }}
                  >
                    En créant un compte, vous acceptez nos{" "}
                    <span className="text-[#5B8EB8] cursor-pointer">
                      conditions d'utilisation
                    </span>{" "}
                    et notre{" "}
                    <span className="text-[#5B8EB8] cursor-pointer">
                      politique de confidentialité
                    </span>
                    .
                  </p>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, #02223F 0%, #1A2680 60%, #29359B 100%)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      boxShadow: "0 6px 24px rgba(41,53,155,0.45), 0 1px 0 rgba(255,255,255,0.12) inset",
                    }}
                  >
                    Rejoindre Lab Horizon
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p
                    className="text-center text-[#A8906A]"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Déjà un compte ?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        snapClosed();
                        setTimeout(() => navigate("/connexion"), 300);
                      }}
                      className="text-[#5B8EB8]"
                      style={{ fontWeight: 700 }}
                    >
                      Se connecter →
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Drag handle zone ── */}
          <div
            className="absolute left-0 right-0 cursor-grab active:cursor-grabbing select-none"
            style={{ top: `${peekTopPct}%`, bottom: 0 }}
            onPointerDown={(e) => {
              if (!isOpen) {
                e.stopPropagation();
                dc.start(e);
              }
            }}
            onClick={() => (isOpen ? snapClosed() : snapOpen())}
          >
            {/* Tab label */}
            <div
              className="absolute flex flex-col items-center justify-center"
              style={{
                top: `${((773 - VB_H * (peekTopPct / 100)) / (VB_H - VB_H * (peekTopPct / 100))) * 100}%`,
                left: `${tabLeftPct}%`,
                width: `${tabWidthPct}%`,
                height: `${(tabHeightPct / (100 - peekTopPct)) * 100}%`,
              }}
            >
              {/* Pill handle */}
              <div
                className="w-8 h-1 rounded-full mb-1"
                style={{ background: "linear-gradient(90deg, transparent, rgba(2,34,63,0.25), transparent)" }}
              />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5 text-[#E8A135]" />
                <span
                  style={{
                    fontSize: "0.5rem",
                    color: "#6B4A20",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Vous êtes chercheur ?
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-2.5 h-2.5 mt-0.5" style={{ color: "rgba(2,34,63,0.3)" }} />
              </motion.div>
            </div>
          </div>

          {/* When open: drag-to-close handle at the top */}
          {isOpen && (
            <div
              className="absolute left-0 right-0 flex justify-center cursor-grab active:cursor-grabbing"
              style={{ top: 0, height: 28 }}
              onPointerDown={(e) => {
                e.stopPropagation();
                dc.start(e);
              }}
            >
              <div
                className="w-10 h-1 rounded-full mt-2.5"
                style={{ background: "linear-gradient(90deg, transparent, rgba(2,34,63,0.2), transparent)" }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}