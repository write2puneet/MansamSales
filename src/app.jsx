import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================================================================
   MANSAM SALES GAME — v2
   Changes in this version:
   - Login by NAME (history keyed to normalized name)
   - Customer face IMAGES (two uploaded paper-cut portraits + one SVG in same style)
   - Softer FEMALE voice (Samantha / Aria / Libby / Google UK Female preferred)
   - Silence-skip timer: only counts active speaking+listening, HARD 4-minute cap
   ========================================================================= */

/* ---- Customer portrait images (base64 injected below) ---- */
const IMG_MAN_KEFFIYEH = "__IMG_MAN__";
const IMG_WOMAN_ARCH = "__IMG_WOMAN__";

/* Elder oud loyalist — paper-cut SVG in Mansam palette to match the two uploaded
   illustrations (warm amber/gold on cream, soft light, serene). */
const ElderPortraitSVG = () => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0e3ca" />
        <stop offset="100%" stopColor="#e8d4ab" />
      </linearGradient>
      <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e3c390" />
        <stop offset="100%" stopColor="#b88850" />
      </linearGradient>
      <linearGradient id="keffiyeh" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f4e4c4" />
        <stop offset="100%" stopColor="#c9a266" />
      </linearGradient>
      <linearGradient id="beard" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f5eddb" />
        <stop offset="100%" stopColor="#e8d7b4" />
      </linearGradient>
      <linearGradient id="thobe" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e9d6b2" />
        <stop offset="100%" stopColor="#b08858" />
      </linearGradient>
      <radialGradient id="warmth" cx="30%" cy="20%" r="80%">
        <stop offset="0%" stopColor="rgba(255,240,210,0.4)" />
        <stop offset="100%" stopColor="rgba(255,240,210,0)" />
      </radialGradient>
    </defs>

    <rect width="400" height="400" fill="url(#bg)" />
    <rect width="400" height="400" fill="url(#warmth)" />

    {/* Shoulder / thobe collar */}
    <path d="M 90 400 L 90 330 Q 90 290 140 275 L 260 275 Q 310 290 310 330 L 310 400 Z" fill="url(#thobe)" />
    <path d="M 180 275 Q 200 295 220 275 L 220 310 Q 200 325 180 310 Z" fill="#a37b48" opacity="0.6" />

    {/* Neck */}
    <path d="M 170 280 L 230 280 L 225 260 Q 200 270 175 260 Z" fill="url(#skin)" />

    {/* Face - 3/4 profile facing right, slightly elder */}
    <path d="M 155 135 Q 150 120 165 105 Q 185 88 215 90 Q 250 93 265 115 Q 275 135 273 165 Q 272 195 258 220 Q 245 245 215 252 Q 185 252 170 230 Q 158 210 155 180 Z" fill="url(#skin)" />

    {/* Cheek shadow */}
    <path d="M 160 180 Q 170 210 190 225 Q 175 220 165 200 Z" fill="#8f6838" opacity="0.35" />

    {/* Eye - thoughtful, a little weary */}
    <ellipse cx="230" cy="160" rx="7" ry="3.5" fill="#4a3218" />
    <path d="M 220 154 Q 230 150 240 155" stroke="#7a5430" strokeWidth="1.8" fill="none" />
    {/* slight eye crease */}
    <path d="M 240 162 Q 248 164 253 162" stroke="#8f6838" strokeWidth="1" fill="none" opacity="0.5" />

    {/* Brow - thicker, greying */}
    <path d="M 218 148 Q 232 142 248 147" stroke="#5a3e22" strokeWidth="3.5" fill="none" strokeLinecap="round" />

    {/* Nose */}
    <path d="M 248 160 Q 256 185 252 205 Q 246 208 240 200" fill="none" stroke="#8f6838" strokeWidth="1.5" opacity="0.5" />
    <ellipse cx="248" cy="205" rx="3" ry="1.5" fill="#8f6838" opacity="0.3" />

    {/* Mouth - composed */}
    <path d="M 225 225 Q 235 228 245 223" stroke="#6b4820" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Grey/white beard */}
    <path d="M 175 215 Q 175 245 195 265 Q 215 272 235 268 Q 258 260 265 235 Q 268 220 262 210 Q 258 230 245 240 Q 220 248 200 240 Q 185 230 180 215 Z" fill="url(#beard)" />
    <path d="M 180 225 Q 200 255 225 262" stroke="#d4c094" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 200 235 Q 215 258 238 255" stroke="#d4c094" strokeWidth="1" fill="none" opacity="0.5" />

    {/* Moustache */}
    <path d="M 215 218 Q 225 214 235 218 Q 245 214 253 220" stroke="#c9b58a" strokeWidth="3" fill="none" strokeLinecap="round" />

    {/* Keffiyeh - flowing, traditional */}
    <path d="M 120 110 Q 115 70 155 55 Q 200 45 250 55 Q 290 65 295 110 L 295 165 Q 288 140 275 125 L 275 105 Q 260 95 245 95 Q 220 100 210 90 Q 185 85 170 95 Q 150 105 145 125 L 145 170 Q 130 150 120 130 Z" fill="url(#keffiyeh)" />

    {/* Keffiyeh folds - left side flow */}
    <path d="M 120 130 Q 100 180 105 240 Q 115 290 150 320 L 90 320 L 90 200 Q 100 160 115 140 Z" fill="url(#keffiyeh)" />
    <path d="M 110 170 Q 95 220 100 270" stroke="#b89658" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 120 155 Q 110 200 112 250" stroke="#b89658" strokeWidth="1" fill="none" opacity="0.4" />

    {/* Keffiyeh right side flow */}
    <path d="M 295 130 Q 315 180 310 240 Q 300 280 280 310 L 310 310 L 310 200 Q 305 160 295 140 Z" fill="url(#keffiyeh)" />
    <path d="M 300 170 Q 310 220 305 270" stroke="#b89658" strokeWidth="1" fill="none" opacity="0.5" />

    {/* Agal (black rope cord) - subtle double line at crown */}
    <ellipse cx="207" cy="95" rx="85" ry="7" fill="none" stroke="#5a4020" strokeWidth="2.5" opacity="0.4" />
    <ellipse cx="207" cy="102" rx="87" ry="6" fill="none" stroke="#5a4020" strokeWidth="2" opacity="0.3" />

    {/* Subtle ear */}
    <ellipse cx="160" cy="175" rx="6" ry="10" fill="url(#skin)" />
    <path d="M 158 172 Q 161 178 158 183" stroke="#8f6838" strokeWidth="1" fill="none" opacity="0.5" />
  </svg>
);

