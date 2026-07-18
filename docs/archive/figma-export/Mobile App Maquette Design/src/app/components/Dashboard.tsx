import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Settings,
  LogOut,
  Plus,
  BookOpen,
  Eye,
  Edit3,
  Trash2,
  Bell as BellIcon,
  MessageSquare,
  User,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  ExternalLink,
  Rss,
} from "lucide-react";
import { useNavigate } from "react-router";
import { publications, researchers } from "./data/mockData";

type Tab = "veille" | "publications" | "profil" | "apercu";

const researcher = researchers[0]; // logged in as Marie Dupont
const myPubs = publications.filter((p) => researcher.publications.includes(p.id));

const watchItems = [
  { id: 1, keyword: "Récifs coralliens Pacifique", newCount: 3, date: "Aujourd'hui" },
  { id: 2, keyword: "Chimie marine anticancéreux", newCount: 1, date: "Hier" },
  { id: 3, keyword: "Biodiversité marine Calédonie", newCount: 0, date: "Il y a 3 j" },
];

const messages = [
  { id: 1, from: "Prof. Karim Benali", preview: "Merci pour votre récente publication, j'aimerais…", unread: true, date: "09:42" },
  { id: 2, from: "Dr. Thomas Rivière", preview: "Bonjour, avez-vous accès aux données Argo de 2022…", unread: false, date: "Hier" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("veille");

  const tabs: { key: Tab; label: string; Icon: React.ElementType }[] = [
    { key: "veille", label: "Veille", Icon: Rss },
    { key: "publications", label: "Publications", Icon: BookOpen },
    { key: "profil", label: "Profil", Icon: User },
    { key: "apercu", label: "Aperçu", Icon: Eye },
  ];

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 pt-6 pb-4"
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-[#9586a8]" style={{ fontSize: "0.75rem" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-[#2B2B2B]" style={{ fontSize: "1.4rem", fontWeight: 800, lineHeight: 1.3 }}>
              Bonjour, Marie 👋
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/compte/messages")}
              className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#EAEAEA] hover:border-[#5B8EB8] transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#535353]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E8A135] rounded-full border border-white" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#EAEAEA] hover:border-[#5B8EB8] transition-colors">
              <Settings className="w-4 h-4 text-[#535353]" />
            </button>
          </div>
        </div>

        {/* Today's quick actions */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#02223F] text-white rounded-2xl p-3.5 flex flex-col items-center gap-1.5 shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>Nouvelle pub.</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white border border-[#EAEAEA] rounded-2xl p-3.5 flex flex-col items-center gap-1.5 shadow-sm hover:border-[#5B8EB8] transition-colors"
          >
            <FileText className="w-5 h-5 text-[#535353]" />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#535353" }}>Brouillons</span>
            <span className="text-xs bg-[#ECECEC] rounded-full px-1.5 py-0.5 text-[#535353]" style={{ fontSize: "0.6rem" }}>2</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("veille")}
            className="bg-white border border-[#EAEAEA] rounded-2xl p-3.5 flex flex-col items-center gap-1.5 shadow-sm hover:border-[#5B8EB8] transition-colors relative"
          >
            <BellIcon className="w-5 h-5 text-[#E8A135]" />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#535353" }}>Veille</span>
            <span className="text-xs bg-[#E8A135]/15 rounded-full px-1.5 py-0.5 text-[#E8A135]" style={{ fontSize: "0.6rem", fontWeight: 700 }}>4 new</span>
          </motion.button>
        </div>

        {/* Stats strip */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {[
            { label: "Vues", value: "1 240", icon: TrendingUp, color: "#5B8EB8" },
            { label: "Publications", value: myPubs.length.toString(), icon: BookOpen, color: "#29359B" },
            { label: "Messages", value: "2", icon: MessageSquare, color: "#E8A135" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex-shrink-0 bg-white rounded-xl px-4 py-3 border border-[#EAEAEA] shadow-sm flex items-center gap-2"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 800, color: "#2B2B2B", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "0.62rem", color: "#9586a8" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-[#EAEAEA]">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2.5 rounded-xl transition-all ${
                activeTab === key
                  ? "bg-[#02223F] text-white shadow-md"
                  : "text-[#535353] hover:text-[#02223F]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 pb-8">
        <AnimatePresence mode="wait">
          {/* VEILLE */}
          {activeTab === "veille" && (
            <motion.div
              key="veille"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[#2B2B2B]" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  Abonnements de veille
                </h2>
                <button className="flex items-center gap-1 text-[#5B8EB8]" style={{ fontSize: "0.75rem" }}>
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>

              {watchItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-[#EAEAEA] shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2B2B2B" }}>{item.keyword}</p>
                      <p style={{ fontSize: "0.7rem", color: "#9586a8" }}>{item.date}</p>
                    </div>
                    {item.newCount > 0 ? (
                      <span className="px-2.5 py-1 bg-[#E8A135]/15 text-[#E8A135] rounded-full" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                        {item.newCount} nouvelle{item.newCount > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#F5F5F5] text-[#9586a8] rounded-full" style={{ fontSize: "0.72rem" }}>
                        À jour
                      </span>
                    )}
                    <button className="text-[#9586a8] hover:text-[#C0392B] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Alert settings */}
              <div className="bg-[#F4EAD6]/50 border border-[#E8A135]/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-[#E8A135]" />
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B" }}>Alertes e-mail</p>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#535353", lineHeight: 1.5 }}>
                  Vous recevez des alertes hebdomadaires pour vos mots-clés. Modifier la fréquence dans les paramètres.
                </p>
              </div>
            </motion.div>
          )}

          {/* PUBLICATIONS */}
          {activeTab === "publications" && (
            <motion.div
              key="publications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[#2B2B2B]" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  Mes publications
                </h2>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 bg-[#02223F] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#5B8EB8] transition-colors"
                  style={{ fontSize: "0.75rem", fontWeight: 600 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Nouvelle
                </motion.button>
              </div>

              {/* Status legend */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {[
                  { label: "Brouillon", color: "#9586a8", count: 2 },
                  { label: "En validation IA", color: "#E8A135", count: 0 },
                  { label: "Publié", color: "#5B8EB8", count: myPubs.length },
                ].map(({ label, color, count }) => (
                  <div
                    key={label}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-full"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span style={{ fontSize: "0.7rem", color: "#535353" }}>{label}</span>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color }} >({count})</span>
                  </div>
                ))}
              </div>

              {myPubs.map((pub, index) => (
                <div key={pub.id} className="bg-white rounded-2xl p-4 border border-[#EAEAEA] shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#5B8EB8]/15 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-[#5B8EB8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2B2B2B", lineHeight: 1.4 }}>
                        {pub.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[#9586a8]" style={{ fontSize: "0.65rem" }}>
                          <Calendar className="w-2.5 h-2.5" /> {pub.date}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#5B8EB8]/10 text-[#5B8EB8] rounded-full" style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                          <CheckCircle2 className="w-2.5 h-2.5" /> Publié
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-[#F0F0F0]">
                    <button
                      onClick={() => navigate(`/publications/${pub.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[#535353] hover:text-[#02223F] border border-[#EAEAEA] rounded-full transition-colors"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <Eye className="w-3 h-3" /> Voir
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[#535353] hover:text-[#02223F] border border-[#EAEAEA] rounded-full transition-colors" style={{ fontSize: "0.7rem" }}>
                      <Edit3 className="w-3 h-3" /> Éditer
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[#C0392B] hover:bg-red-50 border border-[#EAEAEA] rounded-full transition-colors ml-auto" style={{ fontSize: "0.7rem" }}>
                      <Trash2 className="w-3 h-3" /> Retirer
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* PROFIL */}
          {activeTab === "profil" && (
            <motion.div
              key="profil"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[#2B2B2B]" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  Mon profil
                </h2>
                <button className="flex items-center gap-1.5 text-[#5B8EB8]" style={{ fontSize: "0.75rem" }}>
                  <Edit3 className="w-3.5 h-3.5" /> Modifier
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#EAEAEA] shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <img src={researcher.photo} alt={researcher.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "#2B2B2B" }}>{researcher.name}</p>
                    <p style={{ fontSize: "0.78rem", color: "#535353" }}>{researcher.domain}</p>
                    <p style={{ fontSize: "0.72rem", color: "#9586a8" }}>{researcher.institution}</p>
                  </div>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#535353", lineHeight: 1.65 }}>{researcher.bio}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#EAEAEA] shadow-sm">
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9586a8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                  Disponibilité
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2B2B2B" }}>
                      {researcher.available ? "Disponible pour collaboration" : "Non disponible"}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#535353" }}>
                      Cette information est visible sur votre profil public.
                    </p>
                  </div>
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${researcher.available ? "bg-green-400" : "bg-[#D9D0E3]"}`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${researcher.available ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#EAEAEA] shadow-sm space-y-3">
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9586a8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Spécialités
                </p>
                <div className="flex flex-wrap gap-2">
                  {researcher.specialties.map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-[#F5F5F5] border border-[#EAEAEA] rounded-full text-[#535353]" style={{ fontSize: "0.72rem" }}>
                      {s}
                    </span>
                  ))}
                  <button className="px-3 py-1.5 bg-[#5B8EB8]/10 border border-[#5B8EB8]/20 rounded-full text-[#5B8EB8]" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                    <Plus className="w-3 h-3 inline mr-1" />Ajouter
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 border border-[#D9D0E3] text-[#C0392B] py-3 rounded-xl hover:bg-red-50 transition-colors"
                style={{ fontSize: "0.85rem" }}
              >
                <LogOut className="w-4 h-4" /> Se déconnecter
              </button>
            </motion.div>
          )}

          {/* APERÇU PUBLIC */}
          {activeTab === "apercu" && (
            <motion.div
              key="apercu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Banner */}
              <div className="bg-[#F4EAD6]/60 border border-[#E8A135]/30 rounded-2xl p-4 mb-4 flex items-start gap-3">
                <Eye className="w-5 h-5 text-[#E8A135] flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B" }}>Aperçu public</p>
                  <p style={{ fontSize: "0.72rem", color: "#535353", lineHeight: 1.5 }}>
                    C'est ainsi que les visiteurs vous voient sur Lab Horizon.
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/chercheurs/${researcher.id}`)}
                  className="ml-auto flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4 text-[#5B8EB8]" />
                </button>
              </div>

              {/* Preview of the public profile */}
              <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden opacity-90 pointer-events-none">
                <div className="h-24" style={{ background: "linear-gradient(135deg, #5B8EB8 0%, #02223F 100%)" }} />
                <div className="px-4 pb-4">
                  <div className="-mt-8 mb-3">
                    <img src={researcher.photo} alt={researcher.name} className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md" />
                  </div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#2B2B2B" }}>{researcher.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#535353" }}>{researcher.domain}</p>
                  <p style={{ fontSize: "0.7rem", color: "#9586a8", marginTop: "2px" }}>{researcher.institution}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-white bg-green-400" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Disponible</span>
                    <span className="px-2 py-0.5 rounded-full text-white bg-[#5B8EB8]" style={{ fontSize: "0.6rem", fontWeight: 600 }}>{researcher.category}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/chercheurs/${researcher.id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 border border-[#D9D0E3] text-[#535353] py-3 rounded-xl hover:border-[#5B8EB8] transition-colors"
                style={{ fontSize: "0.85rem" }}
              >
                <ExternalLink className="w-4 h-4" /> Voir le profil complet
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
