import { useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useLang } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const Contact = () => {
  const { settings, contactPage } = useAdmin();
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("contact.message_sent"), description: t("contact.message_sent_desc") });
    setForm({ name: "", company: "", email: "", message: "" });
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={contactPage.eyebrow || t("contact.write_to_us")}
        title={contactPage.title || t("contact.sales_contact")}
        subtitle={contactPage.subtitle || t("contact.contact_subtitle")}
        crumbs={[{ label: t("contact.contact") }]}
      />
      <section className="container py-12 md:py-16 grid md:grid-cols-2 gap-12">
        <form onSubmit={submit} className="space-y-5 bg-ivory border border-border p-4 sm:p-6 md:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder={t("contact.name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
            <input
              required
              placeholder={t("contact.company")}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <input
            type="email"
            required
            placeholder={t("contact.professional_email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
          />
          <textarea
            required
            rows={6}
            placeholder={t("contact.your_message")}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
          />
          <button className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            {t("contact.send")}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="flex gap-4"><Mail className="h-5 w-5 text-gold shrink-0 mt-1" /><div>
            <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Email</p>
            <a href={`mailto:${settings.email}`} className="text-bordeaux hover:text-gold">{settings.email}</a>
          </div></div>
          <div className="flex gap-4"><Phone className="h-5 w-5 text-gold shrink-0 mt-1" /><div>
            <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">{t("contact.phone")}</p>
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-bordeaux hover:text-gold">{settings.phone}</a>
          </div></div>
          <div className="flex gap-4"><MapPin className="h-5 w-5 text-gold shrink-0 mt-1" /><div>
            <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">{t("contact.workshop")}</p>
            <p className="text-bordeaux whitespace-pre-line">{settings.address}</p>
          </div></div>
          <div className="bg-cream p-6 text-sm text-bordeaux/70">
            <p className="font-serif text-base text-bordeaux mb-1">{contactPage.showroomTitle || t("contact.showroom_title")}</p>
            {contactPage.showroomText || t("contact.showroom_text")}
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default Contact;
