import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lock, Shield } from "lucide-react";

const AdminLogin = () => {
  const { user, isAdmin, loading, login, refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-bordeaux flex items-center justify-center text-ivory/70">Chargement…</div>;
  }
  if (isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, pwd);
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Connexion impossible", description: res.error });
      return;
    }
    // Re-vérifier le rôle après connexion
    setTimeout(() => {
      // l'AuthContext recharge déjà; si toujours pas admin → message
      if (!isAdmin) {
        toast({
          title: "Connecté",
          description: "Compte sans privilège admin. Si vous êtes le 1er utilisateur, cliquez sur ‘Devenir admin’.",
        });
      }
    }, 500);
  };

  const becomeAdmin = async () => {
    setBootstrapping(true);
    const { data, error } = await supabase.rpc("bootstrap_first_admin");
    setBootstrapping(false);
    if (error) {
      toast({ title: "Erreur", description: error.message });
      return;
    }
    if (data === true) {
      await refreshProfile();
      toast({ title: "Vous êtes admin", description: "Accès au panel ouvert." });
      navigate("/admin");
    } else {
      toast({
        title: "Action refusée",
        description: "Un administrateur existe déjà. Demandez-lui de vous attribuer le rôle.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bordeaux flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <form onSubmit={onSubmit} className="bg-ivory p-10 space-y-6 shadow-elegant">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 bg-gold/20 text-gold rounded-full flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <div className="font-serif text-2xl text-bordeaux">Administration</div>
            <p className="text-sm text-bordeaux/60">Espace réservé à l'équipe Maison Lune</p>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cream border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">Mot de passe</label>
            <input
              type="password"
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full bg-cream border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-bordeaux text-ivory py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {user && !isAdmin && (
          <div className="bg-ivory/10 border border-ivory/20 p-5 text-ivory/80 text-sm space-y-3">
            <div className="flex items-center gap-2 text-gold">
              <Shield className="h-4 w-4" />
              <span className="text-[11px] tracking-luxe uppercase">Premier accès</span>
            </div>
            <p>
              Connecté en tant que <span className="text-ivory">{user.email}</span> mais sans rôle admin.
              S'il s'agit du tout premier compte du site, vous pouvez vous attribuer le rôle administrateur.
            </p>
            <button
              onClick={becomeAdmin}
              disabled={bootstrapping}
              className="w-full bg-gold text-bordeaux py-2.5 text-xs tracking-luxe uppercase hover:bg-ivory transition-smooth disabled:opacity-50"
            >
              {bootstrapping ? "…" : "Devenir le 1er administrateur"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
