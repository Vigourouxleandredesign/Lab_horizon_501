import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { gsapMotion } from './gsapDefaults'

gsap.registerPlugin(ScrollTrigger)

export const TEXT_REVEAL_LINE_WRAPPER_CLASS = 'lh-text-reveal-line-wrapper'

export type TextRevealSetupOptions = {
  playOnMount?: boolean
  delay?: number
  stagger?: number
  start?: string
  toggleActions?: string
}

export type TextRevealCleanup = () => void

/** Découpe en lignes, enveloppe chaque ligne, anime le reveal (GSAP + ScrollTrigger). */
export function setupTextReveal(
  el: HTMLElement,
  options: TextRevealSetupOptions = {},
): TextRevealCleanup {
  const {
    playOnMount = false,
    delay = 0,
    stagger = gsapMotion.textReveal.stagger,
    start = gsapMotion.textReveal.scrollStart,
    toggleActions = gsapMotion.textReveal.toggleActions,
  } = options

  const split = new SplitType(el, { types: 'lines' })
  const lines = [...(split.lines ?? [])]

  for (const line of lines) {
    const wrapper = document.createElement('div')
    wrapper.className = TEXT_REVEAL_LINE_WRAPPER_CLASS
    line.parentNode?.insertBefore(wrapper, line)
    wrapper.appendChild(line)
  }

  gsap.set(lines, { y: gsapMotion.textReveal.lineOffset })

  const tweenVars: gsap.TweenVars = {
    y: 0,
    ease: gsapMotion.textReveal.ease,
    stagger,
    duration: gsapMotion.textReveal.duration,
    delay,
  }

  if (!playOnMount) {
    tweenVars.scrollTrigger = {
      trigger: el,
      start,
      toggleActions,
    }
  }

  const tween = gsap.to(lines, tweenVars)

  if (!playOnMount) {
    ScrollTrigger.refresh()
  }

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    gsap.killTweensOf(lines)
    split.revert()
  }
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
