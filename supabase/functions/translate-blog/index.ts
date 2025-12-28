import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, targetLanguage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      ur: 'Urdu (اردو)',
      ar: 'Arabic (العربية)'
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert translator specializing in Islamic and matrimonial content. Translate the following blog post to ${languageNames[targetLanguage] || targetLanguage}. 

IMPORTANT RULES:
- Preserve Islamic terminology (Allah, Dua, Nikah, Halal, etc.) - transliterate don't translate
- Maintain respectful and spiritual tone
- Preserve ALL HTML formatting exactly (tags like <h2>, <p>, <strong>, <ul>, <li>, etc.)
- Keep the original meaning and context
- Cultural sensitivity for Muslim readers

Return ONLY a valid JSON object with "title" and "content" fields. No markdown, no code blocks, just raw JSON.`
          },
          {
            role: "user",
            content: `Translate this blog to ${languageNames[targetLanguage]}:

TITLE: ${title}

CONTENT:
${content}

Return as valid JSON: {"title": "translated title here", "content": "translated HTML content here"}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from AI");
    }

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify({
        title: parsed.title || title,
        content: parsed.content || content,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Could not parse translation response");

  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Translation failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
