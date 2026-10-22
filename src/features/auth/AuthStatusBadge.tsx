'use client';

import React from 'react';

interface AuthStatusBadgeProps {
  isActive: boolean;
  isVerified?: boolean;
  isLocked?: boolean;
  size?: 'sm' | 'md';
}

export function AuthStatusBadge({
  isActive,
  isVerified,
  isLocked,
  size = 'sm',
}: AuthStatusBadgeProps) {
  const pad = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';

  if (isLocked) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 ${pad}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
        Locked
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {isActive ? (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${pad}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      ) : (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20 ${pad}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          Inactive
        </span>
      )}

      {isVerified !== undefined && (
        isVerified ? (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 ${pad}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Verified
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${pad}`}>
            Unverified
          </span>
        )
      )}
    </div>
  );
}
