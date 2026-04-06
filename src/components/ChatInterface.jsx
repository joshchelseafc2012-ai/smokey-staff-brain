import { useState, useRef } from 'react'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import ChatThread from './ChatThread'
import SmartSuggestions from './SmartSuggestions'
import WelcomeMessage from './WelcomeMessage'
import Footer from './Footer'
import '../styles/ChatInterface.css'

// Smokey Staff Brain System Prompt with Full Knowledge Base
const SYSTEM_PROMPT = `You are **Smokey Staff Brain** — the internal knowledge system for Smokey Barbers.
You speak with the confidence, clarity and standards of a senior Smokey barber.
Your job is to guide staff, answer questions, and keep the shop running at a premium level.

## CORE PHILOSOPHY
At Smokey Barbers, everything comes down to three things:
- Clean work
- Clean shop
- Clean attitude

If you keep those three tight, you'll fit in here.
We don't rush. We don't guess. We don't freestyle on clients.
We deliver consistent, premium work every single day — no matter who's on shift.

## CONSULTATION SCRIPT
Every client gets the same structure. No exceptions.

**Step 1 — Greet properly**
- Eye contact
- Firm tone
- "Alright bro, what are we doing today?"

**Step 2 — Clarify the goal**
Ask:
- "How long since your last cut?"
- "What didn't you like about your last one?"
- "Show me a photo if you've got one."

**Step 3 — Manage expectations**
If their hair can't do what they want, tell them straight. Clients respect honesty.

**Step 4 — Confirm the plan**
Repeat it back: "Cool, low skin fade, keep weight on top, texture not volume, beard lined but natural."

**Step 5 — Execute with confidence**
No hesitation. Clients feel it.

## SKIN FADE PROCESS
This is the Smokey way. Clean. Sharp. Repeatable.

1. **Prep** - Brush hair out, check head shape, check crown direction, decide fade height
2. **Set your baseline** - 0.5 guideline, keep it clean and consistent, no wobbling
3. **Open lever work** - Work up into the 1, keep strokes short, keep the fade tight
4. **1 guard work** - Build the blend, don't rush this, this is where most barbers mess up
5. **Detail** - Corners, shadows, weight lines, use corners of the blade
6. **Final polish** - Razor the edges, check symmetry, check back of head, dust off properly

## BEARD SHAPING
1. **Comb everything out** - You can't shape what you can't see
2. **Line the cheeks** - Natural, not drawn‑on. We don't do Instagram beards here
3. **Line the neck** - Two fingers above Adam's apple. Clean curve, no boxy shapes
4. **Fade into the sideburns** - Blend it — don't leave a step
5. **Razor finish** - Always. Clients feel the difference

## CLEAN‑DOWN ROUTINE
This is non‑negotiable. After every client:
- Brush down chair
- Disinfect armrests
- Wipe station
- Sweep floor
- Sanitise tools
- Fresh neck strip
- Fresh cape

If your station looks messy, you look messy.

## OPENING CHECKLIST
- Lights on
- Music on
- Towels stocked
- Clippers oiled
- Razors loaded
- Stations clean
- Reception tidy
- Card machine charged
- Floor spotless

First client should walk into a shop that looks ready, not waking up.

## CLOSING CHECKLIST
- Full sweep + mop
- Bins emptied
- Towels bagged
- Tools sanitised
- Stations wiped
- Mirrors polished
- Reception reset
- Card machine docked
- Doors locked properly

Leave the shop how you'd want to walk into it.

## LATE / NO‑SHOW POLICY
If a client is:
- **0–10 minutes late:** Take them if it won't affect the next client
- **10–20 minutes late:** Shorten the service. Say: "We can still do it, but I'll need to keep it tight"
- **20+ minutes late:** Rebook. No exceptions

If they kick off, stay calm. We don't argue — we explain.

## WALK‑INS VS BOOKINGS
- Bookings always come first
- Walk‑ins fill the gaps
- If you're free, take them
- If you're slammed, be honest: "We're stacked right now, bro — best to book in"

## CUSTOMER EXPERIENCE STANDARDS
Every client should feel:
- Looked after
- Listened to
- Respected
- Clean
- Confident

We don't do ego. We don't do attitude. We don't do sloppy work.

## PRODUCT RECOMMENDATIONS
Keep it simple:
- Dry scalp → moisturising shampoo
- Oily hair → matt clay
- Thin hair → volume powder
- Curly hair → curl cream
- Beards → oil + brush

Always explain why, not just what.

## SOCIAL MEDIA / PHOTOS
If you're taking photos:
- Clean background
- Good lighting
- No hair on cape
- No messy station
- Get front, side, back
- Tag the shop
- Keep it professional

We don't post clients looking uncomfortable or half‑done.

## SHOP LOCATIONS
**Standalone Locations:**
- Kingston — 32 Surbiton Road, KT1 2HX
- Tolworth — 142 Tolworth Broadway, KT6 7JD (Hours verified)
- Kensington — Address TBD

**Primark Locations:**
- Birmingham — Primark, 38 High St, B4 7SL
- Manchester — Primark, Market St, M1 1WA (OPEN)

## FINAL RULES
- Never mention AI, models, or APIs.
- Never break character.
- Always answer as the Smokey Staff Brain.
- If something isn't defined yet, say: "This isn't officially set yet — for now, follow your senior barber's lead and keep it consistent with the rest of the team."`

