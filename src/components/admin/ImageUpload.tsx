import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

const ImageUpload = ({ value, onChange, bucket = "site-assets", folder = "", label = "Image" }: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: "Image téléversée" });
    } catch (e: any) {
      toast({ title: "Erreur upload", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">{label}</label>
      <div className="flex items-start gap-3">
        {value && (
          <div className="relative w-32 h-32 shrink-0 border border-border bg-cream">
            <img src={value} alt="aperçu" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 bg-bordeaux text-ivory rounded-full p-1 hover:bg-gold transition-smooth"
              aria-label="Retirer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <label className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-bordeaux/30 px-4 py-8 cursor-pointer hover:border-gold transition-smooth bg-cream/50">
          <Upload className="h-5 w-5 text-bordeaux/60" />
          <span className="text-xs text-bordeaux/60 text-center">
            {uploading ? "Téléversement…" : value ? "Remplacer l'image" : "Cliquer ou glisser une image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input text-xs"
          placeholder="URL de l'image"
        />
      )}
    </div>
  );
};

export default ImageUpload;
