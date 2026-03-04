import {
  Database,
  BarChart3,
  BrainCircuit,
  LayoutTemplate,
  GitBranch,
  Star,
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
          {/* 1. CORE PROFESIONAL - Ocupa más espacio para denotar importancia */}
          <div className="md:col-span-2 lg:col-span-2 rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-blue-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Core Profesional
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Excel Avanzado",
                "SQL",
                "Python",
                "Power BI",
                "Data Visualization",
                "ETL / Data Cleaning",
              ].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-semibold border border-blue-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 2. DATABASES - Categoría técnica específica */}
          <div className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-cyan-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Database className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Databases
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["PostgreSQL", "SQL Server", "MySQL"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-semibold border border-cyan-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 3. MACHINE LEARNING - (Se mantiene igual pero con el color púrpura) */}
          <div className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-purple-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Machine Learning
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

          {/* 4. WORKFLOW - (Se mantiene en naranja) */}
          <div className="rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-orange-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <GitBranch className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Workflow
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Git", "GitHub"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-semibold border border-orange-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
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
