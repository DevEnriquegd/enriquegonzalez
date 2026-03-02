"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/portfolio/header";
import SkillSection from "@/components/portfolio/skill-section";
import { TechFilter } from "@/components/portfolio/tech-filter";
import ProjectsSection from "@/components/portfolio/projects-section";
import { ProjectModal } from "@/components/portfolio/project-modal";
import { CreateProjectModal } from "@/components/portfolio/create-project-modal";
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
      />
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
