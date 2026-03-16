import type {
	ManagedUser,
	ManagedUserListResponse,
	UpdateManagedUserPayload,
	UserManagementQuery,
} from "../interfaces/UserManagement";
import { instance as axios } from "../lib/axios";

export const AdminUserService = {
	getAll: async (
		params?: UserManagementQuery,
	): Promise<ManagedUserListResponse> => {
		const response = await axios.get("/admin/users", { params });
		return response.data.data;
	},

	getById: async (id: string): Promise<ManagedUser> => {
		const response = await axios.get(`/admin/users/${id}`);
		return response.data.data;
	},

	update: async (
		id: string,
		data: UpdateManagedUserPayload,
	): Promise<ManagedUser> => {
		const response = await axios.patch(`/admin/users/${id}`, data);
		return response.data.data;
	},

	updateRole: async (
		id: string,
		role: "admin" | "author" | "user",
	): Promise<ManagedUser> => {
		const response = await axios.patch(`/admin/users/${id}/role`, { role });
		return response.data.data;
	},

	updateStatus: async (
		id: string,
		status: "active" | "inactive",
	): Promise<ManagedUser> => {
		const response = await axios.patch(`/admin/users/${id}/status`, { status });
		return response.data.data;
	},

	ban: async (id: string, banReason: string): Promise<ManagedUser> => {
		const response = await axios.patch(`/admin/users/${id}/ban`, { banReason });
		return response.data.data;
	},

	unban: async (id: string): Promise<ManagedUser> => {
		const response = await axios.patch(`/admin/users/${id}/unban`);
		return response.data.data;
	},
};