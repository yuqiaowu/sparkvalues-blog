import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, joinSegments, slugTag, FullSlug } from "../util/path"

const navCss = `
.top-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.top-nav a {
  color: var(--secondary);
  font-family: var(--headerFont);
  font-weight: 600;
  text-decoration: none;
}
.top-nav a:hover {
  color: var(--tertiary);
}
`

export default (() => {
  const Nav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const current = fileData.slug! as FullSlug
    // 生成符合类型的标签页 slug（不能以 / 开头）
    const web3Slug = joinSegments("tags", slugTag("web3")) as FullSlug
    const aiSlug = joinSegments("tags", slugTag("AI 知识库")) as FullSlug
    const web3Href = resolveRelative(current, web3Slug)
    const aiHref = resolveRelative(current, aiSlug)

    return (
      <nav class="top-nav">
        <a class="internal" href={web3Href}>web3</a>
        <a class="internal" href={aiHref}>AI 知识库</a>
      </nav>
    )
  }

  Nav.css = navCss
  return Nav
}) satisfies QuartzComponentConstructor