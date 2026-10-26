import { beforeEach, describe, expect, it } from 'vitest'
import {
  hasSeenPublicationReview,
  isReviewPendingUnread,
  markPublicationReviewSeen,
} from '../../src/lib/reviewSeen'

describe('reviewSeen', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('marque une publication comme vue', () => {
    expect(hasSeenPublicationReview('pub-1')).toBe(false)
    markPublicationReviewSeen('pub-1')
    expect(hasSeenPublicationReview('pub-1')).toBe(true)
    expect(hasSeenPublicationReview('pub-2')).toBe(false)
  })

  it('isReviewPendingUnread = pending et jamais ouverte', () => {
    expect(isReviewPendingUnread('pub-1', true)).toBe(true)
    expect(isReviewPendingUnread('pub-1', false)).toBe(false)
    expect(isReviewPendingUnread('pub-1', undefined)).toBe(false)

    markPublicationReviewSeen('pub-1')
    expect(isReviewPendingUnread('pub-1', true)).toBe(false)
  })
})
