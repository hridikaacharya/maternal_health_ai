import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/nativeTheme';

const STEPS = ['Profile', 'Symptoms', 'History'];

export default function ProgressSteps({ current }) {
  return (
    <View style={styles.row}>
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const active = stepNum === current;
        const done = stepNum < current;
        return (
          <View key={label} style={styles.step}>
            <View style={[styles.bar, stepNum === 1 && styles.bar1, stepNum === 2 && styles.bar2, stepNum === 3 && styles.bar3, (active || done) && styles.barActive, done && styles.barDone]} />
            <Text style={[styles.label, (active || done) && styles.labelActive]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 24,
    height: 74,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    height: '100%',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: colors.borderSoft,
  },
  bar1: { height: 26 },
  bar2: { height: 44 },
  bar3: { height: 62 },
  barActive: {
    backgroundColor: colors.brand,
  },
  barDone: {
    opacity: 0.55,
  },
  label: {
    color: colors.textFaint,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  labelActive: {
    color: colors.text,
  },
});
