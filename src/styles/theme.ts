import { createTheme } from "@mantine/core";

export const appTheme = createTheme({
  fontFamily: "'Montserrat', 'Inter', sans-serif",
  headings: {
    fontFamily: "'Montserrat', 'Inter', sans-serif",
    fontWeight: "600",
  },
  primaryColor: "blue",
  defaultRadius: "md",
  fontSizes: {
    sm: "14px",
    md: "16px",
    lg: "18px",
  },
  colors: {
    dark: [
      "#ffffff", // 0: primary text (màu chữ chính)
      "#f3f4f6", // 1: light text
      "#9ca3af", // 2: secondary text (màu text table head)
      "#6b7280", // 3: placeholder, disabled text (cải thiện tương phản cho disabled và ô tìm kiếm)
      "#4b5563", // 4: border mặc định (làm cho border sidebar, header, select, checkbox nổi bật hơn)
      "#374151", // 5: hover state
      "#1f2937", // 6: component background (datatable, cards)
      "#111827", // 7: app background mặc định của mantine
      "#0f172a", // 8: dark background (dùng trong AdminLayout)
      "#020617", // 9: darkest
    ],
  },
});
