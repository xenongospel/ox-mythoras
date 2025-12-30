export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatRevision = (date: Date) => {
  const month = date.getMonth() + 1
  let season = 'Midyear'
  if (month === 12 || month <= 2) season = 'Winterfall'
  else if (month >= 3 && month <= 5) season = 'Greenspring'
  else if (month >= 6 && month <= 8) season = 'Highsun'
  else if (month >= 9 && month <= 11) season = 'Duskhave'
  return `Rev ${date.getFullYear()} - ${season}`
}

export const formatPatch = (date: Date) => {
  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  return `Patch ${hh}:${mm}`
}