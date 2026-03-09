"use client";

import React, { useState } from "react";
import { Download, FolderSymlink, Image as ImageIcon, MoreVertical, Trash2, Globe, TriangleAlert } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Background } from "@/lib/api/backgrounds";
import LinkBackgroundDialog from "../elements/link-background-dialog";

interface BackgroundCardProps {
  background: Background;
  selected?: boolean;
  onSelectChange?: (id: string, checked: boolean) => void;
  onSetDefault?: (id: string) => void;
  onClearDefault?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const BackgroundCard: React.FC<BackgroundCardProps> = ({
  background,
  selected = false,
  onSelectChange,
  onSetDefault,
  onClearDefault,
  onDownload,
  onDelete,
  className = "",
  ...props
}) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl =
    typeof background.image === "object" && background.image?.url
      ? background.image.url
      : typeof background.image === "string"
        ? background.image
        : undefined;

  const handleCheckboxChange = (checked: boolean) => {
    onSelectChange?.(background.id, checked);
  };

  const displayName = background.name || "Background";

  return (
    <>
      <div
        {...props}
        className={cn(
          "relative rounded-3xl border overflow-hidden group aspect-video",
          "bg-primary/20 backdrop-blur-xl border-white/10",
          "hover:border-primary/50 hover:bg-primary/25 hover:shadow-lg hover:shadow-primary/10",
          "transition-all duration-300 ease-out",
          className
        )}
      >
        {/* Image container */}
        <div className="absolute inset-0">
          {/* Skeleton while loading */}
          {!imageLoaded && imageUrl && (
            <Skeleton className="absolute inset-0 rounded-none bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10" />
          )}

          {/* Background image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-transform duration-500",
                "group-hover:scale-105",
                !imageLoaded && "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          ) : (
            <div
              className="absolute inset-0 bg-primary/15 flex items-center justify-center"
              aria-hidden
            >
              <span className="text-2xl font-semibold text-white/40">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Gradient overlay for better contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            aria-hidden
          />
        </div>

        {/* Top bar: checkbox, badges, menu */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Checkbox
              id={`background-${background.id}`}
              checked={selected}
              onCheckedChange={handleCheckboxChange}
              className="bg-black/40 border-primary/80 data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer data-[state=checked]:text-white text-white rounded-full size-6 backdrop-blur-sm"
            />
            {background.isGlobalDefault && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/90 text-white border border-white/20 backdrop-blur-sm">
                <Globe className="size-2.5" />
                Default
              </span>
            )}
            {(background.characterId || background.personaId || background.realmId) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-600/90 text-white border border-white/20 backdrop-blur-sm">
                <FolderSymlink className="size-2.5" />
                Linked
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
              >
                <MoreVertical className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-xl border border-white/10">
              <DropdownMenuItem
                className="hover:bg-gray-800 transition cursor-pointer"
                onClick={() =>
                  background.isGlobalDefault
                    ? onClearDefault?.(background.id)
                    : onSetDefault?.(background.id)
                }
              >
                <Globe className="w-4 h-4 mr-2" />
                {background.isGlobalDefault
                  ? "Remove as Default"
                  : "Set as Default Global Background"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-800 transition cursor-pointer"
                onClick={() => setIsLinkDialogOpen(true)}
              >
                <FolderSymlink className="w-4 h-4 mr-2" /> Link to Entity...
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-800 transition cursor-pointer"
                onClick={() => onDownload?.(background.id)}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer hover:bg-destructive/20"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom: name overlay on hover */}
        {displayName && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-3 z-10",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )}
          >
            <p className="text-sm font-medium text-white truncate drop-shadow-lg">
              {displayName}
            </p>
          </div>
        )}
      </div>

      <LinkBackgroundDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        backgroundId={background.id}
        backgroundName={displayName}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-primary/15 backdrop-blur-3xl border-primary/30 rounded-4xl p-0 gap-0 overflow-hidden shadow-xl shadow-primary/5 sm:max-w-md">
          <AlertDialogHeader className="px-6 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/20 border-2 border-amber-500/40">
                <TriangleAlert className="size-7 text-amber-500" aria-hidden />
              </div>
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-white text-center leading-tight">
              Delete background?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground text-center">
                <p>
                  {background.name ? (
                    <>
                      <span className="font-semibold text-white">&ldquo;{displayName}&rdquo;</span> will be permanently removed from your account.
                    </>
                  ) : (
                    <>This background will be permanently removed from your account.</>
                  )}
                </p>
                <p className="text-xs">
                  This action cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="px-6 py-4 bg-primary/5 border-t border-primary/20 gap-3 justify-center flex-wrap">
            <AlertDialogCancel className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-white flex-1 sm:flex-initial">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete?.(background.id);
                setIsDeleteDialogOpen(false);
              }}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0 flex-1 sm:flex-initial"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BackgroundCard;
