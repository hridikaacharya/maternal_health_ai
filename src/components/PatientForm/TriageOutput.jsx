import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { riskToElevation } from '../../services/clinicalEngine';
import { colors, radius } from '../../theme/nativeTheme';

const RISK_META = {
  'LOW RISK': { icon: 'shield', backgroundColor: '#e3f0e7', color: colors.low, label: 'Low Risk' },
  URGENT: { icon: 'alert-triangle', backgroundColor: '#faebd3', color: colors.urgent, label: 'Urgent' },
  EMERGENCY: { icon: 'alert-circle', backgroundColor: '#f9e4e1', color: colors.danger, label: 'Emergency' },
};

export default function TriageOutput({ assessment, translation, isProcessing, error, onRestart }) {
  const [lang, setLang] = useState('en');
  if (!assessment) return null;

  const meta = RISK_META[assessment.riskLevel] || RISK_META['LOW RISK'];
  const isEscalated = assessment.riskLevel !== 'LOW RISK';
  const elevation = riskToElevation(assessment.riskLevel);

  return (
    <View>
      <View style={[styles.banner, { backgroundColor: meta.backgroundColor }]}>
        <Feather name={meta.icon} size={30} color={meta.color} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.resultLevel, { color: meta.color }]}>{meta.label}</Text>
          <Text style={styles.resultAction}>{assessment.action}</Text>
        </View>
      </View>

      <View style={styles.band}>
        <View style={[styles.marker, { left: `${elevation}%` }]} />
      </View>
      <View style={styles.bandLabels}>
        <Text style={styles.bandLabel}>Valley - safe</Text>
        <Text style={styles.bandLabel}>Tree line - caution</Text>
        <Text style={styles.bandLabel}>Summit - seek care now</Text>
      </View>

      <View style={styles.reasonCard}>
        <Text style={styles.reasonLabel}>Why this result</Text>
        <Text style={styles.reasonText}>{assessment.reason}</Text>
        <Text style={styles.ruleId}>{assessment.ruleId}</Text>
      </View>

      {isEscalated ? <Text style={styles.logged}>This assessment was automatically logged to the FCHV monitoring dashboard.</Text> : null}

      <View style={styles.translationPanel}>
        <View style={styles.translationHeader}>
          <Text style={styles.translationTitle}>
            <Feather name="globe" size={15} color={colors.text} /> Explain this in plain language
          </Text>
          {translation ? (
            <View style={styles.langToggle}>
              <Pressable onPress={() => setLang('en')} style={[styles.langButton, lang === 'en' && styles.langButtonActive]}>
                <Text style={[styles.langButtonText, lang === 'en' && styles.langButtonTextActive]}>English</Text>
              </Pressable>
              <Pressable onPress={() => setLang('ne')} style={[styles.langButton, lang === 'ne' && styles.langButtonActive]}>
                <Text style={[styles.langButtonText, lang === 'ne' && styles.langButtonTextActive]}>नेपाली</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {isProcessing && !translation && !error ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.brand} />
            <Text style={styles.loadingText}>Preparing a clear explanation...</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {translation ? (
          <Text style={[styles.translationText, lang === 'ne' && styles.translationTextNe]}>
            {lang === 'en' ? translation.english : translation.nepali || 'Nepali translation unavailable for this response - English shown instead.'}
          </Text>
        ) : null}
      </View>

      <Pressable onPress={onRestart} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
        <Feather name="refresh-cw" size={16} color={colors.text} />
        <Text style={styles.secondaryButtonText}>Start a new assessment</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 18, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 },
  resultLevel: { fontWeight: '900', fontSize: 20, marginBottom: 4 },
  resultAction: { color: colors.text, lineHeight: 20, fontWeight: '700' },
  band: { height: 18, borderRadius: 999, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, marginTop: 6, marginBottom: 6, position: 'relative', overflow: 'hidden' },
  marker: { position: 'absolute', top: -5, width: 16, height: 28, marginLeft: -8, borderRadius: 999, backgroundColor: colors.brand },
  bandLabels: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 16 },
  bandLabel: { flex: 1, color: colors.textFaint, fontSize: 11, lineHeight: 15 },
  reasonCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, marginBottom: 16 },
  reasonLabel: { color: colors.textFaint, textTransform: 'uppercase', fontWeight: '800', fontSize: 11, letterSpacing: 0.8, marginBottom: 8 },
  reasonText: { color: colors.text, lineHeight: 22, marginBottom: 10 },
  ruleId: { color: colors.textFaint, fontSize: 11, fontWeight: '800' },
  logged: { backgroundColor: '#e3f0e7', color: colors.low, borderRadius: 14, padding: 12, fontWeight: '700', marginBottom: 16, lineHeight: 20 },
  translationPanel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, marginBottom: 16 },
  translationHeader: { gap: 10, marginBottom: 10 },
  translationTitle: { color: colors.text, fontWeight: '800', flexDirection: 'row', alignItems: 'center', gap: 6 },
  langToggle: { flexDirection: 'row', gap: 8 },
  langButton: { borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt },
  langButtonActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  langButtonText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  langButtonTextActive: { color: '#fff' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  loadingText: { color: colors.textSoft },
  errorText: { color: colors.danger, fontWeight: '700', lineHeight: 20 },
  translationText: { color: colors.text, lineHeight: 23, fontSize: 15 },
  translationTextNe: { fontSize: 16 },
  secondaryButton: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  secondaryButtonText: { color: colors.text, fontWeight: '800' },
  pressed: { opacity: 0.9 },
});
