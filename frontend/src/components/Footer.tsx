import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#020617]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md">
          <h2 className="text-2xl font-black text-white">
            Lerni AI
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Learn languages with AI teachers, real conversations,
            speaking practice, grammar correction, and personalized lessons.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
              Platform
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>

              <Link to="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>

              <Link to="/login" className="transition hover:text-white">
                Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
              Features
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <p>AI Teachers</p>
              <p>Live Speaking</p>
              <p>Personal Plans</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
              Languages
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <p>English</p>
              <p>Arabic</p>
              <p>Hebrew</p>
              <p>French</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Lerni AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;