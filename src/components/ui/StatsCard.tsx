'use client';

import { useEffect, useState } from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  trend?: { value: number; up: boolean };
  color: string;
  delay?: number;
}

export function StatsCard({ icon, label, value, suffix, trend, color, delay = 0 }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1200;
      const steps = 40;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div
      className="group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Accent gradient bar */}
      <div
        className="absolute inset-x-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </p>
          <p
            className="mt-2 text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {displayValue.toLocaleString()}{suffix && <span className="ml-1 text-lg font-medium" style={{ color: 'var(--text-tertiary)' }}>{suffix}</span>}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold"
                style={{
                  background: trend.up ? 'var(--status-success-bg)' : 'var(--status-error-bg)',
                  color: trend.up ? 'var(--status-success)' : 'var(--status-error)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: trend.up ? 'none' : 'rotate(180deg)' }}>
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                {trend.value}%
              </span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>vs last month</span>
            </div>
          )}
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
