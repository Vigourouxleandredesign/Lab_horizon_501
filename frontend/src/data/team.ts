/** Équipe projet Lab Horizon (SAE 501). Les rôles sont dans i18n/about. */
export const ABOUT_TEAM = [
  { id: 'loann', firstName: 'Loann', lastName: 'Fisiipeau' },
  { id: 'joshua', firstName: 'Joshua', lastName: 'Louis-Rose Rosamond' },
  { id: 'leandre', firstName: 'Léandre', lastName: 'Vigouroux' },
  { id: 'lorenzo', firstName: 'Lorenzo', lastName: 'Coppolino' },
] as const

export type AboutTeamMemberId = (typeof ABOUT_TEAM)[number]['id']
