/**
 * Format timestamp to relative time string
 * @param {Date | string | number} timestamp - The timestamp to format
 * @returns {string} - Relative time string (e.g., "Just now", "5 min ago")
 */
export function formatRelativeTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) {
    return 'Just now'
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  // Check if it's yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday'
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  // For older dates, return the date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

/**
 * Format timestamp to full date string
 * @param {Date | string | number} timestamp - The timestamp to format
 * @returns {string} - Full date string (e.g., "Mar 3, 2026")
 */
export function formatFullDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
