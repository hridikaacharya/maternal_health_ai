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
  page: { paddingHorizontal: 16, paddingBottom: 24, gap: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 16, ...shadow },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 18 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarFchv: { backgroundColor: colors.brand },
  avatarPatient: { backgroundColor: colors.accent },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  name: { fontSize: 22, fontWeight: '900', color: colors.text },
  title: { color: colors.textFaint, marginTop: 4 },
  rolePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  roleFchv: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  rolePatient: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  roleText: { fontSize: 11, fontWeight: '900' },
  roleTextFchv: { color: '#1D4ED8' },
  roleTextPatient: { color: '#15803D' },
  logoutButton: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaCard: { flex: 1, minWidth: '48%', padding: 12, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  metaLabel: { color: colors.textFaint, fontSize: 11, fontWeight: '900', marginBottom: 4 },
  metaValue: { color: colors.text, fontWeight: '700', lineHeight: 19 },
  statsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '30%', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  statLabel: { color: '#64748B', fontSize: 11, fontWeight: '800', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: colors.border, paddingBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text, flexDirection: 'row', alignItems: 'center', gap: 8 },
  clearButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearButtonText: { color: colors.danger, fontSize: 12, fontWeight: '800' },
  noticeCard: { backgroundColor: colors.brandSoft, borderRadius: 12, padding: 16 },
  noticeTitle: { marginBottom: 8, color: '#1E3A8A', fontWeight: '900' },
  noticeText: { color: '#334155', lineHeight: 21 },
  bold: { fontWeight: '900' },
  emptyCard: { padding: 28, alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed' },
  emptyTitle: { color: colors.text, fontWeight: '800' },
  emptyText: { color: colors.textSoft, textAlign: 'center' },
  historyCard: { padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, ...shadow },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 8 },
  historyDate: { color: colors.textFaint, fontSize: 12, fontWeight: '800' },
  historyTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 2 },
  riskPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  riskText: { fontSize: 11, fontWeight: '900' },
  historyLabel: { color: colors.textFaint, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.7, marginTop: 10, marginBottom: 4 },
  historyText: { color: colors.text, lineHeight: 20 },
  pressed: { opacity: 0.9 },
});
<>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--color-ink-soft)",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>Symptoms reported:</strong>{" "}
                      {record.symptoms && record.symptoms.length > 0
                        ? record.symptoms.join(", ")
                        : "None"}
                    </div>

                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        borderLeft: `3px solid ${record.color}`,
                      }}
                    >
                      <strong>Required Action:</strong> {record.action}
                    </div>
              </>

      {/* Logout Action */}
      <button
        type="button"
        className="btn btn-ghost btn-block"
        style={{
          border: "1px solid #EF4444",
          color: "#EF4444",
          marginTop: "32px",
        }}
        onClick={onLogout}
      >
        <LogOut size={14} /> Sign Out of Companion
      </button>
