export function WireframePlaceholder({ 
  label, 
  height = '200px',
  className = ''
}: { 
  label: string;
  height?: string;
  className?: string;
}) {
  return (
    <div 
      className={`border-2 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center ${className}`}
      style={{ height }}
    >
      <span className="text-gray-600 font-mono text-sm">[{label}]</span>
    </div>
  );
}
