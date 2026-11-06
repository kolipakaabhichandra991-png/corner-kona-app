import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { getStories } from '@/lib/content/repository'
import type { Category, Story } from '@/lib/content/types'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { brand } from '@/config/brand'
import { LikeButton } from '@/components/like-button'
import { ShareButtons } from '@/components/share-buttons'
import { FormatChips } from '@/components/home/format-chips'
import { StoryCard } from '@/components/home/story-card'
import { CommentsSection } from '@/components/community/comments-section'
import { ArticleJsonLd } from '@/components/seo/json-ld'

export async function StoryPage({ locale, story, category }: { locale: Locale; story: Story; category: Category }) {
  const t = getDictionary(locale)
  const s = sectionStyle[story.category]
  const more = (await getStories()).filter((x) => x.id !== story.id).slice(0, 3)
  const published = new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'long' }).format(
    new Date(story.publishedAt),
  )

  const shareUrl = `${brand.url}${localePath(locale, `/${category.slug}/${story.slug}`)}`

  return (
    <div className="flex flex-col gap-14 pb-16">
      <ArticleJsonLd story={story} locale={locale} url={shareUrl} />
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-6 md:pt-10">
        <Link
          href={localePath(locale, `/${category.slug}`)}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {category.name[locale]}
        </Link>
        <span className={cn('h-1.5 w-14 rounded-full', s.bg)} aria-hidden="true" />
        <h1 className="font-display text-4xl leading-tight font-extrabold text-balance md:text-5xl">{story.title[locale]}</h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">{story.dek[locale]}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 border-y py-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={story.publishedAt}>{published}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" aria-hidden="true" />
              {story.readMin} {t.pages.readTime}
            </span>
          </div>
          <LikeButton id={story.id} label={locale === 'hi' ? 'पसंद करें' : 'Like'} size={18} />
        </div>
        <ShareButtons
          url={shareUrl}
          title={story.title[locale]}
          labels={{
            share: t.pages.share,
            whatsapp: t.pages.shareWhatsapp,
            twitter: t.pages.shareTwitter,
            copyLink: t.pages.copyLink,
            copied: t.pages.linkCopied,
          }}
        />
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted">
          <Image src={story.image || '/placeholder.svg'} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>
        <FormatChips locale={locale} t={t} formats={story.formats} />
        <p className="text-lg leading-relaxed">{story.dek[locale]}</p>
        <CommentsSection
          contentId={story.id}
          contentTitle={story.title[locale]}
          locale={locale}
          labels={{
            commentsTitle: t.pages.commentsTitle,
            commentsSubtitle: t.pages.commentsSubtitle,
            writeComment: t.pages.writeComment,
            yourName: t.pages.yourName,
            postComment: t.pages.postComment,
            reply: t.pages.reply,
            replies: t.pages.replies,
            replyPlaceholder: t.pages.replyPlaceholder,
            sendReply: t.pages.sendReply,
            cancel: t.pages.cancel,
            report: t.pages.report,
            reported: t.pages.reported,
            verifiedReader: t.pages.verifiedReader,
          }}
        />
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-stories-h" className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 md:px-6">
          <h2 id="more-stories-h" className="text-2xl font-extrabold">
            {t.pages.moreStories}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((x) => (
              <li key={x.id}>
                <StoryCard locale={locale} t={t} story={x} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
