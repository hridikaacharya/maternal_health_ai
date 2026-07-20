import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { clearAssessmentRecordsForUser, getAssessmentRecords } from '../../services/storage';
import { colors, radius, shadow } from '../../theme/nativeTheme';

export default function ProfilePage({ user, onLogout }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) {
        setHistory([]);
        return;
      }

      const stored = await getAssessmentRecords();
      const userHistory = stored.filter((record) => record.userId === user.id);
      if (!cancelled) {
        setHistory(userHistory);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;
  const isFchv = user.role === 'fchv';
  const totalScreenings = history.length;
  const latestScreening = history[0];
  const highRiskCount = history.filter((record) => record.riskLevel === 'EMERGENCY' || record.riskLevel === 'URGENT').length;

  const clearHistory = () => {
    Alert.alert('Clear local history?', 'This will delete cached local data for this profile.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearAssessmentRecordsForUser(user.id);
          setHistory([]);
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, isFchv ? styles.avatarFchv : styles.avatarPatient]}>
            <Feather name="user" size={32} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={[styles.rolePill, isFchv ? styles.roleFchv : styles.rolePatient]}>
                <Text style={[styles.roleText, isFchv ? styles.roleTextFchv : styles.roleTextPatient]}>{isFchv ? 'FCHV WORKER' : 'PATIENT'}</Text>
              </View>
            </View>
            <Text style={styles.title}>{user.title}</Text>
          </View>
          <Pressable onPress={onLogout} style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
            <Feather name="log-out" size={16} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}><Feather name="map-pin" size={12} color={colors.textFaint} /> REGIONAL HEALTH UNIT</Text>
            <Text style={styles.metaValue}>{user.district}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}><Feather name="phone" size={12} color={colors.textFaint} /> REGISTERED PHONE</Text>
            <Text style={styles.metaValue}>{user.phone}</Text>
          </View>
        </View>

        {!isFchv ? (
          <View style={styles.statsRow}>
            <View style={styles.statCard}><Text style={styles.statNumber}>{totalScreenings}</Text><Text style={styles.statLabel}>Total Screenings</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNumber, { color: latestScreening ? latestScreening.color : colors.textFaint }]}>{latestScreening ? latestScreening.weeksPregnant : '--'}</Text><Text style={styles.statLabel}>Current Week Logged</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNumber, { color: highRiskCount > 0 ? colors.danger : '#10B981' }]}>{highRiskCount}</Text><Text style={styles.statLabel}>High Risk Flags</Text></View>
          </View>
        ) : null}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          <Feather name="calendar" size={18} color={colors.text} /> {isFchv ? 'Community Coordination Log' : 'My Personal Screening Timeline'}
        </Text>
        {history.length > 0 ? (
          <Pressable onPress={clearHistory} style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}>
            <Feather name="trash-2" size={12} color={colors.danger} />
            <Text style={styles.clearButtonText}>Clear Logs</Text>
          </Pressable>
        ) : null}
      </View>

      {isFchv ? (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Assigned Sector Parameters</Text>
          <Text style={styles.noticeText}>
            You are assigned to the <Text style={styles.bold}>{user.district}</Text> maternal monitoring region. Standard
            screenings filled out by mothers in your district are escalated dynamically to your main dashboard if they
            trigger medical warnings. Use the <Text style={styles.bold}>FCHV Dashboard</Text> tab to view and sign off
            on active cases.
          </Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Feather name="file-text" size={32} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No local records logged yet</Text>
          <Text style={styles.emptyText}>Fill out the Patient Assessment wizard to begin persistent tracking.</Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {history.map((record) => (
            <View key={record.id} style={styles.historyCard}>
              <View style={styles.historyTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyDate}>{record.timestamp}</Text>
                  <Text style={styles.historyTitle}>Gestational Age: {record.weeksPregnant} Weeks</Text>
                </View>
                <View style={[styles.riskPill, { backgroundColor: `${record.color}15` }]}>
                  <Text style={[styles.riskText, { color: record.color }]}>{record.riskLevel}</Text>
                </View>
              </View>
              <Text style={styles.historyLabel}>Symptoms</Text>
              <Text style={styles.historyText}>{record.symptoms?.length ? record.symptoms.join(', ') : 'No explicit symptoms reported'}</Text>
              <Text style={styles.historyLabel}>Action</Text>
              <Text style={styles.historyText}>{record.action}</Text>
              <Text style={styles.historyLabel}>Reason</Text>
              <Text style={styles.historyText}>{record.reason}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    gap: 16,
    backgroundColor: colors.bg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 16,
    ...shadow,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFchv: {
    backgroundColor: colors.brand,
  },
  avatarPatient: {
    backgroundColor: colors.accent,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: colors.text,
  },
  title: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  roleFchv: {
    backgroundColor: colors.brandSoft,
  },
  rolePatient: {
    backgroundColor: colors.accentSoft,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  roleTextFchv: {
    color: colors.brandDark,
  },
  roleTextPatient: {
    color: colors.accentDark,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surfaceAlt,
    padding: 14,
    gap: 6,
  },
  metaLabel: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  statLabel: {
    color: colors.textSoft,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerSoft,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },
  noticeCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.brandSoft,
    backgroundColor: '#f4faf7',
    padding: 16,
    gap: 8,
  },
  noticeTitle: {
    color: colors.brandDark,
    fontSize: 16,
    fontWeight: '900',
  },
  noticeText: {
    color: colors.textSoft,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '900',
    color: colors.text,
  },
  emptyCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textSoft,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 8,
    ...shadow,
  },
  historyTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  historyDate: {
    color: colors.textFaint,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  historyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  riskPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  historyLabel: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  historyText: {
    color: colors.text,
    lineHeight: 20,
  },
});


