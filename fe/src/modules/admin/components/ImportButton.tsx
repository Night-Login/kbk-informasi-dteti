import { useRef, useState, type ChangeEvent } from "react";
import {
  Button,
  CreateButton,
  ExportButton,
  TopToolbar,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import type { AdminDataProvider } from "../dataProvider";

const numericFields = new Set([
  "sort_order",
  "start_year",
  "end_year",
  "year",
  "citation_count",
  "h_index",
  "total_citations",
  "sinta_score",
  "author_order",
]);

const booleanFields = new Set(["is_active", "is_primary"]);

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function coerceValue(field: string, value: string): unknown {
  if (value === "") return null;
  if (numericFields.has(field)) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }
  if (booleanFields.has(field)) {
    return ["true", "1", "yes", "y"].includes(value.toLowerCase());
  }
  return value;
}

function parseFile(name: string, text: string): Record<string, unknown>[] {
  if (name.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(text);
    const items = Array.isArray(parsed) ? parsed : parsed.items;
    if (!Array.isArray(items)) {
      throw new Error("JSON must contain an array or an { items: [] } object.");
    }
    return items;
  }

  const rows = parseCsvRows(text);
  if (rows.length < 2) {
    throw new Error("CSV must contain a header and at least one data row.");
  }
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [
        header,
        coerceValue(header, values[index] || ""),
      ]),
    ),
  );
}

export function ImportButton({ resource }: { resource: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const dataProvider = useDataProvider<AdminDataProvider>();
  const notify = useNotify();
  const refresh = useRefresh();

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    try {
      const items = parseFile(file.name, await file.text());
      const summary = await dataProvider.importItems(resource, items);
      notify(
        `Import complete: ${summary.imported || 0} created, ${summary.updated || 0} updated, ${summary.errors || 0} errors.`,
        { type: summary.errors ? "warning" : "success" },
      );
      refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Import failed.", {
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.json,text/csv,application/json"
        hidden
        onChange={handleFile}
      />
      <Button
        label={busy ? "Importing…" : "Import CSV / JSON"}
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        <UploadFileIcon />
      </Button>
    </>
  );
}

export function ListActions({ resource }: { resource: string }) {
  return (
    <TopToolbar>
      <ImportButton resource={resource} />
      <ExportButton />
      <CreateButton />
    </TopToolbar>
  );
}
