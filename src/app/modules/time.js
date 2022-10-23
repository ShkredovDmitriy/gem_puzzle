export const timerToHMS = (timer) => {
  const h = `${Math.floor(timer / 3600)}`.padStart(2, '0');
  const m = `${Math.floor((timer % 3600) / 60)}`.padStart(2, '0');
  const s = `${Math.floor((timer % 3600) % 60)}`.padStart(2, '0');
  return `${h}:${m}:${s}`;
}