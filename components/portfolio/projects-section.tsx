"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { TechFilter } from "@/components/portfolio/tech-filter";
import type { Project, Technology } from "@/lib/data";
import { getProjectTechnologies } from "@/lib/data";
import { CreateProjectModal } from "@/components/portfolio/create-project-modal";
import UploadProject from "@/components/portfolio/upload-project";

type Props = {
  projects: Project[];
  usedTechnologies: Technology[];
  selectedTechs: string[];
  onToggleTech: (id: string) => void;
  onClearFilters: () => void;
  searchTerm: string;
  onSearch: (s: string) => void;
  onOpen: (p: Project) => void;
  onCreate?: (p: Project) => void;
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
  onCreate,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: session } = useSession();
  const allowEdit =
    process.env.NEXT_PUBLIC_ALLOW_EDIT === "true" || !!session?.user?.isAdmin;
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header: Reducimos márgenes drásticamente en mobile */}
        <div className="mb-6 md:mb-10 text-center px-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Proyectos Destacados
          </h2>
          <div className="mt-2 flex justify-center">
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Análisis y desarrollos enfocados en generar visibilidad,
              eficiencia y mejores decisiones comerciales.
            </p>
          </div>
        </div>

        {/* Zona de Control: Filtros + Botón de Acción Alineados */}
        <div className="mb-8 md:mb-12 max-w-4xl mx-auto px-4">
          {/* Zona de Control: Alineación por base */}
          <div className="mb-8 md:mb-12 max-w-4xl mx-auto px-4">
            <div className="flex w-full items-end gap-2">
              {" "}
              {/* items-end es el secreto para que las bases de los botones coincidan */}
              <div className="flex-1 min-w-0">
                <TechFilter
                  technologies={usedTechnologies}
                  selectedTechs={selectedTechs}
                  onToggle={onToggleTech}
                  onClear={onClearFilters}
                  searchTerm={searchTerm}
                  onSearch={onSearch}
                />
              </div>
              {/* El componente ahora es h-10 internamente */}
              {allowEdit && (
                <div className="shrink-0">
                  <UploadProject onClick={() => setIsCreateOpen(true)} />
                </div>
              )}
            </div>
          </div>

          {/* Modal de creación */}
          {allowEdit && (
            <CreateProjectModal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              onSave={(p) => {
                onCreate?.(p);
              }}
            />
          )}
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

              /* Refactorización de la Card dentro del .map() */

              return (
                <div
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-500/40"
                >
                  {/* Contenedor de Imagen con Aspect Ratio mas ajustado */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badge de Dominio: Estilo sutil pero claro en la esquina */}
                    <div className="absolute top-3 right-3">
                      {domains.map((d) => (
                        <span
                          key={d}
                          className="inline-flex items-center rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    {" "}
                    {/* Padding reducido para mayor densidad */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>

                      {/* Tags en una sola línea con scroll lateral si fuera necesario en móvil */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {languages.concat(tools).map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50/80 px-2 py-0.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: t.color }}
                            />
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Footer de la card: Alineado y compacto */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => onOpen(project)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20"
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
