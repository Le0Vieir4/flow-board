function Separator({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6 text-muted-foreground text-xs">
      <span className="flex-1 h-px bg-line" />
      {children}
      <span className="flex-1 h-px bg-line" />
    </div>
  );
}

export default Separator
