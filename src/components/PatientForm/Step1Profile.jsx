import React from 'react';
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { isWeeksValid } from '../../services/clinicalEngine';
import { colors, radius, shadow } from '../../theme/nativeTheme';

export default function Step1Profile({ formData, updateField, onNext }) {
   const { t } = useTranslation();
  const weeks = Number(formData.weeksPregnant) || 0;
  const clampWeeks = (val) => Math.min(42, Math.max(1, val));

  return (
    <View>
      <Text style={styles.title}>
  {t("assessment.profile.title")}
</Text>
      <Text style={styles.hint}>
  {t("assessment.profile.hint")}
</Text>

      <View style={styles.field}>
        <Text style={styles.label}>{t("assessment.profile.weeksPregnant")}</Text>
        <View style={styles.stepper}>
          <Pressable onPress={() => updateField({ weeksPregnant: clampWeeks(weeks - 1) })} style={styles.stepperButton} accessibilityLabel={t("assessment.profile.decreaseWeeks")}>
            <Feather name="minus" size={18} color={colors.text} />
          </Pressable>
          <View style={styles.stepperValue}>
            <Text style={styles.stepperNumber}>{weeks}</Text>
            <Text style={styles.stepperUnit}>{t("assessment.profile.weeks")}</Text>
          </View>
          <Pressable onPress={() => updateField({ weeksPregnant: clampWeeks(weeks + 1) })} style={styles.stepperButton} accessibilityLabel={t("assessment.profile.increaseWeeks")}>
            <Feather name="plus" size={18} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
  {t("assessment.profile.firstPregnancy")}
</Text>
        <View style={styles.pillRow}>
          {['yes', 'no'].map((val) => (
            <Pressable key={val} onPress={() => updateField({ isFirstPregnancy: val })} style={({ pressed }) => [styles.pill, formData.isFirstPregnancy === val && styles.pillActive, pressed && styles.pressed]}>
              <Text style={[styles.pillText, formData.isFirstPregnancy === val && styles.pillTextActive]}>{val === "yes"
  ? t("common.yes")
  : t("common.no")}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
       <Text style={styles.label}>
  {t("assessment.profile.age")}
</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 24"
          placeholderTextColor={colors.textFaint}
          value={formData.age}
          keyboardType="numeric"
          onChangeText={(value) => updateField({ age: value })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
         {t("assessment.profile.bloodPressure")} <Text style={styles.optional}>{t("common.optional")}</Text>
        </Text>
        <View style={styles.bpRow}>
          <TextInput
            style={[styles.input, styles.bpInput]}
            placeholder={t("assessment.profile.systolic")}
            placeholderTextColor={colors.textFaint}
            keyboardType="numeric"
            value={formData.bloodPressureSys}
            onChangeText={(value) => updateField({ bloodPressureSys: value })}
          />
          <Text style={styles.bpSeparator}>/</Text>
          <TextInput
            style={[styles.input, styles.bpInput]}
            placeholder={t("assessment.profile.diastolic")}
            placeholderTextColor={colors.textFaint}
            keyboardType="numeric"
            value={formData.bloodPressureDia}
            onChangeText={(value) => updateField({ bloodPressureDia: value })}
          />
        </View>
        <Text style={styles.note}>
  {t("assessment.profile.bpNote")}
</Text>
      </View>

      <Pressable onPress={onNext} disabled={!isWeeksValid(formData.weeksPregnant)} style={({ pressed }) => [styles.primaryButton, !isWeeksValid(formData.weeksPregnant) && styles.disabled, pressed && styles.pressed]}>
       <Text style={styles.primaryButtonText}>
  {t("assessment.profile.continue")}
</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6 },
  hint: { color: colors.textSoft, marginBottom: 22, lineHeight: 20 },
  field: { marginBottom: 20 },
  label: { color: colors.text, fontWeight: '800', marginBottom: 10, fontSize: 14 },
  optional: { color: colors.textFaint, fontWeight: '500' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    ...shadow,
  },
  stepperButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperValue: { alignItems: 'center', minWidth: 90 },
  stepperNumber: { fontSize: 34, fontWeight: '900', color: colors.text },
  stepperUnit: { marginTop: -2, color: colors.textSoft, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11, fontWeight: '800' },
  pillRow: { flexDirection: 'row', gap: 10 },
  pill: { flex: 1, minHeight: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  pillActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  pillText: { color: colors.text, fontWeight: '800' },
  pillTextActive: { color: '#fff' },
  input: { width: '100%', minHeight: 48, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceAlt, paddingHorizontal: 14, color: colors.text },
  bpRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bpInput: { flex: 1 },
  bpSeparator: { color: colors.textFaint, fontWeight: '900', fontSize: 18 },
  note: { color: colors.textFaint, fontSize: 12, marginTop: 8, lineHeight: 18 },
  primaryButton: { minHeight: 48, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.9 },
});
