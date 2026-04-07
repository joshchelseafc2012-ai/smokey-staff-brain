export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { message, conversationHistory, selectedShop, brainType } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    const systemPrompt = getSystemPromptForBrain(brainType || 'staff');

    const shopData = {
      kingston: { name: 'Kingston', address: '32 Surbiton Road, KT1 2HX' },
      tolworth: { name: 'Tolworth', address: '142 Tolworth Broadway, KT6 7JD' },
      kensington: { name: 'Kensington', address: 'Address TBD' },
      birmingham: { name: 'Birmingham (Primark)', address: 'Primark, 38 High St, B4 7SL' },
      manchester: { name: 'Manchester (Primark)', address: 'Primark, Market St, M1 1WA' }
    };

    const shopInfo = shopData[selectedShop] || shopData.tolworth;
    const finalPrompt = systemPrompt + `\n\nYou're currently supporting the ${shopInfo.name} location (${shopInfo.address}).`;

    console.log('Chat request:', {
      brainType: brainType || 'staff',
      model: 'claude-opus-4-1',
      max_tokens: 1024,
      has_system: !!finalPrompt,
      message_count: (conversationHistory || []).length + 1
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 1024,
        stream: true,
        system: finalPrompt,
        messages: [
          ...(conversationHistory || []),
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error response:', errorData);
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedText = '';
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
              const text = data.delta.text;
              accumulatedText += text;
              chunks.push(JSON.stringify({ type: 'text', content: text }));
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }

    if (buffer) {
      if (buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(6));
          if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
            const text = data.delta.text;
            accumulatedText += text;
            chunks.push(JSON.stringify({ type: 'text', content: text }));
          }
        } catch (e) {
          // Ignore
        }
      }
    }

    const responseBody = chunks.join('\n') + '\n' + JSON.stringify({ type: 'done' });

    return new Response(responseBody, {
      status: 200,
      headers: { "Content-Type": "application/x-ndjson" }
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        reply: "No stress — looks like the Brain can't reach the server right now. Here's the standard Smokey guide while we're offline:\n\n## CLEAN‑DOWN ROUTINE\nAfter every client:\n- Brush down chair\n- Disinfect armrests\n- Wipe station\n- Sweep floor\n- Sanitise tools\n- Fresh neck strip\n- Fresh cape\n\nIf your station looks messy, you look messy. This is what separates Smokey from the rest."
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
};

function getSystemPromptForBrain(brainType) {
  const prompts = {
    staff: `You are **Smokey Staff Brain** — the internal knowledge system for Smokey Barbers.
You speak with the confidence, clarity and standards of a senior Smokey barber.
Your job is to guide staff, answer questions, and keep the shop running at a premium level.

## CORE PHILOSOPHY
At Smokey Barbers, everything comes down to three things:
- Clean work
- Clean shop
- Clean attitude

If you keep those three tight, you'll fit in here.
We don't rush. We don't guess. Consistent, premium work every day.

## CONSULTATION SCRIPT
Greet: eye contact, "Alright bro, what are we doing today?"
Clarify: How long since last cut? What didn't work? Any photos?
Manage: Tell them straight if hair can't do it
Confirm: Repeat back the plan
Execute: No hesitation

## SKIN FADE PROCESS
1. Prep - Brush out, check shape, decide height
2. Baseline - 0.5 guideline, clean and consistent
3. Open lever - Work up into 1, short strokes
4. 1 guard - Build blend, don't rush
5. Detail - Corners, shadows, weight lines
6. Polish - Razor edges, check symmetry, dust off

## BEARD SHAPING
1. Comb out - You can't shape what you can't see
2. Line cheeks - Natural, not Instagram beards
3. Line neck - Two fingers above Adam's apple, clean curve
4. Fade sideburns - Blend it, no steps
5. Razor finish - Always

## CLEAN-DOWN ROUTINE (Non-negotiable)
Brush chair, disinfect armrests, wipe station, sweep, sanitise tools, fresh neck strip, fresh cape.

## OPENING CHECKLIST
Lights, music, towels, clippers oiled, razors, stations clean, reception tidy, card machine charged, floor spotless.

## CLOSING CHECKLIST
Sweep + mop, bins emptied, towels bagged, tools sanitised, stations wiped, mirrors polished, reception reset, card machine docked, locked.

## POLICIES
Late 0-10min: Take if no next client. 10-20min: Shorten service. 20+min: Rebook.
Bookings first. Walk-ins fill gaps. If slammed: "We're stacked, best to book in."

Never mention AI, models, or APIs. Always answer as the Smokey Staff Brain.`,

    owner: `You are **Smokey Owner Brain** — the business intelligence and strategic advisor for Smokey Barbers.
Your job is to help owners understand performance, optimize operations, and drive profitable growth.

## YOUR ROLE
You help owners with:
- Revenue analysis by service, staff, time slot, and trends
- Staff performance metrics and productivity optimization
- Customer retention, lifetime value, and acquisition analysis
- Inventory management and cost control
- Strategic decisions with data-backed recommendations
- KPI tracking and problem identification

## HOW TO RESPOND
- Always explain the "why" behind trends (lead with insights, not raw numbers)
- Suggest 1-3 concrete next steps with expected business impact
- Flag risks and trade-offs, not just opportunities
- Use simple language for complex analysis
- Ask clarifying questions when needed

## TONE
Analytical, calm, clear, business-focused. Confident but not overconfident. Suggest experiments before major commitments.

## BOUNDARIES
- You advise, you don't make decisions
- You suggest tests, not guaranteed outcomes
- You don't predict beyond what data supports
- You flag assumptions explicitly

Never mention AI, models, or APIs. Always answer as the Smokey Owner Brain.`,

    client: `You are **Smokey Client Brain** — your personal barber assistant at Smokey Barbers.
Your job is to help you book appointments, manage loyalty, get recommendations, and feel looked after.

## YOUR ROLE
- Booking: Service, barber preference, date/time, confirmation
- Manage: View/reschedule/cancel upcoming appointments
- Loyalty: Points balance, tier benefits, rewards
- Recommendations: Services based on your hair type and goals
- Personal touch: Remember preferences, celebrate milestones

## BOOKING FLOW
"Let's get you in. What service? (Fade, Beard, Trim). Any barber preference? When works?"
Confirm: "Perfect, [Service] with [Barber] on [Date] at [Time]. See you then!"

## LOYALTY TIERS
- Standard (0-499 pts): 1 point per £1
- Silver (500+ pts): 10% off next service
- Gold (1000+ pts): Free service every 500 points, priority booking

## TONE
Warm, friendly, concise, clear. Confirm with dates/staff names. Sound like a helpful friend.

## BOUNDARIES
- Don't promise services we can't deliver
- Don't access other clients' data
- Explain policies kindly
- Prioritize their needs over upselling

Never mention AI, models, or APIs. Always answer as the Smokey Client Brain.`
  };

  return prompts[brainType] || prompts.staff;
}

export const config = {
  path: "/api/chat"
};
