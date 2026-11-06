'use client'

import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Heart,
  CornerDownRight,
  Flag,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react'
import { type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export interface CommentItem {
  id: string
  contentId: string
  author: string
  avatarBg: string
  content: string
  createdAt: string
  likes: number
  isLiked?: boolean
  isReported?: boolean
  isVerified?: boolean
  replies?: CommentItem[]
}

const AVATAR_GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-purple-500 to-violet-500',
  'from-fuchsia-500 to-pink-500',
]

function getInitialSeeds(contentId: string, locale: Locale): CommentItem[] {
  const isHi = locale === 'hi'
  return [
    {
      id: `${contentId}-c1`,
      contentId,
      author: isHi ? 'आदित्य वर्मा' : 'Aaditya Verma',
      avatarBg: 'from-indigo-500 to-cyan-500',
      content: isHi
        ? 'यह दृष्टिकोण वाकई आँखें खोल देने वाला है! कॉर्नर कोना की स्टोरीटेलिंग बाकी सभी न्यूज़ पोर्टल्स से कहीं बेहतर है।'
        : 'This perspective is truly eye-opening! Corner Kona’s narrative storytelling is leaps ahead of traditional news portals.',
      createdAt: isHi ? '2 घंटे पहले' : '2 hours ago',
      likes: 24,
      isVerified: true,
      replies: [
        {
          id: `${contentId}-c1-r1`,
          contentId,
          author: isHi ? 'प्रिया नायर' : 'Priya Nair',
          avatarBg: 'from-pink-500 to-rose-500',
          content: isHi
            ? 'बिल्कुल सहमत हूँ! ऑडियो फॉर्मेट में सुनने पर यह और भी गहरा प्रभाव छोड़ता है।'
            : 'Completely agree! Listening in the audio format makes it hit even deeper.',
          createdAt: isHi ? '45 मिनट पहले' : '45 minutes ago',
          likes: 8,
          isVerified: false,
        },
      ],
    },
    {
      id: `${contentId}-c2`,
      contentId,
      author: isHi ? 'कबीर मेहता' : 'Kabir Mehta',
      avatarBg: 'from-amber-500 to-orange-500',
      content: isHi
        ? 'कहानियों को इस तरह संजोना कि युवा पीढ़ी भी जुड़ सके, यही आज के दौर की सबसे बड़ी ज़रूरत है।'
        : 'Structuring deep research into bites that resonate with Gen-Z is exactly what the modern Indian media landscape needed.',
      createdAt: isHi ? '4 घंटे पहले' : '4 hours ago',
      likes: 19,
      isVerified: false,
      replies: [],
    },
  ]
}

interface CommentsSectionProps {
  contentId: string
  contentTitle: string
  locale: Locale
  labels: {
    commentsTitle: string
    commentsSubtitle: string
    writeComment: string
    yourName: string
    postComment: string
    reply: string
    replies: string
    replyPlaceholder: string
    sendReply: string
    cancel: string
    report: string
    reported: string
    verifiedReader: string
  }
}

