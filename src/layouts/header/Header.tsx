import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu as MantineMenu, useMantineColorScheme } from "@mantine/core";
import {
  ChevronDown,
  Search,
  PenLine,
  BookOpen,
  Menu,
  X,
  Zap,
  CircleDollarSignIcon,
  Sun,
  Moon,
} from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo, Browse, Community */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              aria-label="Trang chủ BookLover"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:inline">
                BookLover
              </span>
            </Link>

            {/* Browse Dropdown */}
            <MantineMenu shadow="md" width={224} position="bottom-start">
              <MantineMenu.Target>
                <button className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 cursor-pointer">
                  Duyệt
                  <ChevronDown className="w-4 h-4" />
                </button>
              </MantineMenu.Target>

              <MantineMenu.Dropdown className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <MantineMenu.Item
                  component={Link}
                  to="/browse/featured"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Nổi bật
                </MantineMenu.Item>
                <MantineMenu.Item
                  component={Link}
                  to="/browse/trending"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Xu hướng
                </MantineMenu.Item>
                <MantineMenu.Item
                  component={Link}
                  to="/browse/new"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Mới phát hành
                </MantineMenu.Item>
                <MantineMenu.Divider className="border-gray-200 dark:border-gray-700" />
                <MantineMenu.Item
                  component={Link}
                  to="/browse/genres"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Tất cả thể loại
                </MantineMenu.Item>
              </MantineMenu.Dropdown>
            </MantineMenu>

            {/* Community Dropdown */}
            <MantineMenu shadow="md" width={224} position="bottom-start">
              <MantineMenu.Target>
                <button className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 cursor-pointer">
                  Cộng đồng
                  <ChevronDown className="w-4 h-4" />
                </button>
              </MantineMenu.Target>

              <MantineMenu.Dropdown className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <MantineMenu.Item
                  component={Link}
                  to="/community/forums"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Diễn đàn
                </MantineMenu.Item>
                <MantineMenu.Item
                  component={Link}
                  to="/community/events"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sự kiện
                </MantineMenu.Item>
                <MantineMenu.Item
                  component={Link}
                  to="/community/contests"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cuộc thi
                </MantineMenu.Item>
                <MantineMenu.Divider className="border-gray-200 dark:border-gray-700" />
                <MantineMenu.Item
                  component={Link}
                  to="/community/guidelines"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Quy định cộng đồng
                </MantineMenu.Item>
              </MantineMenu.Dropdown>
            </MantineMenu>
          </div>

          {/* Center Section: Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm truyện..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                aria-label="Tìm truyện..."
              />
            </form>
          </div>

          {/* Right Section: Write, Theme Toggle, Premium, Login, Signup */}
          <div className="flex items-center gap-3">
            {/* Write Dropdown */}
            <MantineMenu shadow="md" width={224} position="bottom-end">
              <MantineMenu.Target>
                <button className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 cursor-pointer">
                  <PenLine className="w-4 h-4" />
                  Viết
                  <ChevronDown className="w-4 h-4" />
                </button>
              </MantineMenu.Target>

              <MantineMenu.Dropdown className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <MantineMenu.Item
                  component={Link}
                  to="/write/new"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Tạo truyện mới
                </MantineMenu.Item>
                <MantineMenu.Item
                  component={Link}
                  to="/write/drafts"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Bản nháp của tôi
                </MantineMenu.Item>
                <MantineMenu.Item
                  component={Link}
                  to="/write/published"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Truyện đã đăng
                </MantineMenu.Item>
                <MantineMenu.Divider className="border-gray-200 dark:border-gray-700" />
                <MantineMenu.Item
                  component={Link}
                  to="/write/guide"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Hướng dẫn viết truyện
                </MantineMenu.Item>
              </MantineMenu.Dropdown>
            </MantineMenu>

            {/* Theme Toggle Button */}
            <button
              onClick={() => toggleColorScheme()}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
              aria-label={
                isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
              }
              title={
                isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
              }
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Premium Button */}
            <Link
              to="/premium"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
            >
              <CircleDollarSignIcon />
              Mua linh thạch/VIP
            </Link>

            {/* Login Link */}
            <Link
              to="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Đăng nhập
            </Link>

            {/* Sign Up Button */}
            <Link
              to="/signup"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm"
            >
              Đăng ký
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
              aria-label="Bật/tắt menu di động"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              aria-label="Tìm kiếm sách, truyện hoặc tác giả"
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="px-4 py-4 space-y-1">
            {/* Browse Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duyệt
              </div>
              <Link
                to="/browse/featured"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nổi bật
              </Link>
              <Link
                to="/browse/trending"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Xu hướng
              </Link>
              <Link
                to="/browse/new"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mới phát hành
              </Link>
              <Link
                to="/browse/genres"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tất cả thể loại
              </Link>
            </div>

            {/* Community Section */}
            <div className="space-y-1 pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cộng đồng
              </div>
              <Link
                to="/community/forums"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Diễn đàn
              </Link>
              <Link
                to="/community/events"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sự kiện
              </Link>
              <Link
                to="/community/contests"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cuộc thi
              </Link>
              <Link
                to="/community/guidelines"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quy định cộng đồng
              </Link>
            </div>

            {/* Write Section */}
            <div className="space-y-1 pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Viết
              </div>
              <Link
                to="/write/new"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tạo truyện mới
              </Link>
              <Link
                to="/write/drafts"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bản nháp của tôi
              </Link>
              <Link
                to="/write/published"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Truyện đã đăng
              </Link>
              <Link
                to="/write/guide"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hướng dẫn viết truyện
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/premium"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-lg transition-all duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="w-4 h-4 fill-orange-600 dark:fill-orange-400" />
                Mua linh thạch/VIP
              </Link>
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
