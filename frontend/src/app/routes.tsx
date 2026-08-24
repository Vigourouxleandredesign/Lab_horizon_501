import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
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
const AccountPage = lazy(() => import('../pages/AccountPage'))
const PublicationReviewPage = lazy(() => import('../pages/PublicationReviewPage'))
const ResearcherPage = lazy(() => import('../pages/ResearcherPage'))

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
      { path: 'chercheurs', element: withSuspense(<UncResearchPage />) },
      { path: 'categories/:slug', element: <DomainPage /> },
      { path: 'categories', element: withSuspense(<CategoriesPage />) },
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
          { index: true, element: withSuspense(<AccountPage />) },
          {
            path: 'publications/:id/review',
            element: withSuspense(<PublicationReviewPage />),
          },
        ],
      },
    ],
  },
])
