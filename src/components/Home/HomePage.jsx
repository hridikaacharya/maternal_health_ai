import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../theme/nativeTheme';

function HeroIllustration() {
  return (
    <View style={styles.heroArt} accessibilityRole="image" accessibilityLabel="Illustration of a winding path climbing terraced hills from a village to a health post">
      <View style={styles.heroSun} />
      <View style={[styles.heroHill, styles.heroHillBack]} />
      <View style={[styles.heroHill, styles.heroHillMid]} />
      <View style={[styles.heroHill, styles.heroHillFront]} />
      <View style={styles.heroPath} />
      <View style={[styles.heroStop, { left: '20%', top: '52%' }]} />
      <Text style={[styles.heroStopLabel, { left: '14%', top: '65%' }]}>1st tri</Text>
      <View style={[styles.heroStop, { left: '50%', top: '34%' }]} />
      <Text style={[styles.heroStopLabel, { left: '44%', top: '47%' }]}>2nd tri</Text>
      <View style={[styles.heroStop, { left: '75%', top: '44%' }]} />
      <Text style={[styles.heroStopLabel, { left: '69%', top: '57%' }]}>3rd tri</Text>
      <View style={styles.heroClinic} />
      <View style={styles.heroHut} />
    </View>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View style={styles.heroTextColumn}>
          <Text style={styles.eyebrow}>Decision support, not replacement</Text>
          <Text style={styles.heroTitle}>Every hour of delay costs lives. Sathi helps close that gap.</Text>
          <Text style={styles.lead}>
            A bilingual triage companion for pregnant women and Female Community Health Volunteers (FCHVs). A
            deterministic clinical engine decides the risk tier - never an AI model - and a translation layer explains
            it clearly, in English and Nepali, in seconds.
          </Text>
          <View style={styles.ctaRow}>
            <Pressable onPress={() => onNavigate('patient')} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.primaryButtonText}>Start an assessment</Text>
              <Feather name="arrow-right" size={16} color="#fff" />
            </Pressable>
            <Pressable onPress={() => onNavigate('fchv')} style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.secondaryButtonText}>View FCHV dashboard</Text>
            </Pressable>
          </View>
        </View>
        <HeroIllustration />
      </View>

      <View style={styles.statsStrip}>
        {[
          ['151', 'maternal deaths per 100,000 live births in Nepal, per the 2021 national census-based Maternal Mortality Study'],
          ['46.7%', "of Nepal's districts report a maternal mortality ratio at or above 140 per 100,000"],
          ['1st', 'of the three delays behind most maternal deaths is simply recognizing danger signs in time - the gap Sathi targets first'],
        ].map(([value, label]) => (
          <View key={value} style={styles.statCard}>
            <Text style={styles.statNumber}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
        <Text style={styles.statsSource}>Sources: Nepal Maternal Mortality Study (2021 census), HERD International district-level insights.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How Sathi works</Text>
        <Text style={styles.sectionSubtitle}>Three steps, built to run in the field on a basic phone.</Text>
        <View style={styles.infoGrid}>
          {[
            { num: '01', icon: 'clipboard', title: 'Answer a few questions', body: 'A short guided form - gestational age, symptoms, care history. Missing data never blocks a result.' },
            { num: '02', icon: 'git-branch', title: 'A fixed rule engine decides', body: 'Auditable, WHO-aligned logic returns Low Risk, Urgent, or Emergency - with the exact rule that fired.' },
            { num: '03', icon: 'globe', title: 'Get a clear explanation', body: 'The result is translated into warm, plain-language English and Nepali. Urgent cases alert an FCHV automatically.' },
          ].map((item) => (
            <View key={item.num} style={styles.infoCard}>
              <Text style={styles.infoNumber}>{item.num}</Text>
              <Feather name={item.icon} size={20} color={colors.brand} style={styles.infoIcon} />
              <Text style={styles.infoTitle}>{item.title}</Text>
              <Text style={styles.infoBody}>{item.body}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built on a hybrid model, on purpose</Text>
        <Text style={styles.sectionSubtitle}>This keeps a language model from ever making a clinical call.</Text>
        <View style={styles.hybridFlow}>
          {[
            ['Input', 'Your answers', colors.surface],
            ['Deterministic', 'Rule engine', colors.brandSoft],
            ['Generative', 'Bilingual explanation', colors.accentSoft],
          ].map(([label, title, backgroundColor]) => (
            <View key={label} style={[styles.hybridNode, { backgroundColor }]}>
              <Text style={styles.hybridLabel}>{label}</Text>
              <Text style={styles.hybridTitle}>{title}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.hybridNote}>The model translates the decision. It never makes it, and it cannot override it.</Text>
      </View>

      <View style={styles.ctaBand}>
        <Text style={styles.ctaBandTitle}>Ready to try it?</Text>
        <Text style={styles.ctaBandBody}>Run through the assessment yourself - it takes about a minute.</Text>
        <Pressable onPress={() => onNavigate('patient')} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed, styles.bandButton]}>
          <Text style={styles.primaryButtonText}>Start an assessment</Text>
          <Feather name="arrow-right" size={16} color="#fff" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 18,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 20,
    gap: 18,
    ...shadow,
  },
  heroTextColumn: {
    gap: 12,
  },
  eyebrow: {
    color: colors.accentDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    fontSize: 11,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
  },
  lead: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 23,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandButton: {
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  heroArt: {
    height: 260,
    borderRadius: 22,
    backgroundColor: '#f5efe1',
    overflow: 'hidden',
    position: 'relative',
  },
  heroSun: {
    position: 'absolute',
    right: 24,
    top: 20,
    width: 52,
    height: 52,
    borderRadius: 99,
    backgroundColor: 'rgba(224, 135, 44, 0.82)',
  },
  heroHill: {
    position: 'absolute',
    left: -10,
    right: -10,
    borderRadius: 18,
  },
  heroHillBack: {
    bottom: 98,
    height: 96,
    backgroundColor: '#d8ddd1',
    transform: [{ skewX: '-18deg' }],
  },
  heroHillMid: {
    bottom: 44,
    height: 108,
    backgroundColor: colors.brandSoft,
    transform: [{ skewX: '-18deg' }],
  },
  heroHillFront: {
    bottom: -8,
    height: 102,
    backgroundColor: colors.brand,
    transform: [{ skewX: '-18deg' }],
    opacity: 0.92,
  },
  heroPath: {
    position: 'absolute',
    left: 18,
    bottom: 48,
    width: '72%',
    height: 2,
    backgroundColor: colors.text,
    transform: [{ rotate: '-18deg' }],
    opacity: 0.55,
  },
  heroStop: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.brand,
  },
  heroStopLabel: {
    position: 'absolute',
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: '700',
  },
  heroClinic: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 42,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.text,
    backgroundColor: colors.surface,
  },
  heroHut: {
    position: 'absolute',
    left: 22,
    bottom: 24,
    width: 34,
    height: 24,
    borderWidth: 1.5,
    borderColor: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 4,
  },
  statsStrip: {
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },
  statLabel: {
    color: colors.textSoft,
    lineHeight: 20,
  },
  statsSource: {
    color: colors.textFaint,
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.textSoft,
    fontSize: 14,
  },
  infoGrid: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  infoNumber: {
    color: colors.textFaint,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoIcon: {
    marginBottom: 10,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  infoBody: {
    color: colors.textSoft,
    lineHeight: 21,
  },
  hybridFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  hybridNode: {
    flex: 1,
    minWidth: 110,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hybridLabel: {
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  hybridTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  hybridNote: {
    color: colors.textSoft,
    fontStyle: 'italic',
  },
  ctaBand: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 10,
  },
  ctaBandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  ctaBandBody: {
    color: colors.textSoft,
  },
});
