import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Gift, UserCheck, AlertTriangle, CreditCard } from "lucide-react";

export function FAQSection() {
  const faqs = [
    {
      id: "1",
      icon: Shield,
      question: "Is my information safe?",
      answer: "Yes, your privacy is our top priority. Only verified members can see basic profile information, and we never share your contact details without your permission."
    },
    {
      id: "2", 
      icon: Gift,
      question: "Is registration free?",
      answer: "Yes, basic registration is completely free. You can create your profile, and we will post your basic profile in our WhatsApp Community, WhatsApp Channel, Facebook Group, and Telegram Group for visibility."
    },
    {
      id: "3",
      icon: UserCheck,
      question: "How does profile verification work?",
      answer: "We only accept government-issued ID proof for verification. Once your profile is verified, we share it in our WhatsApp Community, WhatsApp Channel, Facebook Group, and Telegram Group."
    },
    {
      id: "4",
      icon: AlertTriangle,
      question: "What is your responsibility after sharing profiles?",
      answer: "We only verify profiles using government-issued ID and share them on our platforms. If someone provides incorrect information or any fraud happens later, we are not responsible. After receiving the detailed profile, you should do a thorough verification yourself."
    },
    {
      id: "5",
      icon: CreditCard,
      question: "How can I get detailed profiles?",
      answer: "If you like any profile posted in our WhatsApp Community, WhatsApp Channel, Facebook Group, or Telegram Group, you can request its detailed profile including photos and contact details by paying ₹50 per profile. If your marriage gets fixed through the profile we shared, you need to pay ₹15,000 before the wedding as our service fee."
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Get answers to common questions about our matrimony platform
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => {
            const IconComponent = faq.icon;
            return (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="bg-card border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <span>Q{faq.id}. {faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed ml-11">
                  A: {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}