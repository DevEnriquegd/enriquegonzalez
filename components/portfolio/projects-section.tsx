"use client";

import React from "react";
import { TechFilter } from "@/components/portfolio/tech-filter";
import type { Project, Technology } from "@/lib/data";
import { getProjectTechnologies } from "@/lib/data";

type Props = {
  projects: Project[];
  usedTechnologies: Technology[];
  selectedTechs: string[];
  onToggleTech: (id: string) => void;
  onClearFilters: () => void;
  searchTerm: string;
  onSearch: (s: string) => void;
  onOpen: (p: Project) => void;
};

export const ProjectsSection: React.FC<Props> = ({
  projects,
  usedTechnologies,
  selectedTechs,
  onToggleTech,
  onClearFilters,
  searchTerm,
  onSearch,
  onOpen,
}) => {
  return (
    <section className="w-full bg-white border-y border-slate-200 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Casos de Éxito y Proyectos de Datos
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Proyectos donde transformé datos en decisiones accionables.
          </p>
        </div>

        <div className="mb-12">
          <TechFilter
            technologies={usedTechnologies}
            selectedTechs={selectedTechs}
            onToggle={onToggleTech}
            onClear={onClearFilters}
            searchTerm={searchTerm}
            onSearch={onSearch}
          />
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const langIds = new Set(["python", "sql"]);
            const projectTechs = getProjectTechnologies(project);
            const languages = projectTechs.filter((t) => langIds.has(t.id));
            const tools = projectTechs.filter((t) => !langIds.has(t.id));

            const domainMap: Record<string, string[]> = {
              "sales-forecasting": ["Forecasting"],
              "customer-segmentation": ["Segmentación"],
              "supply-chain-analytics": ["Supply Chain"],
              "financial-reporting": ["Reporting"],
              "churn-prediction": ["Churn"],
              "marketing-attribution": ["Attribution"],
            };

            const domains = domainMap[project.id] || [];

            return (
              /* Eliminamos el onClick y el cursor-pointer de aquí */
              <div
                key={project.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* h-full y flex-1 aseguran que este contenedor ocupe todo el espacio disponible */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    {" "}
                    {/* Este div envuelve el contenido superior */}
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {languages.map((l) => (
                        <span
                          key={l.id}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: l.color }}
                          />
                          {l.name}
                        </span>
                      ))}

                      {tools.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: t.color }}
                          />
                          {t.name}
                        </span>
                      ))}

                      {domains.map((d) => (
                        <span
                          key={d}
                          className="ml-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* El mt-auto empuja este div al fondo de la card sin importar el contenido de arriba */}
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => onOpen(project)}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95 cursor-pointer"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
