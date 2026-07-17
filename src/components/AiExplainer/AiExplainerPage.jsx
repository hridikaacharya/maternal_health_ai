import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GoogleGenAI } from '@google/genai';
import { getAssessmentRecords } from '../../services/storage';
import { colors, radius, shadow } from '../../theme/nativeTheme';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default function AiExplainerPage({ currentUser }) {
  const [promptInput, setPromptInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadLatest = async () => {
      if (currentUser && currentUser.role === 'patient') {
        const stored = await getAssessmentRecords();
        const userHistory = stored.filter((record) => record.userId === currentUser.id);
        if (!cancelled) {
          setLatestAssessment(userHistory[0] || null);
        }
      } else if (!cancelled) {
        setLatestAssessment(null);
      }
    };

    void loadLatest();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  useEffect(() => {
    const name = currentUser?.name || 'Sister';
    const weeksMessage = latestAssessment ? ` I see your last logged checkpoint was at ${latestAssessment.weeksPregnant} weeks.` : '';

    setMessages([
      {
        sender: 'ai',
        text: `Namaste ${name}! I am your Sathi AI Companion.${weeksMessage} Ask me to explain your triage results, clarify pregnancy symptoms, or translate medical terms into simple terms.`,
      },
    ]);
  }, [currentUser, latestAssessment]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd?.({ animated: true });
  }, [messages, isLoading]);

  const headerStatus = useMemo(() => {
    if (!currentUser) return 'No session active. Standard mode only.';
    return `${currentUser.name} (${latestAssessment ? `${latestAssessment.weeksPregnant} Weeks` : 'No assessment submitted yet'})`;
  }, [currentUser, latestAssessment]);

  const handleSendMessage = async () => {
    if (!promptInput.trim() || isLoading) return;

    const userQuery = promptInput.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setPromptInput('');
    setIsLoading(true);

    try {
      const name = currentUser?.name || 'Gita Rai';
      const weeksPregnant = latestAssessment?.weeksPregnant || 'Not specified';
      const riskLevel = latestAssessment?.riskLevel || 'LOW RISK';
      const symptoms = latestAssessment?.symptoms?.length > 0 ? latestAssessment.symptoms.join(', ') : 'None reported';
      const clinicalAction = latestAssessment?.action || 'Continue routine prenatal care.';
      const clinicalReason = latestAssessment?.reason || 'Parameters fall within baseline bounds.';

      const systemInstruction = `You are a compassionate, context-aware bilingual maternal health assistant in Nepal.
Your primary role is to provide empathetic explanation and translation of clinical feedback.

--- CACHED CLINICAL PROFILE (FROM LOCAL STORAGE) ---
- Patient Name: ${name}
- Gestational Progress: ${weeksPregnant} Weeks
- Latest Automated Triage Risk: ${riskLevel}
- Logged Symptoms: ${symptoms}
- Prescribed Next Step: ${clinicalAction}
- Reason for Flag: ${clinicalReason}
--------------------------------------------------

CRITICAL PROTOCOLS:
1. Always align your advice with the clinical snapshot above.
2. Keep the conversation focused on maternal health.
3. If triage is High Risk or Urgent, strongly reinforce: "${clinicalAction}".
4. Return exactly two sections: ENGLISH EXPLANATION and नेपाली विवरण.`;

      if (!ai) {
        throw new Error('Missing Gemini API key');
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `${systemInstruction}\n\nUser Query: ${userQuery}`,
      });

      setMessages((prev) => [...prev, { sender: 'ai', text: response.text }]);
    } catch (error) {
      console.error('Gemini Explainer Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to reach Sathi translate services. Please check your network or API key configuration.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}><Feather name="star" size={20} color="#2563EB" /> Sathi AI Explainer</Text>
          <Text style={styles.headerSubtitle}>Model: gemini-3.5-flash · Mode: Shared Cache Triage Integration</Text>
        </View>
        <View style={styles.statusPill}><Text style={styles.statusPillText}>SYNCED ACTIVE PIPELINE</Text></View>
      </View>

      <View style={styles.matchBar}>
        <Text style={styles.matchText}><Feather name="shield" size={16} color="#15803D" /> <Text style={styles.matchBold}>Database Match:</Text> {headerStatus}</Text>
        {latestAssessment ? <View style={[styles.triageBadge, { backgroundColor: `${latestAssessment.color}20` }]}><Text style={[styles.triageBadgeText, { color: latestAssessment.color }]}>Triage: {latestAssessment.riskLevel}</Text></View> : null}
      </View>

      <View style={styles.guardrailBar}>
        <Feather name="alert-triangle" size={16} color="#991B1B" />
        <Text style={styles.guardrailText}><Text style={styles.matchBold}>Clinical Guardrail:</Text> Generative models explain cached clinical logs. They are restricted from overriding deterministic rule engines.</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.messagesWrap} contentContainerStyle={styles.messagesContent} onContentSizeChange={() => scrollRef.current?.scrollToEnd?.({ animated: true })}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.aiText]}>{msg.text}</Text>
          </View>
        ))}
        {isLoading ? (
          <View style={styles.loadingBubble}>
            <ActivityIndicator color={colors.brand} />
            <Text style={styles.loadingText}>Reading local triage snapshot...</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask about your logged symptoms or request a translation..."
          placeholderTextColor={colors.textFaint}
          value={promptInput}
          onChangeText={setPromptInput}
          editable={!isLoading}
        />
        <Pressable onPress={handleSendMessage} disabled={isLoading || !promptInput.trim()} style={({ pressed }) => [styles.sendButton, (isLoading || !promptInput.trim()) && styles.disabled, pressed && styles.pressed]}>
          <Feather name="send" size={16} color="#fff" />
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignSelf: 'center', width: '100%', maxWidth: 760, minHeight: 680, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadow },
  header: { padding: 18, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: '#F8FAFC', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.text, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerSubtitle: { marginTop: 4, fontSize: 12, color: colors.textFaint },
  statusPill: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statusPillText: { color: '#1D4ED8', fontWeight: '900', fontSize: 11 },
  matchBar: { backgroundColor: '#F0FDF4', padding: 12, borderBottomWidth: 1, borderBottomColor: '#BBF7D0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  matchText: { color: '#166534', flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchBold: { fontWeight: '900' },
  triageBadge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  triageBadgeText: { fontWeight: '900', fontSize: 10 },
  guardrailBar: { backgroundColor: '#FEF2F2', padding: 12, borderBottomWidth: 1, borderBottomColor: '#FECACA', flexDirection: 'row', gap: 10, alignItems: 'center' },
  guardrailText: { color: '#991B1B', flex: 1, lineHeight: 19, fontSize: 12 },
  messagesWrap: { flex: 1 },
  messagesContent: { padding: 16, gap: 12 },
  messageBubble: { maxWidth: '85%', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, ...shadow },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.brand },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  messageText: { lineHeight: 21, fontSize: 14 },
  userText: { color: '#fff' },
  aiText: { color: colors.text },
  loadingBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { color: colors.textFaint, fontSize: 13 },
  inputRow: { padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: '#fff', flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: { flex: 1, minHeight: 48, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceAlt, paddingHorizontal: 14, color: colors.text },
  sendButton: { minHeight: 48, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  sendButtonText: { color: '#fff', fontWeight: '800' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.9 },
});
