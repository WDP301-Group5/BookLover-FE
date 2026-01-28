import React, { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // TODO: Implement actual forgot password logic
      console.log("Forgot password request:", { email });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-neutral-700 flex flex-col pt-8 pb-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm mb-6 justify-center"
          aria-label="Breadcrumb"
        >
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-pointer"
          >
            Trang chủ
          </a>
          <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">
            &gt;
          </span>
          <span className="text-gray-600 dark:text-orange-500">
            Quên mật khẩu
          </span>
        </nav>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            QUÊN MẬT KHẨU
          </h1>
          <div
            className="mt-2 mx-auto w-16 h-1 bg-red-600 dark:bg-orange-500"
            aria-hidden="true"
          ></div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-sm rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md text-sm"
                role="alert"
              >
                Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư
                của bạn.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="appearance-none block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-orange-500 focus:border-yellow-500 dark:focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-900 dark:text-white bg-yellow-400 dark:bg-orange-500 hover:bg-yellow-500 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-yellow-500 dark:focus:ring-orange-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Đang gửi..." : "Gửi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
