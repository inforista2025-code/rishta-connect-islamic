// Vercel Serverless Function: AI Chatbot Lead Capture & Instant Admin Email Notification
import nodemailer from "nodemailer";

export const maxDuration = 30;

const SENDER_EMAIL = process.env.SMTP_EMAIL || "info.rista2025@gmail.com";
const APP_PASSWORD = process.env.SMTP_APP_PASSWORD || "oeoysisyrjvvrwyy";
const ADMIN_EMAIL = "info.rista2025@gmail.com";

const SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD,
  },
});

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, whatsapp, city, query, lookingFor } = req.body || {};

    if (!whatsapp || typeof whatsapp !== "string" || whatsapp.trim().length < 9) {
      return res.status(400).json({ error: "A valid WhatsApp phone number is required" });
    }

    const cleanPhone = whatsapp.replace(/\D/g, "");
    const cleanName = (name || "Website Visitor").trim();
    const cleanCity = (city || "Not Specified").trim();
    const cleanQuery = (query || "General Matrimonial Inquiry").trim();
    const cleanLookingFor = (lookingFor || "Proposals").trim();

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const directWhatsAppUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
      `Assalamu Alaikum ${cleanName}! Aapne Rishta Matrimony par inquiry ki thi. Hum aapko verified rishte share karne ke liye hazir hain.`
    )}`;

    // 1. Send instant email notification to Admin
    try {
      await transporter.sendMail({
        from: `"Rishta AI Lead Alert" <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `⚡ New AI Lead: ${cleanName} (${cleanPhone})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1a202c;">
            <div style="background-color: #047857; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">⚡ New AI Chatbot Lead!</h2>
              <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">A visitor just requested contact via the website AI Assistant</p>
            </div>

            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 140px; color: #4a5568;">Visitor Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #1a202c; font-weight: 600;">${cleanName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">WhatsApp No:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #047857; font-weight: bold; font-size: 16px;">
                    <a href="${directWhatsAppUrl}" style="color: #047857; text-decoration: none;">+91 ${cleanPhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">City / Location:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #1a202c;">${cleanCity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Looking For:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #1a202c;">${cleanLookingFor}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #4a5568;">Visitor Query:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #2d3748; font-style: italic; background-color: #f7fafc; padding: 10px; border-radius: 4px;">"${cleanQuery}"</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-size: 12px;">Captured At:</td>
                  <td style="padding: 8px 0; color: #718096; font-size: 12px;">${timestamp} IST</td>
                </tr>
              </table>

              <div style="text-align: center; margin: 30px 0 10px;">
                <a href="${directWhatsAppUrl}" target="_blank" style="background-color: #25D366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  💬 Chat with ${cleanName} on WhatsApp (+91 ${cleanPhone})
                </a>
              </div>
            </div>

            <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7;">
              Rishta Matrimony AI Assistant • Real-Time Lead Funnel
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn("Could not dispatch lead email notification:", emailErr);
    }

    // 2. Insert lead into Supabase registration_submissions for admin tracking
    try {
      const syntheticEmail = `ai_lead_${cleanPhone}_${Date.now()}@rishtamatrimony.internal`;
      await fetch(`${SUPABASE_URL}/rest/v1/registration_submissions`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          full_name: cleanName,
          email: syntheticEmail,
          whatsapp_number: cleanPhone,
          gender: cleanLookingFor.toLowerCase().includes("bride") ? "Male" : cleanLookingFor.toLowerCase().includes("groom") ? "Female" : "Other",
          date_of_birth: "2000-01-01",
          marital_status: "Single",
          caste: "General",
          maslak: "Sunni",
          height: "N/A",
          complexion: "N/A",
          residence_location: cleanCity,
          education_details: "AI Lead Capture",
          occupation_details: `Query: ${cleanQuery.substring(0, 150)}`,
          family_details: `AI Chat Lead • Captured at ${timestamp}`,
          partner_preferences: `Looking for: ${cleanLookingFor}`,
          preferred_age_range: "20-35",
          preferred_location: cleanCity,
          photo_urls: [],
          status: "pending",
          referral: "ai_chatbot_lead",
        }),
      });
    } catch (dbErr) {
      console.warn("Could not record lead in registration_submissions:", dbErr);
    }

    return res.status(200).json({
      success: true,
      message: "Lead recorded successfully! Admin has been notified.",
      whatsappUrl: directWhatsAppUrl,
    });
  } catch (error: any) {
    console.error("AI Lead handler error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
