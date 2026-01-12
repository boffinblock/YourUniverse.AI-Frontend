"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface ZoomableImageModalContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  startPos: { x: number; y: number } | null;
  setStartPos: (pos: { x: number; y: number } | null) => void;
}

const ZoomableImageModalContext = createContext<ZoomableImageModalContextProps | null>(null);

// ----------------- Provider -----------------
export const ZoomableImageModal = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <ZoomableImageModalContext.Provider value={{ open, setOpen, startPos, setStartPos }}>
      {children}
    </ZoomableImageModalContext.Provider>
  );
};

// ----------------- Trigger -----------------
export const ZoomableImageModalTrigger = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(ZoomableImageModalContext);
  if (!ctx) throw new Error("ZoomableImageModalTrigger must be inside ZoomableImageModal");

  const { setOpen, setStartPos } = ctx;

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setStartPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setOpen(true);
  };

  return <div onClick={handleClick}>{children}</div>;
};

// ----------------- Content -----------------
interface ZoomableImageModalContentProps {
  imageUrl: string;
  width?: number;
  height?: number;
  className?: string;
}

export const ZoomableImageModalContent = ({
  imageUrl,
  width = 290,
  height = 290,
  className = "",
}: ZoomableImageModalContentProps) => {
  const ctx = useContext(ZoomableImageModalContext);
  if (!ctx) throw new Error("ZoomableImageModalContent must be inside ZoomableImageModal");

  const { open, setOpen, startPos } = ctx;

  const handleClose = () => setOpen(false);

  // Target position for image (middle-left)
  const targetX = 40; // px from left
  const targetY = typeof window !== "undefined" ? window.innerHeight / 2 - height / 2 : 0;
  return (
    <AnimatePresence>
      {open && startPos && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none  "
        >
          {/* Wrapper for image + close button */}
          <motion.div
            className="absolute "
            style={{ width: width, height: height }}
            initial={{
              x: startPos.x - width / 2,
              y: startPos.y - height / 2,
              scale: 0.2,
              opacity: 0,
            }}
            animate={{
              x: targetX,
              y: targetY,
              scale: 1,
              opacity: 1,
            }}
            exit={{
              x: startPos.x - width / 2,
              y: startPos.y - height / 2,
              scale: 0.2,
              opacity: 0,
            }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          >
            {/* Image */}
            <Image
              src={imageUrl}
              width={400}
              height={400}
              alt="Zoomed"
              className={`rounded-2xl shadow-lg object-cover w-full h-full pointer-events-auto ${className}`}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 bg-primary cursor-pointer duration-500 text-white rounded-full p-1 hover:bg-red-600 pointer-events-auto"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
