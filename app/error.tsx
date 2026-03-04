"use client";

import React from "react";

export default function GlobalError({ error, reset }: any) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-lg rounded-lg border p-6 text-center bg-white">
            <h1 className="text-2xl font-bold mb-2">Algo salió mal</h1>
            <p className="text-sm text-slate-600 mb-4">
              {String(error?.message || "Error desconocido")}
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white"
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
