import { useUserStore } from "../stores/useUserStore";

export type UserRole = "admin" | "author" | "user";

/**
 * Hook to check user's role
 */
export const useRole = () => {
  const { user } = useUserStore();
  return user?.role as UserRole | undefined;
};

/**
 * Hook to check if user has a specific role
 */
export const useHasRole = (role: UserRole | UserRole[]) => {
  const { user } = useUserStore();

  if (!user) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role as UserRole);
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = () => {
  return useHasRole("admin");
};

/**
 * Hook to check if user is author
 */
export const useIsAuthor = () => {
  return useHasRole("author");
};

/**
 * Hook to check if user has any role (is logged in)
 */
export const useIsAuthenticated = () => {
  const { isLoggedIn } = useUserStore();
  return isLoggedIn;
};

/**
 * Helper to get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: "Quản trị viên",
    author: "Tác giả",
    user: "Người dùng",
  };
  return roleNames[role] || role;
};
