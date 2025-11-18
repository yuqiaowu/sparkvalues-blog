import { QuartzComponent, QuartzComponentConstructor } from "./types"

// 适用于非 Next.js 的 Vercel Web Analytics 集成：
// 1) 注入队列 stub（window.va）
// 2) 加载 Vercel 的采集脚本 /_vercel/analytics/script.js
// 3) 对常见的前端路由事件做一次性监听，补充单页场景的 pageview
export default (() => {
  const VercelAnalytics: QuartzComponent = () => (
    <>
      {/* queue stub，Vercel 官方推荐的非 React 集成方式 */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.va = window.va || function(){(window.vaq = window.vaq || []).push(arguments)}",
        }}
      ></script>
      {/* 加载采集脚本，Vercel 在托管环境下会提供该路径 */}
      <script defer src="/_vercel/analytics/script.js"></script>
      {/* 简单的 SPA 路由变化补充上报（Quartz 可启用 SPA 导航） */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              function track(){ try { window.va && window.va('pageview') } catch(e){} }
              // 基于 History API 的路由变化
              const pushState = history.pushState; const replaceState = history.replaceState;
              history.pushState = function(){ const r = pushState.apply(this, arguments); track(); return r }
              history.replaceState = function(){ const r = replaceState.apply(this, arguments); track(); return r }
              window.addEventListener('popstate', track);
              // 基于哈希的变化
              window.addEventListener('hashchange', track);
              // 初次加载
              track();
            })();
          `,
        }}
      ></script>
    </>
  )

  return VercelAnalytics
}) satisfies QuartzComponentConstructor