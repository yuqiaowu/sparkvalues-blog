import { QuartzComponent } from "./types"
import style from "./styles/homeHero.scss"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { Date as DateComponent, getDate } from "./Date"

const curatedSlugs = ["obsidian-gemini-cli-guide", "web3-wallet-faucet-guide"] as const

const pillars: { title: string; desc: string; tagHref: FullSlug }[] = [
  {
    title: "AI 共创",
    desc: "实战分享如何把 Gemini CLI、终端与 Obsidian 串成顺手的知识工作流。",
    tagHref: "tags/AI知识库" as FullSlug,
  },
  {
    title: "效率工具",
    desc: "从 Obsidian 到命令行，记录那些让我保持专注与好奇的设置。",
    tagHref: "tags/Obsidian" as FullSlug,
  },
  {
    title: "Web3 入门",
    desc: "把复杂的链上操作拆解成一步步教程，让更多人敢于动手。",
    tagHref: "tags/web3" as FullSlug,
  },
]

const isPrimaryNote = (page: QuartzPluginData) => {
  const slug = page.slug
  if (!slug) return false
  if (slug === "index" || slug.endsWith("/index")) return false
  if (slug.startsWith("tags/")) return false
  if (slug.startsWith("static/")) return false
  return true
}

export const HomeHero: QuartzComponent = ({ allFiles, fileData, cfg }) => {
  const notes = allFiles.filter(isPrimaryNote)
  const tagSet = new Set<string>()
  for (const page of notes) {
    for (const tag of page.frontmatter?.tags ?? []) {
      tagSet.add(tag)
    }
  }

  const sorted = [...notes].sort(byDateAndAlphabetical(cfg))
  const latestUpdated = sorted[0]

  const curatedPages = curatedSlugs
    .map((slug) => sorted.find((page) => page.slug === slug))
    .filter((page): page is QuartzPluginData => Boolean(page))

  const highlights: QuartzPluginData[] = [...curatedPages]
  const seen = new Set(highlights.map((page) => page.slug!))
  for (const page of sorted) {
    if (highlights.length >= 3) break
    if (seen.has(page.slug!)) continue
    highlights.push(page)
    seen.add(page.slug!)
  }

  return (
    <section class="home-hero">
      <div class="home-hero__inner">
        <div class="home-hero__intro">
          <p class="home-hero__eyebrow">SparkValues · Digital Garden</p>
          <h1>把 AI 与 Web3 折腾成写作素材的实验室</h1>
          <p class="home-hero__summary">
            我会把折腾 Obsidian、命令行与分布式应用的过程写成可复用的指南，
            帮助创作者、独立开发者与好奇的朋友们在学习曲线上少走弯路。
          </p>
          <div class="home-hero__actions">
            <a
              class="button primary"
              href={resolveRelative(fileData.slug!, "obsidian-gemini-cli-guide" as SimpleSlug)}
            >
              查看 AI 共创指南
            </a>
            <a
              class="button ghost"
              href={resolveRelative(fileData.slug!, "web3-wallet-faucet-guide" as SimpleSlug)}
            >
              Web3 新手教程
            </a>
          </div>
          <ul class="home-hero__stats">
            <li>
              <span>{notes.length}</span>
              <p>篇公开手记</p>
            </li>
            <li>
              <span>{tagSet.size}</span>
              <p>个标签脉络</p>
            </li>
            {latestUpdated && (
              <li>
                <span>
                  <DateComponent date={getDate(cfg, latestUpdated)!} locale={cfg.locale} />
                </span>
                <p>最近更新</p>
              </li>
            )}
          </ul>
        </div>
        <div class="home-pillars">
          {pillars.map((pillar) => (
            <a
              key={pillar.title}
              class="home-pillars__card internal"
              href={resolveRelative(fileData.slug!, pillar.tagHref)}
            >
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </a>
          ))}
        </div>
      </div>
      {highlights.length > 0 && (
        <div class="home-featured">
          <div class="home-featured__header">
            <div>
              <p class="home-featured__eyebrow">精选长文</p>
              <h2>值得收藏的深度篇章</h2>
            </div>
            <p>沉淀我真正动手实践过的流程与脚本。</p>
          </div>
          <div class="home-featured__grid">
            {highlights.map((page) => {
              const title = page.frontmatter?.title ?? page.slug
              const summary = page.description ?? "欢迎探索详情"
              return (
                <article class="home-featured__card" key={page.slug}>
                  <div class="home-featured__meta">
                    {page.dates && <DateComponent date={getDate(cfg, page)!} locale={cfg.locale} />}
                    <span>{(page.frontmatter?.tags ?? []).slice(0, 2).join(" · ")}</span>
                  </div>
                  <h3>
                    <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                      {title}
                    </a>
                  </h3>
                  <p>{summary}</p>
                  <a class="text-link internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                    阅读全文 →
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

HomeHero.css = style

export default () => HomeHero
