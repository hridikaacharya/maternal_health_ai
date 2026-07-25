import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../theme/nativeTheme';
import { useTranslation } from "react-i18next";
export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const mockAccounts = {
    sita_fchv: {
      password: 'fchv123',
      user: {
        id: 'usr_fchv_01',
        name: 'Sita Sharma',
        role: 'fchv',
        title: 'Senior FCHV Coordinator',
        district: 'Lamjung, Gandaki Province',
        phone: '+977 984-1234567',
        casesManaged: 42,
      },
    },
    sample_patient: {
      password: 'patient123',
      user: {
        id: 'usr_pat_01',
        name: 'Sample Patient',
        role: 'patient',
        title: 'Expectant Mother (2nd Trimester)',
        district: 'Tokha, Bagmati Province',
        phone: '+977 986-764321',
        ancVisitsLogged: 2,
      },
    },
  };

  const handleDemoFill = (role) => {
    setError('');
    if (role === 'fchv') {
      setUsername('sita_fchv');
      setPassword('fchv123');
    } else {
      setUsername('sample_patient');
      setPassword('patient123');
    }
  };

  const handleCustomSubmit = () => {
    setError('');
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError(t("login.usernameRequired"));
      return;
    }

    if (!password) {
      setError(t("login.passwordRequired"));
      return;
    }

    const matchedAccount = mockAccounts[cleanUsername];
    if (matchedAccount && matchedAccount.password === password) {
      onLogin(matchedAccount.user);
    } else {
      setError(t("login.invalidCredentials"));
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Feather name="lock" size={36} color={colors.brand} />
        <Text style={styles.title}>{t("login.title")}</Text>
        <Text style={styles.lead}>{t("login.subtitle")}</Text>
      </View>

      <View style={styles.demoBox}>
        <Text style={styles.demoLabel}>{t("login.selectDemoRole")}</Text>
        <View style={styles.demoRow}>
          <Pressable onPress={() => handleDemoFill('fchv')} style={({ pressed }) => [styles.demoButton, styles.primaryButton, pressed && styles.pressed]}>
            <Feather name="shield" size={14} color="#fff" />
            <Text style={styles.primaryButtonText}>
  {t("login.fchvAccount")}
</Text>
          </Pressable>
          <Pressable onPress={() => handleDemoFill('patient')} style={({ pressed }) => [styles.demoButton, styles.secondaryButton, pressed && styles.pressed]}>
            <Feather name="user" size={14} color={colors.text} />
            <Text style={styles.secondaryButtonText}>
  {t("login.patientAccount")}
</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.field}>
       <Text style={styles.label}>
  {t("login.username")}
</Text>
        <TextInput style={styles.input} placeholder={t("login.usernamePlaceholder")} placeholderTextColor={colors.textFaint} value={username} onChangeText={setUsername} autoCapitalize="none" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("login.password")}</Text>
        <TextInput style={styles.input} placeholder={t("login.passwordPlaceholder")} placeholderTextColor={colors.textFaint} secureTextEntry value={password} onChangeText={setPassword} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable onPress={handleCustomSubmit} style={({ pressed }) => [styles.primarySubmit, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>{t("login.signIn")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignSelf: 'center', width: '100%', maxWidth: 480, backgroundColor: colors.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: colors.border, ...shadow },
  header: { alignItems: 'center', gap: 10, marginBottom: 18 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  lead: { fontSize: 14, color: colors.textSoft, textAlign: 'center', lineHeight: 21 },
  demoBox: { backgroundColor: colors.brandSoft, padding: 16, borderRadius: 12, gap: 10, marginBottom: 18 },
  demoLabel: { fontSize: 11, fontWeight: '900', color: colors.text, textTransform: 'uppercase', letterSpacing: 0.8 },
  demoRow: { flexDirection: 'row', gap: 10 },
  demoButton: { flex: 1, minHeight: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 10 },
  primaryButton: { backgroundColor: colors.brand },
  secondaryButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  secondaryButtonText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  field: { marginBottom: 16 },
  label: { color: colors.text, fontWeight: '800', marginBottom: 8 },
  input: { minHeight: 48, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceAlt, paddingHorizontal: 14, color: colors.text },
  error: { color: '#b91c1c', fontSize: 13, marginBottom: 14, backgroundColor: '#fef2f2', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#fee2e2', fontWeight: '600', lineHeight: 19 },
  primarySubmit: { minHeight: 48, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.9 },
});
