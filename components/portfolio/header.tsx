"use client";

import { Github, Linkedin, Mail, FileText, MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
          {/* Lado Izquierdo: Información Profesional */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Enrique Gonzalez Diaz
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-muted-foreground">
                <p className="text-lg font-medium text-primary">
                  Data Analyst | Business Intelligence
                </p>
                <span className="hidden h-1.5 w-1.5 rounded-full bg-border md:block"></span>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Trujillo, Perú</span>
                </div>
              </div>
            </div>

            <p className="max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground mx-auto md:mx-0">
              Ingeniero de Computación y Sistemas enfocado en optimizar la toma
              de decisiones mediante soluciones de automatización y Business
              Intelligence. Desarrollo procesos de integración y transformación
              de datos con Python y SQL, y diseño dashboards en Power BI que
              fortalecen la trazabilidad y confiabilidad del reporting
              comercial.
            </p>

            {/* Acciones y Redes Sociales Alineadas */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="/cv/EnriqueGonzalez_CV.pdf"
                download="EnriqueGonzalez_CV.pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-sm"
              >
                <FileText className="h-4 w-4" />
                Descargar CV
              </a>
              <a
                href="mailto:enriquegdiaz08@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
              >
                <Mail className="h-4 w-4" />
                Contactar
              </a>

              {/* Separador visual solo en desktop */}
              <div className="hidden h-8 w-px bg-border mx-1 md:block"></div>

              {/* Enlaces Sociales integrados en la fila de acciones */}
              <div className="flex items-center gap-2">
                {[
                  {
                    icon: Github,
                    href: "https://github.com/DevEnriquegd",
                    label: "GitHub",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/enrique-gonzalez-diaz/",
                    label: "LinkedIn",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="relative group">
              {/* Marco con tamaño incrementado en 15% */}
              <div className="h-50 w-40 md:h-70 md:w-70 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md">
                <img
                  src="/images/Professional_1.png"
                  alt="Enrique Gonzalez Diaz"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
