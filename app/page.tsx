"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/portfolio/header";
import SkillSection from "@/components/portfolio/skill-section";
import { TechFilter } from "@/components/portfolio/tech-filter";
import ProjectsSection from "@/components/portfolio/projects-section";
import { ProjectModal } from "@/components/portfolio/project-modal";
import CreateProjectModal from "../components/portfolio/create-project-modal";
import {
  technologies,
  projects as initialProjects,
  getProjectTechnologies,
  type Project,
} from "@/lib/data";

export default function HomePage() {
  // 1. Estado inicial con persistencia en LocalStorage
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("data-showcase:projects");
        if (raw) return JSON.parse(raw) as Project[];
      } catch (e) {
        console.error("Error parsing local storage", e);
      }
    }
    return initialProjects;
  });

  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">(
    "default",
  );

  // 2. Persistencia: Sincronizar cambios a LocalStorage
  useEffect(() => {
    localStorage.setItem(
      "data-showcase:projects",
      JSON.stringify(projectsList),
    );
  }, [projectsList]);

  // 3. Lógica de negocio (Filtrado y Ordenamiento)
  const usedTechnologies = useMemo(() => {
    const usedIds = new Set(projectsList.flatMap((p) => p.technologies));
    return technologies.filter((t) => usedIds.has(t.id));
  }, [projectsList]);

  const filteredProjects = useMemo(() => {
    let list = [...projectsList];

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.businessVision.problem.toLowerCase().includes(q) ||
          p.technicalDetail.stack.toLowerCase().includes(q),
      );
    }

    if (selectedTechs.length > 0) {
      list = list.filter((project) =>
        selectedTechs.some((tech) => project.technologies.includes(tech)),
      );
    }

    return list;
  }, [projectsList, searchTerm, selectedTechs]);

  const displayedProjects = useMemo(() => {
    if (sortOrder === "default") return filteredProjects;
    return [...filteredProjects].sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title),
    );
  }, [filteredProjects, sortOrder]);

  // 4. Handlers
  const handleCreateProject = (newProject: Project) => {
    setProjectsList((prev) => [newProject, ...prev]);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
    setSelectedProject(null);
  };

  const handleToggleTech = (techId: string) => {
    setSelectedTechs((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId],
    );
  };

  const handleClearFilters = () => setSelectedTechs([]);
  const cycleSort = () =>
    setSortOrder((s) =>
      s === "default" ? "asc" : s === "asc" ? "desc" : "default",
    );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      <SkillSection />
      <ProjectsSection
        projects={displayedProjects}
        usedTechnologies={usedTechnologies}
        selectedTechs={selectedTechs}
        onToggleTech={handleToggleTech}
        onClearFilters={handleClearFilters}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onOpen={(p) => setSelectedProject(p)}
        onCreate={handleCreateProject}
      />
      <footer className="border-t border-slate-100 bg-background py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
            {/* Identidad y Propuesta de Valor */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div>
                <p className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Enrique Gonzalez<span className="text-blue-600">.</span>
                </p>
                <p className="mt-2 text-sm text-slate-600 max-w-xs leading-relaxed text-center md:text-left">
                  Data Analyst & Business Intelligence. Transformando datos
                  complejos en insights estratégicos.
                </p>
              </div>
            </div>

            {/* Conectividad y Footer Info */}
            <div className="flex flex-col items-center md:items-end space-y-8">
              {/* Enlaces Reales con Interacción Refinada */}
              <div className="flex gap-6">
                {[
                  {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/in/enriquegonzalez-data/",
                  },
                  { name: "GitHub", url: "https://github.com/DevEnriquegd" },
                  { name: "Email", url: "mailto:enriquegdiaz08@gmail.com" },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Stack y Ubicación */}
              <div className="text-center md:text-right space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  SQL · Python · Power BI · Machine Learning
                </p>
                <div className="flex flex-col md:flex-row items-center justify-end gap-1 md:gap-3 text-xs text-slate-400 font-medium">
                  <span>© 2026 Enrique Gonzalez</span>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span>Trujillo, Perú</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSave={(updated) => {
          handleUpdateProject(updated);
          setSelectedProject(updated);
        }}
        onDelete={(id) => handleDeleteProject(id)}
      />
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
}
