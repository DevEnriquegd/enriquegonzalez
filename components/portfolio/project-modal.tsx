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
  Github,
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <aside className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-card shadow-2xl">
            {/* Header with background image */}
            <header className="relative h-72 w-full shrink-0 overflow-hidden">
              {/* Fondo e Imagen (Igual al anterior) */}
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.title}
                  className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] object-cover transition-transform duration-700 hover:scale-110 blur-xs"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-900" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent" />

              {/* Botón de cierre (Igual) */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
              >
                <X className="h-5 w-5" />
              </button>

              {/* CONTENIDO DEL HEADER */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  {/* Información del Proyecto */}
                  <div className="flex-1 space-y-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        {/* Input para el Título */}
                        <Input
                          value={form.title}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                          className="bg-white/10 text-xl font-bold text-white border-white/20 focus:border-white"
                          placeholder="Título del proyecto"
                        />
                        {/* NUEVO: Input para la URL de la Imagen */}
                        <Input
                          value={form.image}
                          onChange={(e) =>
                            setForm({ ...form, image: e.target.value })
                          }
                          className="bg-white/10 text-xs font-medium text-white/70 border-white/10 focus:border-white h-8"
                          placeholder="URL de la imagen de fondo"
                        />
                      </div>
                    ) : (
                      <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        {form.title}
                      </h2>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {getProjectTechnologies(form)
                        .slice(0, 5)
                        .map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10"
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: t.color }}
                            />
                            {t.name}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* ACCIONES PRINCIPALES (Aquí integramos GitHub) */}
                  <div className="flex items-center gap-3">
                    {!isEditing && (
                      <a
                        href={form.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95"
                      >
                        <Github className="h-4 w-4" />
                        <span>Repositorio</span>
                      </a>
                    )}

                    <div className="h-8 w-px bg-white/20 mx-1 hidden md:block"></div>

                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                        >
                          <Check className="h-4 w-4" /> Guardar
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md border border-white/10 hover:bg-white/20"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Body (scrollable) */}
            <div className="overflow-y-auto p-6">
              {/* Sección: Visión de Negocio */}
              <section className="mb-10 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Visión de Negocio
                  </h3>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      key: "problem",
                      label: "Contexto y Desafío",
                      icon: Lightbulb,
                      color: "amber",
                      bg: "bg-amber-50/50",
                      border: "border-amber-100",
                      iconColor: "text-amber-600",
                    },
                    {
                      key: "decision",
                      label: "Estrategia Analítica",
                      icon: Target,
                      color: "blue",
                      bg: "bg-blue-50/50",
                      border: "border-blue-100",
                      iconColor: "text-blue-600",
                    },
                    {
                      key: "impact",
                      label: "Valor y Resultados",
                      icon: TrendingUp,
                      color: "emerald",
                      bg: "bg-emerald-50/50",
                      border: "border-emerald-100",
                      iconColor: "text-emerald-600",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className={`group flex items-start gap-5 rounded-2xl border ${item.border} ${item.bg} p-5 transition-all hover:shadow-md hover:bg-white`}
                    >
                      {/* Icono con contenedor estilizado */}
                      <div className="shrink-0 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200/50 transition-transform group-hover:scale-110">
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>

                      {/* Contenido de la Card */}
                      <div className="flex-1 space-y-1">
                        <div
                          className={`text-xs font-black uppercase tracking-widest ${item.iconColor}/80`}
                        >
                          {item.label}
                        </div>

                        {isEditing ? (
                          <Textarea
                            value={
                              form.businessVision[
                                item.key as keyof typeof form.businessVision
                              ]
                            }
                            onChange={(e) =>
                              setForm({
                                ...form,
                                businessVision: {
                                  ...form.businessVision,
                                  [item.key]: e.target.value,
                                },
                              })
                            }
                            className="mt-2 min-h-25 bg-white border-slate-200 focus:ring-blue-500"
                            placeholder={`Describe el ${item.label.toLowerCase()}...`}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed text-slate-600 font-medium">
                            {form.businessVision[
                              item.key as keyof typeof form.businessVision
                            ] || "Información no especificada."}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sección: Detalles de Ingeniería */}
              <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Code className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Ingeniería del Proyecto
                  </h3>
                </div>

                <div className="relative space-y-0 pl-10">
                  {/* Línea vertical con gradiente para guiar el ojo */}
                  <div className="absolute left-4.75 top-2 bottom-2 w-0.5 bg-linear-to-b from-indigo-500 via-slate-200 to-slate-200" />

                  {[
                    {
                      key: "architecture",
                      label: "Arquitectura de Solución",
                      icon: Layers,
                      color: "indigo",
                    },
                    {
                      key: "stack",
                      label: "Ecosistema Tecnológico",
                      icon: Code,
                      color: "blue",
                    },
                    {
                      key: "dataFlow",
                      label: "Pipeline de Datos (ETL/Modelado)",
                      icon: GitBranch,
                      color: "violet",
                    },
                  ].map((item, idx) => (
                    <div key={item.key} className="relative pb-10 last:pb-0">
                      {/* Nodo interactivo */}
                      <div className="absolute -left-7.75 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-200 shadow-sm transition-colors group-hover:border-indigo-500">
                        <div className="h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                      </div>

                      <div className="group flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-slate-800 transition-colors group-hover:text-indigo-600">
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm font-bold uppercase tracking-wider">
                            {item.label}
                          </span>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
                          {isEditing ? (
                            <Textarea
                              value={
                                form.technicalDetail[
                                  item.key as keyof typeof form.technicalDetail
                                ]
                              }
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  technicalDetail: {
                                    ...form.technicalDetail,
                                    [item.key]: e.target.value,
                                  },
                                })
                              }
                              className="min-h-25 border-none p-0 focus-visible:ring-0 text-sm leading-relaxed"
                              placeholder={`Detalla la ${item.label.toLowerCase()}...`}
                            />
                          ) : (
                            <p className="text-sm leading-relaxed text-slate-600">
                              {form.technicalDetail[
                                item.key as keyof typeof form.technicalDetail
                              ] || "Detalle técnico pendiente."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technology selector when editing */}
              {isEditing && (
                <section className="pt-8 mt-4 border-t border-slate-100">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Gestión de Stack Tecnológico
                      </h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {form.technologies.length} seleccionadas
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {allTechnologies.map((tech) => {
                        const isSelected = form.technologies.includes(tech.id);
                        return (
                          <button
                            key={tech.id}
                            onClick={() => toggleTech(tech.id)}
                            className={`
                group inline-flex items-center gap-2.5 rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-all duration-200
                ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                }
              `}
                          >
                            <span
                              className={`h-2 w-2 rounded-full transition-transform group-hover:scale-125 ${isSelected ? "ring-2 ring-white/20" : ""}`}
                              style={{ backgroundColor: tech.color }}
                            />
                            {tech.name}
                            {isSelected && (
                              <Check className="h-3 w-3 ml-1 text-blue-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default ProjectModal;
