import { HoverCardContent, HoverCardTrigger, HoverCard as ShadcnHoverCard } from "../ui/hover-card"

interface HoverCardProps {
  content?: string | React.ReactNode
  children?: React.ReactNode
}

const HoverCard: React.FC<HoverCardProps> = (props) => {
  const {children, content} = props
  return (
    <ShadcnHoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {content}
      </HoverCardContent>
    </ShadcnHoverCard>
  )
}

export default HoverCard