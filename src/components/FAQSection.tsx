import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "Is my information safe?",
      answer: "Yes, your privacy is our top priority. Only verified members can see basic profile information, and we never share your contact details without your permission."
    },
    {
      question: "How do I upgrade my membership?",
      answer: "You can upgrade to premium membership by clicking the 'Upgrade' button in your profile dashboard. Premium members get access to contact information and advanced matching features."
    },
    {
      question: "Is registration free?",
      answer: "Yes, basic registration is completely free. You can create your profile, browse matches, and use basic features at no cost. Premium features require a subscription."
    },
    {
      question: "How does profile verification work?",
      answer: "Our admin team manually reviews each profile within 24-48 hours. We verify identity documents and ensure all information is genuine before approving profiles."
    }
  ];

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Get answers to common questions about our platform
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Have more questions? Contact our support team via WhatsApp or email.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}