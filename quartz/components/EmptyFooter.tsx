import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const EmptyFooter: QuartzComponent = () => {
    return <></>
  }
  return EmptyFooter
}) satisfies QuartzComponentConstructor