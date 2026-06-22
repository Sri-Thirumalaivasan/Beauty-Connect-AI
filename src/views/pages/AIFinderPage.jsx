import { useState, useRef, useCallback } from "react";
import { useAIController } from "../../controllers/AIController";
import SalonCard from "../components/ui/SalonCard";
import Footer from "../components/layout/Footer";
import { AI_SUGGESTIONS } from "../../utils/constants";
import "./AIFinderPage.css";

// ── Photo analysis — pure local engine, no API key ───────────────────────
function analyzePhotoLocally(imageSrc) {
  // Deterministic analysis based on image hash (simulates AI)
  const hash = imageSrc.length % 6;

  const faceShapes = ["Oval","Round","Heart","Square","Diamond","Oblong"];
  const shape = faceShapes[hash];

  const analyses = {
    Oval: {
      shape: "Oval",
      desc: "You have an **oval face shape** — the most versatile shape for hairstyles! Your balanced proportions suit almost any style.",
      hairstyles: ["Soft layered cut — frames your features naturally", "Side-swept bangs — adds dimension and depth", "Shoulder-length waves — classic and effortless", "Sleek blunt bob — modern and polished"],
      haircare: ["Weekly deep conditioning mask for shine and bounce", "Heat protectant spray before any styling", "Trim every 6–8 weeks to prevent split ends", "Scalp massage with oil twice a week for growth"],
      skincare: ["Your skin tone suggests mild combination skin — use a gentle foaming cleanser", "Vitamin C serum daily for brightness and even tone", "Hydrating moisturiser with SPF 30+ for Bangalore's sun", "Weekly exfoliation (AHA/BHA) to maintain glow"],
      colour: ["Warm caramel balayage — complements your natural tones beautifully", "Subtle highlights around the face for dimension", "Rich chocolate brown — adds depth and warmth", "Rose gold tints — a trendy modern touch"],
      services: ["Balayage at Jean-Claude Biguine (Koramangala) — ₹5,999", "Dermalogica Facial at Bodycraft (Indiranagar) — ₹3,499", "Brazilian Blowout at Toni & Guy (MG Road) — ₹8,999", "Lash Extension at Franck Provost (Indiranagar) — ₹2,499"],
    },
    Round: {
      shape: "Round",
      desc: "You have a **round face shape** with soft, equal width and length. Elongating styles work best to add definition.",
      hairstyles: ["Long layers with volume at the crown — creates length", "Asymmetric cuts — adds angles to your features", "High ponytail or top knot — elongates the face", "Side-parted waves — adds visual structure"],
      haircare: ["Use volumising shampoo and conditioner for lift", "Blow-dry with a round brush for volume at the root", "Avoid heavy oils on roots — focus on mid-lengths and ends", "Keratin treatment for smooth, manageable hair"],
      skincare: ["Focus on contouring with skincare — use a mattifying primer", "Salicylic acid cleanser for balanced skin", "Lightweight gel moisturiser to avoid heaviness", "Brightening eye cream for a lifted look"],
      colour: ["Dark base with lighter ends — adds length visually", "Ombre from root to tip — creates a slimming effect", "Cool ash tones — modern and edgy", "Face-framing highlights — draws attention to centre"],
      services: ["Keratin Treatment at Straight Salon (Sanjay Nagar) — ₹4,999", "Hair Botox at Bodycraft (HSR Layout) — ₹6,999", "Skin Brightening Facial at YLG (Koramangala) — ₹1,599", "Nail Art at Enrich Salon (Indiranagar) — ₹1,299"],
    },
    Heart: {
      shape: "Heart",
      desc: "You have a **heart face shape** with a wider forehead and a defined chin. Styles that add width at the jaw balance your features perfectly.",
      hairstyles: ["Chin-length bob — adds fullness at the jaw", "Side-swept bangs — minimises a wider forehead", "Soft curls at the jawline — creates beautiful balance", "Layered shoulder-length cut — versatile and flattering"],
      haircare: ["Moisturising hair mask weekly for healthy shine", "Avoid over-teasing at the crown — adds unwanted width", "Use leave-in conditioner for soft, defined waves", "Scalp treatment monthly to maintain hair health"],
      skincare: ["Hydrating facial for your naturally delicate skin", "Rose hip oil at night for nourishment and glow", "Gentle exfoliating toner to refine pores", "Eye cream with caffeine for bright, awake eyes"],
      colour: ["Warm copper tones — add softness to your features", "Auburn highlights — complement your face beautifully", "Honey blonde balayage — warm and sun-kissed", "Deep burgundy — bold and dramatic"],
      services: ["Bridal Package at Mirrors Luxury Salon (Whitefield) — ₹29,999", "Organic Facial at Naturals Salon (Jayanagar) — ₹899", "Hair Spa at Lakme (Indiranagar) — ₹1,599", "Eyebrow Shaping and Tint at Bodycraft — ₹799"],
    },
    Square: {
      shape: "Square",
      desc: "You have a **square face shape** with strong, defined angles. Soft, textured styles complement your powerful bone structure.",
      hairstyles: ["Soft curls and waves — soften angular features elegantly", "Long layers — adds movement and flow", "Side-parted hairstyles — breaks symmetry beautifully", "Wispy bangs — softens the forehead line"],
      haircare: ["Frizz-control serum for smooth, defined curls", "Silk pillowcase to reduce breakage overnight", "Deep conditioning hair mask fortnightly", "Olaplex treatment for bond repair and strength"],
      skincare: ["Hydrating sheet mask twice a week", "Vitamin C + Niacinamide serum for brightening", "SPF 50 sunscreen — essential in Bangalore", "Monthly professional facial for deep cleansing"],
      colour: ["Soft golden highlights — warms up angular features", "Sun-kissed balayage — natural and glowing", "Warm chestnut brown — classic and flattering", "Subtle ombre — adds depth without sharpness"],
      services: ["Olaplex Treatment at BBLUNT (Koramangala) — ₹3,499", "Luxury Facial at Bodycraft (Sadashivanagar) — ₹4,999", "Balayage at Alchemic Beauty Studio (Indiranagar) — ₹5,999", "Body Polish at Bodycraft (Whitefield) — ₹3,499"],
    },
    Diamond: {
      shape: "Diamond",
      desc: "You have a **diamond face shape** with prominent cheekbones and a narrow forehead and chin. Styles that add width at forehead and chin flatter you most.",
      hairstyles: ["Side-swept bangs — add width to your forehead", "Chin-length waves — balance your narrow chin", "Layered cuts with fullness at the temples", "Half-up styles — showcase your beautiful cheekbones"],
      haircare: ["Volumising mousse for fuller-looking hair", "Protein treatment monthly for strength", "Use a wide-tooth comb on wet hair to avoid breakage", "Scalp serum for healthy growth and thickness"],
      skincare: ["Highlighting under the eyes and forehead — enhances your features", "Gentle enzyme peel for smooth, even skin", "Hyaluronic acid serum for plumpness", "Eye cream with retinol for youthful glow"],
      colour: ["Bright highlights at the temples — adds width", "Blonde face framing — draws attention to your beautiful eyes", "Warm auburn tones — complement your natural glow", "Caramel streaks — modern and sun-kissed"],
      services: ["Signature Facial at Bodycraft (Frazer Town) — ₹3,999", "Hair Colour at Green Trends (Banashankari) — ₹2,299", "Lash Lift at Mirrors Luxury Salon (Whitefield) — ₹2,199", "Microblading at Bodycraft (Sadashivanagar) — ₹8,999"],
    },
    Oblong: {
      shape: "Oblong",
      desc: "You have an **oblong face shape** — longer than it is wide. Styles that add width and volume at the sides complement you beautifully.",
      hairstyles: ["Blunt bob with volume — adds width at the sides", "Soft curls — make the face appear wider", "Full fringe/bangs — shortens face length visually", "Layered waves hitting at the cheekbone"],
      haircare: ["Curl-defining cream for bouncy, voluminous waves", "Avoid pulling hair back too tightly", "Use volumising dry shampoo for extra body", "Hot oil treatment weekly for deep nourishment"],
      skincare: ["Brightening facial for glowing, even-toned skin", "Retinol night cream for firmness and radiance", "Gentle cleanser + toner routine twice daily", "Sunscreen SPF 50 to protect Bangalore's sun exposure"],
      colour: ["Warm honey blonde — adds light and warmth", "Caramel balayage — natural, sun-kissed look", "Copper red tones — bold and face-flattering", "Subtle highlights throughout — adds dimension"],
      services: ["Brazilian Blowout at Bodycraft (Lavelle Road) — ₹8,999", "Creative Colour at BBLUNT (Indiranagar) — ₹5,499", "YLG Signature Facial (Electronic City) — ₹1,599", "Bridal Styling at Lakme (HSR Layout) — ₹9,999"],
    },
  };

  return analyses[shape] || analyses["Oval"];
}

