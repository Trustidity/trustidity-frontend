"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CustomDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function CustomDropdown({
  trigger,
  children,
  align = "end",
  className,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 w-56 bg-popover text-popover-foreground rounded-md border shadow-md z-50 p-1",
            align === "end" ? "right-0" : "left-0",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface CustomDropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive";
}

export function CustomDropdownItem({
  children,
  onClick,
  className,
  variant = "default",
}: CustomDropdownItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        variant === "destructive" &&
          "text-destructive hover:bg-destructive/10 focus:bg-destructive/10",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CustomDropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomDropdownLabel({
  children,
  className,
}: CustomDropdownLabelProps) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-medium", className)}>
      {children}
    </div>
  );
}

interface CustomDropdownSeparatorProps {
  className?: string;
}

export function CustomDropdownSeparator({
  className,
}: CustomDropdownSeparatorProps) {
  return <div className={cn("bg-border -mx-1 my-1 h-px", className)} />;
}
