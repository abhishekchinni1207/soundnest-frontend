import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { AuthContext } from "./auth.context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchUserAndRole(sessionUser) {
      if (!active) return;

      setUser(sessionUser);

      if (!sessionUser) {
        setRole("user");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionUser.id)
          .single();

        if (!active) return;

        setRole(!error && data?.role ? data.role : "user");
      } catch {
        setRole("user");
      } finally {
        if (active) setLoading(false);
      }
    }

    // 🔹 Initial session load
    supabase.auth.getSession().then(({ data }) => {
      fetchUserAndRole(data.session?.user ?? null);
    });

    // 🔹 Listen to auth changes
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setLoading(true);
        fetchUserAndRole(session?.user ?? null);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
