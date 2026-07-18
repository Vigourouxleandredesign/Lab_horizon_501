import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import SearchPage from "./components/SearchPage";
import ChercheurDirectory from "./components/ChercheurDirectory";
import ChercheurProfile from "./components/ChercheurProfile";
import PublicationDetail from "./components/PublicationDetail";
import AboutPage from "./components/AboutPage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
      <div className="w-20 h-20 bg-[#ECECEC] rounded-2xl flex items-center justify-center mb-6">
        <span style={{ fontSize: "2rem" }}>🔬</span>
      </div>
      <h1 className="text-[#2B2B2B] mb-2" style={{ fontSize: "1.4rem", fontWeight: 800 }}>
        Page introuvable
      </h1>
      <p className="text-[#9586a8] mb-6" style={{ fontSize: "0.9rem" }}>
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <a
        href="/"
        className="bg-[#02223F] text-white px-7 py-3 rounded-full hover:bg-[#5B8EB8] transition-colors"
        style={{ fontSize: "0.85rem", fontWeight: 600 }}
      >
        Retour à l'accueil
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "recherche", Component: SearchPage },
      { path: "chercheurs", Component: ChercheurDirectory },
      { path: "chercheurs/:id", Component: ChercheurProfile },
      { path: "publications/:id", Component: PublicationDetail },
      { path: "a-propos", Component: AboutPage },
      { path: "connexion", Component: AuthPage },
      { path: "inscription", Component: AuthPage },
      { path: "compte", Component: Dashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
