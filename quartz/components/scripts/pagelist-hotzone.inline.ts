function setupHotzones() {
  const items = document.querySelectorAll<HTMLLIElement>("ul.section-ul > li.section-li")
  items.forEach((li) => {
    const section = li.querySelector<HTMLElement>(".section")
    const titleLink = li.querySelector<HTMLAnchorElement>("h3 > a.internal")
    if (!section || !titleLink) return

    const href = titleLink.getAttribute("href") || ""

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      // If clicking on an anchor inside, let default behavior happen
      const anchor = target.closest("a")
      if (anchor) return
      e.preventDefault()
      if (!href) return
      const nav = (window as any).spaNavigate as ((url: URL) => void) | undefined
      if (nav) {
        try {
          nav(new URL(href, window.location.toString()))
        } catch (_) {
          // fallback to hard navigation if URL construction fails
          window.location.href = href
        }
      } else {
        window.location.href = href
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (!href) return
        const nav = (window as any).spaNavigate as ((url: URL) => void) | undefined
        if (nav) {
          try {
            nav(new URL(href, window.location.toString()))
          } catch (_) {
            window.location.href = href
          }
        } else {
          window.location.href = href
        }
      }
    }

    section.setAttribute("tabindex", "0")
    section.setAttribute("role", "link")
    section.addEventListener("click", onClick)
    section.addEventListener("keydown", onKeyDown)

    // prevent bubbling from inner anchors so we don't trigger section click
    const innerAnchors = li.querySelectorAll<HTMLAnchorElement>("a")
    innerAnchors.forEach((a) => {
      const stop = (ev: Event) => ev.stopPropagation()
      a.addEventListener("click", stop)
      a.addEventListener("keydown", stop)
      ;(window as any).addCleanup?.(() => {
        a.removeEventListener("click", stop)
        a.removeEventListener("keydown", stop)
      })
    })

    ;(window as any).addCleanup?.(() => {
      section.removeEventListener("click", onClick)
      section.removeEventListener("keydown", onKeyDown)
      section.removeAttribute("tabindex")
      section.removeAttribute("role")
    })
  })
}

document.addEventListener("DOMContentLoaded", setupHotzones)
document.addEventListener("nav", setupHotzones)