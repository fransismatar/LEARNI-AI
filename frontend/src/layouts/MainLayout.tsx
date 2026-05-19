import { Outlet, NavLink } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <NavLink
            to="/"
            className="text-2xl font-black tracking-tight text-cyan-400"
          >
            Learni AI
          </NavLink>

          <nav className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="rounded-xl border border-cyan-400/40 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
            >
              Register
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;