const formatNumber = (number: number) => {
	return number.toLocaleString("en-US");
};

const formatDate = (date: string | Date) => {
	return new Date(date).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export const format = {
	number: formatNumber,
	date: formatDate,
};

const STONE_TO_VND = 1000;

export const formatVND = (stones?: number) => {
  const value = (stones || 0) * STONE_TO_VND;
  return new Intl.NumberFormat("vi-VN").format(value) + " VND";
};

export const formatStoneAndVND = (stones?: number) => {
  const safe = stones || 0;
  return `${safe} LT (${new Intl.NumberFormat("vi-VN").format(safe * STONE_TO_VND)} VND)`;
};