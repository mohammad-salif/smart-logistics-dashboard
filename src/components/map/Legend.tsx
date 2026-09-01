import { Truck, AlertTriangle } from 'lucide-react';

export function Legend() {
  const items = [
    { label: 'Accessible Route', color: '#10b981', dashed: false },
    { label: 'At-Risk Route', color: '#f59e0b', dashed: true },
    { label: 'Blocked Route', color: '#ef4444', dashed: false, blocked: true },
  ];

  return (
    <div className="absolute left-4 top-4 rounded-xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-md px-4 py-3 shadow-lg z-10">
      <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Legend
      </h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div className="flex h-5 w-8 items-center">
              <div
                className={`h-0.5 w-full ${item.dashed ? 'border-t-2 border-dashed' : ''}`}
                style={{
                  borderColor: item.color,
                  backgroundColor: item.dashed ? 'transparent' : item.color,
                }}
              />
              {item.blocked && (
                <div
                  className="ml-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
            </div>
            <span className="text-xs text-slate-300">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-8 items-center justify-center">
            <Truck className="h-4 w-4 text-sky-400" />
          </div>
          <span className="text-xs text-slate-300">Vehicle</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-8 items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <span className="text-xs text-slate-300">Incident</span>
        </div>
      </div>
    </div>
  );
}
