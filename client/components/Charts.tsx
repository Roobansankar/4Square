'use client';

import {
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Area, AreaChart
} from 'recharts';

const COLORS = ['#f97316', '#3b82f6', '#eab308', '#10b981', '#8b5cf6'];

export function ProjectStatusChart() {
  const data = [
    { name: 'Active', value: 18 },
    { name: 'Completed', value: 10 },
    { name: 'Pending', value: 6 },
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
          paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
          labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip formatter={(v) => [v, 'Projects']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyExpensesChart() {
  const data = [
    { month: 'Jan', expense: 420000, revenue: 650000 },
    { month: 'Feb', expense: 380000, revenue: 590000 },
    { month: 'Mar', expense: 510000, revenue: 780000 },
    { month: 'Apr', expense: 460000, revenue: 720000 },
    { month: 'May', expense: 540000, revenue: 840000 },
    { month: 'Jun', expense: 620000, revenue: 950000 },
    { month: 'Jul', expense: 480000, revenue: 810000 },
    { month: 'Aug', expense: 550000, revenue: 890000 },
    { month: 'Sep', expense: 430000, revenue: 700000 },
    { month: 'Oct', expense: 490000, revenue: 760000 },
    { month: 'Nov', expense: 560000, revenue: 920000 },
    { month: 'Dec', expense: 640000, revenue: 1050000 },
  ];

  const fmt = (v: number) => `₹${(v / 100000).toFixed(1)}L`;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v: unknown) => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expense" fill="#94a3b8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueLineChart() {
  const data = [
    { month: 'Jan', value: 650000 },
    { month: 'Feb', value: 590000 },
    { month: 'Mar', value: 780000 },
    { month: 'Apr', value: 720000 },
    { month: 'May', value: 840000 },
    { month: 'Jun', value: 950000 },
    { month: 'Jul', value: 810000 },
    { month: 'Aug', value: 890000 },
    { month: 'Sep', value: 700000 },
    { month: 'Oct', value: 760000 },
    { month: 'Nov', value: 920000 },
    { month: 'Dec', value: 1050000 },
  ];
  const fmt = (v: number) => `₹${(v / 100000).toFixed(0)}L`;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v: unknown) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
        <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fill="url(#colorRev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ExpenseBreakdownChart() {
  const data = [
    { name: 'Materials', value: 45 },
    { name: 'Labour', value: 28 },
    { name: 'Equipment', value: 12 },
    { name: 'Transport', value: 8 },
    { name: 'Misc', value: 7 },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value"
          label={({ name, value }) => `${name} ${value}%`} labelLine={true}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
      </PieChart>
    </ResponsiveContainer>
  );
}