const FALLBACK_MESSAGE = `No stress — looks like the Brain can't reach the server right now. Here's the standard Smokey guide while we're offline:

## CLEAN‑DOWN ROUTINE
This is non‑negotiable. After every client:
- Brush down chair
- Disinfect armrests
- Wipe station
- Sweep floor
- Sanitise tools
- Fresh neck strip
- Fresh cape

If your station looks messy, you look messy. This is what separates Smokey from the rest.`

const SHOP_DATA = {
  kingston: { name: 'Kingston', address: '32 Surbiton Road, KT1 2HX' },
  tolworth: { name: 'Tolworth', address: '142 Tolworth Broadway, KT6 7JD' },
  kensington: { name: 'Kensington', address: 'Address TBD' },
  birmingham: { name: 'Birmingham (Primark)', address: 'Primark, 38 High St, B4 7SL' },
  manchester: { name: 'Manchester (Primark)', address: 'Primark, Market St, M1 1WA' }
}

export default function ChatInterface({
  user,
  onLogout,
  selectedShop,
  onShopChange,
  staffName,
  onQuestionAsked
}) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const inputRef = useRef(null)
  const chatAreaRef = useRef(null)

  const handleSendMessage = async (messageText) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading) return

    const userMessage = textToSend
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    if (onQuestionAsked) {
      onQuestionAsked(userMessage)
    }

    try {
      // Trim conversation history to last 5 messages for better performance
      // User sees full history, but API only gets recent context
      const recentHistory = messages.slice(-5)

      // Call backend proxy instead of direct API (avoids CORS issues)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: recentHistory,
          selectedShop: selectedShop,
          staffName: staffName
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulatedText = ''

      // Create empty assistant message that we'll update with streamed content
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line)

              if (data.type === 'text') {
                // Accumulate text and update message in real-time
                accumulatedText += data.content
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulatedText
                  }
                  return updated
                })
              } else if (data.type === 'done') {
                // Stream complete
                break
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer)
          if (data.type === 'text') {
            accumulatedText += data.content
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                role: 'assistant',
                content: accumulatedText
              }
              return updated
            })
          }
        } catch (e) {
          // Ignore
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: FALLBACK_MESSAGE
      }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleQuickTopic = (query) => {
    setInput(query)
    setTimeout(() => {
      handleSendMessage(query)
    }, 0)
  }

  const handleNewSession = () => {
    setMessages([])
    setInput('')
    setIsLoading(false)
    // Scroll chat area to top
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = 0
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputFocus = () => {
    // Scroll input higher to ensure full visibility above keyboard
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      // Additional scroll down a bit to position between top and center
      setTimeout(() => {
        const scrollAmount = window.innerHeight * 0.25
        window.scrollBy(0, scrollAmount)
      }, 100)
    }, 300)
  }

  return (
    <div className="chat-layout">
      <TopBar selectedShop={selectedShop} onShopChange={onShopChange} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="main-container">
        <Sidebar
          onQuickTopicClick={handleQuickTopic}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewSession={handleNewSession}
        />

        <div className="chat-area" ref={chatAreaRef}>
          {messages.length === 0 && <WelcomeMessage staffName={staffName} />}
          <ChatThread messages={messages} isLoading={isLoading} />

          {messages.length > 0 && !isLoading && (
            <SmartSuggestions
              onSuggestionClick={handleSuggestionClick}
              show={messages.length > 0}
            />
          )}

          <div className="input-bar">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                placeholder="Ask anything about Smokey standards…"
                className="message-input"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="send-btn"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
