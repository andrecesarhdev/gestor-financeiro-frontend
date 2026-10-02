import { useState } from 'react';
import {
  getPresetRange,
  presetLabels,
  type PeriodPreset,
} from './periodPresets';
import type { PeriodFilter } from './reports.service';

interface PeriodSelectorProps {
  value: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const [activePreset, setActivePreset] = useState<PeriodPreset>('thisMonth');

  function handlePresetClick(preset: PeriodPreset) {
    setActivePreset(preset);
    onChange(getPresetRange(preset));
  }

  function handleCustomDateChange(field: 'startDate' | 'endDate', newValue: string) {
    setActivePreset('custom');
    onChange({ ...value, [field]: newValue });
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {(Object.keys(presetLabels) as Array<Exclude<PeriodPreset, 'custom'>>).map(
        (preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              activePreset === preset
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {presetLabels[preset]}
          </button>
        ),
      )}

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value.startDate}
          onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
        <span className="text-sm text-slate-500 dark:text-slate-400">até</span>
        <input
          type="date"
          value={value.endDate}
          onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>
    </div>
  );
}