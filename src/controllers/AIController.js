import { useState, useCallback, useEffect, useRef } from "react";
import { getAIRecommendation, resetAIContext } from "../services/api/aiService";
import { fetchSalons } from "../services/firebase/salonService";

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hi! I'm Glamr AI ✦\n\nTell me what beauty service you're looking for — your budget, area in Bangalore, or occasion — and I'll find your perfect salon.\n\nYou can say something like:\n*\"Keratin treatment in Koramangala under ₹4000\"*",
};

export function useAIController() {
  const [messages,        setMessages]        = useState([INITIAL_MESSAGE]);
  const [input,           setInput]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [salons,          setSalons]          = useState([]);
  const [suggestedSalons, setSuggestedSalons] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchSalons().then(setSalons).catch(() => {});
    resetAIContext();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      // Include the current user message in history for full context
      const history = [...messages, { role: "user", text: msg }]
        .map(m => ({ role: m.role, content: m.text }));
      const reply = await getAIRecommendation({ userMessage: msg, salons, history });

      setMessages(prev => [...prev, { role: "assistant", text: reply }]);

      const mentioned = salons.filter(s =>
        reply.toLowerCase().includes(s.name.toLowerCase()) ||
        reply.toLowerCase().includes(s.area.toLowerCase())
      ).slice(0, 3);

      if (mentioned.length > 0) setSuggestedSalons(mentioned);

    } catch (err) {
      console.error("AI error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Sorry, I couldn't process that. Please try again! 😊",
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, salons]);

  const resetChat = useCallback(() => {
    resetAIContext();
    setMessages([INITIAL_MESSAGE]);
    setSuggestedSalons([]);
    setInput("");
  }, []);

  return {
    messages, input, setInput,
    loading, suggestedSalons,
    sendMessage, resetChat,
    bottomRef,
    isFirstMessage: messages.length <= 1,
  };
}