import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
    discription: string;
    children: React.ReactNode
}
const ToolTipElement: React.FC<Props> = ({ discription, children }) => {
    return (
        <Tooltip >
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side='bottom' className='max-w-sm' >
                <p>{discription}</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default ToolTipElement