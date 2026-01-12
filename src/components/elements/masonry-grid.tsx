"use client";
import { useEffect, useRef } from "react";

interface MasonryGridProps<T> {
    items: T[];
    renderItem: (item: T, idx: number) => React.ReactNode;
    className?: string; // Tailwind classes
    baseRowHeight?: number;
}

export function MasonryGrid<T>({
    items,
    renderItem,
    className = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6",
    baseRowHeight = 10,
}: MasonryGridProps<T>) {
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        let resizeTimer: ReturnType<typeof setTimeout> | undefined; // ✅ typed timer

        const getRowGap = () => {
            const style = window.getComputedStyle(grid);
            return parseFloat(style.rowGap) || 0;
        };

        const resizeAll = () => {
            if (!grid) return;
            const rowGap = getRowGap();

            grid.querySelectorAll<HTMLElement>(".masonry-item").forEach((item) => {
                const content = item.querySelector<HTMLElement>(".card-content");
                if (content) {
                    const height = content.getBoundingClientRect().height;
                    const rowSpan = Math.ceil((height + rowGap) / (baseRowHeight + rowGap));
                    item.style.gridRowEnd = `span ${rowSpan}`;
                }
            });
        };

        // Recalculate when all images are loaded
        const images = grid.querySelectorAll("img");
        let imagesLoaded = 0;
        images.forEach((img) => {
            if (img.complete) {
                imagesLoaded++;
            } else {
                img.addEventListener("load", () => {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) resizeAll();
                });
            }
        });
        if (imagesLoaded === images.length) resizeAll();

        const debouncedResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeAll, 50);
        };

        const observer = new ResizeObserver(debouncedResize);
        grid.querySelectorAll<HTMLElement>(".card-content").forEach((el) => observer.observe(el));

        resizeAll();
        window.addEventListener("resize", debouncedResize);
        window.addEventListener("load", resizeAll);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", debouncedResize);
            window.removeEventListener("load", resizeAll);
            if (resizeTimer) clearTimeout(resizeTimer);
        };
    }, [items, baseRowHeight]);

    return (
        <div
            ref={gridRef}
            className={`grid ${className}`}
            style={{ gridAutoRows: `${baseRowHeight}px` }}
        >
            {items.map((item, idx) => (
                <div key={idx} className="masonry-item">
                    <div className="card-content">{renderItem(item, idx)}</div>
                </div>
            ))}
        </div>
    );
}