/* ---- Mansam Knowledge Base ---- */
const MANSAM_KB = `
MANSAM — Luxury Arabian Fragrance House. Four collections: Oud, Nayat, Qanun, Buzuq & Riqq.
Brand voice: quiet nobility, heritage, craftsmanship, calm authority. Not loud. Not cheap-chic.
Sales philosophy: storytelling > pushing. Discover the customer first, then match emotion to bottle.
Price register: luxury. Never apologize for price. Anchor on heritage, rarity of accords, and emotional outcome.

FULL SKU LIBRARY (20 EDPs):

OUD COLLECTION
• Hams Min Al Sahraa — Men-featured, family gifting. Rose/Floral/Musk-Oud. "Quiet nobility, inner depth." Desert whisper; noble Arabian accord.
• Naseem Al Ward — Unisex top-seller, work/social. Bergamot/Rose-Jasmine/Soft woods. "Graceful optimism, charm." Cross-gender bestseller; easy elegance.
• Qublat Ward — Travel gifting, elegant unisex. Bergamot/Rose/Oud. "Romantic authority, refined elegance." Majlis elegance; travel-friendly.
• Shatha Biladi — Winter, Saudi identity. Citrus/Floral/Oud. "Pride of origin, rooted identity." Saudi identity signal; winter majlis scent.

NAYAT COLLECTION
• Aala Taj Warda — Summer evenings. Saffron-Cinnamon/Rose/Warm spicy. "Passion, rise, grandeur." Crown symbolism; saffron-rose statement.
• Aala Sathi Al Qamar — Men-featured gifting. White flowers-Lily/Musk-Sandalwood. "Joy, glow." Moonlight energy; softer pleasure code.
• Fakhamat Al Warda — Women-featured. Rose/Fresh florals/Soft woods. "Royal elegance, visible status." Her Majesty rose; royal aura.
• Hadeeth Al Rooh — Women-featured. Warm spices/Oriental woods/Amber. "Inner depth, soulfulness."
• Hamsa — Women-featured. Fruity/Patchouli/Sandalwood. "Warmth, social ease." Warm social scent.
• Sarhan — Men-featured, work/social top-seller. Saffron/Leather-Oud/Deep woods. "Vision, pioneering spirit." Leather-saffron pride.
• Tahta Al Noujoum — Women-featured top-seller, evenings. Neroli/Orange blossom/Musk-rum. "Dreamy playful charm." Under-the-stars mood.
• Min Ana — Travel gifting. Oriental woods/Warm spices/Warm base. "Self-discovery, individuality."
• Horr Fi Al Riyah — Women-featured. Soft almond/Lily/Sandalwood-Amber. "Freedom, independence." Airy amber-wood.

QANUN COLLECTION
• Safaa Al Nada — Men-featured, family gifting. Bergamot/Rose-LilyOfValley/Sandalwood. "Purity, calm clarity." Clean refined desire.
• Mamlakati — Winter. Musk/Strong woods/Vanilla. "Ownership, command." Kingdom; strong winter profile.
• Al Hawa Ghallab — Women-featured top-seller. Juniper-Saffron/Floral/Lasting woody. "Magnetism, desire." Love-wins story.
• Al Shaghaf Al Ahmar — Expressive. Luxurious spices/Rose/Woody. "Passion, intensity, red energy." Red passion code.

BUZUQ & RIQQ COLLECTION
• Khatiiiir — Men-featured hero product, top-seller. Saffron/Leather-Rose/Oud-Frankincense. "Power, danger, bold charisma." Hero product; leather-saffron-oud signature.
• Amtar — Women-featured, summer top-seller. Fruity/Patchouli/Sandalwood. "Fresh optimism, renewal." Rain metaphor.
• Thawrat Al Ahasseess — Men-featured top-seller. Saffron/Rose/Oud-Incense. "Emotional intensity, rebellion." Revolution of senses.

DREAM-TO-PERFUME EMOTIONAL MAP (use when customer describes a feeling):
NOBILITY → Shatha Biladi, Hams Min Al Sahraa, Al Shaghaf Al Ahmar
HAPPINESS → Tahta Al Noujoum, Naseem Al Ward
PLEASURE → Aala Taj Warda, Hadeeth Al Rooh, Fakhamat Al Warda, Aala Sathi Al Qamar
GENEROSITY → Amtar, Horr Fi Al Riyah, Hamsa
PASSION → Thawrat Al Ahasseess, Khatiiiir, Qublat Ward
DESIRE → Safaa Al Nada, Al Hawa Ghallab, Mamlakati
PRIDE → Sarhan, Min Ana

GOLD-STANDARD SERVICE BEHAVIOURS (Service score rubric):
- Warm Arabic/English greeting, eye contact, no rushing
- Discover first: "Is this for yourself or a gift?" / "What mood are you chasing?"
- Speak of notes as story, not as chemistry
- Patience with silence; let the customer smell and reflect
- Offer tea/water in the majlis register if dwell time is long
- Close gently: "Shall I wrap this one for you, or would you like to try one more?"
`.trim();

