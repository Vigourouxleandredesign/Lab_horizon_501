import type { Locale } from './home'

export const uncResearchPageCopy = {
  fr: {
    metaTitle: 'Recherche à l’UNC, Lab Horizon',
    title: 'Recherche à l’UNC',
    intro:
      'Les équipes de recherche de l’Université de Nouvelle-Calédonie et les annuaires des acteurs de la recherche, enseignants-chercheurs, ingénieurs et techniciens.',
    teamsHeading: 'Équipes de recherche UNC',
    directoryTitle: 'Annuaire des acteurs de la recherche UNC',
    directorySubtitle:
      'Enseignants-chercheurs, ingénieurs et techniciens, accédez aux listes officielles sur les sites des laboratoires.',
    externalLabsHeading: 'Partenaires de recherche, fiches en cours d’enrichissement',
    comingSoon: 'Site bientôt disponible',
    visitSite: 'Voir le site',
  },
  en: {
    metaTitle: 'Research at UNC, Lab Horizon',
    title: 'Research at UNC',
    intro:
      'Research teams at the University of New Caledonia and directories of research staff, faculty researchers, engineers and technicians.',
    teamsHeading: 'UNC research teams',
    directoryTitle: 'UNC research staff directory',
    directorySubtitle:
      'Faculty researchers, engineers and technicians, access official lists on laboratory websites.',
    externalLabsHeading: 'Research partners, profiles being enriched',
    comingSoon: 'Website coming soon',
    visitSite: 'Visit website',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
