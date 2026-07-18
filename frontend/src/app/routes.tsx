import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from '../auth/RequireAuth'
import AppFrame from '../components/AppFrame'
import BackofficeLayout from '../components/backoffice/BackofficeLayout'
import AboutPage from '../pages/AboutPage'
import AccountPage from '../pages/AccountPage'
import CategoriesPage from '../pages/CategoriesPage'
import ConnexionPage from '../pages/ConnexionPage'
import InscriptionPage from '../pages/InscriptionPage'
import DomainPage from '../pages/DomainPage'
import HomePage from '../pages/HomePage'
import LegalPage from '../pages/LegalPage'
import NotFoundPage from '../pages/NotFoundPage'
import PublicationPage from '../pages/PublicationPage'
import PublicationReviewPage from '../pages/PublicationReviewPage'
import ResearcherPage from '../pages/ResearcherPage'
import SearchPage from '../pages/SearchPage'
import UncResearchPage from '../pages/UncResearchPage'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppFrame />,
    children: [
      // ----- Zone publique (sans compte) -----
      { index: true, element: <HomePage /> },
      { path: 'recherche', element: <SearchPage /> },
      { path: 'publications/:id', element: <PublicationPage /> },
      { path: 'chercheurs', element: <UncResearchPage /> },
      { path: 'categories/:slug', element: <DomainPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'a-propos', element: <AboutPage /> },
      { path: 'connexion', element: <ConnexionPage /> },
      { path: 'inscription', element: <InscriptionPage /> },
      { path: 'mentions-legales', element: <LegalPage kind="mentions-legales" /> },
      { path: 'confidentialite', element: <LegalPage kind="confidentialite" /> },
      { path: 'cookies', element: <LegalPage kind="cookies" /> },

      // ----- Fiche chercheur (connecté, garde publique AppFrame) -----
      {
        element: <RequireAuth />,
        children: [{ path: 'chercheurs/:id', element: <ResearcherPage /> }],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ----- Backoffice chercheur — layout à part (doc 07 §5) -----
  {
    path: '/compte',
    element: <RequireAuth />,
    children: [
      {
        element: <BackofficeLayout />,
        children: [
          { index: true, element: <AccountPage /> },
          { path: 'publications/:id/review', element: <PublicationReviewPage /> },
        ],
      },
    ],
  },
])
