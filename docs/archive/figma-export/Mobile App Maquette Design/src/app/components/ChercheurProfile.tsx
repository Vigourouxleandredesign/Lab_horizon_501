import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Calendar,
  Tag,
  Lock,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router";
import { researchers, publications } from "./data/mockData";

export default function ChercheurProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const researcher = researchers.find((r) => r.id === id);

  if (!researcher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#9586a8] px-5">
        <p className="mb-4">Chercheur introuvable</p>
        <button
          onClick={() => navigate("/chercheurs")}
          className="text-[#5B8EB8] underline"
          style={{ fontSize: "0.9rem" }}
        >
          Retour à l'annuaire
        </button>
      </div>
    );
  }

  const researcherPubs = publications.filter((p) =>
    researcher.publications.includes(p.id)
  );

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <div className="px-5 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-[#9586a8]" style={{ fontSize: "0.72rem" }}>
          <Link to="/" className="hover:text-[#5B8EB8] transition-colors">Accueil</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/chercheurs" className="hover:text-[#5B8EB8] transition-colors">Chercheurs</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#535353]">{researcher.name}</span>
        </nav>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-5 pb-6"
      >
        {/* Banner */}
        <div
          className="rounded-2xl h-36 relative overflow-hidden mb-4"
          style={{
            background: researcher.available
              ? "linear-gradient(135deg, #5B8EB8 0%, #02223F 100%)"
              : "linear-gradient(135deg, #9586a8 0%, #02223F 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -right-8 w-40 h-40 border border-white rounded-full" />
            <div className="absolute top-4 right-8 w-56 h-56 border border-white rounded-full" />
          </div>
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Avatar + Info */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0 -mt-14">
            <img
              src={researcher.photo}
              alt={researcher.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-xl"
              style={{ border: "4px solid white" }}
            />
            {researcher.available && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="flex-1 mt-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-[#2B2B2B]" style={{ fontSize: "1.2rem", fontWeight: 800, lineHeight: 1.3 }}>
                {researcher.name}
              </h1>
            </div>
            <p className="text-[#535353] mb-2" style={{ fontSize: "0.8rem" }}>
              {researcher.domain}
            </p>
            {researcher.available && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-green-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Disponible pour collaboration
              </span>
            )}
          </div>
        </div>

        {/* Institution */}
        <div className="mt-4 flex items-center gap-2 text-[#535353]">
          <MapPin className="w-4 h-4 text-[#9586a8]" />
          <span style={{ fontSize: "0.82rem" }}>{researcher.institution}</span>
        </div>

        {/* Specialties */}
        <div className="mt-3 flex flex-wrap gap-2">
          {researcher.specialties.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1 px-3 py-1 bg-[#F5F5F5] border border-[#EAEAEA] rounded-full text-[#535353]"
              style={{ fontSize: "0.72rem" }}
            >
              <Tag className="w-2.5 h-2.5" />
              {s}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="mt-4 text-[#535353] leading-relaxed" style={{ fontSize: "0.82rem" }}>
          {researcher.bio}
        </p>

        {/* CTA */}
        <div className="mt-5 flex gap-3">
          {researcher.available ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/connexion")}
              className="flex-1 flex items-center justify-center gap-2 bg-[#02223F] text-white py-3 rounded-full shadow-md hover:bg-[#5B8EB8] transition-colors"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              <MessageSquare className="w-4 h-4" />
              Envoyer un message
            </motion.button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 bg-[#F5F5F5] border border-[#EAEAEA] text-[#9586a8] py-3 rounded-full cursor-not-allowed" style={{ fontSize: "0.85rem" }}>
              <Lock className="w-4 h-4" />
              Indisponible actuellement
            </div>
          )}
          <button
            className="w-11 h-11 flex items-center justify-center bg-white border border-[#EAEAEA] rounded-full hover:border-[#5B8EB8] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#535353]" />
          </button>
        </div>
      </motion.div>

      {/* Publications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-5 pb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#2B2B2B]" style={{ fontSize: "1rem", fontWeight: 700 }}>
            Publications liées
          </h2>
          <span className="text-[#9586a8]" style={{ fontSize: "0.75rem" }}>
            {researcherPubs.length} publication{researcherPubs.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {researcherPubs.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA] cursor-pointer group"
              onClick={() => navigate(`/publications/${pub.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5B8EB8]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-[#5B8EB8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[#2B2B2B] group-hover:text-[#5B8EB8] transition-colors"
                    style={{ fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.4 }}
                  >
                    {pub.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[#9586a8]" style={{ fontSize: "0.65rem" }}>
                      <Calendar className="w-2.5 h-2.5" />
                      {pub.date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-white" style={{ fontSize: "0.6rem", fontWeight: 600, backgroundColor: "#5B8EB8" }}>
                      {pub.category}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9586a8] group-hover:text-[#5B8EB8] flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connect notice */}
        {!researcher.available && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-amber-700" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>
              <strong>Ce chercheur n'est pas disponible pour de nouvelles collaborations en ce moment.</strong>{" "}
              Vous pouvez consulter ses publications et revenir ultérieurement.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
