import { useTheme } from '../features/theme/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Alternar tema claro/escuro"
      className={`relative h-7 w-13 rounded-full transition-colors ${
        isDark ? 'bg-slate-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow transition-transform ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}