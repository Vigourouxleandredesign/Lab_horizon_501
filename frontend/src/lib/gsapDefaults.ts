/** Durées et easings GSAP partagés (Lab Horizon). */
export const gsapMotion = {
  magnetic: {
    followDuration: 0.4,
    followEase: 'power3.out',
    resetDuration: 0.6,
    resetEase: 'elastic.out(1, 0.3)',
  },
  textReveal: {
    ease: 'power1.inOut',
    duration: 0.85,
    stagger: 0.15,
    lineOffset: '100%',
    scrollStart: 'top bottom',
    toggleActions: 'play reset play reset',
    heroDelay: 0.12,
    heroGhostDelay: 0.32,
    resizeDebounceMs: 500,
  },
  homeHero: {
    /** Image seule, puis overlay + texte ensemble. */
    introDelay: 1,
    overlayFadeDuration: 0.55,
    scrollCtaDelay: 1.35,
  },
} as const
