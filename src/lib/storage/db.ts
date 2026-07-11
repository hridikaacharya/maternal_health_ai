import Dexie, { type Table } from 'dexie';

import type { ScreeningRecord } from '@/types/screening';

class ScreeningDatabase extends Dexie {
  screenings!: Table<ScreeningRecord, string>;

  constructor() {
    super('maternal-health-screenings');
    this.version(1).stores({
      screenings: 'id, createdAt, primaryRiskLevel, language'
    });
  }
}

export const screeningDb = new ScreeningDatabase();

export async function saveScreeningRecord(record: Omit<ScreeningRecord, 'id' | 'createdAt'>) {
  const savedRecord: ScreeningRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  await screeningDb.screenings.put(savedRecord);
  return savedRecord;
}
