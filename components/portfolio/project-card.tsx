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
    <button
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.image && project.image.startsWith("http") ? (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {projectTechs.map((tech: Technology) => (
            <span
              key={tech.id}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-[#475569]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: tech.color }}
              />
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500 border border-slate-200">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ProjectCard;
