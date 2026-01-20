import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

const YouTube: React.FC<Props> = ({ className }) => {
    return (
        <svg
            className={cn(className)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            fill="currentColor"
        >
            <path
                d="M357.41,182.09C349,172.1,333.47,168,303.82,168H196.18c-30.33,0-46.12,4.34-54.5,15-8.17,10.38-8.17,25.67-8.17,46.83v40.34c0,41,9.69,61.81,62.67,61.81H303.82c25.72,0,40-3.6,49.18-12.42,9.46-9.05,13.49-23.82,13.49-49.39V229.83C366.49,207.52,365.86,192.13,357.41,182.09Zm-74.33,73.48L234.2,281.12a7.52,7.52,0,0,1-11-6.67V223.53a7.51,7.51,0,0,1,11-6.67l48.88,25.38a7.51,7.51,0,0,1,0,13.33Z"
            />
        </svg>
    );
};

export default YouTube;
