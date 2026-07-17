import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'sathi_assessments';

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export async function getAssessmentRecords() {
  if (canUseLocalStorage()) {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function setAssessmentRecords(records) {
  const payload = JSON.stringify(records);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(STORAGE_KEY, payload);
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEY, payload);
}

export async function clearAssessmentRecordsForUser(userId) {
  const records = await getAssessmentRecords();
  const remaining = records.filter((record) => record.userId !== userId);
  await setAssessmentRecords(remaining);
}