"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Target,
  Lightbulb,
  TrendingUp,
  Layers,
  Code,
  GitBranch,
  Edit,
  Check,
  Trash,
} from "lucide-react";
import type { Project, Technology } from "@/lib/data";
import {
  getProjectTechnologies,
  technologies as allTechnologies,
} from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave?: (updated: Project) => void;
  onDelete?: (id: string) => void;
}

export function ProjectModal({
  project,
  onClose,
  onSave,
  onDelete,
}: ProjectModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Project | null>(project);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (project) {
      setForm(project);
      setIsEditing(false);
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [project, handleEscape]);

  if (!project || !form) return null;

  const handleSave = () => {
    if (onSave) onSave(form);
    setIsEditing(false);
  };

  const toggleTech = (id: string) => {
    setForm((f) =>
      f
        ? {
            ...f,
            technologies: f.technologies.includes(id)
              ? f.technologies.filter((t) => t !== id)
              : [...f.technologies, id],
          }
        : f,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER SECTION */}
        <div className="relative flex items-start gap-4 border-b border-border p-6">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
            {form.image && form.image.startsWith("http") ? (
              <img
                src={form.image}
                alt={form.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={
                  form.image ||
                  "https://via.placeholder.com/600x400?text=Project+Placeholder"
                }
                alt={form.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="text-xl font-semibold"
              />
            ) : (
              <h2 className="text-xl font-semibold text-foreground">
                {project.title}
              </h2>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {getProjectTechnologies(form).map((tech) => (
                <span
                  key={tech.id}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
                >
                  <Check className="h-4 w-4" /> Save
                </button>
                <button
                  onClick={() => {
                    if (!form) return;
                    if (!onDelete) return;
                    if (
                      confirm("Delete this project? This cannot be undone.")
                    ) {
                      onDelete(form.id);
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white"
                >
                  <Trash className="h-4 w-4" /> Delete
                </button>
                <button
                  onClick={() => {
                    setForm(project);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-input px-3 py-1 text-sm"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-input px-3 py-1 text-sm"
                >
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={onClose}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-8">
          {/* GITHUB & IMAGE URLS */}
          <section className="space-y-4">
            {isEditing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Image URL (absolute HTTPS link)
                  </label>
                  <Input
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="https://example.com/images/project-name.jpg"
                    title="Use a full https:// URL for the project image"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    GitHub Repository URL
                  </label>
                  <Input
                    value={form.githubUrl}
                    onChange={(e) =>
                      setForm({ ...form, githubUrl: e.target.value })
                    }
                  />
                </div>
              </div>
            ) : (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> View on GitHub
              </a>
            )}
          </section>

          {/* BUSINESS VISION */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Target className="h-5 w-5 text-primary" /> Business Vision
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {(["problem", "decision", "impact"] as const).map((key) => (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground capitalize">
                    {key === "problem" ? (
                      <Lightbulb className="h-4 w-4" />
                    ) : key === "decision" ? (
                      <Target className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    {key}
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={form.businessVision[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          businessVision: {
                            ...form.businessVision,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {project.businessVision[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* TECHNICAL DETAIL */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Code className="h-5 w-5 text-primary" /> Technical Detail
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {(["architecture", "stack", "dataFlow"] as const).map((key) => (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {key === "architecture" ? (
                      <Layers className="h-4 w-4" />
                    ) : key === "stack" ? (
                      <Code className="h-4 w-4" />
                    ) : (
                      <GitBranch className="h-4 w-4" />
                    )}
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={form.technicalDetail[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          technicalDetail: {
                            ...form.technicalDetail,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {project.technicalDetail[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* TECH STACK SELECTOR */}
          {isEditing && (
            <section className="pt-6 border-t">
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase">
                Update Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => toggleTech(tech.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                      form.technologies.includes(tech.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: tech.color }}
                    />
                    {tech.name}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
