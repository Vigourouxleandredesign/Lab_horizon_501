/** Données mock, équipes de recherche UNC (en attendant l’API). */

import type { LocalizedString } from '../lib/localizedText'

export type UncTeam = {
  id: string
  name: string
  summary: LocalizedString
  websiteUrl?: string
  websiteLabel?: LocalizedString
  status?: 'active' | 'coming_soon'
}

export type ExternalLab = {
  id: string
  name: string
  summary: LocalizedString
  websiteUrl: string
}

export const uncTeams: UncTeam[] = [
  {
    id: 'isea',
    name: 'ISEA',
    summary: {
      fr: 'Ingénierie des Systèmes Écologiques et Anthropisés, recherche sur les écosystèmes terrestres et marins, les interactions homme-environnement et la durabilité des territoires calédoniens.',
      en: 'Ecological and Anthropized Systems Engineering, research on terrestrial and marine ecosystems, human-environment interactions and sustainability in New Caledonian territories.',
    },
    websiteUrl: 'https://www.isea.unc.nc/membres_isea',
    websiteLabel: { fr: 'Membres ISEA', en: 'ISEA members' },
    status: 'active',
  },
  {
    id: 'larje',
    name: 'LARJE',
    summary: {
      fr: 'Laboratoire Agronomique, Ressources, Justice et Environnement, travaux sur l’agronomie tropicale, la justice environnementale, les ressources naturelles et les dynamiques rurales.',
      en: 'Agronomic, Resources, Justice and Environment Laboratory, work on tropical agronomy, environmental justice, natural resources and rural dynamics.',
    },
    websiteUrl: 'https://larje.unc.nc/',
    websiteLabel: { fr: 'Site du LARJE', en: 'LARJE website' },
    status: 'active',
  },
  {
    id: 'isle',
    name: 'ISLE',
    summary: {
      fr: 'Nouvelle équipe issue de la fusion des laboratoires LIRE, TROCA et ERALO, site institutionnel en cours de création, thématiques littéraires, traduction, communication et études océaniennes.',
      en: 'New team from the merger of the LIRE, TROCA and ERALO laboratories, institutional website under construction, literary studies, translation, communication and Oceanian studies.',
    },
    status: 'coming_soon',
  },
]

export const directoryIntro = {
  links: [
    {
      label: { fr: 'Membres ISEA', en: 'ISEA members' },
      url: 'https://www.isea.unc.nc/membres_isea',
    },
    {
      label: { fr: 'LARJE, équipe et contacts', en: 'LARJE, team and contacts' },
      url: 'https://larje.unc.nc/',
    },
  ],
}

export const externalUmrs: ExternalLab[] = [
  {
    id: 'entropie',
    name: 'UMR ENTROPIE',
    summary: {
      fr: 'Unité mixte de recherche partenaire, les fiches des enseignants-chercheurs UNC rattachés seront enrichies prochainement.',
      en: 'Partner joint research unit, profiles of affiliated UNC faculty researchers will be enriched soon.',
    },
    websiteUrl: 'https://umr-entropie.ird.nc',
  },
  {
    id: 'espace-dev',
    name: 'UMR ESPACE-DEV',
    summary: {
      fr: 'Unité mixte de recherche internationale, les fiches des enseignants-chercheurs UNC seront complétées prochainement.',
      en: 'International joint research unit, UNC faculty researcher profiles will be completed soon.',
    },
    websiteUrl: 'https://www.espace-dev.fr',
  },
]
