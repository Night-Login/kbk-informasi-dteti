/**
 * Converts any string into a clean, kebab-case URL slug.
 * Example: "Dr. Ir. Budi Santoso, M.Kom." -> "dr-ir-budi-santoso-mkom"
 */
export function toSlug(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}
