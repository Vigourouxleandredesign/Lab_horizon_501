import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import RequireAuth from '../auth/RequireAuth'
import AppFrame from '../components/AppFrame'
import BackofficeLayout from '../components/backoffice/BackofficeLayout'
import { LoadingState } from '../components/QueryStates'
import DomainPage from '../pages/DomainPage'
import HomePage from '../pages/HomePage'
import PublicationPage from '../pages/PublicationPage'
import SearchPage from '../pages/SearchPage'

const AboutPage = lazy(() => import('../pages/AboutPage'))
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'))
const ConnexionPage = lazy(() => import('../pages/ConnexionPage'))
const InscriptionPage = lazy(() => import('../pages/InscriptionPage'))
const LegalPage = lazy(() => import('../pages/LegalPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const UncResearchPage = lazy(() => import('../pages/UncResearchPage'))
const PublicationReviewPage = lazy(() => import('../pages/PublicationReviewPage'))
const ResearcherPage = lazy(() => import('../pages/ResearcherPage'))
const NouveautesPage = lazy(() => import('../pages/backoffice/NouveautesPage'))
const BackofficeSearchPage = lazy(() => import('../pages/backoffice/BackofficeSearchPage'))
const PublicationsPage = lazy(() => import('../pages/backoffice/PublicationsPage'))
const NewPublicationPage = lazy(() => import('../pages/backoffice/NewPublicationPage'))
const EditPublicationPage = lazy(() => import('../pages/backoffice/EditPublicationPage'))
const AccountSettingsPage = lazy(() => import('../pages/backoffice/AccountSettingsPage'))

function PageFallback() {
  return <LoadingState label="…" />
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppFrame />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'recherche', element: <SearchPage /> },
      { path: 'publications/:id', element: <PublicationPage /> },
      {
        path: 'chercheurs',
        element: withSuspense(<UncResearchPage />),
        handle: { overlayHeader: true },
      },
      { path: 'categories/:slug', element: <DomainPage /> },
      {
        path: 'categories',
        element: withSuspense(<CategoriesPage />),
        handle: { overlayHeader: true },
      },
      {
        path: 'a-propos',
        element: withSuspense(<AboutPage />),
        handle: { overlayHeader: true },
      },
      { path: 'connexion', element: withSuspense(<ConnexionPage />) },
      { path: 'inscription', element: withSuspense(<InscriptionPage />) },
      {
        path: 'mentions-legales',
        element: withSuspense(<LegalPage kind="mentions-legales" />),
      },
      {
        path: 'confidentialite',
        element: withSuspense(<LegalPage kind="confidentialite" />),
      },
      { path: 'cookies', element: withSuspense(<LegalPage kind="cookies" />) },

      {
        element: <RequireAuth />,
        children: [{ path: 'chercheurs/:id', element: withSuspense(<ResearcherPage />) }],
      },

      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
        handle: { overlayHeader: true },
      },
    ],
  },

  {
    path: '/compte',
    element: <RequireAuth />,
    children: [
      {
        element: <BackofficeLayout />,
        children: [
          { index: true, element: <Navigate to="nouveautes" replace /> },
          { path: 'nouveautes', element: withSuspense(<NouveautesPage />) },
          { path: 'recherche', element: withSuspense(<BackofficeSearchPage />) },
          { path: 'publications', element: withSuspense(<PublicationsPage />) },
          { path: 'publications/nouvelle', element: withSuspense(<NewPublicationPage />) },
          {
            path: 'publications/:id/modifier',
            element: withSuspense(<EditPublicationPage />),
          },
          {
            path: 'publications/:id/review',
            element: withSuspense(<PublicationReviewPage />),
          },
          { path: 'profil', element: withSuspense(<AccountSettingsPage />) },
        ],
      },
    ],
  },
])
