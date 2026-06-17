import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/lerni-ai.png";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLessonRoom = location.pathname.startsWith("/avatar-teacher");
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const profile = user?.learningProfile || {};
  const userLevel = profile.englishLevel || profile.level || "Beginner";

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "⌂" },
    { label: "Lessons", path: "/lessons", icon: "▣" },
    { label: "AI Teachers", path: "/avatar-teacher?teacher=Zayed", icon: "◉" },
    { label: "Stories", path: "/stories", icon: "◇" },
    { label: "Vocabulary", path: "/words", icon: "✦" },
    { label: "Speaking Practice", path: "/avatar-teacher?teacher=Zayed", icon: "◌" },
    { label: "Mistakes", path: "/mistakes", icon: "!" },
    { label: "Exams", path: "/exams", icon: "✓" },
    { label: "Learning Plan", path: "/onboarding", icon: "▤" },
    { label: "Progress", path: "/progress", icon: "↗" },
    { label: "Settings", path: "/settings", icon: "⚙" },
  ];

  return (
    <div className="min-h-screen bg-[#f7faff] text-slate-950">
      {!isLessonRoom && (
        <aside className="fixed left-0 top-0 hidden h-screen w-[280px] border-r border-slate-200 bg-white p-5 shadow-[12px_0_40px_rgba(15,23,42,0.04)] lg:flex lg:flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Lerni AI"
                className="h-12 w-12 rounded-2xl object-contain"
              />

              <div>
                <h1 className="text-lg font-black text-slate-950">Lerni AI</h1>
                <p className="text-xs font-bold text-slate-400">
                  AI Language School
                </p>
              </div>
            </div>

            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-sm font-black text-blue-600">
              ✓
            </span>
          </div>

          <div className="mt-7 rounded-[28px] border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-200">
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
                <p className="text-xs font-black uppercase text-blue-500">
                  Student
                </p>
                <p className="truncate font-black text-slate-950">
                  {user?.name || "Student"}
                </p>
                <p className="truncate text-xs font-bold text-slate-400">
                  {userLevel}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-3">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-400">Learning Progress</span>
                <span className="text-blue-600">{userLevel}</span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-2/5 rounded-full bg-blue-600" />
              </div>
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-1 overflow-y-auto pr-1">
            {navItems.map((item) => (
              <NavLink
                key={`${item.label}-${item.path}`}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-sm shadow-sm">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-5 w-full rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-black text-red-500 transition hover:bg-red-100"
          >
            Logout
          </button>
        </aside>
      )}

      <main
        className={
          isLessonRoom
            ? "min-h-screen"
            : "min-h-screen bg-[#f7faff] lg:ml-[280px]"
        }
      >
        {!isLessonRoom && (
          <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Lerni AI"
                  className="h-10 w-10 rounded-2xl object-contain"
                />

                <div>
                  <h1 className="text-lg font-black text-slate-950">
                    Lerni AI
                  </h1>
                  <p className="text-xs font-bold text-slate-400">
                    Welcome, {user?.name || "Student"}
                  </p>
                </div>
              </div>

              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-200">
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
        )}

        <div
          className={
            isLessonRoom
              ? "min-h-screen"
              : "mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-8"
          }
        >
          <Outlet />
        </div>
      </main>

      {!isLessonRoom && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] border-t border-slate-200 bg-white/95 p-2 shadow-[0_-16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-4 gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-2xl px-2 py-3 text-center text-xs font-black transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/avatar-teacher?teacher=Zayed"
              className={({ isActive }) =>
                `rounded-2xl px-2 py-3 text-center text-xs font-black transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              Teacher
            </NavLink>

            <NavLink
              to="/words"
              className={({ isActive }) =>
                `rounded-2xl px-2 py-3 text-center text-xs font-black transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              Words
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `rounded-2xl px-2 py-3 text-center text-xs font-black transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              Settings
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
};

export default AppLayout;