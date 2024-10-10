// src/components/ui/scroll-area.tsx

export const ScrollArea = ({ children, className }: any) => {
  return (
    <div className={`overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};
