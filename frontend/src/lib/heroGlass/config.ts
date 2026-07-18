/** Nombre max de splashes simultanés (shader + curseur). */
export const MAX_SPLASHES = 6

/** Splash cursor WebGL — tous les héros (accueil + domaines). */
export const heroGlassConfig = {
  /** Déplacement UV — réfraction + étirement directionnel. */
  strength: 0.08,
  /** Halo discret sur les crêtes d'onde. */
  highlight: 0.26,
  /** Lissage de l'apparition/disparition du hover (facteur lerp/s). */
  hoverLerp: 8,
  /** Vitesse minimale (px/s) pour un splash complet. */
  splashThreshold: 650,
  /** Vitesse minimale (px/s) pour une micro-onde (réactivité des petits gestes). */
  splashMicroThreshold: 175,
  /** Plage de vitesse au-delà du seuil pour saturer speed=1. */
  splashSpeedRange: 4,
  /** Nb max de splashes semés sur un seul déplacement. */
  splashMaxPerMove: 1,
  /** Délai minimum entre deux splashes complets (ms). */
  splashEmitCooldownMs: 145,
  /** Délai minimum entre deux micro-ondes (ms). */
  splashMicroEmitCooldownMs: 75,
  /** Distance minimale entre deux splashes complets (px). */
  splashMinSpacingPx: 44,
  /** Distance minimale entre deux micro-ondes (px). */
  splashMicroMinSpacingPx: 16,
  /** Rayon de base normalisé (0–1) d'un splash complet. */
  splashSize: 0.108,
  /** Rayon de base d'une micro-onde. */
  splashMicroSize: 0.072,
  /** Durée de vie relative des micro-ondes (× splashLife). */
  splashMicroLifeScale: 0.82,
  /** Speed shader min/max pour les micro-ondes. */
  splashMicroSpeedMin: 0.14,
  splashMicroSpeedMax: 0.48,
  /** Lag (px) des micro-ondes — plus court = plus collé au curseur. */
  splashMicroLagPx: 16,
  /** Durée de vie de base d'un splash (s). */
  splashLife: 1.45,
  /** Vitesse d'animation du splash (1 = temps réel, <1 = plus lent). */
  splashAgeScale: 0.55,
  /** Dispersion aléatoire du point d'émission (0–1). */
  splashJitter: 0.01,
  /** Traînée asymétrique derrière le curseur (1 = symétrique). */
  splashTail: 0.42,
  /** Biais de déformation directionnelle sur l'image (0–1). */
  splashDirectionBias: 0.38,
  /** Courbe vitesse → intensité (1 = linéaire, >1 = plus marqué aux vitesses hautes). */
  splashSpeedPower: 1.35,
  /** Déformation UV à vitesse min / max (speed 0→1). */
  deformStrengthMin: 0.058,
  deformStrengthMax: 0.168,
  /** Étirement comète à vitesse min / max. */
  stretchMin: 1.1,
  stretchMax: 3.65,
  /** Taille du splash : gain selon la vitesse (0–1). */
  sizeSpeedGain: 0.52,
  /** Réduction du lag (px) quand la vitesse augmente (0–1). */
  lagSpeedReduce: 0.22,
  /** Décalage du splash derrière le curseur (px), opposé au mouvement. */
  splashLagPx: 32,
  /** Décalage supplémentaire par splash suivant dans le même geste (px). */
  splashLagSpread: 40,
  /** Ancrage object-fit: cover (0–1) — équivalent CSS object-position. */
  objectPositionX: 0.5,
  objectPositionY: 0.5,
} as const

type WidenNumbers<T> = { [K in keyof T]: T[K] extends number ? number : T[K] }

export type HeroGlassConfig = WidenNumbers<typeof heroGlassConfig>

export function getHeroGlassConfig(): HeroGlassConfig {
  return { ...heroGlassConfig }
}
