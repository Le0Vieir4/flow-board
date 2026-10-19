"use client";

import { useEffect, useRef, useState, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icons } from "../icons";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "confirm";
  disabled?: boolean;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  offset?: number;
}

export function Dropdown({ trigger, items, align = "right", offset = 8, className, children, ...props }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => setOpen((prev) => !prev);

  const menuItems = items.map((item, index) => (
    <button
      key={index}
      type="button"
      onClick={() => {
        item.onClick();
        setOpen(false);
      }}
      disabled={item.disabled}
      className={cn(
        "flex w-full items-center gap-2 rounded-badge px-2.5 py-2 text-label font-medium transition-colors duration-150",
        item.variant === "destructive"
          ? "text-error hover:bg-error/10"
          : item.variant === "confirm"
          ? "bg-error/15 text-error hover:bg-error/25 font-bold"
          : "text-foreground hover:bg-white/4"
      )}
    >
      {item.icon && <span className="flex items-center">{item.icon}</span>}
      {item.label}
    </button>
  ));

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)} {...props}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "fixed z-50 mt-1.5 w-[200px] rounded-lg border border-line bg-panel-2 p-1 shadow-dropdown",
            align === "right" ? "right-0" : "left-0"
          )}
          role="menu"
          style={{ marginTop: offset }}
        >
          {menuItems}
        </div>
      )}
    </div>
  );
}