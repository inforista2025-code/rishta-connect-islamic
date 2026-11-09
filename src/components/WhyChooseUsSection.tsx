import { ShieldCheck, Lock, UserCheck, Crown } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export function WhyChooseUsSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Verified Profiles",
      description: "Manual verification ensures genuine profiles",
    },
    {
      icon: Lock,
      title: "Photo Privacy Protected",
      description: "Photos stay blurred for visitors — only Premium members see originals",
    },
    {
      icon: UserCheck,
      title: "Secure Profile Login",
      description: "Login with your WhatsApp number via OTP — no password needed",
    },
    {
      icon: Crown,
      title: "Premium Benefits",
      description: "Unlimited profiles without admin, clear photos & direct contact",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-cream">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Why Choose <span className="text-primary">Rishta Matrimony?</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Your trusted partner in finding a halal life partner.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-card border border-border rounded-2xl p-5 md:p-6 text-center shadow-xs hover:shadow-lg transition-shadow duration-300 ease-out"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 rounded-full bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
