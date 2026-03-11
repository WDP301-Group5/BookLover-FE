import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import type { UserRole } from "../../hooks/useRBAC";

interface RoleBasedRouteProps {
  /**
   * Allowed roles for this route
   * If user has any of these roles, they can access the route
   */
  allowedRoles: UserRole | UserRole[];
  /**
   * Fallback route when access is denied
   * @default "/unauthorized"
   */
  fallbackRoute?: string;
  /**
   * Custom component to render when access is denied
   * If provided, fallbackRoute is ignored
   */
  unauthorized?: ReactNode;
  /**
   * Whether to require login (additional check beyond role)
   * @default true
   */
  requireLogin?: boolean;
}

/**
 * Component to protect routes based on user role(s)
 *
 * Usage:
 * ```tsx
 * <Route
 *   path="/admin"
 *   element={<RoleBasedRoute allowedRoles="admin" />}
 * >
 *   <Route index element={<AdminDashboard />} />
 * </Route>
 *
 * // Multiple roles
 * <Route
 *   path="/author"
 *   element={<RoleBasedRoute allowedRoles={["admin", "author"]} />}
 * >
 *   <Route index element={<AuthorDashboard />} />
 * </Route>
 * ```
 */
export const RoleBasedRoute = ({
  allowedRoles,
  fallbackRoute = "/unauthorized",
  unauthorized,
  requireLogin = true,
}: RoleBasedRouteProps) => {
  const { user, isLoggedIn } = useUserStore();

  // Check if user is logged in
  if (requireLogin && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const userRole = user?.role as UserRole | undefined;

  if (!userRole || !roles.includes(userRole)) {
    // Return custom unauthorized component if provided
    if (unauthorized) {
      return <>{unauthorized}</>;
    }

    // Otherwise redirect to fallback route
    return <Navigate to={fallbackRoute} replace />;
  }

  return <Outlet />;
};

/**
 * High-order component version of RoleBasedRoute
 * Use this if you prefer HOC pattern
 */
export const withRoleProtection =
  (
    Component: React.ComponentType<any>,
    allowedRoles: UserRole | UserRole[],
    fallbackRoute = "/unauthorized",
  ) =>
  (props: any) => {
    const { user, isLoggedIn } = useUserStore();

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userRole = user?.role as UserRole | undefined;

    if (!userRole || !roles.includes(userRole)) {
      return <Navigate to={fallbackRoute} replace />;
    }

    return <Component {...props} />;
  };
