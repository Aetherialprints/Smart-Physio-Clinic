'use client';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: string;
}

export function KPICard({ title, value, subtitle, icon, trend, color = 'blue' }: KPICardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  const iconBg: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg[color] || iconBg.blue} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
