import { notFound } from "next/navigation";

// Matches any /en/* or /ar/* path with no more specific route match, so
// the localized app/[locale]/not-found.tsx renders instead of falling
// through to the unlocalized root app/not-found.tsx.
export default function CatchAll() {
  notFound();
}
