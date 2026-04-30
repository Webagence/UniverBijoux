import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";
import { Check, X, Trash2 } from "lucide-react";

const AdminAccounts = () => {
  const { getProAccounts, toggleApproveAccount, deleteAccount } = useAdmin();
  const [, force] = useState(0);
  const accounts = getProAccounts();

  return (
    <AdminLayout title="Comptes professionnels">
      <div className="bg-ivory border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream text-[11px] tracking-luxe uppercase text-bordeaux/60">
            <tr>
              <th className="text-left p-3">Société</th>
              <th className="text-left p-3">Contact</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">SIRET</th>
              <th className="text-center p-3">Statut</th>
              <th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-3 text-bordeaux">{a.companyName}</td>
                <td className="p-3 text-bordeaux/70">{a.contactName}</td>
                <td className="p-3 text-bordeaux/70">{a.email}</td>
                <td className="p-3 text-bordeaux/70 font-mono text-xs">{a.siret}</td>
                <td className="p-3 text-center">
                  <span
                    className={`text-[10px] tracking-luxe uppercase px-2 py-1 ${
                      a.approved ? "bg-gold/20 text-gold" : "bg-cream text-bordeaux/60"
                    }`}
                  >
                    {a.approved ? "Validé" : "Attente"}
                  </span>
                </td>
                <td className="p-3 flex gap-2 justify-end">
                  <button
                    onClick={async () => {
                      await toggleApproveAccount(a.id);
                      toast({ title: a.approved ? "Compte suspendu" : "Compte validé" });
                      force((n) => n + 1);
                    }}
                    className="text-bordeaux hover:text-gold"
                    title={a.approved ? "Suspendre" : "Valider"}
                  >
                    {a.approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Supprimer ${a.email} ?`)) {
                        await deleteAccount(a.id);
                        toast({ title: "Compte supprimé" });
                        force((n) => n + 1);
                      }
                    }}
                    className="text-bordeaux/40 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {accounts.length === 0 && (
          <div className="p-10 text-center text-bordeaux/60 text-sm">Aucun compte enregistré.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAccounts;
