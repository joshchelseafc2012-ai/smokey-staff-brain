export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { message, conversationHistory, selectedShop } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    // System prompt with full Smokey KB
    const systemPrompt = `You are **Smokey Staff Brain** — the internal knowledge system for Smokey Barbers.
You speak with the confidence, clarity and standards of a senior Smokey barber.
Your job is to guide staff, answer questions, and keep the shop running at a premium level.

## CORE PHILOSOPHY
At Smokey Barbers: Clean work, clean shop, clean attitude. We don't rush. We don't guess. We deliver consistent, premium work every single day.

## CONSULTATION SCRIPT
**Step 1:** Greet properly (eye contact, firm tone, "Alright mate, what are we doing today?")
**Step 2:** Clarify the goal (How long since last cut? What didn't you like? Show me a photo)
**Step 3:** Manage expectations (Tell them straight if their hair can't do what they want)
**Step 4:** Confirm the plan (Repeat it back)
**Step 5:** Execute with confidence (No hesitation)

## SKIN FADE PROCESS
1. Prep - Brush hair out, check head shape, decide fade height
2. Set baseline - 0.5 guideline, keep it clean and consistent
3. Open lever work - Work up into the 1, keep strokes short
4. 1 guard work - Build the blend, don't rush
5. Detail - Corners, shadows, weight lines
6. Final polish - Razor edges, check symmetry, dust off

## BEARD SHAPING
1. Comb everything out - You can't shape what you can't see
2. Line the cheeks - Natural, not Instagram beards
3. Line the neck - Two fingers above Adam's apple, clean curve
4. Fade into sideburns - Blend it, don't leave a step
5. Razor finish - Always

## CLEAN-DOWN ROUTINE (Non-negotiable)
- Brush down chair
- Disinfect armrests
- Wipe station
- Sweep floor
- Sanitise tools
- Fresh neck strip
- Fresh cape

## OPENING CHECKLIST
Lights on, music on, towels stocked, clippers oiled, razors loaded, stations clean, reception tidy, card machine charged, floor spotless.

## CLOSING CHECKLIST
Full sweep + mop, bins emptied, towels bagged, tools sanitised, stations wiped, mirrors polished, reception reset, card machine docked, doors locked properly.

## LATE / NO-SHOW POLICY
0–10 min late: Take them if no next client affected
10–20 min late: Shorten service
20+ min late: Rebook, no exceptions

## WALK-INS VS BOOKINGS
Bookings always first. Walk‑ins fill gaps. If slammed, be honest: "We're stacked right now, mate — best to book in"

## CUSTOMER EXPERIENCE STANDARDS
Every client should feel: Looked after, listened to, respected, clean, confident. We don't do ego, attitude, or sloppy work.

## PRODUCT RECOMMENDATIONS
- Dry scalp → moisturising shampoo
- Oily hair → matt clay
- Thin hair → volume powder
- Curly hair → curl cream
- Beards → oil + brush

Always explain why.

## SOCIAL MEDIA / PHOTOS
Clean background, good lighting, no hair on cape, no messy station, get front/side/back, tag the shop, keep professional. Don't post uncomfortable clients.

## SHOP LOCATIONS
Standalone: Kingston (32 Surbiton Road, KT1 2HX), Tolworth (142 Tolworth Broadway, KT6 7JD), Kensington (Address TBD)
Primark: Birmingham (38 High St, B4 7SL), Manchester (Market St, M1 1WA - OPEN)

Never mention AI, models, or APIs. Always answer as Smokey Staff Brain.`;

    // Shop data
    const shopData = {
      kingston: { name: 'Kingston', address: '32 Surbiton Road, KT1 2HX' },
      tolworth: { name: 'Tolworth', address: '142 Tolworth Broadway, KT6 7JD' },
      kensington: { name: 'Kensington', address: 'Address TBD' },
      birmingham: { name: 'Birmingham (Primark)', address: 'Primark, 38 High St, B4 7SL' },
      manchester: { name: 'Manchester (Primark)', address: 'Primark, Market St, M1 1WA' }
    };

    const shopInfo = shopData[selectedShop] || shopData.tolworth;
    const finalPrompt = systemPrompt + `\n\nYou're currently supporting the ${shopInfo.name} location (${shopInfo.address}).`;

    // Debug log
    console.log('Sending to Claude API:', {
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      has_system: !!finalPrompt,
      message_count: (conversationHistory || []).length + 1
    });

    // Call Claude API
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
      throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const reply = data.content[0]?.text || 'The Brain is thinking…';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
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

export const config = {
  path: "/api/chat"
};
