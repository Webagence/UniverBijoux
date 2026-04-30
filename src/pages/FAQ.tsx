import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAdmin } from "@/context/AdminContext";

const FAQ = () => {
  const { faq, settings } = useAdmin();
  return (
    <Layout>
      <PageHeader
        eyebrow="Aide"
        title="Questions fréquentes"
        subtitle={`Tout ce que les revendeurs nous demandent le plus souvent. ${settings.siteName}`}
        crumbs={[{ label: "FAQ" }]}
      />
      <section className="container py-12 md:py-16 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faq.map((x) => (
            <AccordionItem key={x.id} value={x.id} className="bg-ivory border border-border px-5">
              <AccordionTrigger className="font-serif text-lg text-bordeaux hover:no-underline text-left">
                {x.q}
              </AccordionTrigger>
              <AccordionContent className="text-bordeaux/70">{x.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </Layout>
  );
};

export default FAQ;
