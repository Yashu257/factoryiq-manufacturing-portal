import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(num, decimals = 0) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export function getStatusColor(status) {
  const statusColors = {
    active: 'success',
    completed: 'success',
    approved: 'success',
    green: 'success',
    pending: 'warning',
    in_progress: 'warning',
    yellow: 'warning',
    delayed: 'danger',
    critical: 'danger',
    rejected: 'danger',
    red: 'danger',
    on_hold: 'secondary',
    cancelled: 'secondary',
    open: 'info',
    new: 'info',
    blue: 'info',
  };
  return statusColors[status.toLowerCase()] || 'secondary';
}
