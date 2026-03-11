import type { ReactNode } from "react";
import { useUserStore } from "../../stores/useUserStore";
import type { UserRole } from "../../hooks/useRBAC";

interface RoleGateProps {
  /**
   * Allowed roles to render children
   */
  allowedRoles: UserRole | UserRole[];
  /**
   * Content to render if user has allowed role
   */
  children: ReactNode;
  /**
   * Content to render if user doesn't have allowed role
   * @default null
   */
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on user role
 * Useful for showing/hiding UI elements
 *
 * Usage:
 * ```tsx
 * <RoleGate allowedRoles="admin">
 *   <AdminPanel />
 * </RoleGate>
 *
 * <RoleGate allowedRoles={["admin", "author"]} fallback={<p>Access denied</p>}>
 *   <CreateContentButton />
 * </RoleGate>
 * ```
 */
export const RoleGate = ({
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) => {
  const { user } = useUserStore();

  if (!user) {
    return fallback;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role as UserRole)) {
    return fallback;
  }

  return <>{children}</>;
};

interface AdminGateProps {
  /**
   * Content to render if user is admin
   */
  children: ReactNode;
  /**
   * Content to render if user is not admin
   * @default null
   */
  fallback?: ReactNode;
}

/**
 * Convenience component for admin-only content
 */
export const AdminGate = ({ children, fallback = null }: AdminGateProps) => {
  return (
    <RoleGate allowedRoles="admin" fallback={fallback}>
      {children}
    </RoleGate>
  );
};

interface AuthorGateProps {
  /**
   * Content to render if user is author
   */
  children: ReactNode;
  /**
   * Content to render if user is not author
   * @default null
   */
  fallback?: ReactNode;
}

/**
 * Convenience component for author-only content
 */
export const AuthorGate = ({ children, fallback = null }: AuthorGateProps) => {
  return (
    <RoleGate allowedRoles={["admin", "author"]} fallback={fallback}>
      {children}
    </RoleGate>
  );
};

interface AuthenticatedGateProps {
  /**
   * Content to render if user is authenticated
   */
  children: ReactNode;
  /**
   * Content to render if user is not authenticated
   * @default null
   */
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on authentication status
 */
export const AuthenticatedGate = ({
  children,
  fallback = null,
}: AuthenticatedGateProps) => {
  const { isLoggedIn } = useUserStore();

  if (!isLoggedIn) {
    return fallback;
  }

  return <>{children}</>;
};
