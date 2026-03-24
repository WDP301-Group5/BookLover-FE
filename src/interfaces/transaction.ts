import type { ManagedUser } from "./UserManagement";

export interface ITransaction {
  id: string; // Mã giao dịch duy nhất
  userId: string; // ID người dùng thực hiện giao dịch
  chapterId: string; // ID của chapter hoặc story (nếu có)
  spiritStones: number; // Số lượng stone trong giao dịch
  stoneBefore: number; // Số lượng stone trước khi giao dịch
  stoneAfter: number; // Số lượng stone sau khi giao dịch
  status: "success" | "failed" | "pending"; // Trạng thái của giao dịch
  createdAt: string; // Ngày giờ tạo giao dịch
  updatedAt: string; // Ngày giờ cập nhật giao dịch
  description?: string; // Mô tả giao dịch (tuỳ chọn)
  transactionCode?: string; // Mã giao dịch bên ngoài (nếu có, từ hệ thống thanh toán)
  adminShare?: number; // Phần doanh thu của admin từ giao dịch (tính 40%)
  authorShare?: number; // Phần doanh thu của tác giả từ giao dịch (tính 60%)
}

export interface ManagedTransaction {
  _id?: string;
  id: string;
  userId: {
    _id: string;
    email: string;
    username?: string;
    avatarURL?: string;
  };
  chapterId?: {
    _id: string;
    title: string;
    isPremium?: boolean;
    price?: number;
    status?: string;
    storyId?: {
      _id: string;
      title: string;
      authorId?: {
        _id: string;
        username?: string;
        email?: string;
        avatarURL?: string;
      };
    };
  };
  spiritStones: number;
  stoneBefore: number;
  stoneAfter: number;
  status: "success" | "failed" | "pending";
  adminShare?: number;
  authorShare?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}