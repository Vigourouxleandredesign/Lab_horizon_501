export type Researcher = {
  id: string
  name: string
  institution: string
  domain: string
  category: string
  available: boolean
  photo: string
}

export type Publication = {
  id: string
  title: string
  category: string
  date: string
  authorId: string
  authorName: string
  institution: string
}

export { categories } from './categories'

export const researchers: Researcher[] = [
  {
    id: '1',
    name: 'Dr. Marie Dupont',
    institution: 'Universite de Nouvelle-Caledonie',
    domain: 'Ecologie marine et biodiversite',
    category: 'Biodiversité, environnement et santé',
    available: true,
    photo: 'https://images.unsplash.com/photo-1659353887272-703de19bec9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: '2',
    name: 'Prof. Jean-Baptiste Morel',
    institution: 'IRD Noumea',
    domain: 'Geosciences appliquees',
    category: 'Géosciences (sciences de la Terre)',
    available: false,
    photo: 'https://images.unsplash.com/photo-1574687175332-dd01d500359e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: '3',
    name: 'Dr. Amina Keita',
    institution: 'Universite de Nouvelle-Caledonie',
    domain: 'Droit public et institutions',
    category: 'Droit & sciences politiques',
    available: true,
    photo: 'https://images.unsplash.com/photo-1659355894391-a86ee16e10c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: '4',
    name: 'Prof. Thomas Riviere',
    institution: 'Universite Paris-Saclay (Mission NC)',
    domain: 'Didactique et formation',
    category: 'Éducation & Santé',
    available: false,
    photo: 'https://images.unsplash.com/photo-1758685848406-c737a196f682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: '5',
    name: 'Dr. Lea Moreau',
    institution: 'Universite de Nouvelle-Caledonie',
    domain: 'Economie territoriale',
    category: 'Économie & gestion',
    available: true,
    photo: 'https://images.unsplash.com/photo-1631816290138-9f0f79cada3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: '6',
    name: 'Prof. Karim Benali',
    institution: 'IFREMER Nouvelle-Caledonie',
    domain: 'Patrimoine et archeologie du Pacifique',
    category: 'Histoire & Archéologie',
    available: true,
    photo: 'https://images.unsplash.com/photo-1758685734414-951a86561065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
]

export const publications: Publication[] = [
  {
    id: '1',
    title: 'Biodiversite des recifs coralliens en Nouvelle-Caledonie',
    category: 'Biodiversité, environnement et santé',
    date: 'Mars 2024',
    authorId: '1',
    authorName: 'Dr. Marie Dupont',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '2',
    title: 'Geodynamique et risques sismiques en zone sud',
    category: 'Géosciences (sciences de la Terre)',
    date: 'Novembre 2023',
    authorId: '2',
    authorName: 'Prof. Jean-Baptiste Morel',
    institution: 'IRD Noumea',
  },
  {
    id: '3',
    title: 'Droit coutumier kanak et droit civil',
    category: 'Droit & sciences politiques',
    date: 'Janvier 2024',
    authorId: '3',
    authorName: 'Dr. Amina Keita',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '4',
    title: 'Pratiques educatives en milieu scolaire calédonien',
    category: 'Éducation & Santé',
    date: 'Aout 2023',
    authorId: '4',
    authorName: 'Prof. Thomas Riviere',
    institution: 'Universite Paris-Saclay',
  },
  {
    id: '5',
    title: 'Sante environnementale et exposition aux metaux en zone miniere',
    category: 'Biodiversité, environnement et santé',
    date: 'Fevrier 2024',
    authorId: '1',
    authorName: 'Dr. Marie Dupont',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '6',
    title: 'Restauration ecologique des mangroves du Grand Sud',
    category: 'Biodiversité, environnement et santé',
    date: 'Octobre 2023',
    authorId: '1',
    authorName: 'Dr. Marie Dupont',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '7',
    title: 'Cartographie des sols nickeliferes par teledetection',
    category: 'Géosciences (sciences de la Terre)',
    date: 'Juin 2024',
    authorId: '2',
    authorName: 'Prof. Jean-Baptiste Morel',
    institution: 'IRD Noumea',
  },
  {
    id: '8',
    title: 'Erosion cotiere et adaptation au changement climatique',
    category: 'Géosciences (sciences de la Terre)',
    date: 'Avril 2023',
    authorId: '2',
    authorName: 'Prof. Jean-Baptiste Morel',
    institution: 'IRD Noumea',
  },
  {
    id: '9',
    title: 'Formation des enseignants en contexte multilingue',
    category: 'Éducation & Santé',
    date: 'Mai 2024',
    authorId: '4',
    authorName: 'Prof. Thomas Riviere',
    institution: 'Universite Paris-Saclay',
  },
  {
    id: '10',
    title: 'Acces aux soins primaires en province Nord',
    category: 'Éducation & Santé',
    date: 'Decembre 2023',
    authorId: '4',
    authorName: 'Prof. Thomas Riviere',
    institution: 'Universite Paris-Saclay',
  },
  {
    id: '11',
    title: 'Impact du nickel sur l’emploi local et les filieres',
    category: 'Économie & gestion',
    date: 'Janvier 2024',
    authorId: '5',
    authorName: 'Dr. Lea Moreau',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '12',
    title: 'PME calédoniennes et resilience economique post-crise',
    category: 'Économie & gestion',
    date: 'Septembre 2023',
    authorId: '5',
    authorName: 'Dr. Lea Moreau',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '13',
    title: 'Gouvernance institutionnelle et processus de decolonisation',
    category: 'Droit & sciences politiques',
    date: 'Mars 2023',
    authorId: '3',
    authorName: 'Dr. Amina Keita',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '14',
    title: 'Participation citoyenne et politiques publiques en province',
    category: 'Droit & sciences politiques',
    date: 'Juillet 2024',
    authorId: '3',
    authorName: 'Dr. Amina Keita',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '15',
    title: 'Sites archeologiques lapita et echanges dans le Pacifique',
    category: 'Histoire & Archéologie',
    date: 'Fevrier 2024',
    authorId: '6',
    authorName: 'Prof. Karim Benali',
    institution: 'IFREMER Nouvelle-Caledonie',
  },
  {
    id: '16',
    title: 'Patrimoine oral kanak : methodes de preservation numerique',
    category: 'Histoire & Archéologie',
    date: 'Novembre 2023',
    authorId: '6',
    authorName: 'Prof. Karim Benali',
    institution: 'IFREMER Nouvelle-Caledonie',
  },
  {
    id: '17',
    title: 'Revitalisation des langues kanak en milieu scolaire',
    category: 'Sociétés, langues & cultures océaniennes',
    date: 'Avril 2024',
    authorId: '4',
    authorName: 'Prof. Thomas Riviere',
    institution: 'Universite Paris-Saclay',
  },
  {
    id: '18',
    title: 'Anthropologie des pratiques culturelles en Nouvelle-Caledonie',
    category: 'Sociétés, langues & cultures océaniennes',
    date: 'Aout 2023',
    authorId: '3',
    authorName: 'Dr. Amina Keita',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '19',
    title: 'Tourisme culturel et identites dans le Pacifique sud',
    category: 'Sociétés, langues & cultures océaniennes',
    date: 'Mai 2023',
    authorId: '5',
    authorName: 'Dr. Lea Moreau',
    institution: 'Universite de Nouvelle-Caledonie',
  },
  {
    id: '20',
    title: 'Strategies de diversification economique des iles',
    category: 'Économie & gestion',
    date: 'Mars 2024',
    authorId: '5',
    authorName: 'Dr. Lea Moreau',
    institution: 'Universite de Nouvelle-Caledonie',
  },
]
