export type PeriodPreset =
  | 'thisWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'thisSemester'
  | 'thisYear'
  | 'custom';

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getPresetRange(preset: PeriodPreset): { startDate: string; endDate: string } {
  const now = new Date();
  const today = toISODate(now);

  switch (preset) {
    case 'thisWeek': {
      const dayOfWeek = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      return { startDate: toISODate(start), endDate: today };
    }
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: toISODate(start), endDate: today };
    }
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: toISODate(start), endDate: toISODate(end) };
    }
    case 'thisQuarter': {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      const start = new Date(now.getFullYear(), quarterStartMonth, 1);
      return { startDate: toISODate(start), endDate: today };
    }
    case 'thisSemester': {
      const semesterStartMonth = now.getMonth() < 6 ? 0 : 6;
      const start = new Date(now.getFullYear(), semesterStartMonth, 1);
      return { startDate: toISODate(start), endDate: today };
    }
    case 'thisYear': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: toISODate(start), endDate: today };
    }
    default:
      return { startDate: today, endDate: today };
  }
}

export const presetLabels: Record<Exclude<PeriodPreset, 'custom'>, string> = {
  thisWeek: 'Esta semana',
  thisMonth: 'Este mês',
  lastMonth: 'Mês passado',
  thisQuarter: 'Este trimestre',
  thisSemester: 'Este semestre',
  thisYear: 'Este ano',
};