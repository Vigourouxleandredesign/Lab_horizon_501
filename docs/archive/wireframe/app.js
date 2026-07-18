/**
 * Lab Horizon wireframe — navigation, i18n FR/EN, carrousel, chatbot FAB
 */
(function () {
  "use strict";

  const STRINGS = {
    fr: {
      heroEyebrow: "Plateforme — Nouvelle-Calédonie",
      heroTitle: "Connecter la recherche à la société",
      heroLead:
        "Valorisez vos travaux, centralisez votre veille et rendez la science accessible.",
      ctaResearcher: "Êtes-vous chercheur ?",
      searchLabel: "Recherche par mots-clés",
      searchBtn: "Rechercher",
      advFilters: "Filtres avancés",
      advFiltersHint: " — disponibilité, catégorie, institution",
      catTitle: "Explorer par discipline",
      resTitle: "Les chercheurs",
      resCta: "Voir l’annuaire",
      aboutTitle: "Qui sommes-nous ?",
      aboutText:
        "Lab Horizon met en valeur la recherche calédonienne et facilite les échanges entre chercheurs, citoyens et entreprises.",
      filtersTitle: "Affiner",
      fAvail: "Disponibilité",
      fCat: "Catégorie",
      fInst: "Institution",
      applyFilters: "Appliquer",
      tabPub: "Publications",
      tabRes: "Chercheurs",
      pagination: "Pagination …",
      metaWhat: "Quoi",
      metaWho: "Qui",
      metaWhen: "Quand",
      metaLab: "Lab / Organisme",
      seeProfile: "Voir le profil du chercheur",
      msgLocked: "Message (connexion requise)",
      availOn: "Disponibilité : ouverte aux collaborations (opt-in)",
      linkedPub: "Publications",
      msgLockedShort: "Message",
      dashTitle: "Tableau de bord chercheur",
      newPub: "Nouvelle publication",
      previewPublic: "Voir comme le public",
      drafts: "Brouillons",
      pendingIA: "En attente validation IA",
      veilleSnap: "Veille (aperçu)",
      tabVeille: "Veille",
      tabMyPub: "Mes publications",
      tabProf: "Profil",
      tabMsg: "Messages",
      veillePlaceholder:
        "Liste des chercheurs suivis, flux d’activité, réglages des alertes push (PWA).",
      legalMentions: "Mentions légales",
      legalPrivacy: "Confidentialité",
      legalCookies: "Cookies",
      footerNote: "Wireframe Lab Horizon — aligné docs/ux · SAE 501",
      chatTitle: "Assistant",
      chatWelcome:
        "Bonjour — je peux vous aider à trouver des publications. (Wireframe)",
      chatPlaceholder: "Votre question…",
      chatSend: "Envoyer",
    },
    en: {
      heroEyebrow: "Platform — New Caledonia",
      heroTitle: "Connecting research with society",
      heroLead:
        "Showcase your work, centralize your watchlist, and make science accessible.",
      ctaResearcher: "Are you a researcher?",
      searchLabel: "Keyword search",
      searchBtn: "Search",
      advFilters: "Advanced filters",
      advFiltersHint: " — availability, category, institution",
      catTitle: "Browse by field",
      resTitle: "Researchers",
      resCta: "Directory",
      aboutTitle: "About us",
      aboutText:
        "Lab Horizon highlights local research and connects researchers, citizens, and businesses.",
      filtersTitle: "Refine",
      fAvail: "Availability",
      fCat: "Category",
      fInst: "Institution",
      applyFilters: "Apply",
      tabPub: "Publications",
      tabRes: "Researchers",
      pagination: "Pagination …",
      metaWhat: "What",
      metaWho: "Who",
      metaWhen: "When",
      metaLab: "Lab / Organization",
      seeProfile: "View researcher profile",
      msgLocked: "Message (sign in required)",
      availOn: "Availability: open to collaborations (opt-in)",
      linkedPub: "Publications",
      msgLockedShort: "Message",
      dashTitle: "Researcher dashboard",
      newPub: "New publication",
      previewPublic: "Preview as public",
      drafts: "Drafts",
      pendingIA: "Awaiting AI validation",
      veilleSnap: "Watchlist (preview)",
      tabVeille: "Watchlist",
      tabMyPub: "My publications",
      tabProf: "Profile",
      tabMsg: "Messages",
      veillePlaceholder:
        "Followed researchers, activity feed, push notification settings (PWA).",
      legalMentions: "Legal notice",
      legalPrivacy: "Privacy",
      legalCookies: "Cookies",
      footerNote: "Lab Horizon wireframe — see docs/ux · SAE 501",
      chatTitle: "Assistant",
      chatWelcome:
        "Hello — I can help you find publications. (Wireframe)",
      chatPlaceholder: "Your question…",
      chatSend: "Send",
    },
  };

  let lang = "fr";

  function applyI18n() {
    const dict = STRINGS[lang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    const chatInput = document.getElementById("chatInput");
    if (chatInput && dict.chatPlaceholder) {
      chatInput.placeholder = dict.chatPlaceholder;
    }
  }

  function showView(name) {
    document.querySelectorAll(".view").forEach((v) => {
      const show = v.id === "view-" + name;
      v.hidden = !show;
    });
    document.querySelectorAll(".nav-link[data-nav]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-nav") === name);
    });
    document.querySelector(".brand[data-nav]")?.setAttribute(
      "aria-current",
      name === "home" ? "page" : "false"
    );
    const main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }

  function initNav() {
    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const nav = el.getAttribute("data-nav");
        if (!nav) return;
        e.preventDefault();
        showView(nav);
        const panel = document.getElementById("navPanel");
        const toggle = document.getElementById("navToggle");
        if (panel && toggle) {
          panel.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    const navToggle = document.getElementById("navToggle");
    const navPanel = document.getElementById("navPanel");
    if (navToggle && navPanel) {
      navToggle.addEventListener("click", () => {
        const open = !navPanel.classList.contains("is-open");
        navPanel.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", String(open));
      });
    }

    document.getElementById("ctaResearcher")?.addEventListener("click", () => {
      showView("dashboard");
    });

    document.getElementById("btnSearch")?.addEventListener("click", () => {
      showView("search");
    });

    document.getElementById("goFilters")?.addEventListener("click", () => {
      showView("search");
    });

    document.getElementById("btnLogin")?.addEventListener("click", () => {
      alert(
        lang === "fr"
          ? "Wireframe : écran connexion à brancher."
          : "Wireframe: connect screen to be wired."
      );
    });
  }

  function initLang() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        lang = btn.getAttribute("data-lang") || "fr";
        document.querySelectorAll(".lang-btn").forEach((b) => {
          b.classList.toggle(
            "is-active",
            b.getAttribute("data-lang") === lang
        );
        });
        document.documentElement.lang = lang === "en" ? "en" : "fr";
        applyI18n();
      });
    });
  }

  function initCarousel() {
    const track = document.getElementById("catTrack");
    const prev = document.getElementById("catPrev");
    const next = document.getElementById("catNext");
    if (!track || !prev || !next) return;
    const step = () => Math.min(220, track.clientWidth * 0.6);
    prev.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    next.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  function initChat() {
    const fab = document.getElementById("fabChat");
    const panel = document.getElementById("chatPanel");
    const close = document.getElementById("chatClose");
    const input = document.getElementById("chatInput");

    function openPanel(open) {
      if (!panel || !fab) return;
      panel.hidden = !open;
      fab.setAttribute("aria-expanded", String(open));
      if (open) input?.focus();
    }

    fab?.addEventListener("click", () => {
      openPanel(panel?.hidden !== false);
    });
    close?.addEventListener("click", () => openPanel(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") openPanel(false);
    });
  }

  applyI18n();
  initNav();
  initLang();
  initCarousel();
  initChat();
})();
