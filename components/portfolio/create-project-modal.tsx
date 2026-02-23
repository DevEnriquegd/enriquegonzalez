"use client";

import React from "react";

import { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Project, Technology } from "@/lib/data";
import { technologies } from "@/lib/data";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

interface FormData {
  title: string;
  image: string;
  technologies: string[];
  businessVision: {
    problem: string;
    decision: string;
    impact: string;
  };
  technicalDetail: {
    architecture: string;
    stack: string;
    dataFlow: string;
  };
  githubUrl: string;
}

const initialFormData: FormData = {
  title: "",
  image: "",
  technologies: [],
  businessVision: {
    problem: "",
    decision: "",
    impact: "",
  },
  technicalDetail: {
    architecture: "",
    stack: "",
    dataFlow: "",
  },
  githubUrl: "",
};

export function CreateProjectModal({
  isOpen,
  onClose,
  onSave,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate only required field: title
    if (!formData.title.trim()) {
      setErrors({ title: "Project name is required" });
      return;
    }

    setErrors({});

    const newProject: Project = {
      id: formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      title: formData.title,
      image:
        formData.image ||
        "https://via.placeholder.com/600x400?text=Project+Placeholder",
      technologies: formData.technologies,
      businessVision: {
        problem: formData.businessVision.problem || "Not specified",
        decision: formData.businessVision.decision || "Not specified",
        impact: formData.businessVision.impact || "Not specified",
      },
      technicalDetail: {
        architecture: formData.technicalDetail.architecture || "Not specified",
        stack: formData.technicalDetail.stack || "Not specified",
        dataFlow: formData.technicalDetail.dataFlow || "Not specified",
      },
      githubUrl: formData.githubUrl || "#",
    };

    onSave(newProject);
    setFormData(initialFormData);
    onClose();
  };

  const handleTechToggle = (techId: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter((id) => id !== techId)
        : [...prev.technologies, techId],
    }));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2
            id="create-modal-title"
            className="text-lg font-semibold text-foreground"
          >
            Create New Project
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-130px)] overflow-y-auto p-5"
        >
          <div className="space-y-5">
            {/* Project Name - Required */}
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Project Name <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors({});
                }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.title ? "border-destructive" : "border-border"
                }`}
                placeholder="Enter project name"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Image URL (absolute HTTPS link)
              </label>
              <input
                id="image"
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/images/project-name.jpg"
                title="Use a full https:// URL for the project image"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label
                htmlFor="githubUrl"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                GitHub URL
              </label>
              <input
                id="githubUrl"
                type="text"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/project"
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => handleTechToggle(tech.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      formData.technologies.includes(tech.id)
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: formData.technologies.includes(tech.id)
                          ? "#fff"
                          : tech.color,
                      }}
                    />
                    {tech.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Vision */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">
                Business Vision
              </legend>
              <div>
                <label
                  htmlFor="problem"
                  className="mb-1 block text-xs text-[#475569]"
                >
                  Problem
                </label>
                <textarea
                  id="problem"
                  value={formData.businessVision.problem}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessVision: {
                        ...prev.businessVision,
                        problem: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the business problem..."
                />
              </div>
              <div>
                <label
                  htmlFor="decision"
                  className="mb-1 block text-xs text-[#475569]"
                >
                  Decision
                </label>
                <textarea
                  id="decision"
                  value={formData.businessVision.decision}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessVision: {
                        ...prev.businessVision,
                        decision: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the decision made..."
                />
              </div>
              <div>
                <label
                  htmlFor="impact"
                  className="mb-1 block text-xs text-[#475569]"
                >
                  Impact
                </label>
                <textarea
                  id="impact"
                  value={formData.businessVision.impact}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessVision: {
                        ...prev.businessVision,
                        impact: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the business impact..."
                />
              </div>
            </fieldset>

            {/* Technical Detail */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">
                Technical Detail
              </legend>
              <div>
                <label
                  htmlFor="architecture"
                  className="mb-1 block text-xs text-[#475569]"
                >
                  Architecture
                </label>
                <textarea
                  id="architecture"
                  value={formData.technicalDetail.architecture}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technicalDetail: {
                        ...prev.technicalDetail,
                        architecture: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the architecture..."
                />
              </div>
              <div>
                <label
                  htmlFor="stack"
                  className="mb-1 block text-xs text-[#475569]"
                >
                  Stack
                </label>
                <textarea
                  id="stack"
                  value={formData.technicalDetail.stack}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technicalDetail: {
                        ...prev.technicalDetail,
                        stack: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the tech stack..."
                />
              </div>
              <div>
                <label
                  htmlFor="dataFlow"
                  className="mb-1 block text-xs text-[#475569]"
                >
                  Data Flow
                </label>
                <textarea
                  id="dataFlow"
                  value={formData.technicalDetail.dataFlow}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technicalDetail: {
                        ...prev.technicalDetail,
                        dataFlow: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the data flow..."
                />
              </div>
            </fieldset>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
