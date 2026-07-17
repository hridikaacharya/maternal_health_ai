import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '../../theme/nativeTheme';

const SYMPTOMS = [
  { key: 'Vaginal bleeding', icon: 'droplet' },
  { key: 'Severe headache', icon: 'activity' },
  { key: 'Blurred vision', icon: 'eye-off' },
  { key: 'Convulsions', icon: 'zap' },
  { key: 'Severe abdominal pain', icon: 'alert-triangle' },
  { key: 'Fever', icon: 'thermometer' },
];

export default function Step2Symptoms({ formData, toggleSymptom, onBack, onNext }) {
  return (
    <View>
      <Text style={styles.title}>Any symptoms right now?</Text>
      <Text style={styles.hint}>Select everything that applies. It's okay to select nothing.</Text>

      <View style={styles.grid}>
        {SYMPTOMS.map(({ key, icon }) => {
          const active = formData.symptoms.includes(key);
          return (
            <Pressable key={key} onPress={() => toggleSymptom(key)} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]} accessibilityRole="button" accessibilityState={{ selected: active }}>
              <Feather name={icon} size={18} color={active ? '#fff' : colors.brand} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{key}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Feather name="arrow-left" size={16} color={colors.text} />
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={onNext} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6 },
  hint: { color: colors.textSoft, marginBottom: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { width: '48%', minHeight: 74, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, gap: 10, justifyContent: 'center' },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { color: colors.text, fontWeight: '800', lineHeight: 19 },
  chipTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 22 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  secondaryButtonText: { color: colors.text, fontWeight: '800' },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  pressed: { opacity: 0.9 },
});
