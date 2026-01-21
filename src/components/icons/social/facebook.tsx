import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

const Facebook: React.FC<Props> = ({ className }) => {
    return (
        <svg
            className={cn(className)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            fill="currentColor"
        >
            <path
                d="M315.94,165.17H292c-18.75,0-22.38,8.91-22.38,22V216h44.71l0,45.14H269.66V377H223V261.13h-39V216h39v-33.3c0-38.63,23.6-59.67,58.07-59.67l34.84,0Z"
            />
        </svg>
    );
};

export default Facebook;
