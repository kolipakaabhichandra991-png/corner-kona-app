import type { Comment } from '@prisma/client'

export const MAX_COMMENT_LENGTH = 1000
/** Statuses the public can see. 'spam' and 'deleted' are hidden. */
export const VISIBLE_STATUSES = ['approved', 'reported']

const AVATARS = [
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-purple-500 to-violet-500',
  'from-fuchsia-500 to-pink-500',
]

function avatarFor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATARS[h % AVATARS.length]
}

/** Same field names as the CommentItem shape used by components/community/comments-section.tsx. */
export interface CommentDTO {
  id: string
  contentId: string
  author: string
  avatarBg: string
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  isReported: boolean
  replies: CommentDTO[]
}

export function toDTO(row: Comment, liked: Set<string>): CommentDTO {
  return {
    id: row.id,
    contentId: row.contentId,
    author: row.authorName,
    avatarBg: avatarFor(row.authorName),
    content: row.body,
    createdAt: row.createdAt.toISOString(),
    likes: row.likes,
    isLiked: liked.has(row.id),
    isReported: row.reported,
    replies: [],
  }
}

/** rows must be sorted newest-first. Replies are shown oldest-first under their parent. */
export function toTree(rows: Comment[], liked: Set<string>, sort: 'newest' | 'top'): CommentDTO[] {
  const byId = new Map<string, CommentDTO>()
  for (const r of rows) byId.set(r.id, toDTO(r, liked))

  for (const r of [...rows].reverse()) {
    if (!r.parentId) continue
    const parent = byId.get(r.parentId)
    const dto = byId.get(r.id)
    if (parent && dto) parent.replies.push(dto)
  }

  const roots: CommentDTO[] = []
  for (const r of rows) {
    if (!r.parentId) {
      const dto = byId.get(r.id)
      if (dto) roots.push(dto)
    }
  }
  if (sort === 'top') {
    roots.sort((a, b) => b.likes - a.likes || b.createdAt.localeCompare(a.createdAt))
  }
  return roots
}
