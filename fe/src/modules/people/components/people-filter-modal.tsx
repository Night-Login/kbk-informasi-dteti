"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export type PeopleFilterValues = {
  supervisionStatus: string;
  isActive: string;
  sortBy: string;
  sortOrder: string;
  tagSlug: string;
  sintaVerified: string;
};

export const defaultPeopleFilterValues: PeopleFilterValues = {
  supervisionStatus: "all",
  isActive: "all",
  sortBy: "name",
  sortOrder: "asc",
  tagSlug: "all",
  sintaVerified: "all",
};

export function countActiveFilters(filters: PeopleFilterValues): number {
  let count = 0;
  if (filters.supervisionStatus && filters.supervisionStatus !== "all") count++;
  if (filters.isActive && filters.isActive !== "all") count++;
  if (filters.sortBy && filters.sortBy !== "name") count++;
  if (filters.sortOrder && filters.sortOrder !== "asc") count++;
  if (filters.tagSlug && filters.tagSlug !== "all") count++;
  if (filters.sintaVerified && filters.sintaVerified !== "all") count++;
  return count;
}

type PeopleFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: PeopleFilterValues;
  onApplyFilters: (newFilters: PeopleFilterValues) => void;
  availableTags?: { label: string; value: string }[];
};

export default function PeopleFilterModal({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
  availableTags = [
    { label: "All Topics", value: "all" },
    { label: "Machine Learning & Deep Learning", value: "machine-learning" },
    { label: "Internet of Things & Embedded", value: "iot" },
    { label: "Cloud & Distributed Computing", value: "cloud-computing" },
    { label: "Cybersecurity & Cryptography", value: "cybersecurity" },
    { label: "Software Architecture & Web", value: "software-engineering" },
    { label: "Data Science & Big Data", value: "data-science" },
    { label: "Human Computer Interaction", value: "hci" },
  ],
}: PeopleFilterModalProps) {
  const [draftFilters, setDraftFilters] = useState<PeopleFilterValues>(currentFilters);

  if (!isOpen) return null;

  function handleReset() {
    setDraftFilters(defaultPeopleFilterValues);
  }

  function handleConfirm() {
    onApplyFilters(draftFilters);
    onClose();
  }

  const draftActiveCount = countActiveFilters(draftFilters);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-line bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-dteti-blue-soft text-dteti-blue">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dteti-ink">Filter Lecturers</h2>
              <p className="text-xs text-muted">
                {draftActiveCount > 0
                  ? `${draftActiveCount} filter(s) currently selected`
                  : "No extra filters selected"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto p-6">
          {/* Supervision Status */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
              Supervision Availability
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Status", value: "all" },
                { label: "Available / Kuota Tersedia", value: "available" },
                { label: "Unavailable / Penuh", value: "unavailable" },
              ].map((item) => {
                const isSelected = draftFilters.supervisionStatus === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        supervisionStatus: item.value,
                      }))
                    }
                    className={[
                      "rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all",
                      isSelected
                        ? "border-dteti-blue bg-dteti-blue-soft text-dteti-blue font-bold shadow-xs"
                        : "border-line bg-white text-dteti-ink hover:border-dteti-blue/30 hover:bg-surface",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
              Lecturer Active Status
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive / On Leave", value: "inactive" },
              ].map((item) => {
                const isSelected = draftFilters.isActive === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        isActive: item.value,
                      }))
                    }
                    className={[
                      "rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all",
                      isSelected
                        ? "border-dteti-blue bg-dteti-blue-soft text-dteti-blue font-bold shadow-xs"
                        : "border-line bg-white text-dteti-ink hover:border-dteti-blue/30 hover:bg-surface",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Research Topic / Tag Slug */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
              Research Topic Tag
            </label>
            <select
              value={draftFilters.tagSlug}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, tagSlug: e.target.value }))
              }
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            >
              {availableTags.map((tag) => (
                <option key={tag.value} value={tag.value}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>

          {/* SINTA ID Verification */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
              SINTA ID Verification
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Lecturers", value: "all" },
                { label: "Verified SINTA ID Only", value: "verified" },
              ].map((item) => {
                const isSelected = draftFilters.sintaVerified === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        sintaVerified: item.value,
                      }))
                    }
                    className={[
                      "rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all",
                      isSelected
                        ? "border-dteti-blue bg-dteti-blue-soft text-dteti-blue font-bold shadow-xs"
                        : "border-line bg-white text-dteti-ink hover:border-dteti-blue/30 hover:bg-surface",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Field & Order */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                Sort By Field
              </label>
              <select
                value={draftFilters.sortBy}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                }
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
              >
                <option value="name">Name</option>
                <option value="sinta_score">SINTA Score</option>
                <option value="publications">Publication Count</option>
                <option value="updated_at">Recently Updated</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                Sort Order
              </label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[
                  { label: "ASC (A-Z)", value: "asc" },
                  { label: "DESC (Z-A)", value: "desc" },
                ].map((item) => {
                  const isSelected = draftFilters.sortOrder === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          sortOrder: item.value,
                        }))
                      }
                      className={[
                        "flex-1 rounded-lg border py-2 text-center text-xs font-semibold transition-all",
                        isSelected
                          ? "border-dteti-yellow bg-dteti-yellow text-dteti-ink font-bold shadow-xs"
                          : "border-line bg-white text-dteti-ink hover:bg-surface",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-line bg-surface/50 px-6 py-4 rounded-b-2xl">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Reset Filters
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line bg-white px-4 py-2 text-xs font-bold text-ink hover:bg-surface"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg bg-dteti-blue px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-dteti-blue-deep transition-colors"
            >
              Confirm ({draftActiveCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
