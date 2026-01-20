import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

const TikTok: React.FC<Props> = ({ className }) => {
    return (
        <svg
            className={cn(className)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            fill="currentColor"
        >
            <path
                d="M353,191.42a59.24,59.24,0,0,1-59.35-58.75H255.31V237.36l0,57.35a34.71,34.71,0,1,1-23.83-32.91V222.9a74.83,74.83,0,0,0-11-.82,73.46,73.46,0,0,0-55.21,24.7,72,72,0,0,0,3.25,99.28,74.54,74.54,0,0,0,6.92,6.05,73.49,73.49,0,0,0,45,15.22,74.83,74.83,0,0,0,11-.81,73.14,73.14,0,0,0,40.91-20.46A71.71,71.71,0,0,0,293.87,295l-.19-85.64a97.11,97.11,0,0,0,59.41,20.19V191.41s-.1,0-.11,0Z"
            />
        </svg>
    );
};

export default TikTok;
