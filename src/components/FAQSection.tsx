import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    { id: "1", question: "Is my information and photo safe?", answer: "Yes, your privacy is our top priority. Your photos stay blurred for visitors and free members — only Premium members can view original photos. We never share your contact details without your permission." },
    { id: "2", question: "Is registration really free?", answer: "Yes, basic registration is completely free. You can create your profile, and we will post it across our WhatsApp Community, WhatsApp Channel, Facebook Group, and Telegram Group for visibility." },
    { id: "3", question: "How do I login after verification?", answer: "Once your profile is verified by our team, simply go to Profile Login, enter your registered WhatsApp number, and you will receive a one-time code (OTP) on your registered email. Enter the code to access your personal dashboard — no password needed." },
    { id: "4", question: "Will my contact details be visible to everyone?", answer: "No, your contact details are only visible to Premium members. We prioritize your privacy at every step." },
    { id: "5", question: "What do I get with Premium membership?", answer: "Premium members get original clear photos, full biodata, contact details access, unlimited interests, saved profiles, and can see who viewed their profile — all for just ₹491 / 2 months." },
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
