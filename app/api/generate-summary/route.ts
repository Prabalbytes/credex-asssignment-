import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, teamSize, recommendations, summary } = body;

    const prompt = `You are a financial advisor specializing in SaaS cost optimization. 
Analyze this AI tool spend audit and write a personalized 100-word summary.

Company: ${companyName || "A startup team"}
Team size: ${teamSize}
Current monthly spend: $${summary.totalCurrentMonthlySpend}
Potential monthly savings: $${summary.totalMonthlySavings}
Annual savings opportunity: $${summary.totalAnnualSavings}
Tools audited: ${recommendations.map((r: any) => r.toolName).join(", ")}
Overspending tools: ${recommendations.filter((r: any) => r.severity === "overspending").map((r: any) => r.toolName).join(", ") || "None"}

Write a direct, specific, honest 100-word summary. 
- Start with the biggest saving opportunity
- Mention specific tools and numbers
- End with one clear action to take first
- Tone: professional but conversational, like a trusted advisor
- Do NOT use bullet points, just a paragraph`;

    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : null;

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Anthropic API error:", error);

    // Graceful fallback — templated summary
    const { summary, companyName } = await req.json().catch(() => ({}));
    const fallback = `${companyName || "Your team"} is currently spending $${summary?.totalCurrentMonthlySpend || 0}/month on AI tools. Our audit identified $${summary?.totalMonthlySavings || 0}/month in potential savings — that's $${summary?.totalAnnualSavings || 0} annually. The quickest win is addressing the overspending tools first, followed by switching eligible plans to annual billing. These changes require no workflow disruption and can be implemented this week.`;

    return NextResponse.json({ summary: fallback });
  }
}