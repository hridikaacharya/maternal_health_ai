import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '../../theme/nativeTheme';

export default function AlertRow({ alert, onResolve }) {
  const isEmergency = alert.riskLevel === 'EMERGENCY';
  const isResolved = Boolean(alert.resolved);

  return (
    <View style={[styles.row, isEmergency ? styles.emergency : styles.urgent, isResolved && styles.resolved]}>
      <View style={[styles.iconWrap, isEmergency ? styles.emergencyIcon : styles.urgentIcon]}>
        <Feather name={isEmergency ? 'alert-circle' : 'alert-triangle'} size={18} color={isEmergency ? colors.danger : colors.urgent} />
      </View>
      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={styles.tier}>{alert.riskLevel}</Text>
          <Text style={styles.time}>{alert.timestamp}</Text>
        </View>
        <Text style={styles.symptoms}>{alert.symptoms}</Text>
        <Text style={styles.weeks}>{alert.weeks} weeks gestation</Text>
      </View>
      <Pressable onPress={onResolve} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
        <Feather name="check" size={15} color={colors.text} />
        <Text style={styles.actionText}>{isResolved ? 'Reopen' : 'Mark reviewed'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderRadius: 18, borderWidth: 1, padding: 14, backgroundColor: colors.surface },
  urgent: { borderColor: '#edce94' },
  emergency: { borderColor: colors.dangerBorder },
  resolved: { opacity: 0.62 },
  iconWrap: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  urgentIcon: { backgroundColor: '#faebd3' },
  emergencyIcon: { backgroundColor: '#f9e4e1' },
  body: { flex: 1, gap: 4 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  tier: { fontWeight: '900', color: colors.text, fontSize: 12 },
  time: { color: colors.textFaint, fontSize: 11, fontWeight: '700' },
  symptoms: { color: colors.text, lineHeight: 20 },
  weeks: { color: colors.textSoft, fontSize: 12, fontWeight: '700' },
  action: { minHeight: 38, paddingHorizontal: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' },
  actionText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  pressed: { opacity: 0.9 },
});
