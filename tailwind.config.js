/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // hoặc 'media' nếu muốn tự động theo hệ thống
  plugins: [],
  theme: {
    extend: {
      // khai báo các tên biến màu đã custom với tailwind
      // khi sử dụng sẽ dùng bg-custom-bg, text-custom-text, ...
      // nhớ restart dev lại mỗi khi khai báo tên biến màu mới để hệ thống cập nhật giá trị
      // vì hệ thống chỉ quét 1 lần vào file config này mỗi khi chạy dự án
      colors: {
        "custom-bg": "var(--my-custom-background-color)",
        "custom-text": "var(--my-custom-text-color)",
      },
    },
  },
};
