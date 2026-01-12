"use client";

import { MDXContent } from "mdx/types";

interface MDXRendererProps {
    MDXComponent: MDXContent;
}

export default function MDXRenderer({ MDXComponent }: MDXRendererProps) {
    return <MDXComponent />;
}