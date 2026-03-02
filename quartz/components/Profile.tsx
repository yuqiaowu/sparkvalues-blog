import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { pathToRoot } from "../util/path"

const Profile: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)

  return (
    <div class={classNames(displayClass, "profile")}>
      <h2 class="profile-header">About Me</h2>
      <div class="profile-card">
        <div class="profile-avatar">
          <img src={`${baseDir}/static/avatar.png`} alt="JO_WU Avatar" />
        </div>
        <div class="profile-info">
          <p class="profile-bio">
            Web3 Product Manager | Quant Trader
            <br />
            探索去中心化未来与策略化交易的边界。
          </p>
          <div class="profile-contact">
            <a href="mailto:newjowu@gmai.com" class="contact-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              newjowu@gmai.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.css = `
.profile {
  margin-bottom: 2rem;
}

.profile-header {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-family: var(--titleFont);
  color: var(--dark);
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: var(--light);
  border-radius: 12px;
  border: 1px solid var(--gray);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.profile-card:hover {
  border-color: var(--secondary);
}

.profile-avatar {
  width: 100%;
  max-width: 180px;
  height: auto;
  aspect-ratio: 1/1;
  border-radius: 8px; /* 轻微圆角使之不那么生硬 */
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid var(--gray);
  background: var(--lightgray);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--dark);
  font-family: var(--titleFont);
  font-size: 1.5rem;
}

.profile-bio {
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--gray);
  margin-bottom: 1rem;
}

.profile-contact {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--secondary);
  text-decoration: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  background: var(--lightgray);
  transition: background 0.2s ease, opacity 0.2s ease;
}

.contact-link:hover {
  background: var(--gray);
  opacity: 0.8;
}

.contact-link svg {
  stroke: var(--secondary);
}

@media all and (max-width: 600px) {
  .profile {
    display: none; /* 移动端隐藏，节省空间，头像已在 Header 中体现 */
  }
}
`

export default (() => Profile) satisfies QuartzComponentConstructor
