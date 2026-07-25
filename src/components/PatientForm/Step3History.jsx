import React from 'react';
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '../../theme/nativeTheme';

const CONDITIONS = [
  { key: 'Diabetes', translation: 'diabetes' },
  { key: 'High blood pressure', translation: 'highBloodPressure' },
  { key: 'Anemia', translation: 'anemia' },
  { key: 'Heart condition', translation: 'heartCondition' },
];
  const ANC_OPTIONS = [
  { value: '0', translation: 'zeroVisits' },
  { value: '1', translation: 'oneToThreeVisits' },
  { value: '4', translation: 'fourPlusVisits' },
];

const IRON_OPTIONS = [
  { value: 'yes', translation: 'yes' },
  { value: 'no', translation: 'no' },
  { value: 'unknown', translation: 'notSure' },
];
export default function Step3History({ formData, updateField, toggleCondition, onBack, onSubmit, isProcessing }) {
  const { t } = useTranslation();
  return (
    <View>
      <Text style={styles.title}>
 {t("assessment.history.title")}
</Text>
     <Text style={styles.hint}>
 {t("assessment.history.hint")}
</Text>

      <View style={styles.field}>
        <Text style={styles.label}>
 {t("assessment.history.anc.title")}
</Text>
        <View style={styles.pillRow}>
          {ANC_OPTIONS.map((opt) => (
            <Pressable key={opt.value} onPress={() => updateField({ ancVisits: opt.value })} style={({ pressed }) => [styles.pill, formData.ancVisits === opt.value && styles.pillActive, pressed && styles.pressed]}>
              <Text style={[styles.pillText, formData.ancVisits === opt.value && styles.pillTextActive]}>{t(`assessment.history.anc.${opt.translation}`)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("assessment.history.conditions.title")} <Text style={styles.optional}>{t("assessment.history.conditions.optional")}</Text></Text>
        <View style={styles.chipWrap}>
          {CONDITIONS.map((cond) => (
            <Pressable key={cond.key} onPress={() => toggleCondition(cond.key)} style={({ pressed }) => [styles.chip, formData.conditions.includes(cond.key) && styles.chipActive, pressed && styles.pressed]}>
              <Text style={[styles.chipText, formData.conditions.includes(cond.key) && styles.chipTextActive]}>{t(`assessment.history.conditions.${cond.translation}`)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("assessment.history.iron.title")}</Text>
        <View style={styles.pillRow}>
         {IRON_OPTIONS.map((opt) => (
  <Pressable 
    key={opt.value} 
    onPress={() => updateField({ tookIron: opt.value })} 
    style={({ pressed }) => [
      styles.pill, 
      formData.tookIron === opt.value && styles.pillActive, 
      pressed && styles.pressed
    ]}
  >
    <Text style={[
      styles.pillText, 
      formData.tookIron === opt.value && styles.pillTextActive
    ]}>
      {t(`assessment.history.iron.${opt.translation}`)}
    </Text>
  </Pressable>
))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onBack} disabled={isProcessing} style={({ pressed }) => [styles.secondaryButton, isProcessing && styles.disabled, pressed && styles.pressed]}>
          <Feather name="arrow-left" size={16} color={colors.text} />
          <Text style={styles.secondaryButtonText}>{t("common.back")}</Text>
        </Pressable>
        <Pressable onPress={onSubmit} disabled={isProcessing} style={({ pressed }) => [styles.primaryButton, isProcessing && styles.disabled, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>{isProcessing ? t("common.evaluating") : t("common.generateAssessment")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6 },
  hint: { color: colors.textSoft, marginBottom: 22 },
  field: { marginBottom: 20 },
  label: { color: colors.text, fontWeight: '800', marginBottom: 10, fontSize: 14 },
  optional: { color: colors.textFaint, fontWeight: '500' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { flexGrow: 1, minWidth: '30%', minHeight: 44, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  pillActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  pillText: { color: colors.text, fontWeight: '800' },
  pillTextActive: { color: '#fff' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 14, minHeight: 42, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { color: colors.text, fontWeight: '800' },
  chipTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  secondaryButtonText: { color: colors.text, fontWeight: '800' },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.9 },
});
