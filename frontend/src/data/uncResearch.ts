/** Données mock — équipes de recherche UNC (en attendant l’API Spring Boot). */

export type UncTeam = {
  id: string
  name: string
  summary: string
  websiteUrl?: string
  websiteLabel?: string
  status?: 'active' | 'coming_soon'
}

export type ExternalLab = {
  id: string
  name: string
  summary: string
  websiteUrl: string
}

export const uncTeams: UncTeam[] = [
  {
    id: 'isea',
    name: 'ISEA',
    summary:
      'Ingénierie des Systèmes Écologiques et Anthropisés — recherche sur les écosystèmes terrestres et marins, les interactions homme-environnement et la durabilité des territoires calédoniens.',
    websiteUrl: 'https://www.isea.unc.nc/membres_isea',
    websiteLabel: 'Membres ISEA',
    status: 'active',
  },
  {
    id: 'larje',
    name: 'LARJE',
    summary:
      'Laboratoire Agronomique, Ressources, Justice et Environnement — travaux sur l’agronomie tropicale, la justice environnementale, les ressources naturelles et les dynamiques rurales.',
    websiteUrl: 'https://larje.unc.nc/',
    websiteLabel: 'Site du LARJE',
    status: 'active',
  },
  {
    id: 'isle',
    name: 'ISLE',
    summary:
      'Nouvelle équipe issue de la fusion des laboratoires LIRE, TROCA et ERALO. Site institutionnel en cours de création — thématiques littéraires, traduction, communication et études océaniennes.',
    status: 'coming_soon',
  },
]

export const directoryIntro = {
  title: 'Annuaire des acteurs de la recherche UNC',
  subtitle:
    'Enseignants-chercheurs (EC), ingénieurs et techniciens — accédez aux listes officielles sur les sites des laboratoires.',
  links: [
    {
      label: 'Membres ISEA',
      url: 'https://www.isea.unc.nc/membres_isea',
    },
    {
      label: 'LARJE — équipe et contacts',
      url: 'https://larje.unc.nc/',
    },
  ],
}

export const externalUmrs: ExternalLab[] = [
  {
    id: 'entropie',
    name: 'UMR ENTROPIE',
    summary:
      'Unité mixte de recherche dont la direction et le site sont hors UNC. Informations détaillées sur les EC rattachés à compléter ultérieurement.',
    websiteUrl: 'https://umr-entropie.ird.nc',
  },
  {
    id: 'espace-dev',
    name: 'UMR ESPACE-DEV',
    summary:
      'Unité mixte de recherche internationale. Les fiches des enseignants-chercheurs UNC y sont moins détaillées — contenu à enrichir prochainement.',
    websiteUrl: 'https://www.espace-dev.fr',
  },
]
