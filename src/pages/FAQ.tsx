import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAdmin } from "@/context/AdminContext";
import { PageSkeleton } from "@/components/Skeletons";

const FAQ = () => {
  const { faq, faqPageHeader } = useAdmin();

  if (!faq || !faqPageHeader) return <Layout><PageSkeleton /></Layout>;

  return (
    <Layout>
      <PageHeader
        eyebrow={faqPageHeader.eyebrow}
        title={faqPageHeader.title}
        subtitle={faqPageHeader.subtitle}
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
