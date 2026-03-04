import React from "react";

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-lg rounded-lg border p-6 text-center bg-white">
            <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
            <p className="text-sm text-slate-600">
              La ruta solicitada no existe.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
