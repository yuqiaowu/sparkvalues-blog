import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

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
    const current = fileData.slug!
    const web3Href = resolveRelative(current, "/tags/web3")
    const aiHref = resolveRelative(current, "/tags/AI-知识库")

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