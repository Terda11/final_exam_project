import type { CategorySlug } from "@/types";

/** Only electronics categories — excludes legacy artisan categories from old DB seeds. */
export const ELECTRONICS_SLUGS: CategorySlug[] = [
  "mobiles-tablets",
  "laptops-computers",
  "projectors",
  "audio-sound",
  "accessories",
];

export function isElectronicsSlug(slug: string): slug is CategorySlug {
  return ELECTRONICS_SLUGS.includes(slug as CategorySlug);
}
