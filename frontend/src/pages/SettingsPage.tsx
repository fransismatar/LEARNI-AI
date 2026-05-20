import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    user?.profileImage || null
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", name);

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const res = await api.put("/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      updateUser(res.data.user);
      setMessage("Profile updated successfully");
      setSelectedImage(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
        <p className="text-sm font-semibold text-cyan-300">Account settings</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Settings</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Manage your profile, account details, and learning preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 text-4xl font-black text-cyan-300">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <h2 className="mt-5 text-2xl font-black">{user?.name}</h2>
            <p className="mt-1 break-all text-sm text-slate-400">
              {user?.email}
            </p>

            <label className="mt-6 w-full cursor-pointer rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-4 text-center font-bold text-cyan-300 transition hover:bg-cyan-400/15">
              Upload profile picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              JPG or PNG recommended. Max file size is 5MB.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div>
            <p className="text-sm font-semibold text-cyan-300">Profile info</p>
            <h2 className="mt-2 text-3xl font-black">Edit your profile</h2>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-5">
            <div>
              <label className="text-sm font-semibold text-slate-300">
                Full name
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300">
                Email address
              </label>
              <input
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-4 text-slate-400 outline-none"
                value={user?.email || ""}
              />
              <p className="mt-2 text-xs text-slate-500">
                Email cannot be changed yet.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="font-bold text-white">Learning account</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your lessons, AI plan, and progress are connected to this account.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;