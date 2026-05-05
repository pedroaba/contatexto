"use client";

import { useEffect, useState } from "react";

import { normalizeAvatarUrlInput } from "@/lib/auth/account-profile";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  src?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  name,
  src,
  alt,
  className,
  imageClassName,
  fallbackClassName,
}: UserAvatarProps) {
  const normalizedSrc = normalizeAvatarUrlInput(src ?? "");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  const fallbackText = (name.trim() || "M").charAt(0).toUpperCase();
  const shouldShowImage = normalizedSrc.length > 0 && !hasError;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {shouldShowImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={normalizedSrc}
          src={normalizedSrc}
          alt={alt ?? name}
          className={cn("size-full object-cover", imageClassName)}
          onError={() => setHasError(true)}
        />
      ) : null}

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-sm font-medium",
          shouldShowImage ? "hidden" : "flex",
          fallbackClassName,
        )}
      >
        {fallbackText}
      </span>
    </span>
  );
}
