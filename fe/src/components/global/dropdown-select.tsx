"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface DropdownSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  align?: "left" | "right";
}

export function DropdownSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  disabled = false,
  searchable = false,
  searchPlaceholder = "Search options...",
  align = "left",
}: DropdownSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Filtered options based on search query
  const filteredOptions = searchQuery.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      )
    : options;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  // Toggle open state
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setSearchQuery("");
    setFocusedIndex(-1);
  };

  // Select an option
  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
  };

  // Clear selection back to placeholder
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
    setSearchQuery("");
  };

  // Keyboard navigation
  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    if (disabled) return;

    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
    }

    if (isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
      } else if (
        e.key === "Enter" &&
        focusedIndex >= 0 &&
        focusedIndex < filteredOptions.length
      ) {
        e.preventDefault();
        handleSelect(filteredOptions[focusedIndex].value);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
          "flex min-h-11 min-w-0 w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-focus",
          isOpen
            ? "border-dteti-blue ring-2 ring-focus/50 shadow-sm"
            : "border-line text-dteti-ink hover:border-dteti-blue",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ].join(" ")}
      >
        <span className="truncate min-w-0 flex-1 text-left">
          {selectedOption ? (
            <span className="text-dteti-ink">{selectedOption.label}</span>
          ) : (
            <span className="text-muted">{placeholder}</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {selectedOption && value !== "" && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                  setIsOpen(false);
                  setSearchQuery("");
                }
              }}
              title="Reset selection"
              className="rounded-full p-0.5 text-muted hover:bg-surface hover:text-dteti-ink transition-colors"
            >
              <X size={13} aria-hidden="true" />
            </span>
          )}
          <ChevronDown
            size={16}
            className={[
              "text-muted transition-transform duration-200",
              isOpen ? "rotate-180 text-dteti-blue" : "",
            ].join(" ")}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={selectId}
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full z-50 mt-1.5 min-w-[200px] w-full max-h-72 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95`}
        >
          {/* Optional Search Bar */}
          {searchable && (
            <div className="relative mb-1.5 p-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-line bg-surface py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-muted focus:border-dteti-blue focus:bg-white focus:outline-none"
              />
            </div>
          )}

          {/* Option Items List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar">
            {/* List of Options */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isFocused = idx === focusedIndex;

                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={[
                      "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors",
                      isSelected
                        ? "bg-dteti-blue-soft text-dteti-blue font-bold"
                        : isFocused
                          ? "bg-surface text-dteti-ink"
                          : "text-dteti-ink hover:bg-surface",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {isSelected && (
                      <Check size={14} className="shrink-0 text-dteti-blue" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-xs text-muted">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
