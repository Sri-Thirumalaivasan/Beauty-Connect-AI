/**
 * SERVICE — Glamr AI Hybrid Engine
 * No API keys needed. Smart context-aware responses using
 * NLP-style keyword detection + salon data matching.
 */

// ── Conversation memory per session ──────────────────────────────────────
let ctx = {
  service: "", area: "", budget: "",
  occasion: "", concern: "", gender: "",
  step: "start", lastTopic: "",
};

function reset() {
  ctx = { service:"", area:"", budget:"", occasion:"", concern:"", gender:"", step:"start", lastTopic:"" };
}

// ── Keyword maps ─────────────────────────────────────────────────────────
const SERVICE_MAP = {
  bridal:      ["bridal","bride","wedding","dulhan","shadi"],
  hair:        ["haircut","hair cut","trim","layers","fringe","bangs","hair"],
  colour:      ["colour","color","balayage","highlights","ombre","tint","dye"],
  keratin:     ["keratin","smoothening","straightening","rebonding","frizz"],
  facial:      ["facial","face","glow","skin","brightening","de-tan","cleanup"],
  spa:         ["spa","massage","body","relaxation","wellness","aromatherapy"],
  nails:       ["nails","nail art","manicure","pedicure","gel nails","extensions"],
  makeup:      ["makeup","make up","party makeup","event","occasion look"],
  men:         ["beard","shave","men","gents","male","grooming"],
  waxing:      ["waxing","wax","threading","eyebrow","upper lip"],
  lashes:      ["lash","eyelash","extension","brow","microblading"],
};

const AREA_MAP = {
  indiranagar:    ["indiranagar","indira nagar","100 feet"],
  koramangala:    ["koramangala","korama"],
  jayanagar:      ["jayanagar","jaya nagar"],
  "mg road":      ["mg road","brigade","lavelle","vittal mallya"],
  whitefield:     ["whitefield","white field","itpl","marathahalli"],
  "hsr layout":   ["hsr","hsr layout","haralur"],
  malleshwaram:   ["malleshwaram","malleswaram"],
  banashankari:   ["banashankari","bsk","bana"],
  "jp nagar":     ["jp nagar","j p nagar","jpnagar"],
  "btm layout":   ["btm","btm layout","bommanahalli"],
  "electronic city":["electronic city","ec","electronics city","ecity"],
  "sadashivanagar":["sadashivanagar","sadashiv nagar","palace road"],
};

const BUDGET_MAP = {
  budget:  ["budget","cheap","affordable","low cost","inexpensive","₹","under 500","under 1000"],
  mid:     ["moderate","mid","medium","reasonable","decent","average"],
  premium: ["premium","luxury","high end","expensive","best","top","elite","₹₹₹"],
};

const CONCERN_MAP = {
  "frizzy hair":    ["frizzy","frizz","puffy hair"],
  "hair fall":      ["hairfall","hair fall","hair loss","thinning"],
  "dandruff":       ["dandruff","flaky","itchy scalp"],
  "acne":           ["acne","pimple","breakout","blemish"],
  "dry skin":       ["dry skin","dry face","dehydrated"],
  "oily skin":      ["oily","oily skin","greasy"],
  "dull skin":      ["dull","dark spots","uneven tone","tan"],
};

// ── Helpers ──────────────────────────────────────────────────────────────
function detect(msg, map) {
  const m = msg.toLowerCase();
  for (const [key, words] of Object.entries(map)) {
    if (words.some(w => m.includes(w))) return key;
  }
  return "";
}

function matchSalons(salons) {
  let list = [...salons];

  if (ctx.area) {
    const filtered = list.filter(s =>
      s.area.toLowerCase().includes(ctx.area.split(" ")[0])
    );
    if (filtered.length > 0) list = filtered;
  }

  if (ctx.service) {
    const svcFiltered = list.filter(s =>
      s.tags.join(" ").toLowerCase().includes(ctx.service) ||
      s.services?.some(sv => sv.name.toLowerCase().includes(ctx.service))
    );
    if (svcFiltered.length > 0) list = svcFiltered;
  }

  if (ctx.budget === "budget") {
    list = list.filter(s => s.priceRange === "₹" || s.priceRange === "₹₹");
  } else if (ctx.budget === "premium") {
    list = list.filter(s => s.priceRange === "₹₹₹" || s.priceRange === "₹₹");
  }

  list.sort((a, b) => b.rating - a.rating);
  return list.slice(0, 3);
}

