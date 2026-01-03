import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  const mountedRef = useRef(true);

  /* 🔁 Redirect if already logged in */
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (!mountedRef.current) return;

    if (error) {
      // user-friendly message
      setError(
        error.message.includes("Invalid")
          ? "Invalid email or password"
          : "Login failed. Please try again."
      );
      setLoading(false);
      return;
    }

    // success → AuthProvider listener handles redirect
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg">
      <div className="flex justify-center items-center mt-20 px-4">
        <div
          className="
            w-full max-w-sm
            rounded-2xl p-8
            bg-white/80 dark:bg-darkCard/80
            backdrop-blur-xl
            border border-black/10 dark:border-white/10
            text-black dark:text-white
            shadow-2xl
          "
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Welcome back
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-4 py-2 rounded-lg
                bg-white dark:bg-black/30
                border border-black/20 dark:border-white/20
                focus:outline-none focus:ring-2 focus:ring-accent
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full px-4 py-2 rounded-lg
                bg-white dark:bg-black/30
                border border-black/20 dark:border-white/20
                focus:outline-none focus:ring-2 focus:ring-accent
              "
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                relative w-full py-3 rounded-xl font-semibold text-black
                bg-gradient-to-r from-[#1bfab7] to-[#16e6a7]
                shadow-lg shadow-accent/40
                hover:shadow-xl hover:shadow-accent/50
                hover:-translate-y-[1px]
                active:translate-y-0 active:shadow-md
                transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-4 opacity-80">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-accent font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
