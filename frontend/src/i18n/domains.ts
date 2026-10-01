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
    fr: 'La Nouvelle-Calédonie est un des points chauds mondiaux de la biodiversité. Ce domaine réunit les recherches sur les écosystèmes terrestres et marins, la valorisation des biomolécules, la restauration des milieux dégradés, notamment les sites miniers, ainsi que la santé environnementale. À l’UNC, l’ISEA et l’UMR ENTROPIE étudient le fonctionnement des systèmes tropicaux et leur évolution face aux changements globaux, du lagon récifal aux forêts humides.',
    en: 'New Caledonia is one of the world’s biodiversity hotspots. This field brings together research on terrestrial and marine ecosystems, the valorisation of biomolecules, the restoration of degraded environments, notably mining sites, as well as environmental health. At UNC, ISEA and the ENTROPIE joint research unit study how tropical systems work and evolve under global change, from the reef lagoon to humid forests.',
  },
  geosciences: {
    fr: 'Les géosciences explorent la Terre calédonienne à travers la géologie et la tectonique, dont la subduction et l’obduction de l’ophiolite, mais aussi les sols et les ressources minérales comme le nickel, l’hydrologie des bassins versants et les risques naturels. À l’UNC, l’ISEA associe observation de terrain, analyses physico-chimiques et modélisation numérique pour comprendre la formation du territoire et guider une gestion durable de ses ressources.',
    en: 'Geosciences explore New Caledonia’s earth through geology and tectonics, including subduction and ophiolite obduction, as well as soils and mineral resources such as nickel, watershed hydrology and natural hazards. At UNC, ISEA combines field observation, physico-chemical analysis and numerical modelling to understand how the territory formed and to guide the sustainable management of its resources.',
  },
  'education-sante': {
    fr: 'Ce domaine interroge la réussite éducative en contexte multiculturel océanien, de la didactique et de la pédagogie à la place des langues et savoirs kanak, en passant par les usages du numérique. Il s’intéresse aussi à la santé et au bien-être de la jeunesse, notamment les compétences psycho-sociales, l’autonomie et la coopération. Le laboratoire LIRE de l’UNC compare les systèmes éducatifs du Pacifique pour soutenir l’émancipation individuelle et collective des populations.',
    en: 'This field examines educational success in a multicultural Oceanian context, from didactics and pedagogy to the place of Kanak languages and knowledge, including digital practices. It also looks at youth health and well-being, notably psycho-social skills, autonomy and cooperation. UNC’s LIRE laboratory compares Pacific education systems to support the individual and collective emancipation of local communities.',
  },
  'economie-gestion': {
    fr: 'Économie et sciences de gestion s’y croisent au prisme des dynamiques insulaires : développement, équité et répartition des richesses, capital humain, stratégies des organisations et transition durable dans le Pacifique. Au sein du LARJE, ces travaux, à la fois fondamentaux et appliqués, éclairent les politiques publiques et les acteurs économiques face aux mutations propres à la Nouvelle-Calédonie.',
    en: 'Economics and management meet here through the lens of island dynamics: development, equity and wealth distribution, human capital, organisational strategies and sustainable transition in the Pacific. Within LARJE, this fundamental and applied research informs public policies and economic stakeholders facing the transformations specific to New Caledonia.',
  },
  'droit-sciences-politiques': {
    fr: 'Droit public et privé, sciences criminelles et science politique se croisent ici pour analyser la gouvernance, l’évolution institutionnelle et le pluralisme juridique calédonien, c’est-à-dire l’articulation entre normes étatiques, droits autochtones et pratiques sociales. Équipe de référence sur ces questions, le LARJE accompagne les transitions du pays et, plus largement, celles des sociétés océaniennes.',
    en: 'Public and private law, criminal sciences and political science meet here to analyse governance, institutional change and New Caledonia’s legal pluralism, that is the interplay between state norms, indigenous rights and social practices. A reference team on these issues, LARJE accompanies the transitions of the country and, more broadly, those of Oceanian societies.',
  },
  'histoire-archeologie': {
    fr: 'De plus de 3 000 ans de peuplement aux bouleversements de la colonisation, ce domaine retrace les trajectoires historiques, géopolitiques et sociales de l’Océanie. Porté par l’équipe TROCA de l’UNC, il croise histoire, archéologie et patrimoine pour éclairer l’émergence des sociétés océaniennes et nourrir la réflexion sur la « communauté de destin » calédonienne.',
    en: 'From over 3,000 years of settlement to the upheavals of colonisation, this field traces the historical, geopolitical and social trajectories of Oceania. Led by UNC’s TROCA team, it combines history, archaeology and heritage to shed light on the emergence of Oceanian societies and to inform reflection on New Caledonia’s shared destiny.',
  },
  'societes-langues-cultures-oceaniennes': {
    fr: 'Ce domaine documente et valorise les langues et cultures océaniennes, des 28 langues kanak à la diversité linguistique, en passant par la création et la médiation artistique, ainsi que les mobilités et les enjeux identitaires contemporains. À l’UNC, l’équipe ERALO travaille à décrire, transmettre et faire reconnaître ce patrimoine vivant, au service du bi/multilinguisme du territoire.',
    en: 'This field documents and promotes Oceanian languages and cultures, from the 28 Kanak languages to linguistic diversity, including artistic creation and mediation as well as contemporary mobilities and identity issues. At UNC, the ERALO team works to describe, transmit and gain recognition for this living heritage, in support of the territory’s bi/multilingualism.',
  },
  informatique: {
    fr: 'L’informatique à l’UNC couvre la science des données, l’intelligence artificielle, le traitement d’images et la modélisation de systèmes complexes, avec des applications concrètes aux enjeux calédoniens en environnement, en santé et dans le domaine des langues. À l’ISEA, les équipes associent recherche fondamentale et développements logiciels pour outiller les autres disciplines et accompagner la transformation numérique du territoire.',
    en: 'Computer science at UNC spans data science, artificial intelligence, image processing and modelling of complex systems, with concrete applications to New Caledonian challenges in environment, health and languages. At ISEA, teams combine fundamental research and software development to support other disciplines and the territory’s digital transformation.',
  },
}

export function domainDescription(slug: CategorySlug, locale: Locale): string {
  return domainDescriptions[slug][locale]
}
