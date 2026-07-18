import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  BookOpen,
  Users,
  Calendar,
  Building2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { publications, researchers, categories } from "./data/mockData";
import heroBiologie from "../../imports/Hero_Biologie.png";

const domains = ["Biologie", "Chimie", "Droit", "Physique", "Mathématiques", "Océanographie", "Environnement", "Informatique"];
const institutions = ["Université de Nouvelle-Calédonie", "IRD Nouméa", "IFREMER NC", "Université Paris-Saclay"];

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromZoom = (location.state as any)?.fromZoom === true;

  // ── Scroll instantané en haut avant le premier paint ────────────────
  // useLayoutEffect = synchrone avant paint → continuité parfaite avec le hero du zoom
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState<"publications" | "chercheurs">("publications");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);

  const categoryParam = searchParams.get("category");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get("q")) setQuery(searchParams.get("q")!);
    if (searchParams.get("category")) setSelectedDomains([searchParams.get("category")!]);
  }, [searchParams]);

  const filteredPublications = publications.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.authorName.toLowerCase().includes(query.toLowerCase());
    const matchesDomain = selectedDomains.length === 0 || selectedDomains.includes(p.category);
    const matchesInstitution = !selectedInstitution || p.institution === selectedInstitution;
    return matchesQuery && matchesDomain && matchesInstitution;
  });

  const filteredResearchers = researchers.filter((r) => {
    const matchesQuery =
      !query ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.domain.toLowerCase().includes(query.toLowerCase()) ||
      r.institution.toLowerCase().includes(query.toLowerCase());
    const matchesDomain = selectedDomains.length === 0 || selectedDomains.includes(r.category);
    const matchesAvailability =
      !selectedAvailability ||
      (selectedAvailability === "available" && r.available) ||
      (selectedAvailability === "unavailable" && !r.available);
    const matchesInstitution = !selectedInstitution || r.institution === selectedInstitution;
    return matchesQuery && matchesDomain && matchesAvailability && matchesInstitution;
  });

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const clearFilters = () => {
    setSelectedDomains([]);
    setSelectedAvailability(null);
    setSelectedInstitution(null);
  };

  const activeFiltersCount =
    selectedDomains.length +
    (selectedAvailability ? 1 : 0) +
    (selectedInstitution ? 1 : 0);

  return (
    <div>
      {/* ── Hero plein écran catégorie ─────────────────────────────────── */}
      <AnimatePresence>
        {categoryParam && (
          <motion.section
            key={categoryParam}
            // Si on vient du zoom : hero déjà visible (transition faite dans HomePage)
            // Sinon : fondu normal
            initial={{ opacity: fromZoom ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: fromZoom ? 0 : 0.5, ease: "easeOut" }}
            style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}
          >
            <img
              src={heroBiologie}
              alt={categoryParam}
              loading="eager"
              decoding="sync"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(2,34,63,0.45) 0%, transparent 35%, transparent 45%, rgba(2,34,63,0.75) 75%, rgba(2,34,63,0.97) 100%)",
              }}
            />

            {/* Texte animé — toujours animé même depuis le zoom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: fromZoom ? 0.1 : 0.3, ease: "easeOut" }}
              style={{ position: "absolute", bottom: 72, left: 24, right: 24 }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Domaine de recherche
              </p>
              <h1
                style={{
                  color: "white",
                  fontSize: "clamp(2.8rem, 10vw, 5rem)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  marginBottom: 14,
                }}
              >
                {categoryParam}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.65, maxWidth: 380 }}>
                Explorez les publications et les chercheurs spécialisés en {categoryParam.toLowerCase()}.
              </p>
            </motion.div>

            {/* Bouton scroll */}
            <motion.button
              onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: fromZoom ? 0.4 : 0.9 }}
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
                borderRadius: 999,
                padding: "8px 20px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{ display: "flex" }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
              Explorer les résultats
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Contenu de recherche ──────────────────────────────────────── */}
      <div ref={resultsRef} className="max-w-screen-xl mx-auto">
        {/* Sticky Search Bar */}
        <div className="sticky top-[72px] z-30 bg-[#ECECEC]/90 backdrop-blur-md px-5 py-3 border-b border-[#D9D0E3]/50">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9586a8]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchParams({ q: query });
                  }
                }}
                placeholder="Mots-clés, auteur, institution…"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D9D0E3] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B8EB8] focus:border-transparent text-[#2B2B2B] placeholder:text-[#9586a8]"
                style={{ fontSize: "0.85rem" }}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className="relative flex items-center gap-1.5 bg-white border border-[#D9D0E3] rounded-full px-4 py-2.5 shadow-sm hover:border-[#5B8EB8] transition-colors"
              style={{ fontSize: "0.8rem", color: "#535353" }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E8A135] rounded-full text-white flex items-center justify-center" style={{ fontSize: "0.6rem" }}>
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Active filter chips */}
          {activeFiltersCount > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {selectedDomains.map((d) => (
                <span
                  key={d}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#5B8EB8]/15 rounded-full text-[#02223F] cursor-pointer hover:bg-[#5B8EB8]/25"
                  style={{ fontSize: "0.7rem", fontWeight: 600 }}
                  onClick={() => toggleDomain(d)}
                >
                  {d} <X className="w-3 h-3" />
                </span>
              ))}
              {selectedAvailability && (
                <span
                  className="flex items-center gap-1 px-2.5 py-1 bg-green-100 rounded-full text-green-700 cursor-pointer"
                  style={{ fontSize: "0.7rem", fontWeight: 600 }}
                  onClick={() => setSelectedAvailability(null)}
                >
                  Disponible <X className="w-3 h-3" />
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-2.5 py-1 text-[#9586a8] hover:text-[#535353] transition-colors"
                style={{ fontSize: "0.7rem" }}
              >
                Effacer tout
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className="flex gap-1 bg-white rounded-full p-1 shadow-sm border border-[#EAEAEA] inline-flex">
            <button
              onClick={() => setActiveTab("publications")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeTab === "publications"
                  ? "bg-[#02223F] text-white shadow-md"
                  : "text-[#535353] hover:text-[#02223F]"
              }`}
              style={{ fontSize: "0.8rem", fontWeight: 600 }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Publications
              <span
                className={`px-1.5 py-0.5 rounded-full ${
                  activeTab === "publications" ? "bg-white/20 text-white" : "bg-[#ECECEC] text-[#535353]"
                }`}
                style={{ fontSize: "0.6rem" }}
              >
                {filteredPublications.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("chercheurs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeTab === "chercheurs"
                  ? "bg-[#02223F] text-white shadow-md"
                  : "text-[#535353] hover:text-[#02223F]"
              }`}
              style={{ fontSize: "0.8rem", fontWeight: 600 }}
            >
              <Users className="w-3.5 h-3.5" />
              Chercheurs
              <span
                className={`px-1.5 py-0.5 rounded-full ${
                  activeTab === "chercheurs" ? "bg-white/20 text-white" : "bg-[#ECECEC] text-[#535353]"
                }`}
                style={{ fontSize: "0.6rem" }}
              >
                {filteredResearchers.length}
              </span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="px-5 py-4 space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === "publications" ? (
              <motion.div
                key="publications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {filteredPublications.length === 0 ? (
                  <div className="text-center py-16 text-[#9586a8]">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p style={{ fontSize: "0.9rem" }}>Aucune publication trouvée</p>
                  </div>
                ) : (
                  filteredPublications.map((pub, index) => (
                    <motion.div
                      key={pub.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA] cursor-pointer group"
                      onClick={() => navigate(`/publications/${pub.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: "#5B8EB818" }}
                        >
                          <BookOpen className="w-4.5 h-4.5" style={{ color: "#5B8EB8" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              className="text-[#2B2B2B] group-hover:text-[#5B8EB8] transition-colors"
                              style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.4 }}
                            >
                              {pub.title}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-[#9586a8] group-hover:text-[#5B8EB8] flex-shrink-0 mt-0.5" />
                          </div>
                          <p className="text-[#9586a8] mt-1" style={{ fontSize: "0.72rem" }}>
                            {pub.authorName}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded-full text-white"
                              style={{ fontSize: "0.6rem", fontWeight: 600, backgroundColor: "#5B8EB8" }}
                            >
                              {pub.category}
                            </span>
                            <span className="flex items-center gap-1 text-[#9586a8]" style={{ fontSize: "0.65rem" }}>
                              <Calendar className="w-3 h-3" />
                              {pub.date}
                            </span>
                            <span className="flex items-center gap-1 text-[#9586a8]" style={{ fontSize: "0.65rem" }}>
                              <Building2 className="w-3 h-3" />
                              {pub.institution.split(" ").slice(0, 3).join(" ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="chercheurs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {filteredResearchers.length === 0 ? (
                  <div className="col-span-2 text-center py-16 text-[#9586a8]">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p style={{ fontSize: "0.9rem" }}>Aucun chercheur trouvé</p>
                  </div>
                ) : (
                  filteredResearchers.map((researcher, index) => (
                    <motion.div
                      key={researcher.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA] cursor-pointer group"
                      onClick={() => navigate(`/chercheurs/${researcher.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={researcher.photo}
                            alt={researcher.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          {researcher.available && (
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#2B2B2B] group-hover:text-[#5B8EB8] transition-colors" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                            {researcher.name}
                          </p>
                          <p className="text-[#9586a8] truncate" style={{ fontSize: "0.7rem" }}>
                            {researcher.institution}
                          </p>
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-white" style={{ fontSize: "0.6rem", fontWeight: 600, backgroundColor: "#5B8EB8" }}>
                              {researcher.category}
                            </span>
                            {researcher.available && (
                              <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700" style={{ fontSize: "0.6rem", fontWeight: 600 }}>
                                Disponible
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed right-0 top-0 bottom-0 z-50 bg-white w-80 shadow-2xl overflow-y-auto"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#2B2B2B]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                      Filtres
                    </h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5 text-[#535353]" />
                    </button>
                  </div>

                  {/* Availability */}
                  <div className="mb-6">
                    <p className="text-[#2B2B2B] mb-3" style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Disponibilité
                    </p>
                    <div className="space-y-2">
                      {[
                        { value: "available", label: "Disponible" },
                        { value: "unavailable", label: "Non disponible" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setSelectedAvailability(selectedAvailability === value ? null : value)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left ${
                            selectedAvailability === value
                              ? "border-[#5B8EB8] bg-[#5B8EB8]/10"
                              : "border-[#EAEAEA] hover:border-[#D9D0E3]"
                          }`}
                          style={{ fontSize: "0.8rem" }}
                        >
                          {label}
                          {selectedAvailability === value && (
                            <CheckCircle2 className="w-4 h-4 text-[#5B8EB8]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Domains */}
                  <div className="mb-6">
                    <p className="text-[#2B2B2B] mb-3" style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Catégorie
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => toggleDomain(domain)}
                          className={`px-3 py-1.5 rounded-full border transition-all ${
                            selectedDomains.includes(domain)
                              ? "border-[#5B8EB8] bg-[#5B8EB8] text-white"
                              : "border-[#EAEAEA] text-[#535353] hover:border-[#5B8EB8]"
                          }`}
                          style={{ fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Institutions */}
                  <div className="mb-8">
                    <p className="text-[#2B2B2B] mb-3" style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Institution
                    </p>
                    <div className="space-y-2">
                      {institutions.map((inst) => (
                        <button
                          key={inst}
                          onClick={() => setSelectedInstitution(selectedInstitution === inst ? null : inst)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left ${
                            selectedInstitution === inst
                              ? "border-[#5B8EB8] bg-[#5B8EB8]/10"
                              : "border-[#EAEAEA] hover:border-[#D9D0E3]"
                          }`}
                          style={{ fontSize: "0.78rem" }}
                        >
                          <span className="leading-tight">{inst}</span>
                          {selectedInstitution === inst && (
                            <CheckCircle2 className="w-4 h-4 text-[#5B8EB8] flex-shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-3 border border-[#D9D0E3] rounded-full text-[#535353] hover:border-[#2B2B2B] transition-colors"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 py-3 bg-[#02223F] text-white rounded-full hover:bg-[#5B8EB8] transition-colors"
                      style={{ fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}