"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, LogIn, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [showCredForm, setShowCredForm] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Estados para el login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/40 bg-white/60 backdrop-blur-xl transition-all duration-300">
      {/* 5. Micro detalle: Scroll bar z-index envuelto en relative */}
      <div className="relative w-full h-0.75 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-600 via-indigo-500 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-150 z-50"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        {" "}
        {/* 4. Espaciado vertical py-5 */}
        {/* Identidad: Monograma Tech */}
        <div className="flex items-center gap-10">
          <Link href="#home" className="group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-700 text-white font-black text-xs ring-1 ring-slate-300/40 transition-all group-hover:scale-105 shadow-sm">
              EG
            </div>
          </Link>

          {/* 1. Menú: Ajuste de escala a text-xs y font-semibold */}
          <div className="hidden md:flex items-center gap-8">
            {["Proyectos", "Habilidades", "Contacto"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 hover:text-slate-900 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {" "}
                {/* 2. Subrayado animado a -bottom-1 */}
                {item}
              </Link>
            ))}
          </div>
        </div>
        {/* Acciones / Sesión */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* 3. Botón "Cerrar Sesión" Ghost Style */}
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

            {/* Popover de Login: Se mantiene funcional */}
            {showCredForm && !session && (
              <div className="absolute right-0 mt-4 w-72 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200 z-50">
                <div className="mb-4 text-center">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Panel Control
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Solo personal autorizado.
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
                      placeholder="admin@data.com"
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

                  {error && (
                    <p className="text-[10px] font-bold text-red-500 text-center">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={async () => {
                      setLoading(true);
                      setError(null);
                      const res: any = await signIn("credentials", {
                        redirect: false,
                        email,
                        password,
                      });
                      if (res?.ok) window.location.reload();
                      else setError("Credenciales inválidas");
                      setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Autenticando..." : "Entrar al Sistema"}
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
            {["Proyectos", "Habilidades", "Contacto"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors border-b border-slate-50 last:border-none"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
