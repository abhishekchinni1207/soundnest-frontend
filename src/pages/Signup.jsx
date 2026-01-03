import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center mt-20 px-4">
      <form
        onSubmit={handleSignup}
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
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-600 mb-4 text-sm">
            Account created! Check your email to confirm.
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full mb-4 px-4 py-2 rounded-lg
            bg-white dark:bg-black/30
            border border-black/20 dark:border-white/20
            focus:outline-none focus:ring-2 focus:ring-accent
          "
        />

        <input
          type="password"
          placeholder="Password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full mb-4 px-4 py-2 rounded-lg
            bg-white dark:bg-black/30
            border border-black/20 dark:border-white/20
            focus:outline-none focus:ring-2 focus:ring-accent
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            relative w-full py-3 rounded-xl
            font-semibold text-black
            bg-gradient-to-r from-[#1bfab7] to-[#16e6a7]
            shadow-lg shadow-accent/40
            hover:shadow-xl hover:shadow-accent/50
            hover:-translate-y-[1px]
            active:translate-y-0 active:shadow-md
            transition-all duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm mt-4 text-center opacity-80">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-accent font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
