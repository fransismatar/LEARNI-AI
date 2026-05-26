import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/lerni-ai.png";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLessonRoom = location.pathname.startsWith("/avatar-teacher");
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Talk with Teacher", path: "/avatar-teacher?teacher=Zayed" },
    { label: "Lessons", path: "/lessons" },
    { label: "Progress", path: "/progress" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      {!isLessonRoom && (
        <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-[#07111f] p-6 text-white lg:block">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Learni AI"
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="mt-8 rounded-[28px] bg-white/[0.06] p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-blue-500 text-xl font-black text-white">
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
                <p className="text-xs font-bold text-slate-400">Student</p>
                <p className="truncate font-black text-white">{user?.name}</p>
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
                  `block rounded-2xl px-5 py-4 text-sm font-bold transition ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="absolute bottom-6 left-6 right-6 rounded-2xl border border-red-400/30 px-5 py-4 text-sm font-black text-red-300 transition hover:bg-red-400/10"
          >
            Logout
          </button>
        </aside>
      )}

      <main className={isLessonRoom ? "min-h-screen" : "min-h-screen lg:ml-72"}>
        {!isLessonRoom && (
          <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-blue-500">Learni AI</h1>

              <div className="flex items-center gap-3">
                <p className="max-w-[120px] truncate text-sm font-bold text-slate-600">
                  {user?.name}
                </p>

                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-blue-500 text-sm font-black text-white">
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
        )}

        <div
          className={
            isLessonRoom
              ? "min-h-screen"
              : "mx-auto max-w-7xl px-6 py-8 pb-24 lg:pb-8"
          }
        >
          <Outlet />
        </div>
      </main>

      {!isLessonRoom && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-slate-200 bg-white p-2 shadow-lg lg:hidden">
          <NavLink
            to="/dashboard"
            className="rounded-xl px-2 py-3 text-center text-xs font-bold text-slate-500"
          >
            Home
          </NavLink>

          <NavLink
            to="/avatar-teacher?teacher=Zayed"
            className="rounded-xl px-2 py-3 text-center text-xs font-bold text-slate-500"
          >
            Teacher
          </NavLink>

          <NavLink
            to="/lessons"
            className="rounded-xl px-2 py-3 text-center text-xs font-bold text-slate-500"
          >
            Lessons
          </NavLink>

          <NavLink
            to="/settings"
            className="rounded-xl px-2 py-3 text-center text-xs font-bold text-slate-500"
          >
            Settings
          </NavLink>
        </nav>
      )}
    </div>
  );
};

export default AppLayout;