/* ---- 3 Customer archetypes ---- */
const CUSTOMERS = [
  {
    id: "browser",
    name: "First-Time Browser",
    difficulty: 1,
    brief: "Curious, low knowledge, needs guidance and reassurance.",
    opening:
      "Hello... I've never bought an oud before. I was just walking past. Everything looks so expensive. Can you tell me what makes this different?",
    persona: `You are a first-time browser in a luxury Arabian perfume boutique in Riyadh. You are curious but intimidated by price and the unfamiliar world of oud and Arabian perfumery. You know almost nothing about perfume notes. You warm up ONLY when the salesperson slows down, discovers what YOU like, and tells a story instead of reciting features. If they rush to upsell or dump information, you become quieter and say things like "I think I need to come back later." Buy signal: when they confidently recommend ONE specific bottle with a reason tied to your mood. Typical objections: "It's a lot of money for something I don't know", "I don't know if I'll like it after an hour", "Is it too strong?". Speak naturally, short sentences, not scripted.`,
    voiceGender: "male",
    image: "man",
  },
  {
    id: "gift",
    name: "Gift Shopper",
    difficulty: 1,
    brief: "Buying for someone else. Indecisive. Needs confident direction.",
    opening:
      "I need a gift for my sister. Her birthday is this weekend. I honestly have no idea what she'd like. Help me — you pick something.",
    persona: `You are shopping for a gift — your sister's birthday is in 3 days. You don't wear perfume yourself and you don't know your sister's taste well, only that she is "elegant, a bit quiet, works in an office." You want the salesperson to TAKE CHARGE but also reassure you. You get annoyed if they ask too many vague questions without giving direction. You love it when they say "For a sister who is elegant and composed, most gift-givers choose X because..." Buy signal: they pick ONE bottle, justify it in two sentences, and mention gifting/wrapping. Objections: "What if she already has something like this?", "Is this too personal?", "Can it be returned?". Speak like someone in a hurry but warm.`,
    voiceGender: "female",
    image: "woman",
  },
  {
    id: "loyalist",
    name: "Classic Oud Loyalist",
    difficulty: 2,
    brief: "Expert buyer. Values heritage and authenticity. Tests knowledge.",
    opening:
      "As-salamu alaykum. I've been wearing oud for thirty years. Tell me — what's the oud origin in your Shatha Biladi? Cambodi? Hindi? And is it real oud or a reconstruction?",
    persona: `You are a Saudi gentleman in your 50s who has worn oud daily for 30 years. You own bottles from Ajmal, Arabian Oud, Amouage, Abdul Samad Al Qurashi. You are polite but testing. You will catch any salesperson who bluffs about oud origins or accord construction. You respect heritage language, the names of oud-growing regions (Cambodi, Hindi, Assam, Trat), and salespeople who admit "I will check with our perfumer" rather than fake an answer. Buy signal: salesperson demonstrates genuine knowledge OR is humble and offers to bring the senior perfumer/brand book. Objections: "Your price is higher than Arabian Oud for less pedigree", "How do I know this isn't a synthetic?", "Who is your nose?". Speak calmly, a little formally, with occasional Arabic courtesy phrases like "ma sha Allah" or "tayyib".`,
    voiceGender: "male",
    image: "elder",
  },
];

const SESSION_SECONDS = 240; // 4-minute HARD cap
const SILENCE_CAP_PER_TURN = 6; // max seconds of silence counted per listening turn

