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
              aria-label="BookLover Home"
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
                Browse
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
                    Featured
                  </Link>
                  <Link
                    to="/browse/trending"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Trending
                  </Link>
                  <Link
                    to="/browse/new"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    New Releases
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  <Link
                    to="/browse/genres"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    All Genres
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
                Community
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
                    Forums
                  </Link>
                  <Link
                    to="/community/events"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Events
                  </Link>
                  <Link
                    to="/community/contests"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Contests
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  <Link
                    to="/community/guidelines"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Community Guidelines
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
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                aria-label="Search books, stories, or authors"
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
                Write
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
                    Create New Story
                  </Link>
                  <Link
                    to="/write/drafts"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    My Drafts
                  </Link>
                  <Link
                    to="/write/published"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Published Stories
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  <Link
                    to="/write/guide"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    Writer's Guide
                  </Link>
                </div>
              )}
            </div>

            {/* Download App Button */}
            <button
              onClick={() => navigate("/download")}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm"
              aria-label="Download the BookLover app"
            >
              <Download className="w-4 h-4" />
              Download app
            </button>

            {/* Login Link */}
            <Link
              to="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Log in
            </Link>

            {/* Sign Up Button */}
            <Link
              to="/signup"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
              aria-label="Toggle mobile menu"
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
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              aria-label="Search books, stories, or authors"
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
                Browse
              </div>
              <Link
                to="/browse/featured"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Featured
              </Link>
              <Link
                to="/browse/trending"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <Link
                to="/browse/new"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Releases
              </Link>
              <Link
                to="/browse/genres"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Genres
              </Link>
            </div>

            {/* Community Section */}
            <div className="space-y-1 pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Community
              </div>
              <Link
                to="/community/forums"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Forums
              </Link>
              <Link
                to="/community/events"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/community/contests"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contests
              </Link>
              <Link
                to="/community/guidelines"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community Guidelines
              </Link>
            </div>

            {/* Write Section */}
            <div className="space-y-1 pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Write
              </div>
              <Link
                to="/write/new"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create New Story
              </Link>
              <Link
                to="/write/drafts"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Drafts
              </Link>
              <Link
                to="/write/published"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Published Stories
              </Link>
              <Link
                to="/write/guide"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Writer's Guide
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
              <button
                onClick={() => {
                  navigate("/download");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download app
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
