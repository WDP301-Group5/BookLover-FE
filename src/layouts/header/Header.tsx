import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Search,
  PenLine,
  Download,
  BookOpen,
  Menu,
  X,
  Zap,
  CircleDollarSignIcon,
} from "lucide-react";

const Header = () => {
  const [browseOpen, setBrowseOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const browseRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const writeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        browseRef.current &&
        !browseRef.current.contains(event.target as Node)
      ) {
        setBrowseOpen(false);
      }
      if (
        communityRef.current &&
        !communityRef.current.contains(event.target as Node)
      ) {
        setCommunityOpen(false);
      }
      if (
        writeRef.current &&
        !writeRef.current.contains(event.target as Node)
      ) {
        setWriteOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="relative hidden md:block" ref={browseRef}>
              <button
                onClick={() => {
                  setBrowseOpen(!browseOpen);
                  setCommunityOpen(false);
                  setWriteOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 cursor-pointer"
                aria-expanded={browseOpen}
                aria-haspopup="true"
              >
                Duyệt
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${browseOpen ? "rotate-180" : ""}`}
                />
              </button>

              {browseOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-40">
                  <Link
                    to="/browse/featured"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Nổi bật
                  </Link>
                  <Link
                    to="/browse/trending"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Xu hướng
                  </Link>
                  <Link
                    to="/browse/new"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Mới phát hành
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  <Link
                    to="/browse/genres"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Tất cả thể loại
                  </Link>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative hidden md:block" ref={communityRef}>
              <button
                onClick={() => {
                  setCommunityOpen(!communityOpen);
                  setBrowseOpen(false);
                  setWriteOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 cursor-pointer"
                aria-expanded={communityOpen}
                aria-haspopup="true"
              >
                Cộng đồng
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${communityOpen ? "rotate-180" : ""}`}
                />
              </button>

              {communityOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-40">
                  <Link
                    to="/community/forums"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Diễn đàn
                  </Link>
                  <Link
                    to="/community/events"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Sự kiện
                  </Link>
                  <Link
                    to="/community/contests"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Cuộc thi
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  <Link
                    to="/community/guidelines"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Quy định cộng đồng
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Center Section: Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden lg:block">
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

          {/* Right Section: Write, Download, Login, Signup */}
          <div className="flex items-center gap-3">
            {/* Write Dropdown */}
            <div className="relative hidden md:block" ref={writeRef}>
              <button
                onClick={() => {
                  setWriteOpen(!writeOpen);
                  setBrowseOpen(false);
                  setCommunityOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 cursor-pointer"
                aria-expanded={writeOpen}
                aria-haspopup="true"
              >
                <PenLine className="w-4 h-4" />
                Viết
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${writeOpen ? "rotate-180" : ""}`}
                />
              </button>

              {writeOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-40">
                  <Link
                    to="/write/new"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Tạo truyện mới
                  </Link>
                  <Link
                    to="/write/drafts"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Bản nháp của tôi
                  </Link>
                  <Link
                    to="/write/published"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Truyện đã đăng
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  <Link
                    to="/write/guide"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Hướng dẫn viết truyện
                  </Link>
                </div>
              )}
            </div>

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
              <button
                onClick={() => {
                  navigate("/download");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Tải ứng dụng
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
