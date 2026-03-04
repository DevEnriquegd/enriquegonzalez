"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, Plus } from "lucide-react";
import type { Project } from "@/lib/data";
import { technologies } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const { data: session } = useSession();

  // Hooks must run unconditionally to preserve hook order between renders.
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  const allowEdit =
    process.env.NEXT_PUBLIC_ALLOW_EDIT === "true" || !!session?.user?.isAdmin;
  if (!allowEdit) return null;

  const handleFileChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrors({ title: "El nombre del proyecto es requerido" });
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
        problem: formData.businessVision.problem || "",
        decision: formData.businessVision.decision || "",
        impact: formData.businessVision.impact || "",
      },
      technicalDetail: {
        architecture: formData.technicalDetail.architecture || "",
        stack: formData.technicalDetail.stack || "",
        dataFlow: formData.technicalDetail.dataFlow || "",
      },
      githubUrl: formData.githubUrl || "",
    };

    // POST to server API; onSave will update parent state when returned
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(newProject),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Error creating project");
        const created = await r.json();
        onSave(created);
        setFormData(initialFormData);
        onClose();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        alert(
          "No autorizado o error al crear. Asegúrate de estar autenticado como admin.",
        );
      });
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ejecutivo */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
          <div>
            <h2
              id="create-modal-title"
              className="text-xl font-black text-slate-900 tracking-tight"
            >
              Subir Nuevo Caso de Éxito
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Configura los detalles técnicos y de negocio.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto p-6 space-y-6"
        >
          {/* Fila 1: Título y Repositorio */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Nombre del proyecto *
              </label>
              <Input
                placeholder="Ej. Telecom X: Predicción de Churn"
                value={formData.title}
                className="rounded-xl border-slate-200 focus:ring-blue-500/20"
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors({});
                }}
              />
              {errors.title && (
                <p className="text-xs font-bold text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                URL del Repositorio
              </label>
              <Input
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                className="rounded-xl border-slate-200 focus:ring-blue-500/20"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Fila 2: Imagen y Preview */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Imagen de Portada (URL)
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                className="rounded-xl border-slate-200 focus:ring-blue-500/20"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
              />
              <p className="text-[10px] text-slate-400">
                Se recomienda una resolución de 1280x720px.
              </p>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <Plus className="mb-1 h-6 w-6 opacity-20" />
                  <span className="text-[10px] font-bold uppercase">
                    Vista previa
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tecnologías: Con scroll y mejor diseño */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Stack Tecnológico
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              {technologies.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleTechToggle(tech.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                    formData.technologies.includes(tech.id)
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
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
          </div>

          {/* Descripción / Visión de Negocio */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Visión de Negocio (Problema)
            </label>
            <Textarea
              placeholder="Describe el desafío de negocio y el impacto esperado..."
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
              className="min-h-25 rounded-xl border-slate-200 focus:ring-blue-500/20"
            />
          </div>

          {/* Opciones Avanzadas */}
          <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100/50">
            <button
              type="button"
              onClick={() => setShowAdvanced((s) => !s)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
            >
              {showAdvanced
                ? "- Ocultar detalles técnicos"
                : "+ Agregar detalles técnicos (Arquitectura)"}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Detalla la arquitectura, el flujo de datos o el stack específico..."
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
                  className="min-h-30 rounded-xl border-blue-200 bg-white"
                />
              </div>
            )}
          </div>

          {/* Acciones Finales */}
          <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-bold text-slate-400 transition-colors hover:text-slate-600"
            >
              Descartar
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Publicar Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
