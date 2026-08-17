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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import type { AdminDataProvider } from "../dataProvider";

const resourceHeaderGuides: Record<string, { csv: string; json: string }> = {
  lecturers: {
    csv: "full_name,slug,nip_or_staff_id,sinta_id,academic_title,email,supervision_status,is_active",
    json: `[
  {
    "full_name": "Dr. Budi Santoso",
    "slug": "budi-santoso",
    "nip_or_staff_id": "198001012005011001",
    "sinta_id": "5971234",
    "email": "budi.santoso@ugm.ac.id",
    "supervision_status": "Available"
  }
]`,
  },
  projects: {
    csv: "title,slug,status,start_year,end_year,partner_names,funding_source,visibility",
    json: `[
  {
    "title": "Sistem Cerdas IoT DTETI",
    "slug": "sistem-cerdas-iot-dteti",
    "status": "ONGOING",
    "start_year": 2024,
    "funding_source": "RKAT DTETI 2024"
  }
]`,
  },
  publications: {
    csv: "title,slug,year,venue,publication_type,doi,url,citation_count,source,verified_status",
    json: `[
  {
    "title": "Machine Learning for Smart Grid",
    "slug": "machine-learning-smart-grid",
    "year": 2024,
    "venue": "IEEE Access",
    "doi": "10.1109/ACCESS.2024.12345"
  }
]`,
  },
  "research/clusters": {
    csv: "name,slug,description,sort_order",
    json: `[
  {
    "name": "Sistem Informasi & Data",
    "slug": "sistem-informasi-data",
    "sort_order": 1
  }
]`,
  },
  "research/tags": {
    csv: "name,slug,cluster_id,description,is_active",
    json: `[
  {
    "name": "Machine Learning",
    "slug": "machine-learning",
    "cluster_id": "uuid-here"
  }
]`,
  },
};

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
  const [guideOpen, setGuideOpen] = useState(false);
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

  const guide = resourceHeaderGuides[resource] || {
    csv: "id,name,description",
    json: '[{ "name": "Example" }]',
  };

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

      <MuiButton
        size="small"
        startIcon={<HelpOutlineIcon />}
        onClick={() => setGuideOpen(true)}
        sx={{ textTransform: "none", fontSize: "0.8125rem", color: "text.secondary", ml: 0.5 }}
      >
        Format Guide
      </MuiButton>

      <Dialog open={guideOpen} onClose={() => setGuideOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
          <span>Import Format Guide ({resource})</span>
          <IconButton onClick={() => setGuideOpen(false)} size="small" sx={{ ml: "auto" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            You can upload a <strong>.csv</strong> or <strong>.json</strong> file. Ensure column names match the expected format below:
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2 }}>
            Expected CSV Headers:
          </Typography>
          <Box sx={{ p: 1.5, bg: "#f0f4f8", bgcolor: "#f5f7f9", borderRadius: 1, fontFamily: "monospace", fontSize: 13, wordBreak: "break-all" }}>
            {guide.csv}
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2 }}>
            Sample JSON Format:
          </Typography>
          <Box component="pre" sx={{ p: 1.5, bgcolor: "#f5f7f9", borderRadius: 1, fontFamily: "monospace", fontSize: 12, overflowX: "auto" }}>
            {guide.json}
          </Box>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setGuideOpen(false)}>Close</MuiButton>
          <MuiButton variant="contained" onClick={() => { setGuideOpen(false); inputRef.current?.click(); }}>
            Select File to Upload
          </MuiButton>
        </DialogActions>
      </Dialog>
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