export function CommentsSection({ contentId, contentTitle, locale, labels }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [authorName, setAuthorName] = useState('')
  const [newCommentText, setNewCommentText] = useState('')
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top')
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set())

  // Load comments from localStorage or initialize with seed data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`ck_comments_${contentId}`)
      if (stored) {
        setComments(JSON.parse(stored))
      } else {
        const seeds = getInitialSeeds(contentId, locale)
        setComments(seeds)
        localStorage.setItem(`ck_comments_${contentId}`, JSON.stringify(seeds))
      }

      // Check if user has saved profile name
      const user = localStorage.getItem('ck_auth_user')
      if (user) {
        try {
          const parsed = JSON.parse(user)
          if (parsed.name) setAuthorName(parsed.name)
        } catch {
          // ignore
        }
      }
    } catch {
      setComments(getInitialSeeds(contentId, locale))
    }
  }, [contentId, locale])

  // Save to localStorage & sync with Admin moderation store
  const persistComments = (updated: CommentItem[]) => {
    setComments(updated)
    try {
      localStorage.setItem(`ck_comments_${contentId}`, JSON.stringify(updated))
      
      // Update global admin moderation collection
      const allCommentsRaw = localStorage.getItem('ck_moderation_queue') || '[]'
      const allComments: CommentItem[] = JSON.parse(allCommentsRaw)
      
      // Flatten current list
      const flat: CommentItem[] = []
      updated.forEach((c) => {
        flat.push(c)
        if (c.replies) flat.push(...c.replies)
      })
      
      const filtered = allComments.filter((c) => c.contentId !== contentId)
      localStorage.setItem('ck_moderation_queue', JSON.stringify([...filtered, ...flat]))
    } catch {
      // LocalStorage fallback
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return

    const name = authorName.trim() || (locale === 'hi' ? 'पाठक' : 'Corner Reader')
    const randomGrad = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)]

    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      contentId,
      author: name,
      avatarBg: randomGrad,
      content: newCommentText.trim(),
      createdAt: locale === 'hi' ? 'अभी' : 'Just now',
      likes: 1,
      isLiked: true,
      isVerified: false,
      replies: [],
    }

    const updated = [newComment, ...comments]
    persistComments(updated)
    setNewCommentText('')
  }

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return

    const name = authorName.trim() || (locale === 'hi' ? 'पाठक' : 'Corner Reader')
    const randomGrad = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)]

    const newReply: CommentItem = {
      id: `r_${Date.now()}`,
      contentId,
      author: name,
      avatarBg: randomGrad,
      content: replyText.trim(),
      createdAt: locale === 'hi' ? 'अभी' : 'Just now',
      likes: 1,
      isLiked: true,
      isVerified: false,
    }

    const updated = comments.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply],
        }
      }
      return c
    })

    persistComments(updated)
    setReplyText('')
    setReplyingToId(null)
  }

  const handleToggleLike = (commentId: string, isReply = false, parentId?: string) => {
    const updated = comments.map((c) => {
      if (!isReply && c.id === commentId) {
        const currentlyLiked = !!c.isLiked
        return {
          ...c,
          isLiked: !currentlyLiked,
          likes: currentlyLiked ? c.likes - 1 : c.likes + 1,
        }
      }
      if (isReply && c.id === parentId && c.replies) {
        return {
          ...c,
          replies: c.replies.map((r) => {
            if (r.id === commentId) {
              const currentlyLiked = !!r.isLiked
              return {
                ...r,
                isLiked: !currentlyLiked,
                likes: currentlyLiked ? r.likes - 1 : r.likes + 1,
              }
            }
            return r
          }),
        }
      }
      return c
    })
    persistComments(updated)
  }

  const handleReport = (id: string) => {
    setReportedIds((prev) => new Set(prev).add(id))
    try {
      const reports = JSON.parse(localStorage.getItem('ck_reported_items') || '[]')
      reports.push({ id, contentId, contentTitle, reportedAt: new Date().toISOString() })
      localStorage.setItem('ck_reported_items', JSON.stringify(reports))
    } catch {
      // ignore
    }
  }

  const totalCommentCount = comments.reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0)

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'top') return b.likes - a.likes
    return 0 // chronological from array
  })

  return (
    <section
      aria-labelledby="community-comments-heading"
      className="mt-8 rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <h2 id="community-comments-heading" className="text-xl font-extrabold tracking-tight sm:text-2xl">
              {labels.commentsTitle}
            </h2>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-black text-primary">
              {totalCommentCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{labels.commentsSubtitle}</p>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-muted-foreground">
          <ArrowUpDown className="size-3.5" />
          <button
            type="button"
            onClick={() => setSortBy('top')}
            className={cn(
              'rounded-full px-3 py-1 transition-colors',
              sortBy === 'top' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted hover:text-foreground',
            )}
          >
            {locale === 'hi' ? 'लोकप्रिय' : 'Top'}
          </button>
          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={cn(
              'rounded-full px-3 py-1 transition-colors',
              sortBy === 'newest' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted hover:text-foreground',
            )}
          >
            {locale === 'hi' ? 'नवीनतम' : 'Newest'}
          </button>
        </div>
      </div>

      {/* Main Comment Input Box */}
      <form onSubmit={handleAddComment} className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-primary to-accent font-bold text-white shadow-sm text-sm">
            {authorName ? authorName.charAt(0).toUpperCase() : 'CK'}
          </div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder={labels.yourName}
            className="w-full max-w-xs rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={labels.writeComment}
            className="w-full rounded-2xl border border-input bg-background/60 p-3.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="mt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-extrabold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-3.5" />
              {labels.postComment}
            </button>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="mt-8 space-y-6">
        {sortedComments.map((comment) => {
          const isReported = reportedIds.has(comment.id)
          return (
            <div key={comment.id} className="group relative rounded-2xl border border-border/40 bg-muted/20 p-4 transition-colors hover:bg-muted/30">
              <div className="flex items-start gap-3">
                {/* Author Avatar */}
                <div
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-tr font-bold text-white shadow-sm text-sm',
                    comment.avatarBg,
                  )}
                >
                  {comment.author.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-foreground">{comment.author}</span>
                    {comment.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <CheckCircle2 className="size-2.5" />
                        {labels.verifiedReader}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {/* Actions Bar */}
                  <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(comment.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 transition-colors',
                        comment.isLiked ? 'text-rose-500 font-bold' : 'hover:text-foreground',
                      )}
                    >
                      <Heart className={cn('size-3.5', comment.isLiked && 'fill-rose-500')} />
                      <span>{comment.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <CornerDownRight className="size-3.5" />
                      <span>{labels.reply}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReport(comment.id)}
                      disabled={isReported}
                      className={cn(
                        'inline-flex items-center gap-1 transition-colors ml-auto',
                        isReported ? 'text-amber-500 cursor-default' : 'hover:text-destructive',
                      )}
                    >
                      {isReported ? (
                        <>
                          <ShieldAlert className="size-3" />
                          <span>{labels.reported}</span>
                        </>
                      ) : (
                        <>
                          <Flag className="size-3" />
                          <span>{labels.report}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Inline Reply Box */}
                  {replyingToId === comment.id && (
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={labels.replyPlaceholder}
                        className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToId(null)
                            setReplyText('')
                          }}
                          className="rounded-full px-3 py-1 text-xs font-bold text-muted-foreground hover:bg-muted"
                        >
                          {labels.cancel}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-40"
                        >
                          {labels.sendReply}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Threaded Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 sm:pl-6 border-l-2 border-primary/20">
                      {comment.replies.map((reply) => {
                        const replyReported = reportedIds.has(reply.id)
                        return (
                          <div key={reply.id} className="rounded-xl bg-background/50 p-3 border border-border/30">
                            <div className="flex items-start gap-2.5">
                              <div
                                className={cn(
                                  'grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-tr font-bold text-white shadow-xs text-xs',
                                  reply.avatarBg,
                                )}
                              >
                                {reply.author.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-xs text-foreground">{reply.author}</span>
                                  <span className="text-[11px] text-muted-foreground">{reply.createdAt}</span>
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                  {reply.content}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleLike(reply.id, true, comment.id)}
                                    className={cn(
                                      'inline-flex items-center gap-1 transition-colors',
                                      reply.isLiked ? 'text-rose-500 font-bold' : 'hover:text-foreground',
                                    )}
                                  >
                                    <Heart className={cn('size-3', reply.isLiked && 'fill-rose-500')} />
                                    <span>{reply.likes}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReport(reply.id)}
                                    disabled={replyReported}
                                    className={cn(
                                      'inline-flex items-center gap-1 transition-colors ml-auto',
                                      replyReported ? 'text-amber-500 cursor-default' : 'hover:text-destructive',
                                    )}
                                  >
                                    {replyReported ? labels.reported : labels.report}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
