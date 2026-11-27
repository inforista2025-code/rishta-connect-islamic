import { motion } from "motion/react";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppFloatingButton({
  phoneNumber = "919128719875",
  defaultMessage = "Assalamu Alaikum! I have an inquiry regarding Rishta Matrimony.",
}: WhatsAppFloatingButtonProps) {
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group select-none"
    >
      {/* Tooltip Pill / Label (Desktop & Tablet) */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat for Inquiry on WhatsApp"
        className="hidden sm:flex items-center gap-2 bg-card/95 backdrop-blur-md border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold text-foreground cursor-pointer hover:border-emerald-500 hover:shadow-xl transition-all duration-200"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-foreground font-medium">WhatsApp Inquiry</span>
        <span className="text-emerald-600 font-bold">💬</span>
      </a>

      {/* Floating Action Circular Button Container with Outward Radiating Waves */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Outward Radiating Wave Ring 1 */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366] pointer-events-none -z-10"
          animate={{ scale: [1, 1.45, 1.85], opacity: [0.75, 0.35, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden="true"
        />

        {/* Outward Radiating Wave Ring 2 (Staggered Wave) */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366] pointer-events-none -z-10"
          animate={{ scale: [1, 1.4, 1.75], opacity: [0.6, 0.25, 0] }}
          transition={{ duration: 2.2, delay: 0.75, repeat: Infinity, ease: "easeOut" }}
          aria-hidden="true"
        />

        {/* CSS Ping Fallback */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping pointer-events-none -z-10"
          aria-hidden="true"
        />

        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Chat on WhatsApp for Inquiry (+91 9128719875)"
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-white/50 cursor-pointer"
        >
          {/* WhatsApp Vector Icon */}
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            stroke="currentColor"
            strokeWidth="0"
            fill="currentColor"
            className="text-white drop-shadow-xs"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.301-.15-1.778-.877-2.054-.977-.276-.1-.476-.15-.676.15-.2.301-.776.977-.951 1.177-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.131-.614.136-.135.301-.351.451-.526.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.676-1.629-.926-2.23-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.109.15.2 2.119 3.236 5.134 4.54.717.31 1.277.495 1.713.633.72.229 1.376.197 1.895.12.578-.087 1.778-.727 2.029-1.429.25-.702.25-1.304.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.54 2 2.08 6.46 2.08 11.96c0 1.99.58 3.84 1.59 5.41L2 22l4.78-1.56c1.51.93 3.27 1.48 5.26 1.48 5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm0 18.21c-1.74 0-3.36-.5-4.74-1.37l-.34-.21-2.83.92.94-2.76-.23-.37a8.214 8.214 0 0 1-1.26-4.42c0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25 0 4.55-3.7 8.21-8.27 8.21z" />
          </svg>

          {/* Online Indicator Badge */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white shadow-xs"></span>
        </motion.a>
      </div>
    </motion.div>
  );
}
