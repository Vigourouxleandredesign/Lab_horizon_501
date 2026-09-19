import type { Locale } from './home'

export type LegalKind = 'mentions-legales' | 'confidentialite' | 'cookies'

type LegalSection = {
  heading: string
  paragraphs: string[]
}

type LegalPageCopy = {
  title: string
  intro: string
  sections: LegalSection[]
}

export const legalCopy = {
  fr: {
    'mentions-legales': {
      title: 'Mentions légales',
      intro:
        'Lab Horizon est une plateforme de valorisation de la recherche portée par l’Université de la Nouvelle-Calédonie (UNC), développée dans le cadre du projet étudiant SAE 501 de l’IUT de Nouvelle-Calédonie.',
      sections: [
        {
          heading: 'Éditeur du site',
          paragraphs: [
            'Université de la Nouvelle-Calédonie (UNC), Nouméa, Nouvelle-Calédonie.',
            'Les coordonnées complètes de l’éditeur (adresse postale, SIRET, directeur de la publication) seront publiées par l’UNC/IUT avant la mise en production du site.',
          ],
        },
        {
          heading: 'Conception et réalisation',
          paragraphs: [
            'Lab Horizon a été conçu et développé par une équipe étudiante de l’IUT de Nouvelle-Calédonie (SAE 501), sous l’encadrement pédagogique de l’UNC.',
          ],
        },
        {
          heading: 'Hébergement',
          paragraphs: [
            'Version de démonstration : Netlify, Inc. (netlify.com), 512 2nd Street, San Francisco, CA 94107, États-Unis.',
            'Version de production visée : infrastructure de l’Université de la Nouvelle-Calédonie.',
          ],
        },
        {
          heading: 'Propriété intellectuelle',
          paragraphs: [
            'Les publications scientifiques, résumés vulgarisés et contenus éditoriaux référencés sur Lab Horizon demeurent la propriété de leurs auteurs et des établissements de recherche concernés (UNC et unités de recherche partenaires). Toute reproduction est soumise à leur autorisation, sauf mention contraire.',
          ],
        },
        {
          heading: 'Contact et signalement',
          paragraphs: [
            'Pour toute question relative au site, un signalement d’erreur ou de contenu inapproprié, une adresse de contact sera publiée par l’UNC/IUT avant la mise en production.',
          ],
        },
      ],
    },
    confidentialite: {
      title: 'Politique de confidentialité',
      intro:
        'Cette politique explique quelles données personnelles Lab Horizon collecte, pourquoi, et comment vous pouvez exercer vos droits.',
      sections: [
        {
          heading: 'Responsable du traitement',
          paragraphs: ['Université de la Nouvelle-Calédonie (UNC), éditeur de Lab Horizon.'],
        },
        {
          heading: 'Données collectées',
          paragraphs: [
            'Compte chercheur : nom, adresse email, mot de passe (stocké de façon chiffrée) et identifiant ORCID (facultatif).',
            'Navigation : aucune donnée de suivi publicitaire n’est collectée à ce jour (voir la politique cookies).',
          ],
        },
        {
          heading: 'Finalités du traitement',
          paragraphs: [
            'Authentification et gestion de votre compte chercheur ; publication et valorisation de vos travaux de recherche et de leurs versions vulgarisées ; amélioration du service.',
          ],
        },
        {
          heading: 'Base légale',
          paragraphs: [
            'Exécution du service demandé (création et gestion de compte) et, le cas échéant, votre consentement.',
          ],
        },
        {
          heading: 'Durée de conservation',
          paragraphs: [
            'Les données de compte sont conservées tant que le compte est actif. En cas de suppression de compte, les données personnelles sont supprimées, sous réserve des obligations légales de conservation.',
          ],
        },
        {
          heading: 'Destinataires des données',
          paragraphs: [
            'Les données sont accessibles à l’équipe technique et administrative de l’UNC/IUT en charge de la plateforme. Elles ne sont ni vendues ni transmises à des tiers à des fins commerciales.',
          ],
        },
        {
          heading: 'Vos droits',
          paragraphs: [
            'Conformément à la réglementation applicable, vous disposez d’un droit d’accès, de rectification et d’effacement de vos données.',
            'Une partie de ces droits est accessible directement depuis votre espace « Votre compte » (déploiement progressif) ; vous pouvez également nous contacter à l’adresse indiquée dans les mentions légales.',
          ],
        },
        {
          heading: 'Sécurité',
          paragraphs: [
            'Les mots de passe sont stockés sous forme chiffrée (hachage), les sessions utilisent des cookies httpOnly, et les échanges sont sécurisés par HTTPS en production.',
          ],
        },
      ],
    },
    cookies: {
      title: 'Politique cookies',
      intro:
        'Lab Horizon n’utilise que des cookies et stockages techniques strictement nécessaires au fonctionnement du site. Aucun cookie publicitaire ou de mesure d’audience n’est déposé à ce jour.',
      sections: [
        {
          heading: 'Cookies strictement nécessaires',
          paragraphs: [
            'XSRF-TOKEN : protège les formulaires contre les attaques CSRF, posé lors de la connexion à votre espace chercheur.',
            'Cookie de session Laravel (httpOnly) : maintient votre connexion active pendant votre visite.',
          ],
        },
        {
          heading: 'Stockage local (sessionStorage)',
          paragraphs: [
            'lab-horizon-locale : mémorise votre choix de langue (français/anglais) pour la durée de votre visite.',
            'lab-horizon-demo-session : simule une session en mode démonstration (comptes de test), sans donnée personnelle réelle.',
          ],
        },
        {
          heading: 'Ressources tierces',
          paragraphs: [
            'Les polices du site sont chargées depuis Google Fonts (fonts.googleapis.com, fonts.gstatic.com). Ce chargement n’installe pas de cookie de suivi mais implique une requête réseau vers les serveurs de Google.',
          ],
        },
        {
          heading: 'Pas de bandeau de consentement',
          paragraphs: [
            'Le site n’affiche pas de bandeau de consentement car il n’utilise, à ce jour, que des cookies strictement nécessaires, non soumis à consentement. Si des cookies de mesure d’audience ou de personnalisation étaient ajoutés à l’avenir, cette page serait mise à jour et un mécanisme de consentement serait proposé.',
          ],
        },
        {
          heading: 'Gérer vos préférences',
          paragraphs: [
            'Vous pouvez à tout moment supprimer les cookies via les réglages de votre navigateur. Cela déconnectera votre session en cours.',
          ],
        },
      ],
    },
    backHome: "Retour à l'accueil",
  },
  en: {
    'mentions-legales': {
      title: 'Legal notice',
      intro:
        'Lab Horizon is a research showcase platform run by the University of New Caledonia (UNC), developed as part of the SAE 501 student project at the IUT of New Caledonia.',
      sections: [
        {
          heading: 'Publisher',
          paragraphs: [
            'University of New Caledonia (UNC), Nouméa, New Caledonia.',
            'Full publisher details (postal address, company registration number, publication director) will be published by UNC/IUT before the site goes live.',
          ],
        },
        {
          heading: 'Design and development',
          paragraphs: [
            'Lab Horizon was designed and built by a student team at the IUT of New Caledonia (SAE 501), under the academic supervision of UNC.',
          ],
        },
        {
          heading: 'Hosting',
          paragraphs: [
            'Demo version: Netlify, Inc. (netlify.com), 512 2nd Street, San Francisco, CA 94107, USA.',
            'Target production environment: University of New Caledonia infrastructure.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'Scientific publications, plain-language summaries and editorial content referenced on Lab Horizon remain the property of their authors and the relevant research institutions (UNC and partner research units). Any reproduction requires their authorisation, unless stated otherwise.',
          ],
        },
        {
          heading: 'Contact and reporting',
          paragraphs: [
            'For any question about the site, or to report an error or inappropriate content, a contact address will be published by UNC/IUT before go-live.',
          ],
        },
      ],
    },
    confidentialite: {
      title: 'Privacy policy',
      intro:
        'This policy explains what personal data Lab Horizon collects, why, and how you can exercise your rights.',
      sections: [
        {
          heading: 'Data controller',
          paragraphs: ['University of New Caledonia (UNC), publisher of Lab Horizon.'],
        },
        {
          heading: 'Data collected',
          paragraphs: [
            'Researcher account: name, email address, password (stored encrypted) and ORCID identifier (optional).',
            'Browsing: no advertising tracking data is collected at this time (see the cookie policy).',
          ],
        },
        {
          heading: 'Purposes of processing',
          paragraphs: [
            'Authentication and management of your researcher account; publication and promotion of your research work and its plain-language versions; service improvement.',
          ],
        },
        {
          heading: 'Legal basis',
          paragraphs: [
            'Performance of the requested service (account creation and management) and, where applicable, your consent.',
          ],
        },
        {
          heading: 'Retention period',
          paragraphs: [
            'Account data is kept for as long as the account is active. If the account is deleted, personal data is erased, subject to legal retention obligations.',
          ],
        },
        {
          heading: 'Data recipients',
          paragraphs: [
            'Data is accessible to the UNC/IUT technical and administrative team in charge of the platform. It is neither sold nor shared with third parties for commercial purposes.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'In accordance with applicable regulations, you have the right to access, rectify and erase your data.',
            'Some of these rights are directly available from your "Your account" area (progressive rollout); you may also contact us at the address given in the legal notice.',
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'Passwords are stored encrypted (hashed), sessions use httpOnly cookies, and exchanges are secured with HTTPS in production.',
          ],
        },
      ],
    },
    cookies: {
      title: 'Cookie policy',
      intro:
        'Lab Horizon only uses cookies and technical storage strictly necessary for the site to work. No advertising or audience-measurement cookie is set at this time.',
      sections: [
        {
          heading: 'Strictly necessary cookies',
          paragraphs: [
            'XSRF-TOKEN: protects forms against CSRF attacks, set when you sign in to your researcher area.',
            'Laravel session cookie (httpOnly): keeps your connection active during your visit.',
          ],
        },
        {
          heading: 'Local storage (sessionStorage)',
          paragraphs: [
            'lab-horizon-locale: remembers your language choice (French/English) for the duration of your visit.',
            'lab-horizon-demo-session: simulates a session in demo mode (test accounts), with no real personal data.',
          ],
        },
        {
          heading: 'Third-party resources',
          paragraphs: [
            'Site fonts are loaded from Google Fonts (fonts.googleapis.com, fonts.gstatic.com). This does not set a tracking cookie but does involve a network request to Google’s servers.',
          ],
        },
        {
          heading: 'No consent banner',
          paragraphs: [
            'The site does not display a consent banner because it currently only uses strictly necessary cookies, which are not subject to consent. If audience-measurement or personalisation cookies are added in the future, this page will be updated and a consent mechanism will be offered.',
          ],
        },
        {
          heading: 'Managing your preferences',
          paragraphs: [
            'You can delete cookies at any time via your browser settings. This will sign you out of your current session.',
          ],
        },
      ],
    },
    backHome: 'Back to home',
  },
} as const satisfies Record<Locale, Record<LegalKind, LegalPageCopy> & { backHome: string }>

export function legalContent(kind: LegalKind, locale: Locale): LegalPageCopy {
  return legalCopy[locale][kind]
}
