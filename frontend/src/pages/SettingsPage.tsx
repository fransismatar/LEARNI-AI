import { useAuth } from "../context/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-cyan-300">Account settings</p>
        <h1 className="mt-3 text-5xl font-black">Settings</h1>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-slate-400">Name</p>
        <h2 className="mt-2 text-2xl font-bold">{user?.name}</h2>

        <p className="mt-6 text-slate-400">Email</p>
        <h2 className="mt-2 text-2xl font-bold">{user?.email}</h2>
      </div>
    </section>
  );
};

export default SettingsPage;
