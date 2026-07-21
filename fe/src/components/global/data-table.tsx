"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export type DataTableColumn = {
  key: string;
  label: string;
  className?: string;
};

export type DataTableRow = {
  id: string;
  filterValue: string;
  cells: Record<string, string | number>;
  actionHref?: string;
};

export type DataTableFilter = {
  label: string;
  value: string;
};

type DataTableProps = {
  ariaLabel: string;
  columns: DataTableColumn[];
  rows: DataTableRow[];
  filters: DataTableFilter[];
  actionLabel?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  statusLabel?: string;
  statusTone?: "available" | "unavailable";
};

export default function DataTable({
  ariaLabel,
  columns,
  rows,
  filters,
  actionLabel = "Action",
  emptyMessage = "No matching data found.",
  searchPlaceholder = "Search",
  statusLabel,
  statusTone = "available",
}: DataTableProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]?.value ?? "all");
  const [query, setQuery] = useState("");

  const visibleRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return rows.filter((row) => {
      const matchesFilter =
        activeFilter === "all" || row.filterValue === activeFilter;
      const searchableText = Object.values(row.cells).join(" ").toLocaleLowerCase();

      return (
        matchesFilter &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [activeFilter, query, rows]);

  return (
    <section aria-label={ariaLabel} className="overflow-hidden border border-line bg-white">
      <div className="brand-gradient flex flex-col gap-4 p-4 text-white lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Table filters">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter.value)}
                className={[
                  "min-h-9 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dteti-blue",
                  isActive
                    ? "border-dteti-yellow bg-dteti-yellow text-dteti-ink"
                    : "border-white/70 bg-transparent text-white hover:bg-white/10",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {statusLabel ? (
            <p className="flex items-center gap-2 text-xs font-semibold text-white">
              <span>{statusLabel}</span>
              <span
                className={[
                  "size-3 rounded-full",
                  statusTone === "available" ? "bg-emerald-400" : "bg-red-400",
                ].join(" ")}
                aria-hidden="true"
              />
              <span className="sr-only">
                {statusTone === "available" ? "Available" : "Unavailable"}
              </span>
            </p>
          ) : null}

          <label className="relative block min-w-56">
            <span className="sr-only">{searchPlaceholder}</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={15}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="min-h-9 w-full border border-white/60 bg-white py-2 pl-9 pr-3 text-xs text-ink placeholder:text-muted focus:border-dteti-yellow focus:outline-none focus:ring-2 focus:ring-dteti-yellow"
            />
          </label>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visibleRows.length} rows
      </p>

      <div className="overflow-x-auto" tabIndex={0}>
        <table className="w-full min-w-[58rem] border-collapse text-left text-xs">
          <thead className="bg-dteti-blue-deep text-dteti-yellow">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={["px-4 py-3 font-semibold", column.className]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {column.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-center font-semibold">
                {actionLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-b-0">
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column.key}`}
                    className={["px-4 py-3 align-top text-ink", column.className]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {row.cells[column.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-center align-top">
                  {row.actionHref ? (
                    <Link
                      href={row.actionHref}
                      aria-label={`Open ${String(row.cells.name ?? "row")}`}
                      className="inline-grid size-7 place-items-center bg-dteti-yellow text-dteti-ink transition-colors hover:bg-dteti-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
                    >
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ) : (
                    <span aria-hidden="true">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleRows.length === 0 ? (
        <p className="border-t border-line px-4 py-8 text-center text-sm text-muted">
          {emptyMessage}
        </p>
      ) : null}
    </section>
  );
}
