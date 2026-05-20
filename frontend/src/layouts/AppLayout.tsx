import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "AI Chat", path: "/teacher" },
  { label: "Speaking Practice", path: "/realtime-teacher" },
  { label: "Video Teacher", path: "/avatar-teacher" },
  { label: "Lessons", path: "/lessons" },
  { label: "Progress", path: "/progress" },
  { label: "Settings", path: "/settings" },
];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-slate-950 p-6 lg:block">
        <h1 className="text-2xl font-black text-cyan-400">Learni AI</h1>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">Student</p>
          <p className="mt-1 font-bold">{user?.name}</p>
          <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-2xl px-5 py-4 font-semibold transition ${
                  isActive
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-6 left-6 right-6 rounded-2xl border border-red-400/40 px-5 py-4 font-bold text-red-300 transition hover:bg-red-400/10"
        >
          Logout
        </button>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-cyan-400">Learni AI</h1>
            <p className="text-sm text-slate-300">{user?.name}</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8 pb-24 lg:pb-8">
  <Outlet />
</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-white/10 bg-slate-950 p-2 lg:hidden">
  <NavLink to="/dashboard" className="rounded-xl px-2 py-3 text-center text-xs text-slate-300">
    Home
  </NavLink>

  <NavLink to="/teacher" className="rounded-xl px-2 py-3 text-center text-xs text-slate-300">
    Chat
  </NavLink>

  <NavLink to="/lessons" className="rounded-xl px-2 py-3 text-center text-xs text-slate-300">
    Lessons
  </NavLink>

  <NavLink to="/avatar-teacher" className="rounded-xl px-2 py-3 text-center text-xs text-cyan-300">
    Avatar
  </NavLink>
</nav>
    </div>
  );
};

export default AppLayout;