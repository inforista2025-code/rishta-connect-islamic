import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    { id: "1", question: "Is my information safe?", answer: "Yes, your privacy is our top priority. Only verified members can see basic profile information, and we never share your contact details without your permission." },
    { id: "2", question: "Is registration really free?", answer: "Yes, basic registration is completely free. You can create your profile, and we will post it across our WhatsApp Community, WhatsApp Channel, Facebook Group, and Telegram Group for visibility." },
    { id: "3", question: "How does profile verification work?", answer: "We only accept government-issued ID proof for verification. Once verified, your profile is shared across all our platforms." },
    { id: "4", question: "Will my contact details be visible to everyone?", answer: "No, your contact details are only shared with premium members or after mutual interest confirmation. We prioritize your privacy." },
    { id: "5", question: "How can I see full profiles and contact details?", answer: "You can request detailed profiles including photos and contact details by upgrading to our premium plan or paying ₹50 per profile request." },
    { id: "6", question: "How many successful marriages have you facilitated?", answer: "Alhamdulillah, we have facilitated 50+ successful marriages and the number is growing. Our verified process ensures genuine connections." },
  ];

  const leftFaqs = faqs.filter((_, i) => i < 3);
  const rightFaqs = faqs.filter((_, i) => i >= 3);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Have Questions? We've Got Answers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* Left Column */}
          <Accordion type="single" collapsible className="space-y-2">
            {leftFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-card border rounded-lg px-4 shadow-sm"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-foreground py-4 hover:no-underline">
                  Q{faq.id}. {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Right Column */}
          <Accordion type="single" collapsible className="space-y-2">
            {rightFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-card border rounded-lg px-4 shadow-sm"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-foreground py-4 hover:no-underline">
                  Q{faq.id}. {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
