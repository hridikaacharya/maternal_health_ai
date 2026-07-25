import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Layout/Header';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PatientAssessmentScreen from '../screens/PatientAssessmentScreen';
import FchvDashboardScreen from '../screens/FchvDashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AiExplainerScreen from '../screens/AiExplainerScreen';
import { getAssessmentRecords, setAssessmentRecords } from '../services/storage';
import { colors } from '../theme/nativeTheme';

export default function AppNavigator() {
  const [currentView, setCurrentView] = useState('home');
  const [globalAlerts, setGlobalAlerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleAlertTriggered = (alert) => setGlobalAlerts((prev) => [alert, ...prev]);

  const handleResolveAlert = (id) =>
    setGlobalAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, resolved: !item.resolved } : item)));

  const seedDemoData = async (userId) => {
    const existing = await getAssessmentRecords();
    const hasData = existing.some((item) => item.userId === userId);

    if (!hasData && userId === 'usr_pat_01') {
      const seededRecords = [
        {
          id: 1000000000001,
          userId: 'usr_pat_01',
          timestamp: 'Jun 12, 2026 10:30 AM',
          weeksPregnant: 16,
          ancVisits: '1',
          symptoms: ['Mild swelling'],
          riskLevel: 'LOW RISK',
          action: 'Continue Routine ANC Monitoring.',
          reason: 'Physiological parameters and symptom checks fall within normal expected bounds.',
          color: '#10b981',
        },
        {
          id: 1000000000002,
          userId: 'usr_pat_01',
          timestamp: 'May 14, 2026 09:15 AM',
          weeksPregnant: 12,
          ancVisits: '0',
          symptoms: [],
          riskLevel: 'LOW RISK',
          action: 'Continue Routine ANC Monitoring.',
          reason: 'Current parameters fall within baseline expected paths.',
          color: '#10b981',
        },
      ];

      await setAssessmentRecords([...seededRecords, ...existing]);
    }
  };

  const handleLoginSuccess = (userObject) => {
    setCurrentUser(userObject);
    void seedDemoData(userObject.id);
    setCurrentView(userObject.role === 'fchv' ? 'fchv' : 'patient');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const renderCurrentScreen = () => {
    if (!currentUser && currentView !== 'home' && currentView !== 'login') {
      return <LoginScreen onLogin={handleLoginSuccess} />;
    }

    switch (currentView) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={(view) => {
              if (!currentUser && view !== 'home') {
                setCurrentView('login');
              } else {
                setCurrentView(view);
              }
            }}
          />
        );
      case 'login':
        return <LoginScreen onLogin={handleLoginSuccess} />;
      case 'profile':
        return <ProfileScreen user={currentUser} onLogout={handleLogout} />;
      case 'ai-explain':
        return <AiExplainerScreen currentUser={currentUser} />;
      case 'patient':
        return <PatientAssessmentScreen onAlertTriggered={handleAlertTriggered} currentUser={currentUser} />;
      case 'fchv':
        return currentUser?.role === 'fchv' ? (
          <FchvDashboardScreen alerts={globalAlerts} onResolveAlert={handleResolveAlert} />
        ) : (
          <View style={styles.restrictedCard}>
            <Text style={styles.restrictedTitle}>Access Restricted</Text>
            <Text style={styles.restrictedText}>
              Your account ({currentUser?.name}) does not have FCHV monitoring permissions.
            </Text>
          </View>
        );
      default:
        return <HomeScreen onNavigate={setCurrentView} />;
    }
  };

  return (
    <SafeAreaView style={styles.shell}>
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        alertCount={globalAlerts.filter((alert) => !alert.resolved).length}
        currentUser={currentUser}
      />
      <ScrollView contentContainerStyle={currentView === 'home' ? styles.homeMain : styles.main}>
        {renderCurrentScreen()}
      </ScrollView>
      <View style={styles.footerWrap}>
        <Text style={styles.footer}>
          Maatri Care is a decision-support prototype. It does not replace assessment, diagnosis, or treatment by a qualified
          health worker. In an emergency, seek immediate care.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  main: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  homeMain: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 24,
  },
  footerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  footer: {
    textAlign: 'center',
    color: colors.textFaint,
    fontSize: 12,
    lineHeight: 18,
  },
  restrictedCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    marginTop: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 12,
  },
  restrictedText: {
    color: colors.textSoft,
    lineHeight: 22,
  },
});