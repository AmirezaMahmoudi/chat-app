// formatMessageTime.ts
export const formatMessageTime = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp)
    const now = new Date()
  
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
  
    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
  
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    }
  
    if (isToday) {
      return date.toLocaleTimeString([], options) // e.g., "14:30"
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], options)}`
    } else {
      return date.toLocaleDateString() + ", " + date.toLocaleTimeString([], options)
    }
  }
  