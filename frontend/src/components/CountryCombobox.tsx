import React, { useEffect, useMemo, useRef, useState } from "react";
import { countries } from "../data/countries";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export default function CountryCombobox({ value, onChange, placeholder, className, disabled, required }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const sorted = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [query, sorted]);

  const selected = useMemo(() => {
    const v = value.trim().toLowerCase();
    if (!v) return null;
    return sorted.find((c) => c.name.toLowerCase() === v || c.code.toLowerCase() === v) || null;
  }, [sorted, value]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
      setQuery("");
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const displayValue = selected ? selected.name : value;

  return (
    <div className={`country-combobox ${disabled ? "country-combobox--disabled" : ""}`} ref={rootRef}>
      <div className={`country-combobox-input ${open ? "is-open" : ""}`}>
        {selected ? <span className="country-combobox-flag">{selected.flag}</span> : null}
        <input
          className={className || "country-combobox-field"}
          value={open ? query : displayValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setOpen(true);
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
            }
          }}
        />
        {displayValue.trim() ? (
          <button
            type="button"
            className="country-combobox-clear"
            aria-label="Clear country"
            onClick={() => {
              onChange("");
              setQuery("");
              setOpen(false);
            }}
            disabled={disabled}
          >
            ×
          </button>
        ) : (
          <span className="country-combobox-caret" aria-hidden="true">
            ▾
          </span>
        )}
      </div>

      {open ? (
        <div className="country-combobox-menu" role="listbox">
          {filtered.length ? (
            filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                className="country-combobox-item"
                role="option"
                aria-selected={c.name === selected?.name}
                onClick={() => {
                  onChange(c.name);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="country-combobox-item-name">{c.name}</span>
                <span className="country-combobox-item-code">{c.code}</span>
                <span className="country-combobox-item-flag">{c.flag}</span>
              </button>
            ))
          ) : (
            <div className="country-combobox-empty">Not found</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

