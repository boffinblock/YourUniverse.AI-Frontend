/**
 * Parse Chub / external lorebook JSON into our app's CreateLorebookRequest format.
 * Supports:
 * - Our format: { name, description, entries: [{ keywords, context }] }
 * - Chub format: { name, description, entries: { "1": { key/keys, content, disable, order, ... } } }
 */

import type { CreateLorebookRequest, CreateLorebookEntryInput } from "@/lib/api/lorebooks/types";

/** Chub-style entry: object with key/keys and content */
interface ChubEntry {
  key?: string[];
  keys?: string[];
  content?: string;
  comment?: string;
  disable?: boolean;
  order?: number;
  insertion_order?: number;
  priority?: number;
  enabled?: boolean;
  name?: string;
  [key: string]: unknown;
}

/** Chub-style lorebook: entries is an object keyed by id */
interface ChubLorebookJson {
  name: string;
  description?: string;
  is_creation?: boolean;
  scan_depth?: number;
  token_budget?: number;
  recursive_scanning?: boolean;
  extensions?: Record<string, unknown>;
  entries?: Record<string, ChubEntry> | CreateLorebookEntryInput[];
  [key: string]: unknown;
}

function isChubEntriesObject(
  entries: unknown
): entries is Record<string, ChubEntry> {
  return (
    typeof entries === "object" &&
    entries !== null &&
    !Array.isArray(entries) &&
    Object.keys(entries).length > 0
  );
}

function normalizeChubEntry(
  entry: ChubEntry,
  index: number
): CreateLorebookEntryInput | null {
  const keywords: string[] = [];
  if (Array.isArray(entry.keys) && entry.keys.length > 0) {
    keywords.push(...entry.keys.map((k) => String(k).trim()).filter(Boolean));
  }
  if (Array.isArray(entry.key) && entry.key.length > 0 && keywords.length === 0) {
    keywords.push(...entry.key.map((k) => String(k).trim()).filter(Boolean));
  }
  if (keywords.length === 0 && entry.name) {
    keywords.push(entry.name.trim());
  }
  if (keywords.length === 0) {
    return null;
  }

  const context =
    typeof entry.content === "string"
      ? entry.content.trim()
      : typeof entry.comment === "string"
        ? entry.comment.trim()
        : "";

  const rawPriority =
    typeof entry.priority === "number"
      ? entry.priority
      : typeof entry.insertion_order === "number"
        ? entry.insertion_order
        : typeof entry.order === "number"
          ? entry.order
          : index + 1;
  const priority = Math.min(Math.max(0, Math.floor(Number(rawPriority))), 100);

  const isEnabled =
    entry.enabled !== undefined
      ? Boolean(entry.enabled)
      : entry.disable !== undefined
        ? !entry.disable
        : true;

  return {
    keywords,
    context: context || "[No context]",
    isEnabled,
    priority,
  };
}

/**
 * Normalize external lorebook JSON to our CreateLorebookRequest format.
 * - If entries is an object (Chub format), convert to array.
 * - If entries is already an array, normalize each item (key/keyword → keywords).
 */
export function parseLorebookImportJson(
  data: unknown
): Omit<CreateLorebookRequest, "avatar"> {
  const raw = data as ChubLorebookJson;

  const fallbackName = `lorebook${Math.floor(Math.random() * 10000) + 1}`;
  const resolvedName =
    raw && typeof raw.name === "string" && raw.name.trim()
      ? raw.name.trim()
      : fallbackName;

  let entries: CreateLorebookEntryInput[] = [];
  const rating = (raw.rating === "NSFW" || raw.rating === "SFW"
    ? raw.rating
    : "SFW") as "SFW" | "NSFW";
  const visibility = (raw.visibility === "public" || raw.visibility === "private"
    ? raw.visibility
    : "private") as "public" | "private";

  if (isChubEntriesObject(raw.entries)) {
    const list = Object.values(raw.entries)
      .map((e, i) => normalizeChubEntry(e, i))
      .filter((e): e is CreateLorebookEntryInput => e !== null);
    // Sort by priority then by original order
    list.sort(
      (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
    );
    entries = list;
  } else if (Array.isArray(raw.entries)) {
    entries = raw.entries
      .map((e: unknown, i: number) => {
        const item = e as Record<string, unknown>;
        const keywords: string[] = Array.isArray(item.keywords)
          ? item.keywords.map((k) => String(k).trim()).filter(Boolean)
          : Array.isArray(item.keys)
            ? item.keys.map((k) => String(k).trim()).filter(Boolean)
            : item.keyword
              ? [String(item.keyword).trim()].filter(Boolean)
              : [];
        if (keywords.length === 0) return null;
        const context =
          typeof item.context === "string"
            ? item.context.trim()
            : typeof item.content === "string"
              ? item.content.trim()
              : "";
        const rawPriority =
          typeof item.priority === "number"
            ? item.priority
            : typeof item.order === "number"
              ? item.order
              : i + 1;
        return {
          keywords,
          context: context || "[No context]",
          isEnabled: item.isEnabled !== undefined ? Boolean(item.isEnabled) : !Boolean(item.disable),
          priority: Math.min(Math.max(0, Math.floor(Number(rawPriority))), 100),
        } as CreateLorebookEntryInput;
      })
      .filter((e): e is CreateLorebookEntryInput => e !== null);
  }

  // Reassign priority to 1..100 so backend validation passes (max 100)
  if (entries.length > 0) {
    entries = entries.map((e, i) => ({
      ...e,
      priority: Math.min(i + 1, 100),
    }));
  }

  const description =
    typeof raw.description === "string"
      ? raw.description.trim()
      : undefined;

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((t) => String(t).trim()).filter(Boolean)
    : undefined;

  return {
    name: resolvedName,
    description: description || undefined,
    rating,
    visibility,
    tags,
    favourite: Boolean(raw.favourite),
    entries: entries.length > 0 ? entries : undefined,
  };
}

/**
 * Read a File as JSON, parse with parseLorebookImportJson, and return normalized data.
 * Use this before sending to the import API so the backend always receives our format.
 */
export async function parseLorebookImportFile(
  file: File
): Promise<Omit<CreateLorebookRequest, "avatar">> {
  const text = await file.text();
  const data = JSON.parse(text) as unknown;
  return parseLorebookImportJson(data);
}
