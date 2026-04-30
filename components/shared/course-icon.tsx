import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const courseImages: Record<string, string> = {
  python: "/courses/python.png",
  sql: "/courses/sql.png",
  networking: "/courses/networking-devices.png",
};

interface CourseIconProps {
  /** Course slug (preferred) — looks up image by convention. */
  slug?: string;
  /** Direct image path — used when caller already has it. */
  src?: string;
  alt?: string;
  /** Square size in pixels. */
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Renders a course brand icon (PNG from /public/courses/) at a given size.
 * Falls back to a generic BookOpen lucide icon if no image is found.
 *
 * Centralizes course iconography so we never need emoji as fallbacks.
 */
export function CourseIcon({
  slug,
  src,
  alt = "",
  size = 32,
  className,
  priority,
}: CourseIconProps) {
  const path = src ?? (slug ? courseImages[slug] : undefined);

  if (!path) {
    return (
      <BookOpen
        className={cn("shrink-0 text-muted-foreground", className)}
        style={{ width: size, height: size }}
        strokeWidth={1.75}
      />
    );
  }

  return (
    <Image
      src={path}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
      unoptimized
      priority={priority}
    />
  );
}
