"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetPersona } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  User,
  Hash,
  BookOpen,
  Link2,
  X,
  Sparkles,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/date-utils";

interface PersonaPreviewProps {
  personaId?: string;
  onClose?: () => void;
}

const DetailSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className }) => (
  <div className={cn("space-y-2.5", className)}>
    <div className="flex items-center gap-2 text-[11px] font-semibold text-primary/80 uppercase tracking-widest">
      {icon}
      {title}
    </div>
    <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const PersonaPreview: React.FC<PersonaPreviewProps> = ({ personaId, onClose }) => {
  const { persona, isLoading } = useGetPersona(personaId, {
    enabled: !!personaId,
  });

  if (!personaId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center relative">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 w-full max-w-[220px]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-7 w-7 text-primary/50" />
          </div>
          <p className="text-sm text-muted-foreground">No persona in this chat</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full animate-pulse relative">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="h-32 rounded-t-xl bg-primary/15" />
        <div className="flex justify-center -mt-14 px-4">
          <div className="h-24 w-24 rounded-full bg-primary/20 border-4 border-background shadow-lg" />
        </div>
        <div className="space-y-4 px-4 pt-6 pb-6">
          <div className="space-y-2 text-center">
            <div className="h-5 w-24 mx-auto rounded-md bg-primary/15" />
            <div className="flex justify-center gap-2">
              <div className="h-5 w-12 rounded-full bg-primary/10" />
              <div className="h-5 w-14 rounded-full bg-primary/10" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-primary/10" />
            <div className="h-3 w-4/5 rounded bg-primary/10" />
            <div className="h-3 w-3/4 rounded bg-primary/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center relative">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 w-full max-w-[220px]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-7 w-7 text-primary/50" />
          </div>
          <p className="text-sm text-muted-foreground">Persona not found</p>
        </div>
      </div>
    );
  }

  const avatarUrl = persona.avatar?.url || "/logo1.png";
  const avatarFallback = persona.name.charAt(0).toUpperCase() || "PN";
  const backgroundUrl = persona.backgroundImg?.url;
  const hasTags = persona.tags && persona.tags.length > 0;
  const hasLinked = persona.lorebook || (persona.characters && persona.characters.length > 0);

  return (
    <div className="h-full bg-primary/20 backdrop-blur-sm relative">
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-2 right-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition-colors backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="h-full overflow-y-auto">
      <div className="relative">
        <div
          className={cn(
            "h-32 w-full bg-center bg-cover relative z-0",
            "bg-primary/50"
          )}
          style={
            backgroundUrl
              ? { backgroundImage: `url(${backgroundUrl})` }
              : undefined
          }
        />
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 z-10">
          <Avatar className="h-24 w-24 rounded-full border-4 border-background shadow-xl ring-2 ring-primary/30">
            <AvatarImage src={avatarUrl} alt={persona.name} className="object-cover" />
            <AvatarFallback className="bg-primary/80 backdrop-blur-3xl text-2xl font-semibold text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="px-4 pt-16 pb-6 space-y-5">
        <div className="text-center space-y-2">
          <h2 className="font-semibold text-lg text-white truncate">
            {persona.name}
          </h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0 font-medium"
            >
              {persona.rating}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0 font-normal text-white border-primary capitalize"
            >
              {persona.visibility}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {persona.description && (
            <div className="rounded-xl border border-primary/50 bg-primary/5 p-4">
              <DetailSection title="About" icon={<User className="h-3.5 w-3.5" />}>
                <p className="line-clamp-6">{persona.description}</p>
              </DetailSection>
            </div>
          )}

          {hasTags && (
            <div className="rounded-xl border border-primary/50 bg-primary/5 p-4">
              <DetailSection title="Tags" icon={<Hash className="h-3.5 w-3.5" />}>
                <div className="flex flex-wrap gap-1.5">
                  {persona.tags?.map((tag, idx) => (
                    <Badge
                      key={`${persona.id}-tag-${idx}`}
                      variant="outline"
                      className="text-[10px] font-normal border-primary/50 text-white hover:border-primary/40 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </DetailSection>
            </div>
          )}

          {hasLinked && (
            <div className="rounded-xl border border-primary/50 bg-primary/5 p-4">
              <DetailSection title="Linked" icon={<Link2 className="h-3.5 w-3.5" />}>
                <div className="flex flex-wrap gap-2">
                  {persona.lorebook && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-primary/50 gap-1 text-white"
                    >
                      <BookOpen className="h-3 w-3" />
                      {persona.lorebook.name}
                    </Badge>
                  )}
                  {persona.characters?.map((char) => (
                    <Badge
                      key={char.id}
                      variant="outline"
                      className="text-[10px] border-primary/50 gap-1 text-white"
                    >
                      <User className="h-3 w-3" />
                      {char.name}
                    </Badge>
                  ))}
                </div>
              </DetailSection>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-primary/50">
          {persona.createdAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatRelativeTime(new Date(persona.createdAt))}
            </span>
          )}
        </div>

        <Link
          href={`/personas/${persona.id}`}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-3 rounded-xl",
            "text-sm font-medium text-primary",
            "bg-primary/15 hover:bg-primary/25 border border-primary/20",
            "transition-all duration-200 hover:border-primary/40"
          )}
        >
          <Sparkles className="h-4 w-4" />
          View full profile
        </Link>
      </div>
      </div>
    </div>
  );
};

export default PersonaPreview;
