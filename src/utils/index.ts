export const DateFormat = (date: Date | string): string => {
	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
};

// format số theo định dạng 1,234.00
export const NumberFormat = (num: number): string =>
	num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

// viết các số dạng ngắn gọn như 12.3K, 2.12M
export const ShorterNumber = (num: number): string => {
	const length = String(num).length;
	const num3Char = num / 10 ** (length - 3);
	const num3CharInteger = Math.round(num3Char);
	if (length >= 16) {
		return NumberFormat((num3CharInteger * 10 ** (length - 16)) / 100) + "P";
	} else if (length >= 13) {
		return NumberFormat((num3CharInteger * 10 ** (length - 13)) / 100) + "T";
	} else if (length >= 10) {
		return NumberFormat((num3CharInteger * 10 ** (length - 10)) / 100) + "B";
	} else if (length >= 7) {
		return NumberFormat((num3CharInteger * 10 ** (length - 7)) / 100) + "M";
	} else if (length >= 4) {
		return NumberFormat((num3CharInteger * 10 ** (length - 4)) / 100) + "K";
	} else {
		return NumberFormat(num);
	}
};

export const slugify = (str: string) =>
	str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s+/g, "-");

export const DateHourFormat = (date: Date | string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};