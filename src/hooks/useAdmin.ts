import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "../services/AdminService";
import { showError, showSuccess } from "../utils/notifications";

/**
 * Hook để lấy danh sách tất cả users
 */
export const useAdmins = () => {
	return useQuery({
		queryKey: ["admins"],
		queryFn: AdminService.getAll,
	});
};

/**
 * Hook để lấy thông tin 1 user theo ID
 */
export const useAdminById = (id: string) => {
	return useQuery({
		queryKey: ["admins", id],
		queryFn: () => AdminService.getById(id),
		enabled: !!id,
	});
};

/**
 * Hook để tạo mới admin
 */
export const useCreateAdmin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: AdminService.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			showSuccess("Tạo mới thành công");
		},
		onError: (error: unknown) => {
			const message =
				error instanceof Error ? error.message : "Lỗi khi tạo mới";
			showError(message);
			console.error(error);
		},
	});
};

/**
 * Hook để cập nhật thông tin admin
 */
export const useUpdateAdmin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
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
			};
		}) => AdminService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			showSuccess("Cập nhật thành công");
		},
		onError: (error: unknown) => {
			const message =
				error instanceof Error ? error.message : "Lỗi khi cập nhật";
			showError(message);
			console.error(error);
		},
	});
};

/**
 * Hook để xóa 1 admin
 */
export const useDeleteAdmin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: AdminService.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			showSuccess("Xóa thành công");
		},
		onError: (error: unknown) => {
			const message = error instanceof Error ? error.message : "Lỗi khi xóa";
			showError(message);
			console.error(error);
		},
	});
};

/**
 * Hook để xóa nhiều admins
 */
export const useDeleteManyAdmins = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: AdminService.deleteMany,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			showSuccess("Xóa thành công");
		},
		onError: (error: unknown) => {
			const message = error instanceof Error ? error.message : "Lỗi khi xóa";
			showError(message);
			console.error(error);
		},
	});
};
