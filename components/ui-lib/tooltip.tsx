import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TooltipProps {
  content?: string
  children?: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const {children, content='tooltip'} = props
  return (
    <TooltipProvider delayDuration={0}>
      <ShadcnTooltip>
        <TooltipTrigger asChild>
          {children ?? 'tooltip'}
        </TooltipTrigger>
        <TooltipContent>
          {content}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  )
}

export default Tooltip