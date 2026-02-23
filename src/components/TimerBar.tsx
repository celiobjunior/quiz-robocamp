type TimerBarProps = {
  remainingSeconds: number;
  totalSeconds: number;
};

export function TimerBar({ remainingSeconds, totalSeconds }: TimerBarProps) {
  const normalizedRemaining = Math.max(0, Math.min(remainingSeconds, totalSeconds));
  const progress = (normalizedRemaining / totalSeconds) * 100;

  let statusClass = "bg-brandWine";
  if (progress <= 45) {
    statusClass = "bg-orange-500";
  }
  if (progress <= 20) {
    statusClass = "bg-red-600";
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-brandBlack">
        <span>Tempo</span>
        <span>{Math.ceil(normalizedRemaining)}s</span>
      </div>
      <div className="h-4 w-full overflow-hidden border-[3px] border-brandBlack bg-brandWhite">
        <div
          className={`h-full transition-all duration-200 ${statusClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
