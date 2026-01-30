"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.register(formData);
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
              Amar Pathagar
            </h1>
            <p className="text-old-grey uppercase text-sm tracking-widest">
              Join Our Community
            </p>
          </Link>
        </div>

        {/* Register Form */}
        <div className="classic-card">
          <h2 className="classic-heading text-2xl">Register</h2>

          {error && (
            <div className="mb-4 p-3 border-2 border-red-600 bg-red-50 text-red-600 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="classic-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="classic-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="classic-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="classic-input pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-old-grey hover:text-old-ink transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full classic-button disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-old-grey text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-old-ink font-bold underline">
                Login here
              </Link>
            </p>
            <p className="text-old-grey text-sm">
              <Link
                href="/"
                className="text-old-ink font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1 justify-center"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>

        {/* Starting Score Info */}
        <div className="mt-6 p-4 border-2 border-old-ink bg-white">
          <p className="text-sm font-bold uppercase tracking-wider text-center mb-2">
            Starting Success Score: 100
          </p>
          <p className="text-xs text-old-grey text-center">
            Build your reputation through contributions
          </p>
        </div>
      </div>
    </div>
  );
}
