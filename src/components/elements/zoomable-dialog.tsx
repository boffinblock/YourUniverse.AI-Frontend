"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";

interface ZoomableDialogContextProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    startPos: { x: number; y: number } | null;
    setStartPos: (pos: { x: number; y: number } | null) => void;
}

const ZoomableDialogContext = createContext<ZoomableDialogContextProps | null>(null);

export const ZoomableDialog = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

    return (
        <ZoomableDialogContext.Provider value={{ open, setOpen, startPos, setStartPos }}>
            {children}
        </ZoomableDialogContext.Provider>
    );
};

export const ZoomableDialogTrigger = ({
    children,
    asChild = false,
}: {
    children: React.ReactNode;
    asChild?: boolean;
}) => {
    const ctx = useContext(ZoomableDialogContext);
    if (!ctx) throw new Error("ZoomableDialogTrigger must be inside ZoomableDialog");

    const { setOpen, setStartPos } = ctx;

    const Comp = asChild ? Slot : "div";

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setStartPos({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });

        setOpen(true);
    };

    return (
        <Comp onClick={handleClick}>
            {children}
        </Comp>
    );
};

export const ZoomableDialogContent = ({
    children,
    className = "",
    closeOnOutsideClick = true,
}: {
    children: React.ReactNode;
    className?: string;
    closeOnOutsideClick?: boolean;
}) => {
    const ctx = useContext(ZoomableDialogContext);
    if (!ctx) throw new Error("ZoomableDialogContent must be inside ZoomableDialog");

    const { open, setOpen, startPos } = ctx;
    const portalRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        portalRef.current = document.getElementById("zoom-dialog-root") as HTMLElement;
        if (!portalRef.current) {
            const el = document.createElement("div");
            el.id = "zoom-dialog-root";
            document.body.appendChild(el);
            portalRef.current = el;
        }
    }, []);

    // ESC close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setOpen]);

    if (!portalRef.current) return null;

    return createPortal(
        <AnimatePresence>
            {open && startPos && (
                <motion.div
                    className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => closeOnOutsideClick && setOpen(false)}
                >
                    <motion.div
                        className={`absolute rounded-xl shadow-2xl p-5 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto ${className}`}
                        initial={{
                            x: startPos.x - window.innerWidth / 2,
                            y: startPos.y - window.innerHeight / 2,
                            scale: 0.4,
                            opacity: 0,
                        }}
                        animate={{
                            x: 0,
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                stiffness: 140,
                                damping: 18,
                            },
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>,
        portalRef.current
    );
};