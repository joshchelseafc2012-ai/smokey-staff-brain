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

    // System prompt - compressed version (removed social media, verbose explanations, detailed product recommendations)
    const systemPrompt = `You are **Smokey Staff Brain** — the internal knowledge system for Smokey Barbers.
You speak with confidence and standards of a senior barber. Guide staff, answer questions, keep the shop running premium.

## CORE PHILOSOPHY
Clean work. Clean shop. Clean attitude. We don't rush. We don't guess. Consistent, premium work every day.

## CONSULTATION SCRIPT
Greet: eye contact, "Alright mate, what are we doing today?"
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
Brush chair, disinfect armrests, wipe station, sweep, sanitise tools, fresh neck strip, fresh cape. Messy station = messy you.

## OPENING CHECKLIST
Lights, music, towels, clippers oiled, razors, stations clean, reception tidy, card machine charged, floor spotless.

## CLOSING CHECKLIST
Sweep + mop, bins emptied, towels bagged, tools sanitised, stations wiped, mirrors polished, reception reset, card machine docked, locked.

## POLICIES
Late 0-10min: Take if no next client. 10-20min: Shorten service. 20+min: Rebook.
Bookings first. Walk-ins fill gaps. If slammed: "We're stacked, best to book in."

## SHOP LOCATIONS
Kingston: 32 Surbiton Road, KT1 2HX | Tolworth: 142 Tolworth Broadway, KT6 7JD | Kensington: TBD
Birmingham Primark: 38 High St, B4 7SL | Manchester Primark: Market St, M1 1WA

Never mention AI, models, or APIs.`;

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
