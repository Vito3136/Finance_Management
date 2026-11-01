// Supabase Edge Function: security-alert
// Sends security alert emails via Resend API and logs failed login attempts.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { attemptedEmail, failedCount, isLocked, userAgent, timestamp } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY in Supabase secrets.");
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY in Supabase secrets." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const dateStr = timestamp
      ? new Date(timestamp).toLocaleString("it-IT", { timeZone: "Europe/Rome" })
      : new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });

    const subject = isLocked
      ? `⛔ [URGENTE Finance Management] Blocco 24 ore attivato (${failedCount}/2 tentativi)`
      : `⚠️ [Finance Management] Tentativo di accesso fallito (${failedCount}/2)`;

    const statusBadge = isLocked
      ? `<span style="background:#ff3b30;color:#ffffff;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;">BLOCCO 24 ORE ATTIVATO</span>`
      : `<span style="background:#ff9500;color:#ffffff;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;">PRE-BLOCCO (Tentativo 1 di 2)</span>`;

    const html = `
    <!DOCTYPE html>
    <html lang="it">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Avviso di Sicurezza</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 24px; color: #1c1c1e; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e5e5ea; }
          .header { background: #000000; padding: 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.4px; }
          .content { padding: 28px 24px; }
          .alert-box { background: rgba(255, 59, 48, 0.08); border: 1px solid rgba(255, 59, 48, 0.25); border-radius: 12px; padding: 18px; margin-bottom: 24px; }
          .alert-box h2 { margin: 0 0 6px 0; font-size: 16px; color: #ff3b30; font-weight: 700; }
          .alert-box p { margin: 0; font-size: 14px; color: #3a3a3c; line-height: 1.45; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
          .details-table td { padding: 12px 8px; border-bottom: 1px solid #f2f2f7; }
          .details-table td.label { color: #8e8e93; font-weight: 500; width: 42%; }
          .details-table td.value { color: #1c1c1e; font-weight: 600; }
          .notice-box { background: #f2f2f7; border-radius: 10px; padding: 14px; font-size: 13px; color: #636366; line-height: 1.5; margin-bottom: 8px; }
          .footer { padding: 16px 24px; background: #f9f9fb; font-size: 12px; color: #8e8e93; text-align: center; border-top: 1px solid #f2f2f7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Finance Management</h1>
          </div>
          <div class="content">
            <div class="alert-box">
              <h2>⚠️ Rilevato tentativo di accesso con password errata</h2>
              <p>È stato registrato un tentativo di accesso non autorizzato sulla tua applicazione Finance Management.</p>
            </div>
            <table class="details-table">
              <tr>
                <td class="label">Stato Protezione</td>
                <td class="value">${statusBadge}</td>
              </tr>
              <tr>
                <td class="label">Data e Ora (Roma)</td>
                <td class="value">${dateStr}</td>
              </tr>
              <tr>
                <td class="label">Email inserita</td>
                <td class="value"><code>${attemptedEmail || "(vuota)"}</code></td>
              </tr>
              <tr>
                <td class="label">Tentativi registrati</td>
                <td class="value">${failedCount} su 2</td>
              </tr>
              <tr>
                <td class="label">Dispositivo / Browser</td>
                <td class="value" style="font-size: 12px; font-weight: 400; word-break: break-all;">${userAgent || "Non rilevato"}</td>
              </tr>
            </table>
            <div class="notice-box">
              <strong>Nota di sicurezza:</strong> Se non sei stato tu, qualcuno sta tentando di indovinare le tue credenziali. Ricorda che il tuo accesso biometrico con <strong>Face ID</strong> è sempre disponibile ed esente da blocchi.
            </div>
          </div>
          <div class="footer">
            Finance Management Security System • Inviato tramite Supabase Edge Function & Resend
          </div>
        </div>
      </body>
    </html>
    `;

    // Dispatch email through Resend API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Finance Management Security <onboarding@resend.dev>",
        to: ["vito3136@gmail.com"],
        subject: subject,
        html: html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendData);
      return new Response(JSON.stringify({ error: resendData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: resendRes.status,
      });
    }

    return new Response(JSON.stringify({ success: true, resend: resendData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
