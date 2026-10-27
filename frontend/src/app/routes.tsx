import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import RequireAuth from '../auth/RequireAuth'
import AppFrame from '../components/AppFrame'
import BackofficeLayout from '../components/backoffice/BackofficeLayout'
import DomainPage from '../pages/DomainPage'
import HomePage from '../pages/HomePage'
import PublicationPage from '../pages/PublicationPage'
import SearchPage from '../pages/SearchPage'
import {
  AboutPage,
  CategoriesPage,
  ConnexionPage,
  InscriptionPage,
  LegalPage,
  NotFoundPage,
  UncResearchPage,
  PublicationReviewPage,
  ResearcherPage,
  NouveautesPage,
  BackofficeSearchPage,
  PublicationsPage,
  NewPublicationPage,
  EditPublicationPage,
  AccountSettingsPage,
  PageFallback,
} from './lazyPages'

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
