"use client";

import React from "react";
import { Plus } from "lucide-react";

interface UploadProjectProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function UploadProject({
  onClick,
  label = "Subir proyecto",
  className = "",
}: UploadProjectProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      // Cambiamos py-2 por h-10 y rounded-lg por rounded-xl
      className={`h-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/20 border border-blue-500/10 ${className}`}
    >
      <Plus className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline whitespace-nowrap">{label}</span>
    </button>
  );
}

export default UploadProject;