/* ============================================================ */
export default function MansamSalesGame() {
  const [screen, setScreen] = useState("login");
  const [playerName, setPlayerName] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!playerName) return;
    (async () => {
      try {
        const key = `player:${normalizeName(playerName)}`;
        const res = await window.storage.get(key);
        if (res && res.value) setHistory(JSON.parse(res.value));
        else setHistory([]);
      } catch {
        setHistory([]);
      }
    })();
  }, [playerName]);

  const saveSession = async (sessionRecord) => {
    const next = [...history, sessionRecord];
    setHistory(next);
    try {
      const key = `player:${normalizeName(playerName)}`;
      await window.storage.set(key, JSON.stringify(next));
      await window.storage.set(
        `session:${normalizeName(playerName)}:${Date.now()}`,
        JSON.stringify({ playerName, ...sessionRecord }),
        true
      );
    } catch (e) {
      console.error("storage error", e);
    }
  };

  const handleLogin = (n) => { setPlayerName(n); setScreen("pick"); };
  const handlePickCustomer = (c) => { setSelectedCustomer(c); setScreen("game"); };
  const handleSessionEnd = async (result) => {
    const record = {
      ts: new Date().toISOString(),
      customer: selectedCustomer.name,
      customerId: selectedCustomer.id,
      saleScore: result.saleScore,
      serviceScore: result.serviceScore,
      points: result.points,
      message: result.message,
      highlights: result.highlights,
      growth: result.growth,
      transcriptLength: result.transcriptLength,
      activeSeconds: result.activeSeconds,
    };
    await saveSession(record);
    setLastResult(record);
    setScreen("debrief");
  };

  const totalPoints = history.reduce((a, h) => a + (h.points || 0), 0);

  return (
    <div className="min-h-screen w-full bg-[#0a0604] text-[#e8dcc4] font-serif overflow-hidden relative">
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#8b6a43] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#3d2a14] blur-[140px]" />
      </div>
      <div className="pointer-events-none fixed inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(232,220,196,0.04) 1px, transparent 0)`,
        backgroundSize: "32px 32px"
      }} />

      <AnimatePresence mode="wait">
        {screen === "login" && <LoginScreen key="login" onLogin={handleLogin} />}
        {screen === "pick" && (
          <PickCustomerScreen
            key="pick"
            playerName={playerName}
            totalPoints={totalPoints}
            sessionCount={history.length}
            onPick={handlePickCustomer}
            onLogout={() => { setPlayerName(null); setScreen("login"); }}
          />
        )}
        {screen === "game" && (
          <GameScreen
            key="game"
            customer={selectedCustomer}
            playerName={playerName}
            onEnd={handleSessionEnd}
            onCancel={() => setScreen("pick")}
          />
        )}
        {screen === "debrief" && lastResult && (
          <DebriefScreen
            key="debrief"
            result={lastResult}
            totalPoints={totalPoints}
            sessionCount={history.length}
            history={history}
            onAgain={() => setScreen("pick")}
            onLogout={() => { setPlayerName(null); setScreen("login"); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function normalizeName(n) {
  return (n || "").trim().toLowerCase().replace(/\s+/g, "_");
}
function prettyName(n) {
  return (n || "").trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

/* ============================================================
   Screen 1 — Login by NAME
   ============================================================ */
function LoginScreen({ onLogin }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const trimmed = input.trim();
    if (trimmed.length < 2) {
      setError("Please enter your name to begin.");
      return;
    }
    onLogin(prettyName(trimmed));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-[11px] tracking-[0.5em] text-[#c9a77a] mb-6 uppercase"
      >
        Mansam · Parfumery
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
        className="text-center font-serif italic leading-[0.95] text-[#e8dcc4]"
        style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
      >
        Play the<br />
        <span className="text-[#d4b48a]">Sales Game</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-8 text-center text-[#c9a77a]/80 max-w-md text-lg"
      >
        Enter your name to begin. Every session earns points.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
        className="mt-10 w-full max-w-md"
      >
        <div className="relative">
          <input
            type="text"
            autoComplete="given-name"
            maxLength={40}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Your name"
            className="w-full text-center text-4xl bg-transparent border-b-2 border-[#8b6a43] text-[#e8dcc4] py-4 focus:outline-none focus:border-[#d4b48a] placeholder-[#8b6a43]/40"
          />
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#8b6a43] mt-3 text-center">
            First name is enough
          </div>
        </div>

        {error && <div className="mt-4 text-center text-sm text-[#d97b5a]">{error}</div>}

        <button
          onClick={submit}
          className="mt-10 w-full bg-[#c9a77a] hover:bg-[#d4b48a] text-[#0a0604] font-serif uppercase tracking-[0.3em] text-sm py-5 transition-colors"
        >
          Enter the Boutique
        </button>
      </motion.div>

      <div className="absolute bottom-6 text-[10px] uppercase tracking-[0.4em] text-[#8b6a43]/60">
        Training & Coaching · KSA Floor
      </div>
    </motion.div>
  );
}

/* ============================================================
   Portrait renderer
   ============================================================ */
function CustomerPortrait({ kind, circular = true }) {
  const common = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };
  if (kind === "man") {
    return <img src={IMG_MAN_KEFFIYEH} alt="Customer" style={common} />;
  }
  if (kind === "woman") {
    return <img src={IMG_WOMAN_ARCH} alt="Customer" style={common} />;
  }
  // elder — SVG
  return <div style={{ width: "100%", height: "100%" }}><ElderPortraitSVG /></div>;
}

/* ============================================================
   Screen 1.5 — Pick a customer
   ============================================================ */
function PickCustomerScreen({ playerName, totalPoints, sessionCount, onPick, onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen px-6 py-10 flex flex-col"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#8b6a43]">Welcome back</div>
          <div className="text-3xl font-serif italic text-[#e8dcc4]">{playerName}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#8b6a43]">Points · Sessions</div>
          <div className="text-3xl font-serif text-[#d4b48a]">
            {totalPoints} <span className="text-[#8b6a43] text-xl">·</span> {sessionCount}
          </div>
        </div>
      </div>

      <h2 className="text-center font-serif italic text-[#e8dcc4] mb-3"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
        Who walks in today?
      </h2>
      <p className="text-center text-[#c9a77a]/70 text-sm mb-10 max-w-md mx-auto">
        Choose a customer. Tap their portrait to begin a four-minute conversation.
      </p>

      <div className="flex-1 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto w-full">
        {CUSTOMERS.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => onPick(c)}
            className="group relative overflow-hidden bg-[#1a120a] border border-[#8b6a43]/40 hover:border-[#d4b48a] transition-all text-left"
            style={{ minHeight: "440px" }}
          >
            <div className="w-full" style={{ height: "260px", overflow: "hidden", background: "#f0e3ca" }}>
              <CustomerPortrait kind={c.image} />
            </div>
            <div className="p-6">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#c9a77a] mb-2">
                Difficulty {"★".repeat(c.difficulty)}{"☆".repeat(3 - c.difficulty)}
              </div>
              <div className="text-2xl font-serif italic text-[#e8dcc4] mb-2">{c.name}</div>
              <div className="text-sm text-[#e8dcc4]/70 leading-relaxed">{c.brief}</div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.4em] text-[#d4b48a]">
                Tap to begin →
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="mt-10 mx-auto text-[10px] uppercase tracking-[0.4em] text-[#8b6a43] hover:text-[#c9a77a]"
      >
        ← Not you? Log out
      </button>
    </motion.div>
  );
}

/* ============================================================
   Voice picker — prefers warm female voices for softer tone
   ============================================================ */
function pickVoice(gender) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || !voices.length) return null;

  // Tiered preferences — highest quality first
  const femalePatterns = [
    /samantha/i,           // iOS/macOS — very warm, soft
    /google uk english female/i,
    /microsoft aria/i,     // warm neural
    /microsoft libby/i,    // British, soft
    /microsoft jenny/i,
    /karen/i,              // macOS Australian, warm
    /moira/i,              // macOS Irish, warm
    /serena/i,             // macOS British
    /ava/i,
    /zira/i,
    /female/i,
  ];
  const malePatterns = [
    /daniel/i,             // macOS British — warm, measured
    /microsoft guy/i,
    /microsoft ryan/i,
    /alex/i,
    /david/i,
    /male/i,
  ];

  const pool = gender === "female" ? femalePatterns : malePatterns;
  const enVoices = voices.filter(v => /^en/i.test(v.lang));

  for (const p of pool) {
    const v = enVoices.find(vc => p.test(vc.name));
    if (v) return v;
  }
  // fall back to any English voice
  return enVoices[0] || voices[0];
}

/* ============================================================
   Screen 2 — Game (voice, silence-skip timer, 4-min hard cap)
   ============================================================ */
function GameScreen({ customer, playerName, onEnd, onCancel }) {
  const [phase, setPhase] = useState("ready"); // ready | running | ending
  const [activeSeconds, setActiveSeconds] = useState(0); // only counts active speak/listen time
  const [transcript, setTranscript] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const transcriptRef = useRef([]);
  const recognitionRef = useRef(null);
  const endingRef = useRef(false);

  // Timer accounting refs
  const activeSecondsRef = useRef(0);
  const activityTickRef = useRef(null);        // increments activeSeconds while active
  const activityActiveRef = useRef(false);     // whether the clock is ticking right now
  const silenceStartRef = useRef(null);        // ms when current silent stretch began
  const silenceCapHitRef = useRef(false);      // have we already paused due to silence?

  const voiceRef = useRef(null);
  const voiceReadyRef = useRef(false);

  const speechSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition) &&
    window.speechSynthesis;

  /* ---- Preload voices (browsers load async) ---- */
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const load = () => {
      voiceRef.current = pickVoice(customer.voiceGender);
      voiceReadyRef.current = !!voiceRef.current;
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [customer.voiceGender]);

  /* ---- Activity clock helpers ---- */
  const startActivityClock = () => {
    if (activityActiveRef.current) return;
    activityActiveRef.current = true;
    silenceStartRef.current = null;
    silenceCapHitRef.current = false;
    activityTickRef.current = setInterval(() => {
      activeSecondsRef.current += 1;
      setActiveSeconds(activeSecondsRef.current);
      if (activeSecondsRef.current >= SESSION_SECONDS) {
        clearInterval(activityTickRef.current);
        activityActiveRef.current = false;
        handleEndSession();
      }
    }, 1000);
  };
  const pauseActivityClock = () => {
    if (!activityActiveRef.current) return;
    activityActiveRef.current = false;
    clearInterval(activityTickRef.current);
  };

  /* ---- TTS with softer tone ---- */
  const speak = (text) => new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve();
    try { window.speechSynthesis.cancel(); } catch {}
    const u = new SpeechSynthesisUtterance(text);

    // Softer tone: slower rate, gentler pitch, slightly reduced volume
    if (customer.voiceGender === "female") {
      u.rate = 0.88;   // unhurried
      u.pitch = 1.05;  // warm, not shrill
      u.volume = 0.92;
    } else if (customer.id === "loyalist") {
      u.rate = 0.85;   // measured elder
      u.pitch = 0.90;
      u.volume = 0.95;
    } else {
      u.rate = 0.92;
      u.pitch = 0.98;
      u.volume = 0.95;
    }

    // Pick voice (re-pick if not ready yet)
    if (!voiceRef.current) voiceRef.current = pickVoice(customer.voiceGender);
    if (voiceRef.current) u.voice = voiceRef.current;

    u.onstart = () => { setSpeaking(true); startActivityClock(); };
    u.onend = () => { setSpeaking(false); resolve(); };
    u.onerror = () => { setSpeaking(false); resolve(); };
    window.speechSynthesis.speak(u);
  });

  /* ---- STT with silence cap ---- */
  const startListening = useCallback(() => {
    if (endingRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    try {
      const rec = new SR();
      rec.lang = "en-US";
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      let silenceTimer = null;
      let gotAnything = false;

      const armSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          // Pause the clock after SILENCE_CAP_PER_TURN seconds of total silence
          if (!gotAnything && !silenceCapHitRef.current) {
            silenceCapHitRef.current = true;
            pauseActivityClock();
            setStatus("Paused while waiting — speak when ready.");
          }
        }, SILENCE_CAP_PER_TURN * 1000);
      };

      rec.onstart = () => {
        setListening(true);
        setStatus("Listening…");
        startActivityClock();
        gotAnything = false;
        armSilenceTimer();
      };
      rec.onresult = async (e) => {
        let finalText = "";
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          if (r[0].transcript.trim()) {
            gotAnything = true;
            // Any speech detected — resume clock if it was paused
            if (!activityActiveRef.current) startActivityClock();
          }
          if (r.isFinal) finalText += r[0].transcript;
        }
        if (finalText.trim()) {
          if (silenceTimer) clearTimeout(silenceTimer);
          setListening(false);
          setStatus("");
          await handleSalespersonTurn(finalText.trim());
        }
      };
      rec.onerror = (e) => {
        if (silenceTimer) clearTimeout(silenceTimer);
        setListening(false);
        if (e.error === "no-speech") {
          // Silence on this turn — pause clock and retry without counting the gap
          pauseActivityClock();
          setStatus("Still listening — speak when ready.");
          setTimeout(() => { if (!endingRef.current) startListening(); }, 400);
        } else if (e.error === "not-allowed") {
          setErrorMsg("Microphone permission denied. Please allow mic access.");
        } else if (e.error === "aborted") {
          // normal — ignore
        } else {
          setStatus(`Mic: ${e.error}. Reconnecting…`);
          setTimeout(() => { if (!endingRef.current) startListening(); }, 600);
        }
      };
      rec.onend = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        setListening(false);
      };
      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setErrorMsg("Speech recognition failed to start.");
    }
  }, [/* your dependencies */]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch {}
    setListening(false);
  };

  /* ---- Customer AI turn ---- */
  const getCustomerReply = async (convo) => {
    const messages = convo.map(m => ({
      role: m.role === "customer" ? "assistant" : "user",
      content: m.text
    }));
    const systemPrompt = `${customer.persona}

You are playing this customer in a live voice roleplay training game for Mansam boutique salespeople.
RULES:
- Reply in short, natural spoken sentences (1–3 sentences, max 40 words).
- Stay fully in character as the customer. NEVER break character, NEVER coach, NEVER say you are an AI.
- React authentically — warm up when they discover you, push back when they rush.
- If they demonstrate the right behaviour, gradually move toward a buy signal.
- Use only natural speech. No stage directions, no asterisks, no emojis.

Brand context:
${MANSAM_KB}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: systemPrompt,
        messages: messages.length ? messages : [{ role: "user", content: "(Begin the scene now.)" }]
      })
    });
    const data = await res.json();
    const text = (data.content || [])
      .filter(b => b.type === "text").map(b => b.text).join(" ").trim();
    return text || "Sorry, could you say that again?";
  };

  const handleSalespersonTurn = async (said) => {
    if (endingRef.current) return;
    const updated = [...transcriptRef.current, { role: "salesperson", text: said }];
    transcriptRef.current = updated;
    setTranscript(updated);
    setStatus("Customer is thinking…");
    // Thinking time is NOT active conversation — pause the clock
    pauseActivityClock();
    try {
      const reply = await getCustomerReply(updated);
      if (endingRef.current) return;
      const withReply = [...updated, { role: "customer", text: reply }];
      transcriptRef.current = withReply;
      setTranscript(withReply);
      setStatus("Customer is speaking…");
      await speak(reply);
      if (!endingRef.current && activeSecondsRef.current < SESSION_SECONDS - 2) {
        startListening();
      } else {
        handleEndSession();
      }
    } catch (err) {
      console.error(err);
      setStatus("Connection hiccup. Listening again…");
      if (!endingRef.current) setTimeout(() => startListening(), 800);
    }
  };

  /* ---- Start ---- */
  const startSession = async () => {
    if (!speechSupported) {
      setErrorMsg("Voice is not supported in this browser. Please use Chrome on desktop or Android.");
      return;
    }
    setPhase("running");
    setStatus("Customer is speaking…");
    const opener = customer.opening;
    const first = [{ role: "customer", text: opener }];
    transcriptRef.current = first;
    setTranscript(first);
    await speak(opener);
    if (!endingRef.current) startListening();
  };

  /* ---- End + score ---- */
  const handleEndSession = async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    setPhase("ending");
    setStatus("Scoring your session…");
    try { window.speechSynthesis.cancel(); } catch {}
    stopListening();
    pauseActivityClock();

    const result = await scoreSession(transcriptRef.current, customer);
    onEnd({
      ...result,
      transcriptLength: transcriptRef.current.length,
      activeSeconds: activeSecondsRef.current,
    });
  };

  useEffect(() => {
    return () => {
      endingRef.current = true;
      try { window.speechSynthesis.cancel(); } catch {}
      try { recognitionRef.current?.abort(); } catch {}
      clearInterval(activityTickRef.current);
    };
  }, []);

  const remaining = Math.max(0, SESSION_SECONDS - activeSeconds);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = activeSeconds / SESSION_SECONDS;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-8"
    >
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <button
          onClick={() => {
            endingRef.current = true;
            try { window.speechSynthesis.cancel(); } catch {}
            stopListening();
            pauseActivityClock();
            onCancel();
          }}
          className="text-[10px] uppercase tracking-[0.4em] text-[#8b6a43] hover:text-[#c9a77a]"
        >
          ← Leave
        </button>
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#8b6a43]">
          {playerName} · {customer.name}
        </div>
      </div>

      {/* Portrait with timer ring */}
      <div className="relative" style={{ width: "min(72vw, 420px)", height: "min(72vw, 420px)" }}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="94" fill="none" stroke="rgba(139,106,67,0.25)" strokeWidth="2" />
          <motion.circle
            cx="100" cy="100" r="94" fill="none"
            stroke="#d4b48a" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 94}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 94}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <motion.button
          onClick={phase === "ready" ? startSession : undefined}
          disabled={phase !== "ready"}
          whileHover={phase === "ready" ? { scale: 1.02 } : {}}
          whileTap={phase === "ready" ? { scale: 0.98 } : {}}
          animate={speaking ? { scale: [1, 1.012, 1] } : listening ? { scale: [1, 1.005, 1] } : {}}
          transition={speaking ? { duration: 1.4, repeat: Infinity } : listening ? { duration: 2, repeat: Infinity } : {}}
          className={`absolute inset-3 rounded-full overflow-hidden ${phase === "ready" ? "cursor-pointer" : "cursor-default"}`}
          style={{ border: "1px solid rgba(212,180,138,0.4)" }}
        >
          <div className="absolute inset-0">
            <CustomerPortrait kind={customer.image} />
          </div>

          {phase === "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0604]/35 backdrop-blur-[1px]">
              <div className="text-[11px] uppercase tracking-[0.4em] text-[#f0e3ca] mb-2 px-4 py-2 bg-[#0a0604]/50 rounded-full">
                Press to Start
              </div>
              <div className="text-xl font-serif italic text-[#f0e3ca] mt-2 px-4 py-1 bg-[#0a0604]/50 rounded-full">
                {customer.name}
              </div>
            </div>
          )}

          {listening && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-[#0a0604]/50 px-4 py-2 rounded-full">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i} className="w-2 h-2 rounded-full bg-[#f0e3ca]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* Timer */}
      <div className="mt-10 text-center">
        <div className="text-[10px] uppercase tracking-[0.5em] text-[#8b6a43] mb-2">
          Time Remaining {!activityActiveRef.current && phase === "running" && "· paused"}
        </div>
        <div className="text-6xl font-serif tabular-nums text-[#e8dcc4]" style={{ fontFeatureSettings: "'tnum'" }}>
          {mm}:{ss}
        </div>
      </div>

      <div className="mt-6 min-h-[1.5rem] text-sm text-[#c9a77a]/80 tracking-wider text-center max-w-md">
        {phase === "ready" && "Tap the portrait to begin. Speak naturally — the customer will reply out loud."}
        {phase === "running" && status}
        {phase === "ending" && "Scoring your session…"}
      </div>

      {errorMsg && <div className="mt-4 text-sm text-[#d97b5a] max-w-sm text-center">{errorMsg}</div>}

      {phase === "running" && (
        <button
          onClick={handleEndSession}
          className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#8b6a43] hover:text-[#c9a77a]"
        >
          End & score now →
        </button>
      )}

      {phase === "running" && transcript.length > 0 && (
        <div className="mt-6 max-w-xl w-full text-center">
          {transcript.slice(-2).map((t, i) => (
            <div key={i} className={`text-sm mb-2 ${t.role === "customer" ? "text-[#d4b48a] italic" : "text-[#e8dcc4]/80"}`}>
              <span className="text-[9px] uppercase tracking-[0.4em] text-[#8b6a43] mr-2">
                {t.role === "customer" ? customer.name : playerName}
              </span>
              {t.text}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ============================================================
   Scoring
   ============================================================ */
async function scoreSession(transcript, customer) {
  const turns = transcript
    .map(t => `${t.role === "customer" ? "CUSTOMER" : "SALESPERSON"}: ${t.text}`)
    .join("\n");

  const systemPrompt = `You are the senior sales coach at Mansam, a luxury Arabian fragrance house.
You just observed a roleplay between a trainee salesperson and a simulated customer (${customer.name}: ${customer.brief}).

Score the trainee on two independent 1–10 scales:
- SALE (can they close?): needs discovery, product knowledge, storytelling, objection handling, close/upsell
- SERVICE (does the customer feel cared for?): warmth, cultural register, active listening, patience, language

Brand context:
${MANSAM_KB}

Return ONLY valid minified JSON, no prose, no code fences. Schema:
{
 "saleScore": number 1-10,
 "serviceScore": number 1-10,
 "message": string — 1-2 sentence warm, motivating headline,
 "highlights": [string, string, string] — 3 specific strong moments from the transcript,
 "growth": [ { "what": string, "suggested": string } ] — 2 growth areas, each with a concrete better phrase
}

IMPORTANT: Never shame. Always find something to praise. If the transcript is short or sparse, base scores around 5-6 and note that more practice time will help.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: `Here is the transcript. Score it now and return JSON only.\n\n${turns || "(No conversation happened — salesperson did not engage.)"}`
        }]
      })
    });
    const data = await res.json();
    const raw = (data.content || [])
      .filter(b => b.type === "text").map(b => b.text).join("")
      .replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    const sale = clamp(parsed.saleScore, 1, 10);
    const service = clamp(parsed.serviceScore, 1, 10);
    const points = 10 + (sale + service) * 5;

    return {
      saleScore: sale, serviceScore: service, points,
      message: parsed.message || "Good session — every round builds the muscle.",
      highlights: parsed.highlights || [],
      growth: parsed.growth || [],
    };
  } catch (err) {
    console.error("scoring failed", err);
    return {
      saleScore: 5, serviceScore: 5, points: 60,
      message: "We couldn't fully score this session, but showing up is the hardest part. Try again.",
      highlights: ["You showed up and engaged the customer."],
      growth: [{ what: "Connection issue during scoring.", suggested: "Try another session — the coach will score fully next time." }],
    };
  }
}

