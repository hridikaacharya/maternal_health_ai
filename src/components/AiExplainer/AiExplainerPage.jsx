import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key is missing! Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export default function AiExplainerPage({ currentUser }) {
  const [promptInput, setPromptInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState(null);

  // Load the latest assessment for this specific logged-in user from the shared local cache
  useEffect(() => {
    if (currentUser && currentUser.role === "patient") {
      try {
        const stored = JSON.parse(
          localStorage.getItem("sathi_assessments") || "[]",
        );
        // Filter the shared assessments log to get only this user's records
        const userHistory = stored.filter(
          (record) => record.userId === currentUser.id,
        );

        if (userHistory.length > 0) {
          // Since new records are unshifted to the front, index 0 is always the most recent
          setLatestAssessment(userHistory[0]);
        }
      } catch (err) {
        console.error("Error reading shared cache for AI Explainer:", err);
      }
    }
  }, [currentUser]);

  // Set the personalized greeting once the profile/history is matched
  useEffect(() => {
    const name = currentUser?.name || "Sister";
    const weeksMessage = latestAssessment
      ? ` I see your last logged checkpoint was at **${latestAssessment.weeksPregnant} weeks**.`
      : "";

    setMessages([
      {
        sender: "ai",
        text: `Namaste ${name}! I am your Sathi AI Companion.${weeksMessage} Ask me to explain your triage results, clarify pregnancy symptoms, or translate medical terms into simple terms.`,
      },
    ]);
  }, [currentUser, latestAssessment]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;

    const userQuery = promptInput;
    setMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setPromptInput("");
    setIsLoading(true);

    try {
      // Deconstruct clinical metrics from the shared profile database
      const name = currentUser?.name || "Gita Rai";
      const weeksPregnant = latestAssessment?.weeksPregnant || "Not specified";
      const riskLevel = latestAssessment?.riskLevel || "LOW RISK";
      const symptoms =
        latestAssessment?.symptoms?.length > 0
          ? latestAssessment.symptoms.join(", ")
          : "None reported";
      const clinicalAction =
        latestAssessment?.action || "Continue routine prenatal care.";
      const clinicalReason =
        latestAssessment?.reason || "Parameters fall within baseline bounds.";

      // System envelope keeping Gemini strictly tied to the cached record
      const systemInstruction = `You are a compassionate, context-aware bilingual maternal health assistant in Nepal.
Your primary role is to provide empathetic explanation and translation of clinical feedback.

--- CACHED CLINICAL PROFILE (FROM LOCALSTORAGE) ---
- Patient Name: ${name}
- Gestational Progress: ${weeksPregnant} Weeks
- Latest Automated Triage Risk: ${riskLevel}
- Logged Symptoms: ${symptoms}
- Prescribed Next Step: ${clinicalAction}
- Reason for Flag: ${clinicalReason}
--------------------------------------------------

CRITICAL PROTOCOLS:
1. Always align your advice with the clinical snapshot above. If the user asks about symptoms or progress, reference their active log of ${weeksPregnant} weeks pregnant.
2. Keep the conversation hyper-focused on maternal health. If they ask unrelated questions, warmly redirect them to pregnancy safety.
3. If their automated triage is High Risk or Urgent, do not diagnose; strongly reinforce the recommended action: "${clinicalAction}".
4. You must split your response into exactly two clean visual sections:
   - SECTION 1: ENGLISH EXPLANATION (Empathetic, jargon-free, supportive)
   - SECTION 2: नेपाली विवरण (Comforting, simple Nepali translated into clear Devanagari script)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${systemInstruction}\n\nUser Query: ${userQuery}`,
      });

      setMessages((prev) => [...prev, { sender: "ai", text: response.text }]);
    } catch (error) {
      console.error("Gemini Explainer Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Unable to reach Sathi translate services. Please check your network or API key configuration.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="wizard-card"
      style={{
        maxWidth: "760px",
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        height: "680px",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--color-border-soft)",
          backgroundColor: "#F8FAFC",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "18px",
            }}
          >
            <Sparkles size={20} style={{ color: "#2563EB" }} /> Sathi AI
            Explainer
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "12px",
              color: "var(--color-ink-faint)",
            }}
          >
            Model: gemini-3.5-flash · Mode: Shared Cache Triage Integration
          </p>
        </div>
        <span
          style={{
            backgroundColor: "#EFF6FF",
            color: "#1D4ED8",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: "bold",
            border: "1px solid #BFDBFE",
          }}
        >
          SYNCED ACTIVE PIPELINE
        </span>
      </div>

      {/* Database Connection Verification Bar */}
      <div
        style={{
          backgroundColor: "#F0FDF4",
          padding: "10px 20px",
          borderBottom: "1px solid #BBF7D0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#166534",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={16} style={{ color: "#15803D" }} />
          <strong>Database Match:</strong>{" "}
          {currentUser ? (
            `${currentUser.name} (${latestAssessment ? `${latestAssessment.weeksPregnant} Weeks` : "No assessment submitted yet"})`
          ) : (
            <em style={{ color: "#B91C1C" }}>
              No session active. Standard mode only.
            </em>
          )}
        </span>
        {latestAssessment && (
          <span
            style={{
              backgroundColor: latestAssessment.color + "20",
              color: latestAssessment.color,
              padding: "2px 8px",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            Triage: {latestAssessment.riskLevel}
          </span>
        )}
      </div>

      {/* Safety Notice */}
      <div
        style={{
          backgroundColor: "#FEF2F2",
          padding: "10px 20px",
          borderBottom: "1px solid #FECACA",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "12px",
          color: "#991B1B",
        }}
      >
        <AlertTriangle size={16} />
        <span>
          <strong>Clinical Guardrail:</strong> Generative models explain cached
          clinical logs. They are restricted from overriding deterministic rule
          engines.
        </span>
      </div>

      {/* Chat Messages Feed */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "14px 18px",
              borderRadius: "12px",
              backgroundColor:
                msg.sender === "user"
                  ? "var(--color-brand)"
                  : "var(--color-surface)",
              color: msg.sender === "user" ? "white" : "var(--color-ink)",
              border:
                msg.sender === "ai"
                  ? "1px solid var(--color-border-soft)"
                  : "none",
              whiteSpace: "pre-line",
              fontSize: "14px",
              lineHeight: "1.5",
              boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
            }}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "12px 18px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "12px",
              border: "1px solid var(--color-border-soft)",
              color: "var(--color-ink-faint)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCw size={14} className="spin" /> Reading local triage
            snapshot...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: "16px",
          borderTop: "1px solid var(--color-border-soft)",
          display: "flex",
          gap: "10px",
          backgroundColor: "white",
        }}
      >
        <input
          type="text"
          className="text-input"
          style={{ flex: 1, margin: 0 }}
          placeholder="Ask about your logged symptoms or request a translation..."
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !promptInput.trim()}
        >
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}
