"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, LogIn, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [showCredForm, setShowCredForm] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Estados para el Smart Navbar
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Estados para el login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
      return;
    }
    window.location.hash = id;
    setOpen(false);
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // 1. Lógica de Progreso de Lectura
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress((currentScrollY / scrollHeight) * 100);

    // 2. Lógica Smart Navbar: Ocultar al bajar, mostrar al subir
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false); // Bajando
      setShowCredForm(false); // Cerramos popover al ocultar para evitar bugs visuales
    } else {
      setIsVisible(true); // Subiendo
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={`sticky top-0 z-40 w-full border-b border-slate-200/40 bg-white/60 backdrop-blur-xl transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Scroll Progress refinado envuelto en relative */}
      <div className="relative w-full h-0.75 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-600 via-indigo-500 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-150 z-50"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="#home"
            className="group"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("home");
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-700 text-white font-black text-xs ring-1 ring-slate-300/40 transition-all group-hover:scale-105 shadow-sm">
              EG
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["stack", "projects"].map((id) => (
              <Link
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(id);
                }}
                className="relative text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 hover:text-slate-900 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {id === "stack" ? "Stack Tecnológico" : "Proyectos"}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() =>
                session ? signOut() : setShowCredForm(!showCredForm)
              }
              className={`inline-flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all active:scale-95 shadow-sm ${
                session
                  ? "bg-transparent border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {session ? (
                <>
                  <LogOut className="h-3.5 w-3.5 opacity-60" />
                  <span>Cerrar Sesión</span>
                </>
              ) : (
                <>
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Acceso</span>
                </>
              )}
            </button>

            {showCredForm && !session && (
              <div className="absolute right-0 mt-4 w-72 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200 z-50">
                <div className="mb-4 text-center">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Panel Control
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Solo autorizado.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      const res: any = await signIn("credentials", {
                        redirect: false,
                        email,
                        password,
                      });
                      if (res?.ok) window.location.reload();
                      else setError("Error");
                      setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                  >
                    {loading ? "..." : "Entrar"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 md:hidden text-slate-600"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Menú Mobile estilo Panel */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-2">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("projects");
              }}
              className="py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 border-b border-slate-50 last:border-none"
            >
              Proyectos
            </a>
            <a
              href="#stack"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("stack");
              }}
              className="py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600"
            >
              Stack Tecnológico
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
