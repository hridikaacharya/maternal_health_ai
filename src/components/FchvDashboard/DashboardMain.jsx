import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AlertRow from './AlertRow';
import { colors, radius } from '../../theme/nativeTheme';

export default function DashboardMain({ alerts, onResolveAlert }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    return alerts.filter((alert) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !alert.resolved;
      return alert.riskLevel === filter;
    });
  }, [alerts, filter]);

  const activeCount = alerts.filter((alert) => !alert.resolved).length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Monitoring Log</Text>
          <Text style={styles.subtitle}>{activeCount} active case{activeCount === 1 ? '' : 's'} needing follow-up</Text>
        </View>
        <View style={styles.filterRow}>
          {['all', 'active', 'EMERGENCY', 'URGENT'].map((option) => (
            <Pressable key={option} onPress={() => setFilter(option)} style={({ pressed }) => [styles.filterButton, filter === option && styles.filterButtonActive, pressed && styles.pressed]}>
              <Text style={[styles.filterText, filter === option && styles.filterTextActive]}>{option === 'all' ? 'All' : option === 'active' ? 'Active' : option.charAt(0) + option.slice(1).toLowerCase()}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="inbox" size={30} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>No alerts here yet.</Text>
          <Text style={styles.emptyText}>Urgent and emergency assessments from the patient form will appear automatically.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <AlertRow alert={item} onResolve={() => onResolveAlert(item.id)} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 16 },
  header: { gap: 12 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.textSoft, lineHeight: 20 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterButton: { paddingHorizontal: 12, minHeight: 40, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  filterButtonActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  filterText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  filterTextActive: { color: '#fff' },
  emptyState: { paddingVertical: 32, alignItems: 'center', gap: 8 },
  emptyTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  emptyText: { color: colors.textSoft, textAlign: 'center', lineHeight: 20 },
  pressed: { opacity: 0.9 },
});
