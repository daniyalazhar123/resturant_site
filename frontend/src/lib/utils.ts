import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes without conflicts.
 * Used by Aceternity UI, Skipper UI, and Animaster Lib components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
