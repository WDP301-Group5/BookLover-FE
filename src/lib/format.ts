const formatNumber = (number: number) => {
  return number.toLocaleString('en-US');
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export const format = {
  number: formatNumber,
  date: formatDate,
}