export function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return 'Bilinmiyor'
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
