import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../i18n";
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../theme/nativeTheme';



export default function Header({
  currentView,
  onChangeView,
  alertCount,
  currentUser,
}) {
  const { t, i18n } = useTranslation();
  const isFchv = currentUser && currentUser.role === 'fchv';
  const handleLanguageToggle = () => {
  const nextLanguage = i18n.language === "en" ? "ne" : "en";
  changeLanguage(nextLanguage);
};
 

  const tabs = currentUser
    ? [
        { key: 'home', label: t("header.home"), icon: 'home' },
        { key: 'patient', label: t("header.patientAssessment"), icon: 'clipboard' },
        ...(isFchv ? [{ key: 'fchv', label: t("header.dashboard"), icon: 'alert-triangle', badge: alertCount }] : []),
        { key: 'ai-explain', label: t("header.aiExplainer"), icon: 'star' },
        { key: 'profile', label: currentUser.name.split(' ')[0], icon: 'user' },
      ]
    : [
        { key: 'home', label: 'Home', icon: 'home' },
        { key: 'login', label: 'Sign In', icon: 'lock' },
      ];

  return (
    <View style={styles.header}>
      <Pressable onPress={() => onChangeView('home')} style={styles.brand} accessibilityLabel="Go to home page">
        <View style={styles.logoMark}>
          <View style={styles.logoPeak} />
          <View style={styles.logoSun} />
        </View>
        <View>
          <Text style={styles.title}>{t("common.appName")}</Text>
          <Text style={styles.subtitle}>Maternal Health Companion · MHDSS</Text>
        </View>
      </Pressable>
       <Pressable
  onPress={handleLanguageToggle}
  style={{
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  }}
>
  <Text>
    {i18n.language === "en" ? "नेपाली" : "English"}
  </Text>
</Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {tabs.map((tab) => {
          const active = currentView === tab.key;
          return (
            <Pressable key={tab.key} onPress={() => onChangeView(tab.key)} style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && styles.tabPressed]}>
              <Feather name={tab.icon} size={14} color={active ? '#fff' : colors.textSoft} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              {tab.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
    position: 'relative',
    overflow: 'hidden',
  },
  logoPeak: {
    position: 'absolute',
    left: 7,
    bottom: 9,
    width: 24,
    height: 16,
    backgroundColor: colors.brand,
    transform: [{ skewX: '-22deg' }],
  },
  logoSun: {
    position: 'absolute',
    right: 7,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.accent,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 11,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  tabs: {
    gap: 8,
    paddingRight: 12,
  },
  tab: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  tabPressed: {
    opacity: 0.88,
  },
  tabText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#fff',
  },
  badge: {
    marginLeft: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
