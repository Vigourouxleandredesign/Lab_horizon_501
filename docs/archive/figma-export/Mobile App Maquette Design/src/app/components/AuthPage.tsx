import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  FlaskConical,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Building2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";

type Mode = "login" | "register";
type Role = "chercheur" | "professionnel";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>(
    location.pathname === "/inscription" ? "register" : "login"
  );
  const [role, setRole] = useState<Role>("chercheur");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    institution: "",
    domain: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && step === 1) {
      setStep(2);
    } else {
      navigate("/compte");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-5 py-8">
      {/* Back */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#535353] hover:text-[#02223F] transition-colors"
          style={{ fontSize: "0.82rem" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#EAEAEA] overflow-hidden">
          {/* Header gradient */}
          <div
            className="px-8 pt-8 pb-6"
            style={{ background: "linear-gradient(135deg, #02223F 0%, #29359B 100%)" }}
          >
            <h1 className="text-white mb-1" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
              {mode === "login" ? "Bienvenue" : "Créer un compte"}
            </h1>
            <p className="text-white/60" style={{ fontSize: "0.8rem" }}>
              {mode === "login"
                ? "Connectez-vous à Lab Horizon"
                : step === 1
                ? "Choisissez votre profil"
                : "Complétez vos informations"}
            </p>

            {/* Step indicator (register only) */}
            {mode === "register" && (
              <div className="flex gap-2 mt-4">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      s <= step ? "bg-[#E8A135]" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="px-8 pb-8 pt-6">
            <AnimatePresence mode="wait">
              {/* LOGIN FORM */}
              {mode === "login" && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block mb-1.5 text-[#2B2B2B]" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9586a8]" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="votre@email.nc"
                        className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] border border-[#EAEAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8EB8] focus:border-transparent text-[#2B2B2B] placeholder:text-[#9586a8] transition-all"
                        style={{ fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-[#2B2B2B]" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9586a8]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-[#F5F5F5] border border-[#EAEAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8EB8] focus:border-transparent text-[#2B2B2B] placeholder:text-[#9586a8] transition-all"
                        style={{ fontSize: "0.85rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9586a8] hover:text-[#535353]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      className="mt-1 text-[#5B8EB8] hover:text-[#02223F] transition-colors"
                      style={{ fontSize: "0.72rem" }}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#02223F] text-white py-3.5 rounded-xl hover:bg-[#5B8EB8] transition-colors mt-2 shadow-md"
                    style={{ fontSize: "0.9rem", fontWeight: 700 }}
                  >
                    Se connecter <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p className="text-center text-[#9586a8]" style={{ fontSize: "0.78rem" }}>
                    Pas encore de compte ?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("register"); setStep(1); }}
                      className="text-[#5B8EB8] hover:text-[#02223F] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      S'inscrire
                    </button>
                  </p>
                </motion.form>
              )}

              {/* REGISTER STEP 1 — Role selection */}
              {mode === "register" && step === 1 && (
                <motion.div
                  key="register-step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <p className="text-[#535353]" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                    Quel type de compte souhaitez-vous créer ?
                  </p>

                  {/* Role cards */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setRole("chercheur")}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        role === "chercheur"
                          ? "border-[#5B8EB8] bg-[#5B8EB8]/8"
                          : "border-[#EAEAEA] hover:border-[#D9D0E3]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: role === "chercheur" ? "#5B8EB8" : "#F5F5F5" }}
                        >
                          <FlaskConical
                            className="w-5 h-5"
                            style={{ color: role === "chercheur" ? "white" : "#9586a8" }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2B2B2B" }}>
                              Compte Chercheur
                            </p>
                            {role === "chercheur" && (
                              <CheckCircle2 className="w-4 h-4 text-[#5B8EB8]" />
                            )}
                          </div>
                          <p style={{ fontSize: "0.72rem", color: "#535353", lineHeight: 1.5 }}>
                            Publiez vos recherches, gérez votre profil et connectez-vous avec vos pairs.
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {["Publications", "Veille", "Messagerie"].map((f) => (
                              <span
                                key={f}
                                className="px-2 py-0.5 bg-[#5B8EB8]/10 text-[#5B8EB8] rounded-full"
                                style={{ fontSize: "0.62rem", fontWeight: 600 }}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("professionnel")}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        role === "professionnel"
                          ? "border-[#E8A135] bg-[#E8A135]/8"
                          : "border-[#EAEAEA] hover:border-[#D9D0E3]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: role === "professionnel" ? "#E8A135" : "#F5F5F5" }}
                        >
                          <Briefcase
                            className="w-5 h-5"
                            style={{ color: role === "professionnel" ? "white" : "#9586a8" }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2B2B2B" }}>
                              Compte Professionnel
                            </p>
                            {role === "professionnel" && (
                              <CheckCircle2 className="w-4 h-4 text-[#E8A135]" />
                            )}
                          </div>
                          <p style={{ fontSize: "0.72rem", color: "#535353", lineHeight: 1.5 }}>
                            Accédez à la recherche, contactez des chercheurs et suivez les avancées scientifiques.
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {["Recherche", "Filtres", "Messagerie"].map((f) => (
                              <span
                                key={f}
                                className="px-2 py-0.5 bg-[#E8A135]/10 text-[#E8A135] rounded-full"
                                style={{ fontSize: "0.62rem", fontWeight: 600 }}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(2)}
                    className="w-full flex items-center justify-center gap-2 bg-[#02223F] text-white py-3.5 rounded-xl hover:bg-[#5B8EB8] transition-colors shadow-md"
                    style={{ fontSize: "0.9rem", fontWeight: 700 }}
                  >
                    Continuer <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p className="text-center text-[#9586a8]" style={{ fontSize: "0.78rem" }}>
                    Déjà inscrit ?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-[#5B8EB8] hover:text-[#02223F] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      Se connecter
                    </button>
                  </p>
                </motion.div>
              )}

              {/* REGISTER STEP 2 — Account info */}
              {mode === "register" && step === 2 && (
                <motion.form
                  key="register-step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 p-3 bg-[#F5F5F5] rounded-xl mb-1">
                    {role === "chercheur" ? (
                      <FlaskConical className="w-4 h-4 text-[#5B8EB8]" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-[#E8A135]" />
                    )}
                    <span style={{ fontSize: "0.78rem", color: "#535353" }}>
                      Compte <strong style={{ color: "#2B2B2B" }}>{role === "chercheur" ? "Chercheur" : "Professionnel"}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="ml-auto text-[#5B8EB8]"
                      style={{ fontSize: "0.72rem" }}
                    >
                      Modifier
                    </button>
                  </div>

                  {[
                    { key: "name", label: "Nom complet", Icon: User, placeholder: "Dr. Jean Dupont", type: "text" },
                    { key: "email", label: "E-mail", Icon: Mail, placeholder: "votre@email.nc", type: "email" },
                    { key: "institution", label: "Institution / Entreprise", Icon: Building2, placeholder: "UNC, IRD, IFREMER…", type: "text" },
                  ].map(({ key, label, Icon, placeholder, type }) => (
                    <div key={key}>
                      <label className="block mb-1.5 text-[#2B2B2B]" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                        {label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9586a8]" />
                        <input
                          type={type}
                          required
                          placeholder={placeholder}
                          value={(form as any)[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] border border-[#EAEAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8EB8] focus:border-transparent text-[#2B2B2B] placeholder:text-[#9586a8] transition-all"
                          style={{ fontSize: "0.85rem" }}
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block mb-1.5 text-[#2B2B2B]" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9586a8]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="8 caractères minimum"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 bg-[#F5F5F5] border border-[#EAEAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8EB8] focus:border-transparent text-[#2B2B2B] placeholder:text-[#9586a8] transition-all"
                        style={{ fontSize: "0.85rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9586a8]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[#9586a8]" style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
                    En créant un compte, vous acceptez nos{" "}
                    <span className="text-[#5B8EB8] cursor-pointer">conditions d'utilisation</span> et notre{" "}
                    <span className="text-[#5B8EB8] cursor-pointer">politique de confidentialité</span>.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#02223F] text-white py-3.5 rounded-xl hover:bg-[#5B8EB8] transition-colors shadow-md"
                    style={{ fontSize: "0.9rem", fontWeight: 700 }}
                  >
                    Créer mon compte <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
