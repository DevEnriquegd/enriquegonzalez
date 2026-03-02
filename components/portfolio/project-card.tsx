"use client";

import Image from "next/image";
import type { Project, Technology } from "@/lib/data";
import { getProjectTechnologies } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const projectTechs = getProjectTechnologies(project).slice(0, 4);

  return (
  <div className="min-h-screen bg-background">
    <Header />
    <SkillSection />

    {/* SECCIÓN DE PROYECTOS: La sacamos del main limitado para que el fondo blanco sea total */}
    <section className="w-full bg-white py-20 border-y border-border">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Encabezado de sección */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Casos de Éxito y Proyectos de Datos
          </h2>
          <p className="mt-3 text-gray-600">
            Proyectos donde transformé datos en decisiones accionables.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-10">
          <TechFilter
            technologies={usedTechnologies}
            selectedTechs={selectedTechs}
            onToggle={handleToggleTech}
            onClear={handleClearFilters}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
        </div>

        {/* Grid de Proyectos */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project) => {
            // ... (Tus constantes de filtrado de techs se mantienen igual)

            return (
              <div
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Imagen con hover unificado */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay sutil al pasar el mouse */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    {project.title}
                  </h3>

                  {/* Tags (Idiomas, Herramientas, Dominios) */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {/* ... tus mapeos de languages, tools y domains ... */}
                  </div>

                  {/* BOTÓN ALINEADO A LA DERECHA */}
                  <div className="mt-auto flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evita doble clic con el div padre
                        setSelectedProject(project);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95"
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

    {/* El resto de componentes (Footer, Modales) se mantienen igual */}
    <footer className="border-t py-12 text-center bg-slate-50">
      <p className="text-sm text-slate-500">
        Data Insights Hub — Designed for scalability
      </p>
    </footer>

    <ProjectModal ... />
    <CreateProjectModal ... />
  </div>
);
}