function buildSalonCard(salon) {
  const topServices = salon.services?.slice(0, 3).map(s => `  • ${s.name} — ₹${s.price}`).join("\n") || "";
  return `**${salon.name}** (${salon.area})
⭐ ${salon.rating} · ${salon.reviewCount} reviews · ${salon.priceRange} · ${salon.openNow ? "🟢 Open now" : "🔴 Closed"}
${topServices}`;
}

function buildRecommendation(salons) {
  const top = matchSalons(salons);
  if (top.length === 0) {
    return `I couldn't find a perfect match for **${ctx.service}** in **${ctx.area}** right now. Try browsing all salons or adjust your area filter.`;
  }

  const serviceLabel = ctx.service || "beauty";
  const areaLabel    = ctx.area    || "Bangalore";
  const budgetLabel  = ctx.budget  ? ` (${ctx.budget})` : "";

  let resp = `✨ Here are my top picks for **${serviceLabel}** in **${areaLabel}**${budgetLabel}:\n\n`;
  top.forEach((s, i) => { resp += `${i + 1}. ${buildSalonCard(s)}\n\n`; });
  resp += `Would you like to know more about any of these salons, check pricing, or look for something else?`;
  return resp;
}

// ── Smart response handler ────────────────────────────────────────────────
function smartReply(msg, salons) {
  const m = msg.toLowerCase().trim();

  // ── Reset ──
  if (["reset","start over","new search","restart"].some(w => m.includes(w))) {
    reset();
    return "Sure! Let's start fresh. 😊\n\nWhat beauty service are you looking for today in Bangalore?";
  }

  // ── Greetings ──
  if (["hi","hello","hey","hii","helo","good morning","good evening","good afternoon","namaste","sup","yo"].some(w => m === w || m.startsWith(w+" "))) {
    return `Hi there! 👋 Welcome to **Glamr AI**!\n\nI'm your personal beauty advisor for Bangalore. Tell me:\n- What service are you looking for? (Haircut, Facial, Bridal, Spa…)\n- Which area of Bangalore?\n- What's your budget?\n\nOr just ask me anything — like *"Best bridal salon in Koramangala"* 💅`;
  }

  // ── Thanks ──
  if (["thank","thanks","thank you","thx","ty"].some(w => m.includes(w))) {
    return "You're welcome! 😊 Feel free to ask anytime. Happy glowing! ✨";
  }

  // ── Help ──
  if (m === "help" || m === "what can you do") {
    return `I can help you with:\n\n💇 **Find salons** by area, service, or budget\n💍 **Bridal packages** and wedding beauty\n✨ **Skincare & facials** recommendations\n💅 **Nail art** and beauty treatments\n🧔 **Men's grooming** salons\n📸 **Photo analysis** — switch to the Photo tab!\n\nJust tell me what you need. For example:\n*"I need a keratin treatment in Indiranagar under ₹3000"*`;
  }

  // ── Detect context from message ──
  const detectedService = detect(m, SERVICE_MAP);
  const detectedArea    = detect(m, AREA_MAP);
  const detectedBudget  = detect(m, BUDGET_MAP);
  const detectedConcern = detect(m, CONCERN_MAP);

  if (detectedService) ctx.service = detectedService;
  if (detectedArea)    ctx.area    = detectedArea;
  if (detectedBudget)  ctx.budget  = detectedBudget;
  if (detectedConcern) ctx.concern = detectedConcern;

  // ── Yes/No handling ──
  if (["yes","yeah","yep","sure","ok","okay","yup"].includes(m)) {
    if (ctx.service && ctx.area) return buildRecommendation(salons);
    if (ctx.service && !ctx.area) return `Great! Which area in Bangalore are you in?\n\n📍 Indiranagar · Koramangala · Jayanagar · MG Road · Whitefield · HSR Layout · Malleshwaram`;
    return "Awesome! What service are you looking for? (Haircut, Facial, Bridal, Spa, Nails, Men's Grooming…)";
  }
  if (["no","nope","nah","not really"].includes(m)) {
    return "No problem! Is there anything else I can help you find? Feel free to ask about salons, services or beauty tips 😊";
  }

  // ── Specific service questions ──
  if (m.includes("price") || m.includes("cost") || m.includes("how much") || m.includes("rate")) {
    const svc = ctx.service || "haircut";
    const prices = {
      haircut:"₹400–₹1,500", keratin:"₹3,000–₹8,000", bridal:"₹8,000–₹45,000",
      facial:"₹800–₹5,000", spa:"₹2,000–₹5,000", nails:"₹300–₹1,800",
      colour:"₹1,500–₹7,000", waxing:"₹500–₹2,000", men:"₹250–₹1,500",
    };
    const price = prices[svc] || "₹500–₹5,000";
    return `The typical price range for **${svc}** in Bangalore is **${price}** depending on the salon tier.\n\n💡 Budget salons (₹) are around ₹300–₹800\n💎 Luxury salons (₹₹₹) can go up to ₹8,000+\n\nWould you like me to find salons within a specific budget?`;
  }

  // ── Specific concern ──
  if (ctx.concern && !ctx.service) {
    const concernReply = {
      "frizzy hair": "For **frizzy hair**, I recommend a **Keratin Treatment** or **Brazilian Blowout**. These last 3–6 months and give smooth, frizz-free results. Shall I find keratin specialists near you?",
      "hair fall":   "For **hair fall**, salon treatments like **Hair Spa**, **Scalp Treatment**, and **Olaplex** can help significantly. Which area are you in?",
      "dandruff":    "For **dandruff**, a professional **Scalp Treatment** or **Anti-Dandruff Hair Spa** would help. These are available at most YLG, Bodycraft and Lakme salons.",
      "acne":        "For **acne-prone skin**, a **Dermalogica Facial** or **Ainhoa Facial** at Bodycraft is excellent. They use skin-specific products. Shall I find one near you?",
      "dry skin":    "For **dry skin**, a **Hydrating Facial** or **Vitamin C Treatment** would work wonders. Naturals Salon and YLG have great organic options.",
      "oily skin":   "For **oily skin**, a **Deep Cleansing Facial** or **Pore Minimising Treatment** is ideal. Which part of Bangalore are you in?",
      "dull skin":   "For **dull skin**, a **Brightening Facial** or **De-Tan Treatment** will give you an instant glow. Bodycraft and Enrich Salon are great options.",
    };
    return concernReply[ctx.concern] || "I understand your concern. Which area in Bangalore are you looking for a salon?";
  }

  // ── Specific service without area ──
  if (ctx.service && !ctx.area) {
    const serviceIntro = {
      bridal:  `💍 Great choice! Bridal packages in Bangalore range from ₹8,000 to ₹45,000 for full-day experiences.\n\nTop bridal salons include **Bodycraft**, **Mirrors Luxury Salon** and **Lakme Salon**.\n\nWhich area are you in?`,
      keratin: `💇 Keratin treatment is perfect for smooth, frizz-free hair — results last 3–6 months!\n\nPricing: ₹3,000–₹8,000 depending on hair length.\n\nWhich area of Bangalore are you in?`,
      facial:  `✨ Facials in Bangalore range from ₹800 (basic) to ₹5,000 (luxury Dermalogica).\n\nTop picks: **Bodycraft** (Dermalogica Facial), **YLG** (Signature Facial), **Naturals** (Organic Facial).\n\nWhich area are you in?`,
      colour:  `🎨 Hair colour services in Bangalore — Global colour from ₹2,000, Balayage from ₹4,500!\n\nBest colourists: **Jean-Claude Biguine**, **BBLUNT**, **Alchemic Beauty Studio**.\n\nWhich area are you in?`,
      spa:     `🧖 Spa treatments are perfect for relaxation! Bodycraft, Mirrors and Franck Provost offer amazing spa experiences.\n\nWhich area are you looking in?`,
      nails:   `💅 Nail art and gel extensions are trending! Prices from ₹300 (basic) to ₹1,800 (nail art).\n\nWhich area are you in?`,
      men:     `🧔 Great! Bangalore has excellent men's grooming salons. BarberCo, Jawed Habib and Green Trends are top picks.\n\nWhich area are you in?`,
      hair:    `💇 Haircuts in Bangalore range from ₹250 to ₹1,800 depending on the salon.\n\nWhich area are you in?`,
    };
    return (serviceIntro[ctx.service] || `I can help you find **${ctx.service}** services in Bangalore!\n\nWhich area are you in?\n\n📍 Indiranagar · Koramangala · Jayanagar · MG Road · Whitefield · HSR Layout`);
  }

  // ── Have service + area → recommend ──
  if (ctx.service && ctx.area) {
    return buildRecommendation(salons);
  }

  // ── Area mentioned but no service ──
  if (ctx.area && !ctx.service) {
    return `Great, you're near **${ctx.area}**! We have several top-rated salons there. 🗺️\n\nWhat service are you looking for?\n\n• 💇 Haircut / Colour / Keratin\n• ✨ Facial / Skin treatment\n• 💅 Nails / Manicure / Pedicure\n• 💍 Bridal makeup\n• 🧖 Spa / Massage\n• 🧔 Men's grooming`;
  }

  // ── Free-form salon search: "show me salons" / "list salons" ──
  if (m.includes("show") || m.includes("list") || m.includes("find") || m.includes("suggest") || m.includes("recommend")) {
    if (salons.length > 0) {
      const top3 = salons.sort((a,b) => b.rating - a.rating).slice(0, 3);
      let resp = `✨ Here are some top-rated salons in Bangalore:\n\n`;
      top3.forEach((s, i) => { resp += `${i+1}. ${buildSalonCard(s)}\n\n`; });
      resp += `Tell me your area or service preference for more specific results! 😊`;
      return resp;
    }
  }

  // ── Trending / popular ──
  if (m.includes("trending") || m.includes("popular") || m.includes("best") || m.includes("top")) {
    if (!ctx.area && !ctx.service) {
      return `🔥 **Trending beauty services in Bangalore right now:**\n\n1. **Keratin Treatment** — Smooth, frizz-free hair (₹3,000–₹8,000)\n2. **Balayage** — Sun-kissed colour effect (₹4,500–₹7,000)\n3. **Hydra Facial** — Deep skin hydration (₹2,500–₹5,000)\n4. **Nail Art** — 3D & chrome nail designs (₹500–₹2,000)\n5. **Bridal Packages** — Full-day luxury experiences\n\nWant to find a salon for any of these services?`;
    }
  }

  // ── Beauty tips ──
  if (m.includes("tip") || m.includes("advice") || m.includes("suggest") || m.includes("routine")) {
    return `✨ **Quick Beauty Tips from Glamr AI:**\n\n💇 **Hair:** Use a heat protectant before styling. Deep condition weekly for frizz control.\n🧴 **Skin:** Double cleanse at night. SPF 30+ is non-negotiable in Bangalore's sun!\n💅 **Nails:** Moisturise your cuticles daily. Use a base coat to prevent yellowing.\n💄 **Makeup:** Primer makes your makeup last longer in Bangalore's humid weather.\n\nWant personalised recommendations? Tell me your area and I'll find the best salon for you! 🌟`;
  }

  // ── Fallback with helpful direction ──
  if (m.length < 4) {
    return "Could you tell me a bit more? For example: *\"Haircut in Koramangala\"* or *\"Bridal makeup near Whitefield\"* 😊";
  }

  return `I'd love to help you find the perfect salon! 😊\n\nCould you share:\n1. **What service** you're looking for? (Haircut, Facial, Bridal, Keratin…)\n2. **Which area** in Bangalore?\n3. **Budget preference?** (Affordable / Premium)\n\nOr just say something like *"Keratin in Indiranagar under ₹4000"* and I'll find you the best options! ✨`;
}

// ── Main export ───────────────────────────────────────────────────────────
export async function getAIRecommendation({ userMessage, salons, history = [] }) {
  // Tiny artificial delay for natural feel
  await new Promise(r => setTimeout(r, 400));
  return smartReply(userMessage, salons);
}

export function resetAIContext() {
  reset();
}
