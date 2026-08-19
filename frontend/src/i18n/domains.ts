import type { CategorySlug } from '../data/categories'
import type { Locale } from './home'

export const domainPageCopy = {
  fr: {
    eyebrow: 'Domaine de recherche',
    scrollCta: 'Explorer les publications',
    publicationsTitle: 'Publications',
    publicationsSubtitle: 'Sélection de travaux récents dans ce domaine.',
    searchAll: 'Voir toutes les publications',
    backToCategories: 'Tous les domaines',
    emptyState: 'Aucune publication pour ce domaine pour le moment.',
    loading: 'Chargement des publications…',
    error: 'Les publications sont momentanément indisponibles.',
  },
  en: {
    eyebrow: 'Research field',
    scrollCta: 'Browse publications',
    publicationsTitle: 'Publications',
    publicationsSubtitle: 'A selection of recent work in this field.',
    searchAll: 'View all publications',
    backToCategories: 'All fields',
    emptyState: 'No publications for this field yet.',
    loading: 'Loading publications…',
    error: 'Publications are temporarily unavailable.',
  },
} as const

type DomainDescriptionMap = Record<CategorySlug, { fr: string; en: string }>

export const domainDescriptions: DomainDescriptionMap = {
  'biodiversite-environnement-sante': {
    fr: 'Ce domaine regroupe les recherches sur les écosystèmes terrestres et marins, la santé environnementale et la préservation de la biodiversité en Nouvelle-Calédonie et dans le Pacifique.',
    en: 'This field covers research on terrestrial and marine ecosystems, environmental health, and biodiversity conservation in New Caledonia and the Pacific.',
  },
  geosciences: {
    fr: 'Les géosciences à l’UNC explorent la géologie, les sols, les risques naturels et les ressources minérales du territoire calédonien, au croisement des enjeux climatiques et territoriaux.',
    en: 'Geosciences at UNC explore geology, soils, natural hazards, and mineral resources in New Caledonia, at the intersection of climate and territorial challenges.',
  },
  'education-sante': {
    fr: 'Formation, didactique, sciences de l’éducation et santé publique, ce domaine soutient l’innovation pédagogique et les politiques de santé adaptées aux contextes océaniens.',
    en: 'Training, didactics, education sciences, and public health, this field supports pedagogical innovation and health policies adapted to Oceanian contexts.',
  },
  'economie-gestion': {
    fr: 'Économie territoriale, gestion des organisations et développement durable, les travaux analysent les dynamiques économiques du Pacifique et les stratégies des acteurs locaux.',
    en: 'Territorial economics, organizational management, and sustainable development, research analyses Pacific economic dynamics and local stakeholders’ strategies.',
  },
  'droit-sciences-politiques': {
    fr: 'Droit public, institutions, gouvernance et sciences politiques, ce domaine étudie les cadres juridiques et les processus décisionnels en Nouvelle-Calédonie et en région.',
    en: 'Public law, institutions, governance, and political science, this field studies legal frameworks and decision-making processes in New Caledonia and the region.',
  },
  'histoire-archeologie': {
    fr: 'Histoire, archéologie et patrimoine, les recherches documentent les sociétés du passé et les héritages culturels du Pacifique, en lien avec les communautés contemporaines.',
    en: 'History, archaeology, and heritage, research documents past societies and Pacific cultural legacies in connection with contemporary communities.',
  },
  'societes-langues-cultures-oceaniennes': {
    fr: 'Anthropologie, linguistique et études culturelles, ce domaine met en lumière les sociétés, langues et pratiques culturelles océaniennes dans leur diversité.',
    en: 'Anthropology, linguistics, and cultural studies, this field highlights Oceanian societies, languages, and cultural practices in their diversity.',
  },
}

export function domainDescription(slug: CategorySlug, locale: Locale): string {
  return domainDescriptions[slug][locale]
}
