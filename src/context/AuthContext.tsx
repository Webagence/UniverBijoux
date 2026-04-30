import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export interface ProProfile {
  id: string;
  email: string;
  company_name: string;
  siret: string;
  contact_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  vat_number: string;
  approved: boolean;
}

interface RegisterPayload {
  companyName: string;
  siret: string;
  contactName: string;
  phone?: string;
  email: string;
  password: string;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  profile: ProProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterPayload) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfileAndRole = useCallback(async (uid: string) => {
    const [{ data: prof }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((prof as ProProfile) ?? null);
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
  }, []);

  useEffect(() => {
    // 1) écoute des changements de session AVANT getSession
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // déférer pour éviter deadlock
        setTimeout(() => loadProfileAndRole(sess.user.id), 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    // 2) puis récupération de la session existante
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) loadProfileAndRole(sess.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfileAndRole]);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfileAndRole(user.id);
  }, [user, loadProfileAndRole]);

  const login: AuthCtx["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const register: AuthCtx["register"] = async (data) => {
    const cleanSiret = data.siret.replace(/\s/g, "");
    if (!/^\d{14}$/.test(cleanSiret)) {
      return { ok: false, error: "Le numéro SIRET doit contenir 14 chiffres." };
    }
    const { error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/compte`,
        data: {
          company_name: data.companyName,
          siret: cleanSiret,
          contact_name: data.contactName,
          phone: data.phone ?? "",
        },
      },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, profile, isAdmin, loading, login, register, logout, refreshProfile }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
