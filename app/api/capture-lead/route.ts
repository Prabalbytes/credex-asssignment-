import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, companyName, role, teamSize, auditId, monthlySavings } = body;

    // Honeypot check — bot protection
    if (body.website) {
      return NextResponse.json({ success: true }); // silently reject
    }

    // Save lead to Supabase
    const { error: dbError } = await supabase.from("leads").insert({
      audit_id: auditId,
      email,
      company_name: companyName,
      role,
      team_size: teamSize,
      monthly_savings: monthlySavings,
    });

    if (dbError) {
      console.error("Lead insert error:", dbError);
    }

    // Send confirmation email
    await resend.emails.send({
      from: "AI Spend Audit <onboarding@resend.dev>",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your AI Spend Audit is ready</h2>
          <p>Hi${companyName ? ` from ${companyName}` : ""},</p>
          <p>Your audit found potential savings of 
            <strong>$${monthlySavings}/month</strong> 
            ($${monthlySavings * 12}/year).
          </p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/report/${auditId}" 
               style="background:#10b981;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">
              View Your Report
            </a>
          </p>
          ${monthlySavings > 500 ? `
          <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;">
            <h3>You qualify for a Credex consultation</h3>
            <p>Your team could save significantly by sourcing AI credits through Credex. 
               We source discounted credits from companies that overforecast.</p>
            <a href="https://credex.rocks" style="color:#10b981;">Book a free consultation →</a>
          </div>
          ` : ""}
          <p style="color:#666;font-size:12px;margin-top:32px;">
            AI Spend Audit · Powered by Credex
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Capture lead error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}