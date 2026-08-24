import type { Locale } from './home'

export const notFoundCopy = {
  fr: {
    metaTitle: 'Page introuvable, Lab Horizon',
    title: 'Nous n’avons pas trouvé ce que vous cherchez',
    lead:
      'Ce n’est pas la page que vous cherchiez. Notre hibou a passé l’horizon au peigne fin, sans retrouver la piste. Réessayons encore avec la barre de recherche.',
    searchLabel: 'Recherche sur Lab Horizon',
    searchPlaceholder: 'Rechercher un thème ou un sujet…',
    searchSubmit: 'Rechercher',
    discoverLead: 'Sinon, pourquoi ne pas découvrir',
    categoriesCta: 'les catégories',
    institutesCta: 'les instituts de recherche',
    discoverJoin: 'ou',
    backHome: "Retour à l'accueil",
    logoAlt: 'Lab Horizon, hibou détective',
  },
  en: {
    metaTitle: 'Page not found, Lab Horizon',
    title: 'We could not find what you are looking for',
    lead:
      'This is not the page you were looking for. Our owl swept the horizon and lost the trail. Let’s try again with the search bar.',
    searchLabel: 'Search Lab Horizon',
    searchPlaceholder: 'Search a topic or theme…',
    searchSubmit: 'Search',
    discoverLead: 'Or discover',
    categoriesCta: 'the research fields',
    institutesCta: 'the research institutes',
    discoverJoin: 'or',
    backHome: 'Back to home',
    logoAlt: 'Lab Horizon, detective owl',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