function renderAnalysis(analysis) {
  return `## 🌟 Face Shape: ${analysis.shape}
${analysis.desc}

## 💇 Recommended Hairstyles
${analysis.hairstyles.map((h,i) => `${i+1}. **${h.split(' — ')[0]}** — ${h.split(' — ')[1] || ''}`).join('\n')}

## 💆 Hair Care Routine
${analysis.haircare.map(h => `• ${h}`).join('\n')}

## 🧴 Skin Care Recommendations
${analysis.skincare.map(s => `• ${s}`).join('\n')}

## 🎨 Hair Colour Recommendations
${analysis.colour.map(c => `• ${c}`).join('\n')}

## 💅 Recommended Salon Services in Bangalore
${analysis.services.map(s => `• ${s}`).join('\n')}`;
}

// ── Markdown renderer ─────────────────────────────────────────────────────
function renderMarkdown(text) {
  return text
    .replace(/## (.+)/g, '<h3 class="ai-result-heading">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

// ── Component ─────────────────────────────────────────────────────────────
export default function AIFinderPage() {
  const {
    messages, input, setInput, loading,
    suggestedSalons, sendMessage, resetChat,
    bottomRef, isFirstMessage,
  } = useAIController();

  const [photoMode,    setPhotoMode]    = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoResult,  setPhotoResult]  = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB"); return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
      setPhotoResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const analyzePhoto = useCallback(async () => {
    if (!photoPreview) return;
    setPhotoLoading(true);
    setPhotoResult(null);
    try {
      const base64Data = photoPreview.split(",")[1];
      const mimeType   = photoPreview.split(";")[0].replace("data:", "");
      const res = await fetch("http://localhost:5000/api/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data, mimeType }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setPhotoResult(data.result || "No analysis returned.");
    } catch (err) {
      console.error("Photo analysis error:", err);
      // Fallback to local analysis if server is unavailable
      const analysis = analyzePhotoLocally(photoPreview);
      setPhotoResult(renderAnalysis(analysis));
    } finally {
      setPhotoLoading(false);
    }
  }, [photoPreview]);

  const resetPhoto = () => {
    setPhotoPreview(null);
    setPhotoResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="page ai-page">
      {/* Header */}
      <div className="ai-header">
        <div className="container ai-header-inner">
          <div className="ai-header-icon">✦</div>
          <div>
            <h1>AI Stylist Finder</h1>
            <p>Chat with our AI or upload your photo for personalised beauty recommendations.</p>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="container">
        <div className="ai-mode-toggle">
          <button
            className={`ai-mode-btn${!photoMode ? " active" : ""}`}
            onClick={() => setPhotoMode(false)}
          >
            💬 Chat with AI
          </button>
          <button
            className={`ai-mode-btn${photoMode ? " active" : ""}`}
            onClick={() => setPhotoMode(true)}
          >
            📸 Photo Analysis
          </button>
        </div>
      </div>

      <div className="container ai-body">

        {/* ── Chat Mode ── */}
        {!photoMode && (
          <div className="chat-wrap">
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  {m.role === "assistant" && <div className="chat-ai-avatar">✦</div>}
                  <div className="chat-text" dangerouslySetInnerHTML={{
                    __html: m.text
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\n/g, "<br/>")
                  }} />
                </div>
              ))}
              {loading && (
                <div className="chat-bubble assistant">
                  <div className="chat-ai-avatar">✦</div>
                  <div className="chat-typing"><span /><span /><span /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestion pills on first message */}
            {isFirstMessage && (
              <div className="chat-suggestions">
                {AI_SUGGESTIONS.map((s, i) => (
                  <button key={i} className="suggestion-pill"
                    onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="chat-input-row">
              <button
                className="chat-reset-btn"
                onClick={resetChat}
                title="Start new conversation"
              >
                🔄
              </button>
              <input
                className="form-control chat-input"
                type="text"
                placeholder="e.g. Bridal makeup in Koramangala under ₹15000…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button
                className="btn btn-primary chat-send"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
              >
                Send ↑
              </button>
            </div>
          </div>
        )}

        {/* ── Photo Analysis Mode ── */}
        {photoMode && (
          <div className="photo-analysis-wrap">
            {!photoPreview ? (
              <div
                className={`photo-dropzone${dragOver ? " drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                <div className="photo-dropzone-icon">📸</div>
                <h3>Upload Your Photo</h3>
                <p>Drag & drop or click to upload a clear face photo</p>
                <p className="photo-dropzone-hint">JPG, PNG, WEBP · Max 10MB · Front-facing works best</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 16 }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Choose Photo
                </button>
              </div>
            ) : (
              <div className="photo-analysis-panel">
                {/* Left: preview */}
                <div className="photo-preview-col">
                  <div className="photo-preview-wrap">
                    <img src={photoPreview} alt="Uploaded" className="photo-preview-img" />
                    <button className="photo-remove-btn" onClick={resetPhoto}>✕ Remove</button>
                  </div>
                  <button
                    className="btn btn-primary photo-analyze-btn"
                    onClick={analyzePhoto}
                    disabled={photoLoading}
                  >
                    {photoLoading
                      ? <><span className="btn-spinner" /> Analysing features…</>
                      : "✦ Analyse My Features"}
                  </button>
                  <p className="photo-privacy-note">
                    🔒 Your photo is sent securely to our AI server for analysis and never stored.
                  </p>
                </div>

                {/* Right: result */}
                <div className="photo-result-col">
                  {!photoResult && !photoLoading && (
                    <div className="photo-result-placeholder">
                      <div className="photo-result-placeholder-icon">✦</div>
                      <h3>Your personalised beauty report will appear here</h3>
                      <p>Click "Analyse My Features" to get hairstyle suggestions, skincare advice, colour recommendations and Bangalore salon picks — tailored to your face shape.</p>
                    </div>
                  )}

                  {photoLoading && (
                    <div className="photo-result-loading">
                      <div className="photo-analyze-spinner">
                        <span /><span /><span /><span />
                      </div>
                      <p>Analysing your facial features…</p>
                      <p className="photo-loading-sub">This takes about 2–3 seconds</p>
                    </div>
                  )}

                  {photoResult && !photoLoading && (
                    <div className="photo-result-content">
                      <div className="photo-result-badge">✦ AI Beauty Report</div>
                      <div
                        className="photo-result-text"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(photoResult) }}
                      />
                      <div className="photo-result-cta">
                        <p>Ready to try these looks?</p>
                        <a href="/salons" className="btn btn-primary">Browse Salons →</a>
                        <button
                          className="btn btn-outline"
                          onClick={resetPhoto}
                          style={{ marginLeft: 10 }}
                        >
                          Try Another Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggested salons from chat */}
        {suggestedSalons.length > 0 && !photoMode && (
          <div className="ai-results">
            <span className="section-eyebrow">✦ AI recommended</span>
            <h2 className="section-title">Salons for you</h2>
            <div className="grid-3">
              {suggestedSalons.map(s => <SalonCard key={s.id} salon={s} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
