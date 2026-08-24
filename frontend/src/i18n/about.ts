import type { AboutTeamMemberId } from '../data/team'
import type { Locale } from './home'

export const aboutCopy = {
  fr: {
    metaTitle: 'À propos, Lab Horizon',
    badge: 'Université de la Nouvelle-Calédonie',
    title: 'Un horizon pour la recherche calédonienne',
    lead:
      'Lab Horizon est né d’une idée simple : que les travaux menés ici trouvent enfin un lieu où l’on peut les découvrir, les comprendre, et y revenir.',
    exploreCta: 'Explorer le catalogue',
    projectTitle: 'Le projet',
    projectBody: [
      'Lab Horizon est une porte d’entrée vers la recherche menée à l’Université de la Nouvelle-Calédonie et chez ses partenaires. Une plateforme pour le public, les étudiants et les chercheurs, sans avoir à savoir déjà où chercher.',
      'On y parcourt les publications par domaine, on y rencontre les instituts, on y retrouve un catalogue pensé pour le territoire.',
    ],
    whyTitle: 'Pourquoi Lab Horizon',
    whyBody:
      'La recherche calédonienne existe, elle est riche, elle est souvent ailleurs : dans les revues, dans les archives, dans des réseaux que peu de gens ouvrent. Il manquait un endroit où l’on arrive, où l’on comprend, et d’où l’on continue. C’est cet endroit que nous construisons.',
    pillars: [
      {
        title: 'Valoriser',
        body: 'Mettre en lumière les travaux affiliés à l’UNC, pour qu’ils existent aussi hors des cercles spécialisés.',
      },
      {
        title: 'Rendre accessible',
        body: 'Offrir une lecture claire, sans jargon inutile, pour que chacun puisse entrer dans un sujet.',
      },
      {
        title: 'Conserver le sens',
        body: 'La vulgarisation n’efface pas l’œuvre. Nous gardons l’authenticité des ouvrages et le propos des chercheurs.',
      },
    ],
    teamTitle: 'L’équipe',
    teamLead:
      'Conçu et développé par une équipe étudiante, encadrée par l’IUT de Nouvelle-Calédonie.',
    roles: {
      loann: 'Chef de projet, communication et création',
      joshua: 'Développeur back',
      leandre: 'Développeur front et UX/UI',
      lorenzo: 'Développeur LLM et création',
    },
    discoverLead: 'Pour continuer, découvrez',
    categoriesCta: 'les catégories',
    institutesCta: 'les instituts de recherche',
    discoverJoin: 'ou',
    backHome: "Retour à l'accueil",
  },
  en: {
    metaTitle: 'About, Lab Horizon',
    badge: 'University of New Caledonia',
    title: 'A horizon for New Caledonian research',
    lead:
      'Lab Horizon started from a simple idea: that work done here should have a place where people can find it, understand it, and come back to it.',
    exploreCta: 'Explore the catalogue',
    projectTitle: 'The project',
    projectBody: [
      'Lab Horizon is a way into research at the University of New Caledonia and among its partners. A platform for the public, students and researchers, without needing to know already where to look.',
      'You can browse publications by field, meet the institutes, and find a catalogue built for this territory.',
    ],
    whyTitle: 'Why Lab Horizon',
    whyBody:
      'New Caledonian research exists, it is rich, and it often lives elsewhere: in journals, in archives, in networks few people open. What was missing was a place to arrive, to understand, and to go further. That is the place we are building.',
    pillars: [
      {
        title: 'Showcase',
        body: 'Bring UNC-affiliated work into the light, so it also exists beyond specialist circles.',
      },
      {
        title: 'Make it accessible',
        body: 'Offer a clear reading, without needless jargon, so anyone can enter a subject.',
      },
      {
        title: 'Keep the meaning',
        body: 'Plain language does not erase the work. We keep the authenticity of the documents and the intent of the researchers.',
      },
    ],
    teamTitle: 'The team',
    teamLead:
      'Designed and built by a student team, supervised by the IUT of New Caledonia.',
    roles: {
      loann: 'Project lead, communication and design',
      joshua: 'Back-end developer',
      leandre: 'Front-end developer and UX/UI',
      lorenzo: 'LLM developer and design',
    },
    discoverLead: 'To go further, explore',
    categoriesCta: 'the research fields',
    institutesCta: 'the research institutes',
    discoverJoin: 'or',
    backHome: 'Back to home',
  },
} as const satisfies Record<
  Locale,
  {
    metaTitle: string
    badge: string
    title: string
    lead: string
    exploreCta: string
    projectTitle: string
    projectBody: readonly string[]
    whyTitle: string
    whyBody: string
    pillars: readonly { title: string; body: string }[]
    teamTitle: string
    teamLead: string
    roles: Record<AboutTeamMemberId, string>
    discoverLead: string
    categoriesCta: string
    institutesCta: string
    discoverJoin: string
    backHome: string
  }
>
