import { motion } from "motion/react";
import { ArrowRight, Globe2, Users, BookOpen, FlaskConical, Heart, Target, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";
import { stats } from "./data/mockData";

const values = [
  {
    Icon: Globe2,
    title: "Ouverture",
    description: "La science doit être accessible à tous. Nous facilitons le partage des connaissances entre chercheurs, étudiants et professionnels du monde entier.",
    color: "#5B8EB8",
  },
  {
    Icon: Heart,
    title: "Collaboration",
    description: "Les grandes avancées scientifiques naissent de la collaboration. Lab Horizon crée les ponts entre disciplines, institutions et territoires.",
    color: "#E8A135",
  },
  {
    Icon: Target,
    title: "Rigueur",
    description: "Chaque publication est soumise à un processus de validation assisté par IA avant d'être partagée sur la plateforme.",
    color: "#007A8C",
  },
  {
    Icon: Lightbulb,
    title: "Innovation",
    description: "Nous explorons continuellement de nouveaux formats pour diffuser la recherche : vulgarisation, visualisations, chatbot scientifique.",
    color: "#29359B",
  },
];

const team = [
  { name: "Sophie Laurent", role: "Directrice", initials: "SL", color: "#5B8EB8" },
  { name: "Marc Tétard", role: "CTO", initials: "MT", color: "#29359B" },
  { name: "Elena Bako", role: "Responsable UX", initials: "EB", color: "#E8A135" },
  { name: "Pierre Naouna", role: "Coordinateur Recherche", initials: "PN", color: "#007A8C" },
];

const partners = ["UNC", "IRD NC", "IFREMER", "Gouvernement NC", "CNRS", "ANR"];

const statItems = [
  { value: stats.researchers, label: "Chercheurs inscrits", Icon: Users, color: "#5B8EB8" },
  { value: stats.publications, label: "Publications partagées", Icon: BookOpen, color: "#E8A135" },
  { value: stats.categories, label: "Domaines scientifiques", Icon: FlaskConical, color: "#007A8C" },
  { value: stats.institutions, label: "Institutions partenaires", Icon: Globe2, color: "#29359B" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="px-5 py-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 rounded-full border border-[#EAEAEA] shadow-sm mb-5">
          <Globe2 className="w-3.5 h-3.5 text-[#007A8C]" />
          <span style={{ fontSize: "0.75rem", color: "#007A8C", fontWeight: 600 }}>À propos de Lab Horizon</span>
        </div>

        <h1
          className="text-[#2B2B2B] mb-5 max-w-2xl mx-auto"
          style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)", fontWeight: 800, lineHeight: 1.25 }}
        >
          La science calédonienne, ouverte au monde entier
        </h1>
        <p className="text-[#535353] max-w-xl mx-auto" style={{ fontSize: "0.92rem", lineHeight: 1.75 }}>
          Lab Horizon est né d'une conviction : la recherche scientifique menée en Nouvelle-Calédonie mérite d'être visible, partagée et valorisée à l'échelle internationale. Notre plateforme connecte chercheurs, étudiants et professionnels autour d'un objectif commun : faire avancer la science.
        </p>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="px-5 py-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statItems.map(({ value, label, Icon, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 text-center shadow-md border border-[#EAEAEA]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-[#2B2B2B]" style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>
                {value}+
              </p>
              <p className="text-[#9586a8] mt-1" style={{ fontSize: "0.7rem", lineHeight: 1.3 }}>
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="px-5 py-10"
      >
        <div
          className="rounded-3xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #02223F 0%, #29359B 100%)" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
            <Target className="w-3.5 h-3.5 text-[#E8A135]" />
            <span style={{ fontSize: "0.7rem", color: "#E8A135", fontWeight: 600, letterSpacing: "0.05em" }}>
              NOTRE MISSION
            </span>
          </div>
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, lineHeight: 1.3 }}>
            Démocratiser l'accès à la recherche scientifique du Pacifique
          </h2>
          <p className="text-white/70 max-w-lg mx-auto" style={{ fontSize: "0.88rem", lineHeight: 1.7 }}>
            En offrant une plateforme intuitive, multilingue et accessible à tous, nous permettons à chaque chercheur de partager ses travaux et à chaque citoyen de bénéficier des avancées de la science.
          </p>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="px-5 py-8"
      >
        <h2 className="text-[#2B2B2B] text-center mb-8" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
          Nos valeurs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map(({ Icon, title, description, color }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-md border border-[#EAEAEA]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-[#2B2B2B] mb-2" style={{ fontSize: "1rem", fontWeight: 700 }}>
                {title}
              </h3>
              <p className="text-[#535353]" style={{ fontSize: "0.82rem", lineHeight: 1.65 }}>
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="px-5 py-8"
      >
        <h2 className="text-[#2B2B2B] text-center mb-6" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
          L'équipe
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {team.map(({ name, role, initials, color }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 text-center shadow-md border border-[#EAEAEA]"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white"
                style={{ backgroundColor: color, fontSize: "1.1rem", fontWeight: 800 }}
              >
                {initials}
              </div>
              <p className="text-[#2B2B2B]" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                {name}
              </p>
              <p className="text-[#9586a8]" style={{ fontSize: "0.7rem" }}>
                {role}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Partners */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="px-5 py-8"
      >
        <h2 className="text-[#2B2B2B] text-center mb-6" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
          Nos partenaires
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="px-5 py-3 bg-white rounded-full shadow-sm border border-[#EAEAEA] text-[#535353]"
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              {partner}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="px-5 py-10 mb-4"
      >
        <div className="bg-white rounded-3xl p-8 text-center shadow-md border border-[#EAEAEA]">
          <h2 className="text-[#2B2B2B] mb-3" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
            Rejoignez Lab Horizon
          </h2>
          <p className="text-[#535353] mb-6" style={{ fontSize: "0.85rem", lineHeight: 1.65 }}>
            Chercheur, étudiant ou professionnel ? Notre plateforme est ouverte à tous ceux qui souhaitent contribuer à l'avancement de la science.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/inscription")}
              className="flex items-center justify-center gap-2 bg-[#02223F] text-white px-7 py-3 rounded-full shadow-lg hover:bg-[#5B8EB8] transition-colors"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              Créer un compte <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/recherche")}
              className="flex items-center justify-center gap-2 border border-[#D9D0E3] text-[#535353] px-7 py-3 rounded-full hover:border-[#5B8EB8] transition-colors"
              style={{ fontSize: "0.85rem" }}
            >
              Explorer les publications <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
