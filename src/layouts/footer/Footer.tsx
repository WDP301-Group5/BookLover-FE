import {
  BookOpen,
  Users,
  Award,
  Briefcase,
  HelpCircle,
  Globe,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-600" />
              BookLover
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Discover, read, and share your favorite books with a community of
              passionate readers.
            </p>
          </div>

          {/* Discover Section */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">
              Discover
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Browse Books
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  New Releases
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Best Sellers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Genres
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Authors
                </a>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Book Clubs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Reviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Forums
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  Writer Program
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Brand Partnerships
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Bottom Links */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs">
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              >
                Terms of Service
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              >
                Privacy Policy
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              >
                Payment Policy
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              >
                Accessibility
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                Language
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500">
              © {currentYear} BookLover. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
