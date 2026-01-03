export default function MiniEqualizer() {
  return (
    <div className="flex items-end gap-1 h-28">
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={i}
          className="w-2 rounded-full bg-yellow-400 animate-eq"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}
