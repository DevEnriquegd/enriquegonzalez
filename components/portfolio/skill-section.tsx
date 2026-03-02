import {
  Database,
  BarChart3,
  BrainCircuit,
  LayoutTemplate,
  GitBranch,
} from "lucide-react";

export const SkillSection = () => {
  return (
    <section id="stack" className="py-12 md:py-16 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Stack Tecnológico
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Mi arsenal técnico especializado en la ingeniería y ciencia de datos
            para optimizar la toma de decisiones.
          </p>
        </header>

        {/* Bento Grid Optimizado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. DATA CORE - Énfasis en legibilidad */}
          <div className="md:col-span-2 rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-blue-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Data & Analytics Core
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Excel Avanzado",
                "Python",
                "SQL",
                "PostgreSQL",
                "SQL Server",
                "MySQL",
              ].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 2. BUSINESS INTELLIGENCE */}
          <div className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-yellow-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                BI
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Power BI", "DAX", "Power Query"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 rounded-lg text-xs font-semibold border border-yellow-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 3. MACHINE LEARNING - Ahora con tags para consistencia */}
          <div className="md:row-span-1 rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-purple-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Predictive Modeling
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Scikit-learn", "XGBoost", "Random Forest"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-semibold border border-purple-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 4. WORKFLOW */}
          <div className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-orange-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <GitBranch className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">
                Workflow
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Git, GitHub, Google Colab, VS Code
            </p>
          </div>

          {/* 5. DESIGN & PROTOTYPING */}
          <div className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-pink-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <LayoutTemplate className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">
                UI/UX Data
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Prototipado en{" "}
              <span className="text-pink-600 dark:text-pink-400">Figma</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillSection;
