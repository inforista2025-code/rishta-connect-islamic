import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailRequest {
  type: "registration" | "verification_status";
  full_name: string;
  email: string;
  gender?: string;
  city?: string;
  whatsapp_number?: string;
  verification_status?: "verified" | "rejected";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: RegistrationEmailRequest = await req.json();
    const { type, full_name, email, gender, city, whatsapp_number, verification_status } = payload;

    console.log("Email request received:", { type, full_name, email, verification_status });

    if (type === "registration") {
      // Email to user
      const userEmailResponse = await resend.emails.send({
        from: "Rista Matrimony <onboarding@resend.dev>",
        to: [email],
        subject: "Rista Matrimony – Registration Received",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B5A2B;">Assalamu Alaikum ${full_name},</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Your profile has been submitted successfully.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Our team will verify it soon.
            </p>
            <br/>
            <p style="font-size: 14px; color: #666;">
              Best regards,<br/>
              <strong>Rista Matrimony Team</strong>
            </p>
          </div>
        `,
      });

      console.log("User registration email sent:", userEmailResponse);

      // Email to admin
      const adminEmailResponse = await resend.emails.send({
        from: "Rista Matrimony <onboarding@resend.dev>",
        to: ["info.rista2025@gmail.com"],
        subject: "New Matrimony Registration",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B5A2B;">New Registration Received</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9;">Name</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${full_name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9;">Gender</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${gender || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9;">City</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${city || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9;">WhatsApp</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${whatsapp_number || 'N/A'}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              Please review this registration in the admin dashboard.
            </p>
          </div>
        `,
      });

      console.log("Admin notification email sent:", adminEmailResponse);

      return new Response(
        JSON.stringify({ success: true, userEmail: userEmailResponse, adminEmail: adminEmailResponse }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else if (type === "verification_status") {
      let subject: string;
      let bodyContent: string;

      if (verification_status === "verified") {
        subject = "Rista Matrimony – Profile Verified ✅";
        bodyContent = `
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            MashaAllah! Your profile has been <strong style="color: #22c55e;">verified</strong> and is now live on our platform.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            May Allah bless you with a righteous spouse. In sha Allah.
          </p>
        `;
      } else {
        subject = "Rista Matrimony – Profile Update Required";
        bodyContent = `
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Unfortunately, your profile could not be verified at this time.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Please contact us for more information or re-submit your profile with complete details.
          </p>
        `;
      }

      const emailResponse = await resend.emails.send({
        from: "Rista Matrimony <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B5A2B;">Assalamu Alaikum ${full_name},</h2>
            ${bodyContent}
            <br/>
            <p style="font-size: 14px; color: #666;">
              Best regards,<br/>
              <strong>Rista Matrimony Team</strong>
            </p>
          </div>
        `,
      });

      console.log("Verification status email sent:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, email: emailResponse }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid email type" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);