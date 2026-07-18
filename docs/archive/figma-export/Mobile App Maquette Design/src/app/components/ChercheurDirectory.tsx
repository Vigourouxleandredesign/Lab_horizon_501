import { useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { researchers, categories } from "./data/mockData";

export default function ChercheurDirectory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filtered = researchers.filter((r) => {
    const matchesQuery =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || r.category === selectedCategory;
    const matchesAvail = !showAvailableOnly || r.available;
    return matchesQuery && matchesCat && matchesAvail;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-5 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h1 className="text-[#2B2B2B] mb-1" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
          Annuaire des chercheurs
        </h1>
        <p className="text-[#535353]" style={{ fontSize: "0.85rem" }}>
          {researchers.length} chercheurs enregistrés sur Lab Horizon
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9586a8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, domaine, institution…"
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#D9D0E3] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B8EB8] text-[#2B2B2B] placeholder:text-[#9586a8]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </motion.div>

      {/* Category pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4"
      >
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all ${
            !selectedCategory
              ? "border-[#02223F] bg-[#02223F] text-white"
              : "border-[#D9D0E3] bg-white text-[#535353] hover:border-[#5B8EB8]"
          }`}
          style={{ fontSize: "0.78rem", fontWeight: 600 }}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all ${
              selectedCategory === cat.name
                ? "text-white border-transparent"
                : "border-[#D9D0E3] bg-white text-[#535353] hover:border-[#5B8EB8]"
            }`}
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              backgroundColor: selectedCategory === cat.name ? cat.color : undefined,
              borderColor: selectedCategory === cat.name ? cat.color : undefined,
            }}
          >
            {cat.name}
          </button>
        ))}
      </motion.div>

      {/* Available toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => setShowAvailableOnly(!showAvailableOnly)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            showAvailableOnly ? "bg-green-400" : "bg-[#D9D0E3]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
              showAvailableOnly ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-[#535353]" style={{ fontSize: "0.8rem" }}>
          Disponibles uniquement
        </span>
        <span className="text-[#9586a8]" style={{ fontSize: "0.75rem" }}>
          ({researchers.filter((r) => r.available).length})
        </span>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-[#9586a8]">
            <p style={{ fontSize: "0.9rem" }}>Aucun chercheur trouvé</p>
          </div>
        ) : (
          filtered.map((researcher, index) => (
            <motion.div
              key={researcher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-md border border-[#EAEAEA] overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/chercheurs/${researcher.id}`)}
            >
              {/* Card header */}
              <div
                className="h-24 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${researcher.available ? "#5B8EB8" : "#9586a8"} 0%, #02223F 100%)`,
                }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-4 w-20 h-20 border border-white rounded-full" />
                  <div className="absolute -top-4 right-8 w-28 h-28 border border-white rounded-full" />
                </div>

                {/* Availability badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-full text-white flex items-center gap-1 ${
                      researcher.available ? "bg-green-400/80" : "bg-white/20"
                    }`}
                    style={{ fontSize: "0.6rem", fontWeight: 600 }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${researcher.available ? "bg-white" : "bg-white/50"}`}
                    />
                    {researcher.available ? "Disponible" : "Non disponible"}
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div className="px-4 relative">
                <div className="-mt-10 mb-3">
                  <img
                    src={researcher.photo}
                    alt={researcher.name}
                    className="w-16 h-16 rounded-xl object-cover border-3 border-white shadow-lg"
                    style={{ border: "3px solid white" }}
                  />
                </div>

                {/* Info */}
                <div className="pb-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-[#2B2B2B] group-hover:text-[#5B8EB8] transition-colors" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                      {researcher.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-[#9586a8] group-hover:text-[#5B8EB8] transition-colors flex-shrink-0 mt-0.5" />
                  </div>

                  <p className="text-[#9586a8] mb-2" style={{ fontSize: "0.72rem" }}>
                    {researcher.domain}
                  </p>

                  <div className="flex items-center gap-1 text-[#535353] mb-3">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span style={{ fontSize: "0.7rem" }}>{researcher.institution.split(" ").slice(0, 4).join(" ")}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-[#F0F0F0]">
                    <div className="flex items-center gap-1 text-[#9586a8]">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span style={{ fontSize: "0.7rem" }}>
                        {researcher.publications.length} publication{researcher.publications.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-white"
                        style={{ fontSize: "0.58rem", fontWeight: 600, backgroundColor: "#5B8EB8" }}
                      >
                        {researcher.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
