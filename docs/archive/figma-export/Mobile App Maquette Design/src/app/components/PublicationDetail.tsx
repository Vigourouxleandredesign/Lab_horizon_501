import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Tag,
  Clock,
  ChevronRight,
  MessageSquare,
  Share2,
  Bookmark,
  User,
  FlaskConical,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router";
import { publications, researchers } from "./data/mockData";

export default function PublicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pub = publications.find((p) => p.id === id);

  if (!pub) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#9586a8] px-5">
        <p className="mb-4">Publication introuvable</p>
        <button onClick={() => navigate("/recherche")} className="text-[#5B8EB8] underline">
          Retour à la recherche
        </button>
      </div>
    );
  }

  const author = researchers.find((r) => r.id === pub.authorId);

  // Generate some body paragraphs from the abstract
  const bodyParagraphs = [
    pub.abstract,
    `Ces travaux s'inscrivent dans un programme de recherche pluriannuel mené en collaboration avec plusieurs institutions partenaires. Les données ont été collectées sur une période de 36 mois selon un protocole rigoureux validé par notre comité scientifique.`,
    `Les résultats obtenus ouvrent de nouvelles perspectives méthodologiques et confirment l'hypothèse centrale de nos travaux. Ils permettent également d'identifier plusieurs axes de recherche complémentaires qui feront l'objet de publications futures.`,
    `Cette recherche bénéficie du soutien financier du gouvernement de Nouvelle-Calédonie et de l'ANR. Nos remerciements vont également à tous nos partenaires institutionnels et aux participants qui ont rendu ces travaux possibles.`,
  ];

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <div className="px-5 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-[#9586a8] flex-wrap" style={{ fontSize: "0.72rem" }}>
          <Link to="/" className="hover:text-[#5B8EB8] transition-colors">Accueil</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/recherche" className="hover:text-[#5B8EB8] transition-colors">{pub.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#535353] truncate max-w-[200px]">{pub.title.substring(0, 30)}…</span>
        </nav>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 px-5 pb-8">
        {/* Main content — 2 cols on desktop */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#535353] hover:text-[#02223F] transition-colors mb-4"
              style={{ fontSize: "0.82rem" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>

            {/* Category badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="px-3 py-1 rounded-full text-white"
                style={{ fontSize: "0.7rem", fontWeight: 700, backgroundColor: "#5B8EB8" }}
              >
                {pub.category}
              </span>
              <span className="flex items-center gap-1 text-[#9586a8]" style={{ fontSize: "0.7rem" }}>
                <Clock className="w-3 h-3" />
                {pub.readingTime} de lecture
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-[#2B2B2B] mb-4"
              style={{ fontSize: "clamp(1.2rem, 4vw, 1.6rem)", fontWeight: 800, lineHeight: 1.35 }}
            >
              {pub.title}
            </h1>

            {/* Author + date (mobile meta) */}
            <div className="flex items-center gap-3 mb-4 lg:hidden">
              {author && (
                <img
                  src={author.photo}
                  alt={author.name}
                  className="w-10 h-10 rounded-xl object-cover cursor-pointer"
                  onClick={() => navigate(`/chercheurs/${author.id}`)}
                />
              )}
              <div>
                <p
                  className="text-[#2B2B2B] cursor-pointer hover:text-[#5B8EB8] transition-colors"
                  style={{ fontSize: "0.82rem", fontWeight: 600 }}
                  onClick={() => author && navigate(`/chercheurs/${author.id}`)}
                >
                  {pub.authorName}
                </p>
                <p className="text-[#9586a8]" style={{ fontSize: "0.7rem" }}>
                  {pub.institution}
                </p>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 mb-6">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#EAEAEA] rounded-full hover:border-[#5B8EB8] transition-colors text-[#535353]" style={{ fontSize: "0.75rem" }}>
                <Bookmark className="w-3.5 h-3.5" />
                Sauvegarder
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#EAEAEA] rounded-full hover:border-[#5B8EB8] transition-colors text-[#535353]" style={{ fontSize: "0.75rem" }}>
                <Share2 className="w-3.5 h-3.5" />
                Partager
              </button>
            </div>

            {/* Abstract */}
            <div className="bg-[#F4EAD6]/60 border-l-4 border-[#E8A135] rounded-r-2xl pl-4 pr-4 py-4 mb-6">
              <p className="text-[#535353]" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Résumé
              </p>
              <p className="text-[#2B2B2B]" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                {pub.abstract}
              </p>
            </div>

            {/* Body */}
            <div className="space-y-5">
              {bodyParagraphs.slice(1).map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-[#535353]"
                  style={{ fontSize: "0.88rem", lineHeight: 1.75 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Keywords */}
            <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
              <p className="text-[#9586a8] mb-3" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Mots-clés
              </p>
              <div className="flex flex-wrap gap-2">
                {pub.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F5F5] border border-[#EAEAEA] rounded-full text-[#535353] cursor-pointer hover:border-[#5B8EB8] transition-colors"
                    style={{ fontSize: "0.73rem" }}
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 p-5 bg-white rounded-2xl border border-[#EAEAEA] shadow-sm">
              <p className="text-[#2B2B2B] mb-3" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                Intéressé par ces travaux ?
              </p>
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => author && navigate(`/chercheurs/${author.id}`)}
                  className="flex items-center gap-2 bg-[#02223F] text-white px-5 py-2.5 rounded-full hover:bg-[#5B8EB8] transition-colors"
                  style={{ fontSize: "0.8rem", fontWeight: 600 }}
                >
                  <User className="w-3.5 h-3.5" />
                  Voir le profil du chercheur
                </motion.button>
                {author?.available ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/connexion")}
                    className="flex items-center gap-2 bg-white border border-[#D9D0E3] text-[#535353] px-5 py-2.5 rounded-full hover:border-[#5B8EB8] transition-colors"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Contacter
                  </motion.button>
                ) : (
                  <div
                    className="flex items-center gap-2 border border-[#EAEAEA] text-[#9586a8] px-5 py-2.5 rounded-full cursor-not-allowed"
                    style={{ fontSize: "0.8rem" }}
                    title="Connexion requise pour contacter ce chercheur"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Connexion pour contacter
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar metadata — right col on desktop */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="sticky top-28 space-y-4">
            {/* Author card */}
            {author && (
              <div
                className="bg-white rounded-2xl p-5 border border-[#EAEAEA] shadow-sm cursor-pointer hover:border-[#5B8EB8] transition-colors"
                onClick={() => navigate(`/chercheurs/${author.id}`)}
              >
                <p className="text-[#9586a8] mb-3" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Auteur
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={author.photo} alt={author.name} className="w-12 h-12 rounded-xl object-cover" />
                    {author.available && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2B2B2B" }}>{author.name}</p>
                    <p style={{ fontSize: "0.7rem", color: "#9586a8" }}>{author.domain}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="bg-white rounded-2xl p-5 border border-[#EAEAEA] shadow-sm space-y-4">
              <p className="text-[#9586a8]" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Informations
              </p>
              {[
                { Icon: Calendar, label: "Date", value: pub.date },
                { Icon: Building2, label: "Institution", value: pub.institution },
                { Icon: FlaskConical, label: "Laboratoire", value: pub.lab },
                { Icon: Tag, label: "Catégorie", value: pub.category },
                { Icon: Clock, label: "Lecture", value: pub.readingTime },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#9586a8]" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", color: "#9586a8" }}>{label}</p>
                    <p style={{ fontSize: "0.78rem", color: "#535353" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Mobile metadata */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:hidden mt-6 bg-white rounded-2xl p-4 border border-[#EAEAEA] shadow-sm"
        >
          <p className="text-[#9586a8] mb-3" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Informations
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { Icon: Calendar, label: "Date", value: pub.date },
              { Icon: Building2, label: "Institution", value: pub.institution.split(" ").slice(0, 3).join(" ") },
              { Icon: FlaskConical, label: "Laboratoire", value: pub.lab.split(" ").slice(0, 3).join(" ") },
              { Icon: Clock, label: "Lecture", value: pub.readingTime },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3 h-3 text-[#9586a8]" />
                </div>
                <div>
                  <p style={{ fontSize: "0.6rem", color: "#9586a8" }}>{label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#535353" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
