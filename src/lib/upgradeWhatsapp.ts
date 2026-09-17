// Opens WhatsApp with a prefilled Premium upgrade message.
// Kept in one place so every member-side "Upgrade" CTA behaves identically
// to the WhatsApp button on the Pricing page.
export const UPGRADE_WHATSAPP_URL =
  "https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Connect%2C%20I%20would%20like%20to%20upgrade%20to%20the%20Premium%20Rishta%20Plan%20for%20Rs.%20491%20for%202%20months.%20Kindly%20guide%20me%20with%20the%20next%20steps%2C%20JazakAllah%20khair.";

export function openUpgradeWhatsApp() {
  window.open(UPGRADE_WHATSAPP_URL, "_blank", "noopener,noreferrer");
}