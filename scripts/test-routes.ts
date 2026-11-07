/**
 * Local test for the new database routes. Needs: `pnpm dev` running in another terminal and
 * ALLOW_DEV_USER=true in .env.local. Creates test rows (marked [ROUTE-TEST]) and deletes them at the end.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BASE = process.env.TEST_BASE_URL ?? 'http://localhost:3000'
const TAG = '[ROUTE-TEST]'
const CONTENT_ID = 'route-test-content'
let failures = 0

function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) {
    failures++
    if (detail !== undefined) console.log('      ->', JSON.stringify(detail))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any

async function call(path: string, init: { method?: string; body?: unknown; headers?: Record<string, string>; cookie?: string } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json', ...(init.headers ?? {}) }
  if (init.cookie) headers.cookie = init.cookie
  const res = await fetch(BASE + path, {
    method: init.method ?? 'GET',
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  let json: Json = null
  try {
    json = await res.json()
  } catch {
    json = null
  }
  const setCookies: string[] = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : []
  return { status: res.status, json, setCookies }
}

async function main() {
  const stamp = Date.now()
  const testEmail = `route-test-${stamp}@example.com`
  let visitorId: string | null = null

  try {
    const ping = await call(`/api/v1/comments?contentId=${CONTENT_ID}`)
    if (ping.status !== 200) {
      console.log(`Cannot reach ${BASE} (status ${ping.status}). Is "pnpm dev" running in another terminal?`)
      failures++
      return
    }
    check('public comment list works (empty at first)', Array.isArray(ping.json?.data))

    // --- user comments ---
    const loggedOut = await call('/api/v1/comments', {
      method: 'POST',
      headers: { 'x-dev-logged-out': '1' },
      body: { contentId: CONTENT_ID, body: `${TAG} nope` },
    })
    check('posting while logged out is refused (401)', loggedOut.status === 401, loggedOut)

    const created = await call('/api/v1/comments', {
      method: 'POST',
      body: { contentId: CONTENT_ID, body: `${TAG} hello` },
    })
    if (created.status === 401) {
      console.log('      Hint: add ALLOW_DEV_USER=true to .env.local and restart "pnpm dev".')
    }
    check('posting a comment works (201)', created.status === 201 && !!created.json?.data?.id, created)
    const commentId: string | undefined = created.json?.data?.id
    if (!commentId) return

    check('empty comment is refused (422)', (await call('/api/v1/comments', { method: 'POST', body: { contentId: CONTENT_ID, body: '   ' } })).status === 422)
    check(
      'comment over 1000 characters is refused (422)',
      (await call('/api/v1/comments', { method: 'POST', body: { contentId: CONTENT_ID, body: 'x'.repeat(1001) } })).status === 422,
    )

    const reply = await call('/api/v1/comments', {
      method: 'POST',
      body: { contentId: CONTENT_ID, body: `${TAG} reply`, parentId: commentId },
    })
    check('replying to a comment works (201)', reply.status === 201, reply)

    const list1 = await call(`/api/v1/comments?contentId=${CONTENT_ID}`)
    const top = (list1.json?.data ?? []).find((c: Json) => c.id === commentId)
    check('list shows the comment with its reply', !!top && top.replies?.length === 1, list1.json)

    // --- likes ---
    const like1 = await call(`/api/v1/comments/${commentId}/like`, { method: 'POST' })
    check('first like counts (liked: true, likes: 1)', like1.json?.data?.liked === true && like1.json?.data?.likes === 1, like1)
    const like2 = await call(`/api/v1/comments/${commentId}/like`, { method: 'POST' })
    check('second like undoes the first (liked: false, likes: 0)', like2.json?.data?.liked === false && like2.json?.data?.likes === 0, like2)
    const likeOut = await call(`/api/v1/comments/${commentId}/like`, { method: 'POST', headers: { 'x-dev-logged-out': '1' } })
    check('liking while logged out is refused (401)', likeOut.status === 401)

    // --- report ---
    const report = await call(`/api/v1/comments/${commentId}/report`, { method: 'POST', body: { reason: `${TAG} test report` } })
    check('reporting works', report.status === 200 && report.json?.data?.reported === true, report)
    await call(`/api/v1/comments/${commentId}/report`, { method: 'POST', body: {} })
    check('reporting twice keeps one report', (await prisma.commentReport.count({ where: { commentId } })) === 1)

    // --- admin (the cookie has the same format the admin login creates) ---
    const noAdmin = await call('/api/admin/comments')
    check('admin list without admin login is refused (401)', noAdmin.status === 401, noAdmin)

    const adminCookie =
      'corner_kona_admin_token=' +
      Buffer.from(JSON.stringify({ user: 'route-test', role: 'Super Admin', loginTime: Date.now() })).toString('base64')

    const adminList = await call('/api/admin/comments?status=reported', { cookie: adminCookie })
    const found = (adminList.json?.data ?? []).find((c: Json) => c.id === commentId)
    check('admin sees the reported comment with report count 1', !!found && found.reportCount === 1, adminList.json)

    const spam = await call(`/api/admin/comments/${commentId}`, { method: 'PATCH', cookie: adminCookie, body: { action: 'spam', note: `${TAG} test` } })
    check('admin marks it as spam', spam.status === 200 && spam.json?.data?.status === 'spam', spam)
    const list2 = await call(`/api/v1/comments?contentId=${CONTENT_ID}`)
    check('spam comment disappears from the public list', !(list2.json?.data ?? []).some((c: Json) => c.id === commentId), list2.json)
    check('moderation log row was written', (await prisma.moderationAction.count({ where: { commentId } })) >= 1)

    const badAction = await call(`/api/admin/comments/${commentId}`, { method: 'PATCH', cookie: adminCookie, body: { action: 'explode' } })
    check('unknown admin action is refused (422)', badAction.status === 422)

    // --- newsletter ---
    check('invalid email is refused (422)', (await call('/api/v1/newsletter', { method: 'POST', body: { email: 'nope' } })).status === 422)
    check('newsletter signup works (201)', (await call('/api/v1/newsletter', { method: 'POST', body: { email: testEmail } })).status === 201)
    check('same email twice is fine (201)', (await call('/api/v1/newsletter', { method: 'POST', body: { email: testEmail } })).status === 201)
    check('email stored exactly once', (await prisma.newsletterSubscriber.count({ where: { email: testEmail } })) === 1)

    // --- progress + transcript (use a real episode from the database) ---
    const episode = await prisma.episode.findFirst({ select: { id: true, slug: true } })
    if (!episode) {
      check('there is at least one episode in the database', false)
    } else {
      const put1 = await call('/api/v1/progress', { method: 'PUT', body: { episodeId: episode.id, positionSec: 123.5 } })
      check('saving progress works', put1.status === 200, put1)
      const cookieHeader = put1.setCookies.find((c) => c.startsWith('ck_visitor='))
      const cookie = cookieHeader ? cookieHeader.split(';')[0] : ''
      visitorId = cookie ? cookie.replace('ck_visitor=', '') : null
      check('a visitor cookie was issued', !!cookie)

      const get1 = await call(`/api/v1/progress?episodeId=${episode.id}`, { cookie })
      check('progress reads back (123.5)', get1.json?.data?.positionSec === 123.5, get1.json)
      await call('/api/v1/progress', { method: 'PUT', cookie, body: { episodeId: episode.id, positionSec: 200.25 } })
      const get2 = await call(`/api/v1/progress?slug=${episode.slug}`, { cookie })
      check('progress updates (200.25) and can be read by slug', get2.json?.data?.positionSec === 200.25, get2.json)
      check('still only one progress row for this visitor', visitorId ? (await prisma.listeningProgress.count({ where: { visitorId } })) === 1 : false)
      check('negative position is refused (422)', (await call('/api/v1/progress', { method: 'PUT', cookie, body: { episodeId: episode.id, positionSec: -5 } })).status === 422)

      const tr = await call(`/api/v1/episodes/${episode.slug}/transcript`)
      check('transcript route returns lines', Array.isArray(tr.json?.data?.lines) && tr.json.data.lines.length > 0, tr.json?.data?.source)
      console.log(`      (transcript source: ${tr.json?.data?.source})`)
    }
    check('unknown episode transcript gives 404', (await call('/api/v1/episodes/does-not-exist-xyz/transcript')).status === 404)
  } finally {
    // Clean up everything this script created. Likes, reports and moderation rows are removed with their comment.
    await prisma.comment.deleteMany({ where: { OR: [{ contentId: CONTENT_ID }, { body: { startsWith: TAG } }] } })
    await prisma.newsletterSubscriber.deleteMany({ where: { email: { startsWith: 'route-test-' } } })
    if (visitorId) await prisma.listeningProgress.deleteMany({ where: { visitorId } })
    await prisma.$disconnect()
    console.log('\nTest data cleaned up.')
    console.log(failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`)
    process.exitCode = failures === 0 ? 0 : 1
  }
}

main()
