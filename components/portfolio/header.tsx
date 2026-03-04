"use client";

import { Github, Linkedin, Mail, FileText, MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        {/* Cambiamos flex-col-reverse a flex-col para que en móvil la foto suba */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-12">
          {/* Lado de la Foto - Ahora primero en el DOM para móvil */}
          <div className="flex flex-col items-center md:items-end md:order-2">
            <div className="relative group">
              {/* Efecto de resplandor sutil de fondo */}
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

              <div className="relative h-56 w-48 md:h-72 md:w-64 overflow-hidden rounded-2xl border border-border bg-muted shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                <img
                  src="/images/Professional_1.png"
                  alt="Enrique Gonzalez Diaz"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                />
              </div>
            </div>
          </div>

          {/* Lado Izquierdo: Información Profesional */}
          <div className="flex-1 space-y-6 text-center md:text-left md:order-1">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                Enrique Gonzalez Diaz
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  Data Analyst | Business Intelligence
                </p>
                <span className="hidden h-1.5 w-1.5 rounded-full bg-slate-300 md:block"></span>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>Trujillo, Perú</span>
                </div>
              </div>
            </div>

            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Ingeniero de Computación y Sistemas especializado en Data & BI.
              Diseño soluciones de integración y análisis de datos que mejoran
              la trazabilidad del reporting y optimizan la toma de decisiones
              comerciales mediante Python, SQL y Power BI.
            </p>

            {/* Acciones */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <a
                href="/cv/EnriqueGonzalez_CV.pdf"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 px-6 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95"
              >
                <FileText className="h-4 w-4" />
                Descargar CV
              </a>
              <a
                href="mailto:enriquegdiaz08@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <Mail className="h-4 w-4" />
                Contactar
              </a>

              <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2 md:block"></div>

              <div className="flex items-center gap-3">
                {[
                  {
                    icon: Github,
                    href: "https://github.com/DevEnriquegd",
                    label: "GitHub",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/enriquegonzalez-data/",
                    label: "LinkedIn",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-all hover:border-blue-500 hover:text-blue-500 hover:shadow-sm"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
