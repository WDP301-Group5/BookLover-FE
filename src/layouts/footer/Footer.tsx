import { BookOpen, Users, Award, Briefcase, HelpCircle } from "lucide-react";

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
              Khám phá, đọc và chia sẻ những cuốn sách yêu thích của bạn cùng
              cộng đồng độc giả đam mê.
            </p>
          </div>

          {/* Discover Section */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">
              Khám phá
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Duyệt sách
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Mới phát hành
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Bán chạy nhất
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Thể loại
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Tác giả
                </a>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Cộng đồng
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Câu lạc bộ sách
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Đánh giá
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Diễn đàn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  Chương trình tác giả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Sự kiện
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-gray-900 font-semibold text-sm mb-4">
              Công ty
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Báo chí
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer"
                >
                  Đối tác thương hiệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-violet-600 text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Trung tâm trợ giúp
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
                Điều khoản dịch vụ
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              >
                Chính sách bảo mật
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              >
                Chính sách thanh toán
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
              >
                Khả năng tiếp cận
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
              ></a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500">
              © {currentYear} BookLover. Bảo lưu mọi quyền.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