function clamp(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(x)));
}

/* ============================================================
   Screen 3 — Debrief
   ============================================================ */
function DebriefScreen({ result, totalPoints, sessionCount, history, onAgain, onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen px-6 py-12 max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }} className="text-center"
      >
        <div className="text-[11px] uppercase tracking-[0.5em] text-[#c9a77a] mb-4">
          Session Complete · {result.customer}
        </div>
        <h2 className="font-serif italic text-[#e8dcc4] mb-2"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>
          {pickCelebration(result.saleScore + result.serviceScore)}
        </h2>
        <p className="text-lg text-[#d4b48a] italic max-w-xl mx-auto mt-4">
          {result.message}
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }} className="mt-12 text-center"
      >
        <div className="text-[10px] uppercase tracking-[0.5em] text-[#8b6a43] mb-2">Points Earned</div>
        <div className="text-8xl font-serif text-[#d4b48a]" style={{ fontFeatureSettings: "'tnum'" }}>
          +{result.points}
        </div>
        <div className="text-[11px] uppercase tracking-[0.4em] text-[#8b6a43] mt-2">
          Cumulative {totalPoints} · {sessionCount} session{sessionCount === 1 ? "" : "s"}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }} className="mt-10 grid grid-cols-2 gap-5"
      >
        <ScoreCard label="Sale" value={result.saleScore} />
        <ScoreCard label="Service" value={result.serviceScore} />
      </motion.div>

      {result.highlights && result.highlights.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }} className="mt-10"
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#c9a77a] mb-3">What You Did Well</div>
          <div className="space-y-3">
            {result.highlights.map((h, i) => (
              <div key={i} className="flex gap-3 text-[#e8dcc4]/90 text-sm leading-relaxed">
                <span className="text-[#d4b48a] mt-0.5">✦</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {result.growth && result.growth.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }} className="mt-8"
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#c9a77a] mb-3">Grow Here Next</div>
          <div className="space-y-4">
            {result.growth.map((g, i) => (
              <div key={i} className="border-l-2 border-[#8b6a43] pl-4">
                <div className="text-sm text-[#e8dcc4]/90">{g.what}</div>
                {g.suggested && (
                  <div className="text-sm italic text-[#d4b48a] mt-1">
                    Try: "{g.suggested}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {history.length > 1 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }} className="mt-10"
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#c9a77a] mb-3">Your Journey</div>
          <Sparkline history={history} />
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3 }} className="mt-12 flex flex-col gap-3"
      >
        <button
          onClick={onAgain}
          className="w-full bg-[#c9a77a] hover:bg-[#d4b48a] text-[#0a0604] font-serif uppercase tracking-[0.3em] text-sm py-5 transition-colors"
        >
          Play Another Round
        </button>
        <button
          onClick={onLogout}
          className="w-full text-[10px] uppercase tracking-[0.4em] text-[#8b6a43] hover:text-[#c9a77a] py-3"
        >
          Log out
        </button>
      </motion.div>
    </motion.div>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="border border-[#8b6a43]/40 bg-[#1a120a]/40 backdrop-blur p-6 text-center">
      <div className="text-[10px] uppercase tracking-[0.4em] text-[#8b6a43] mb-2">{label}</div>
      <div className="text-6xl font-serif text-[#e8dcc4]" style={{ fontFeatureSettings: "'tnum'" }}>
        {value}<span className="text-2xl text-[#8b6a43]">/10</span>
      </div>
      <div className="mt-3 h-1 bg-[#3d2a14] overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#8b6a43] to-[#d4b48a]"
             style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

function Sparkline({ history }) {
  const pts = history.slice(-10);
  const max = 20;
  const w = 600, h = 80, pad = 8;
  const step = (w - pad * 2) / Math.max(1, pts.length - 1);
  const points = pts.map((p, i) => {
    const v = (p.saleScore || 0) + (p.serviceScore || 0);
    const x = pad + i * step;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y];
  });
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  return (
    <div className="border border-[#8b6a43]/40 bg-[#1a120a]/40 p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
        <path d={path} fill="none" stroke="#d4b48a" strokeWidth="2" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#d4b48a" />
        ))}
      </svg>
      <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] text-[#8b6a43] mt-2">
        <span>{pts.length} sessions</span>
        <span>Sale + Service combined</span>
      </div>
    </div>
  );
}

function pickCelebration(combined) {
  if (combined >= 17) return "Extraordinary.";
  if (combined >= 14) return "Beautifully played.";
  if (combined >= 10) return "Strong effort.";
  if (combined >= 6) return "You showed up.";
  return "Every master started here.";
}
