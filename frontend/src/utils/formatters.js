export const cleanText = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, "'")
             .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&#039;/g, "'");
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
