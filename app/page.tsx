"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowDownUpIcon, Plus } from "lucide-react";
import { Header } from "@/components/portfolio/header";
import SkillSection from "@/components/portfolio/skill-section";
import { TechFilter } from "@/components/portfolio/tech-filter";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectModal } from "@/components/portfolio/project-modal";
import { CreateProjectModal } from "@/components/portfolio/create-project-modal";
import {
  technologies,
  projects as initialProjects,
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
          (p.description && p.description.toLowerCase().includes(q)),
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
    <div className="min-h-screen bg-background">
      <Header />
      <SkillSection />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <section className="mb-8">
          <TechFilter
            technologies={usedTechnologies}
            selectedTechs={selectedTechs}
            onToggle={handleToggleTech}
            onClear={handleClearFilters}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#475569]">
              {filteredProjects.length === projectsList.length
                ? `${projectsList.length} Projects`
                : `${filteredProjects.length} of ${projectsList.length} Projects`}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={cycleSort}
                className="inline-flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm"
              >
                <ArrowDownUpIcon className="h-4 w-4" />
                <span>
                  Sort: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                </span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <p className="text-lg font-medium text-[#475569]">
                No projects match your filters
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-8 text-center">
        <p className="text-sm text-[#94A3B8]">
          Data Insights Hub — Designed for scalability
        </p>
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
