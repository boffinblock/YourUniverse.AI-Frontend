"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      theme={"dark"}
      className="toaster group  "
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!bg-green-500/30 backdrop-blur border !border-green-500 !text-white",         // default toast
          success: "!bg-green-500/30 backdrop-blur border !border-green-500 !text-white",     // success toast
          error: "!bg-red-600/30 backdrop-blur border !border-red-600 !text-white",         // error toast
          warning: "!bg-yellow-500/30 backdrop-blur border !border-yellow-500 !text-black",    // warning toast
          info: "!bg-primary-600/30 backdrop-blur border !border-primary !text-white",         // info toast
          loading: "!bg-gray-900/30 backdrop-blur border !border-gray-700 !text-white",      // loading toast
        },
      }}

      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
