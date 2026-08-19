import type { Locale } from './home'

export const aboutCopy = {
  fr: {
    metaTitle: 'À propos, Lab Horizon',
    title: 'À propos de Lab Horizon',
    lead:
      'Lab Horizon valorise la recherche menée à l’Université de la Nouvelle-Calédonie et par ses partenaires en Nouvelle-Calédonie et dans le Pacifique, au service des chercheurs, des étudiants et du grand public.',
    missionTitle: 'Notre mission',
    missionBody:
      'Valoriser et rendre accessibles les travaux des chercheurs affiliés à l’UNC, qu’il s’agisse des publications, de la vulgarisation ou de la veille par domaine scientifique.',
    linkUncResearch: 'Recherche UNC',
    linkSearch: 'Rechercher des publications',
    backHome: "Retour à l'accueil",
  },
  en: {
    metaTitle: 'About, Lab Horizon',
    title: 'About Lab Horizon',
    lead:
      'Lab Horizon showcases research at the University of New Caledonia and by its partners in New Caledonia and the Pacific, for researchers, students and the wider public.',
    missionTitle: 'Our mission',
    missionBody:
      'Showcase and make accessible the work of UNC-affiliated researchers, whether through publications, plain-language summaries or field-based watchlists.',
    linkUncResearch: 'UNC research',
    linkSearch: 'Search publications',
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<string, unknown>>
