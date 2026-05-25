function getToday() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getCurrentTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function formatDate(dateStr) {
  const parts = dateStr.split('-')
  return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
}

function formatDateWithToday(dateStr) {
  const today = getToday()
  if (dateStr === today) {
    return `${formatDate(dateStr)}（今天）`
  }
  return formatDate(dateStr)
}

function getMonthStart() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01`
}

module.exports = {
  getToday,
  getCurrentTime,
  formatDate,
  formatDateWithToday,
  getMonthStart
}
