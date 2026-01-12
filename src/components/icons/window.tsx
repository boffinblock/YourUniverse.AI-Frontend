import React from 'react'
import { cn } from '@/lib/utils'
interface Props {
    className?: string
}
const Window: React.FC<Props> = ({ className }) => {
    return (
        <svg className={cn("text-[#552EFB]", className)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" fill='#552EFB' viewBox="0 0 50 50">
            <path d="M4 4H24V24H4zM26 4H46V24H26zM4 26H24V46H4zM26 26H46V46H26z"></path>
        </svg>
    )
}

export default Window