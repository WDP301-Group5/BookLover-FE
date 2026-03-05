import type { AdminUser } from "../interfaces/AdminUser";
import { instance as axios } from "../lib/axios";

export const AdminService = {
	/**
	 * Lấy danh sách tất cả users
	 */
	getAll: async (): Promise<AdminUser[]> => {
		const response = await axios.get("/admin");
		return response.data.data;
	},

	/**
	 * Lấy thông tin chi tiết 1 user theo ID
	 */
	getById: async (id: string): Promise<AdminUser> => {
		const response = await axios.get(`/admin/${id}`);
		return response.data.data;
	},

	/**
	 * Tạo mới user (admin)
	 */
	create: async (data: {
		email: string;
		password: string;
		confirmPassword: string;
		username: string;
		fullName: string;
		nickName?: string;
		penName?: string;
		dob?: string;
		role?: string;
		status?: string;
	}): Promise<AdminUser> => {
		const response = await axios.post("/admin", data);
		return response.data.data;
	},

	/**
	 * Cập nhật thông tin user
	 */
	update: async (
		id: string,
		data: {
			username?: string;
			fullName?: string;
			nickName?: string;
			penName?: string;
			dob?: string;
			role?: string;
			status?: string;
			changePassword?: boolean;
			newPassword?: string;
			confirmPassword?: string;
		},
	): Promise<AdminUser> => {
		const response = await axios.put(`/admin/${id}`, data);
		return response.data.data;
	},

	/**
	 * Xóa 1 user
	 */
	delete: async (id: string): Promise<void> => {
		await axios.delete(`/admin/${id}`);
	},

	/**
	 * Xóa nhiều users
	 */
	deleteMany: async (ids: string[]): Promise<void> => {
		await axios.post("/admin/delete-many", { ids });
	},
};
