import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GenreService } from "../services/GenreService";
import { showError, showSuccess } from "../utils/notifications";

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: GenreService.getAll,
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GenreService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      showSuccess("Tạo thể loại thành công");
    },
    onError: (error) => {
      showError(error.message || "Lỗi khi tạo thể loại");
      console.error(error);
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      GenreService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      showSuccess("Cập nhật thể loại thành công");
    },
    onError: (error) => {
      showError(error.message || "Lỗi khi cập nhật thể loại");
    },
  });
};

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GenreService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      showSuccess("Xóa thể loại thành công");
    },
    onError: (error) => {
      showError(error.message || "Lỗi khi xóa thể loại");
      console.error(error);
    },
  });
};

export const useDeleteGenres = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GenreService.deleteMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      showSuccess("Xóa các thể loại thành công");
    },
    onError: (error) => {
      showError(error.message || "Lỗi khi xóa các thể loại");
    },
  });
};
