import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "最近文章",
        showTitle: false,
        limit: 5,
        showTags: true,
        filter: (f) => f.slug !== "index" && !f.slug?.endsWith("/index") && !f.slug?.startsWith("tags/"),
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    // 全站启用评论（可用 frontmatter comments: false 逐篇关闭）
    Component.Comments({
      provider: "giscus",
      options: {
        repo: (process.env.GISCUS_REPO ?? "yuqiaowu/sparkvalues-blog") as `${string}/${string}`,
        repoId: process.env.GISCUS_REPO_ID ?? "",
        category: process.env.GISCUS_CATEGORY ?? "Announcements",
        categoryId: process.env.GISCUS_CATEGORY_ID ?? "",
        lang: process.env.GISCUS_LANG ?? "zh-CN",
        mapping: "pathname",
        inputPosition: "top",
        reactionsEnabled: true,
        strict: false,
      },
    }),
  ],
  footer: Component.EmptyFooter(),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Graph(),
  ],
  right: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "open",
      showSnippets: false,
    }),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Graph(),
  ],
  right: [
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "open",
      showSnippets: false,
    }),
  ],
}
