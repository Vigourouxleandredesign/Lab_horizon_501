/**
 * Pages chargées à la demande + fallback de chargement.
 * Module séparé de routes.tsx : un fichier n'exporte que des composants (Fast Refresh).
 */
import { lazy } from 'react'
import { LoadingState } from '../components/QueryStates'

export const AboutPage = lazy(() => import('../pages/AboutPage'))
export const CategoriesPage = lazy(() => import('../pages/CategoriesPage'))
export const ConnexionPage = lazy(() => import('../pages/ConnexionPage'))
export const InscriptionPage = lazy(() => import('../pages/InscriptionPage'))
export const LegalPage = lazy(() => import('../pages/LegalPage'))
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
export const UncResearchPage = lazy(() => import('../pages/UncResearchPage'))
export const PublicationReviewPage = lazy(() => import('../pages/PublicationReviewPage'))
export const ResearcherPage = lazy(() => import('../pages/ResearcherPage'))
export const NouveautesPage = lazy(() => import('../pages/backoffice/NouveautesPage'))
export const BackofficeSearchPage = lazy(() => import('../pages/backoffice/BackofficeSearchPage'))
export const PublicationsPage = lazy(() => import('../pages/backoffice/PublicationsPage'))
export const NewPublicationPage = lazy(() => import('../pages/backoffice/NewPublicationPage'))
export const EditPublicationPage = lazy(() => import('../pages/backoffice/EditPublicationPage'))
export const AccountSettingsPage = lazy(() => import('../pages/backoffice/AccountSettingsPage'))

export function PageFallback() {
  return <LoadingState label="…" />
}
