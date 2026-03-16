import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	UpdateManagedUserPayload,
	UserManagementQuery,
} from "../interfaces/UserManagement";
import { AdminUserService } from "../services/AdminUserService";
import { showError, showSuccess } from "../utils/notifications";

const getErrorMessage = (error: unknown, fallback: string) => {
	if (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof error.response === "object" &&
		error.response !== null &&
		"data" in error.response &&
		typeof error.response.data === "object" &&
		error.response.data !== null &&
		"message" in error.response.data
	) {
		return String(error.response.data.message);
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallback;
};

export const useManagedUsers = (params?: UserManagementQuery) => {
	return useQuery({
		queryKey: ["managed-users", params],
		queryFn: () => AdminUserService.getAll(params),
	});
};

export const useManagedUserDetail = (id?: string) => {
	return useQuery({
		queryKey: ["managed-user-detail", id],
		queryFn: () => AdminUserService.getById(id as string),
		enabled: !!id,
	});
};

export const useAdminUser= () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateManagedUserPayload;
		}) => AdminUserService.update(id, data),
		onSuccess: () => {
			showSuccess("Cập nhật người dùng thành công");
			queryClient.invalidateQueries({ queryKey: ["managed-users"] });
			queryClient.invalidateQueries({ queryKey: ["managed-user-detail"] });
		},
		onError: (error: unknown) => {
			showError(getErrorMessage(error, "Cập nhật thất bại"));
		},
	});
};

export const useUpdateManagedUserRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			role,
		}: {
			id: string;
			role: "admin" | "author" | "user";
		}) => AdminUserService.updateRole(id, role),
		onSuccess: () => {
			showSuccess("Cập nhật vai trò thành công");
			queryClient.invalidateQueries({ queryKey: ["managed-users"] });
		},
		onError: (error: unknown) => {
			showError(getErrorMessage(error, "Cập nhật vai trò thất bại"));
		},
	});
};

export const useUpdateManagedUserStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			status,
		}: {
			id: string;
			status: "active" | "inactive";
		}) => AdminUserService.updateStatus(id, status),
		onSuccess: () => {
			showSuccess("Cập nhật trạng thái thành công");
			queryClient.invalidateQueries({ queryKey: ["managed-users"] });
		},
		onError: (error: unknown) => {
			showError(getErrorMessage(error, "Cập nhật trạng thái thất bại"));
		},
	});
};

export const useBanManagedUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			banReason,
		}: {
			id: string;
			banReason: string;
		}) => AdminUserService.ban(id, banReason),
		onSuccess: () => {
			showSuccess("Khóa người dùng thành công");
			queryClient.invalidateQueries({ queryKey: ["managed-users"] });
		},
		onError: (error: unknown) => {
			showError(getErrorMessage(error, "Khóa người dùng thất bại"));
		},
	});
};

export const useUnbanManagedUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => AdminUserService.unban(id),
		onSuccess: () => {
			showSuccess("Mở khóa người dùng thành công");
			queryClient.invalidateQueries({ queryKey: ["managed-users"] });
		},
		onError: (error: unknown) => {
			showError(getErrorMessage(error, "Mở khóa người dùng thất bại"));
		},
	});
};