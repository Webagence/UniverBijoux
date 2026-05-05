import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const addressSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  company: z.string().min(2, "Le nom de l'entreprise est requis"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville est requise"),
  postal_code: z.string().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  country: z.string().min(2, "Le pays est requis"),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  submitLabel?: string;
}

const AddressForm = ({ defaultValues, onSubmit, submitLabel = "Enregistrer" }: AddressFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      company: defaultValues?.company || "",
      address: defaultValues?.address || "",
      city: defaultValues?.city || "",
      postal_code: defaultValues?.postal_code || "",
      country: defaultValues?.country || "France",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du contact</Label>
          <Input id="name" {...register("name")} className="border-border" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input id="company" {...register("company")} className="border-border" />
          {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" {...register("address")} className="border-border" />
        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" {...register("city")} className="border-border" />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input id="postal_code" {...register("postal_code")} className="border-border" />
          {errors.postal_code && <p className="text-xs text-destructive">{errors.postal_code.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input id="country" {...register("country")} className="border-border" />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-bordeaux text-ivory py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
      >
        {isSubmitting ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
};

export default AddressForm;
