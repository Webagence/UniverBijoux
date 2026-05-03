import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { authApi } from "@/services/authApi";

const CART_KEY = "ml_cart";

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

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
  roles: { id: number; name: string; label: string }[];
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
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { user: userData, profile: profileData } = await authApi.me();
      setUser(userData);
      setProfile(profileData);
      setIsAdmin(userData.roles?.some((r: { name: string }) => r.name === 'admin') ?? false);
    } catch {
      localStorage.removeItem('auth_token');
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshProfile = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  const login: AuthCtx["login"] = async (email, password) => {
    try {
      await authApi.login(email.trim().toLowerCase(), password);
      await loadUser();
      return { ok: true };
    } catch (err: any) {
      return {
        ok: false,
        error: err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Identifiants invalides',
      };
    }
  };

  const register: AuthCtx["register"] = async (data) => {
    const cleanSiret = data.siret.replace(/\s/g, "");
    if (!/^\d{14}$/.test(cleanSiret)) {
      return { ok: false, error: "Le numéro SIRET doit contenir 14 chiffres." };
    }

    try {
      const result = await authApi.register({
        name: data.companyName,
        email: data.email.trim().toLowerCase(),
        password: data.password,
        password_confirmation: data.password,
        phone: data.phone ?? "",
        company_name: data.companyName,
        siret: cleanSiret,
        contact_name: data.contactName,
      });
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        await loadUser();
      }
      return { ok: true };
    } catch (err: any) {
      return {
        ok: false,
        error: err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Erreur lors de l\'inscription',
      };
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    localStorage.removeItem(CART_KEY);
    window.location.href = '/connexion';
  };

  return (
    <Ctx.Provider value={{ user, profile, isAdmin, loading, login, register, logout, refreshProfile }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
