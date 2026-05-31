export function getWeeklyProgressDisplay(weeklySessions: number, targetDays?: string | number | null) {
  const target = Number(targetDays ?? 0);
  const weekly = Math.max(0, Math.floor(Number.isFinite(weeklySessions) ? weeklySessions : 0));

  if (!Number.isFinite(target) || target <= 0) {
    return {
      value: "-",
      label: "semana",
      extraLabel: null,
      completed: 0,
      target: 0,
      extraSessions: 0,
    };
  }

  const completed = Math.min(weekly, target);
  const extraSessions = Math.max(weekly - target, 0);

  return {
    value: `${completed}/${target}`,
    label: extraSessions > 0 ? "objetivo" : "semana",
    extraLabel: extraSessions > 0 ? `+${extraSessions} extra` : null,
    completed,
    target,
    extraSessions,
  };
}
