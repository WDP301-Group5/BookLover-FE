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
      "#ffffff", // mantine lấy màu mặc định của text là dark 1
      "#0d0d0d",
      "#1a1a1a",
      "#262626",
      "#333333",
      "#404040",
      "#4d4d4d",
      "#595959", // của background là dark 7
      "#666666",
      "#737373",
    ]
  }
});
