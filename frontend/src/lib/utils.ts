import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_CONFIG = {
  name: "Green Harvest",
  tagline: "Farm to Table, Reimagined",
  description:
    "A modern marketplace connecting local growers with conscious eaters.",
};
