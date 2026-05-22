import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/lerni-ai.png";

const AppLayout = () => {
  const { user, logout } = useAuth();

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Talk with Teacher", path: "/avatar-teacher" },
    { label: "Lessons", path: "/lessons" },
    { label: "Progress", path: "/progress" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-slate-950 p-6 lg:block">
        <img
  src={logo}
  alt="Learni AI"
  className="h-14 w-auto object-contain"
/>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-xl font-black text-cyan-300">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user?.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-400">Student</p>
              <p className="truncate font-bold">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-2xl px-5 py-4 font-semibold transition ${
                  isActive
                    ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20"
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

            <div className="flex items-center gap-3">
              <p className="max-w-[120px] truncate text-sm text-slate-300">
                {user?.name}
              </p>

              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarLetter
                )}
              </div>
            </div>
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

  <NavLink to="/avatar-teacher" className="rounded-xl px-2 py-3 text-center text-xs text-slate-300">
    Teacher
  </NavLink>

  <NavLink to="/lessons" className="rounded-xl px-2 py-3 text-center text-xs text-slate-300">
    Lessons
  </NavLink>

  <NavLink to="/settings" className="rounded-xl px-2 py-3 text-center text-xs text-slate-300">
    Settings
  </NavLink>
</nav>
    </div>
  );
};

export default AppLayout;