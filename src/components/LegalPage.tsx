import { ReactNode } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";

interface Section {
  heading: string;
  body: ReactNode;
}

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  sections: Section[];
  crumb: string;
}

const LegalPage = ({ eyebrow, title, subtitle, sections, crumb }: Props) => (
  <Layout>
    <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} crumbs={[{ label: crumb }]} />
    <section className="container py-12 md:py-16 max-w-3xl">
      <div className="space-y-10 text-bordeaux/80 leading-relaxed">
        {sections.map((s) => (
          <article key={s.heading} className="space-y-3">
            <h2 className="font-serif text-2xl text-bordeaux">{s.heading}</h2>
            <div className="text-sm space-y-3">{s.body}</div>
          </article>
        ))}
      </div>
    </section>
  </Layout>
);

export default LegalPage;
