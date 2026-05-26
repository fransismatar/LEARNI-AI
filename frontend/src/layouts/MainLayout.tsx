import { Outlet, NavLink, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/" || location.pathname === "/onboarding";

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {!hideHeader && (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <NavLink
              to="/"
              className="text-2xl font-black tracking-tight text-blue-500"
            >
              Learni AI
            </NavLink>

            <nav className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="rounded-xl border border-blue-200 px-5 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
              >
                Register
              </NavLink>
            </nav>
          </div>
        </header>
      )}

      <main className={hideHeader ? "" : "mx-auto max-w-7xl px-6 py-12"}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;