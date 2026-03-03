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
    <section className="w-full bg-white border-y border-slate-200 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header de sección optimizado */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Casos de Éxito y Proyectos de Datos
          </h2>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Soluciones analíticas y modelos predictivos donde transformé datos
            en decisiones accionables.
          </p>
        </div>

        {/* Zona de Control Compacta: Filtros y Búsqueda */}
        <div className="mb-10 p-4 ">
          <TechFilter
            technologies={usedTechnologies}
            selectedTechs={selectedTechs}
            onToggle={onToggleTech}
            onClear={onClearFilters}
            searchTerm={searchTerm}
            onSearch={onSearch}
          />
        </div>

        {/* Grid de Proyectos con Feedback Visual */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((project) => {
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
                <div
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-500/30"
                >
                  {/* Contenedor de Imagen con Zoom sutil */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/5" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Tecnologías (Languages & Tools) */}
                        <div className="flex flex-wrap gap-2 w-full">
                          {languages.concat(tools).map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50/50 px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: t.color }}
                              />
                              {t.name}
                            </span>
                          ))}
                        </div>

                        {/* Dominios de Negocio (Separación Visual) */}
                        <div className="mt-2 flex w-full justify-end">
                          {domains.map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-100"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Botón CTA con alineación fija */}
                    <div className="mt-8 flex justify-end pt-4 border-t border-slate-50">
                      <button
                        onClick={() => onOpen(project)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Estado vacío para mejores prácticas de UX */
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500 font-medium">
                No se encontraron proyectos con esos criterios.
              </p>
              <button
                onClick={onClearFilters}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
