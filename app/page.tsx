"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/portfolio/header";
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
import Navbar from "@/components/portfolio/navbar";

export default function HomePage() {
  // 1. Estado inicial: vací­o; cargaremos desde la API al montar
  const [projectsList, setProjectsList] = useState<Project[]>([]);

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

  // 2b. Al montar, intentamos cargar desde la API (server / data/projects.json).
  // Si falla, nos rescatamos desde localStorage o desde `initialProjects`.
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/projects", {
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = (await res.json()) as any[];
          // Normalize backend field `image_url` -> `image` for compatibility
          const normalized = (data || []).map((p: any) => ({
            ...p,
            image: p.image ?? p.image_url ?? "",
          })) as Project[];
          if (mounted) setProjectsList(normalized || []);
          return;
        }
      } catch (err) {
        // ignore and fallback
      }

      // Fallback: localStorage -> initialProjects
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("data-showcase:projects");
          if (raw)
            return mounted && setProjectsList(JSON.parse(raw) as Project[]);
        } catch (e) {
          // ignore
        }
      }

      if (mounted) setProjectsList(initialProjects);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

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
      <Navbar />
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
      <footer className="border-t border-slate-100 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row md:items-start md:gap-4">
            {/* 1. Identidad: Alineación central en mobile, izquierda en desktop */}
            <div className="flex flex-col items-center space-y-4 md:items-start">
              <div className="text-center md:text-left">
                <p className="text-lg font-black text-slate-900 tracking-tight">
                  Enrique Gonzalez<span className="text-blue-600">.</span>
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed font-medium text-slate-500">
                  Data Analyst & Business Intelligence. Especializado en
                  transformar datos en decisiones estratégicas mediante
                  soluciones escalables.
                </p>
              </div>
            </div>

            {/* 2. Conectividad y Status: Estructura organizada para mobile */}
            <div className="flex flex-col items-center space-y-8 md:items-end">
              {/* Enlaces con padding táctil mejorado para mobile */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:justify-end">
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
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all duration-300 border-b-2 border-transparent hover:border-blue-600 pb-1"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Info de Cierre: Stack y Copyright */}
              <div className="space-y-3 text-center md:text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  SQL · Python · Power BI · Machine Learning
                </p>
                <div className="flex flex-col items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-tighter text-slate-400 md:flex-row md:justify-end md:gap-3">
                  <span>© 2026 Enrique Gonzalez</span>
                  <span className="hidden md:inline text-slate-200">|</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    Trujillo, Perú
                  </span>
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
