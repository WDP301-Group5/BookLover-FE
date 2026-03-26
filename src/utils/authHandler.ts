/**
 * Authentication handler utility
 * Handles complete logout when token expires or becomes invalid
 */

import { isTokenExpired } from "./token";

/**
 * Clear all authentication data from localStorage
 */
function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("user-store"); // Zustand persist key
}

/**
 * Handle complete logout - clear both localStorage and Zustand store
 * This ensures user is fully logged out from the system
 */
export async function handleCompleteLogout() {
  // Clear localStorage
  clearAuthStorage();

  // Clear Zustand store
  try {
    const { useUserStore } = await import("../stores/useUserStore");
    useUserStore.setState({
      user: null,
      isLoggedIn: false,
    });
  } catch (error) {
    console.error("Failed to clear user store:", error);
  }
}

/**
 * Check if token is valid (exists and not expired)
 * If invalid, perform complete logout
 */
export async function validateTokenAndLogoutIfExpired(): Promise<boolean> {
  const token = localStorage.getItem("token");

  // No token or token expired
  if (!token || isTokenExpired(token)) {
    await handleCompleteLogout();
    return false;
  }

  return true;
}

/**
 * Handle 401 Unauthorized response
 * This should be called from axios interceptors
 */
export async function handle401Unauthorized() {
  console.warn("Token expired or unauthorized. Performing complete logout...");
  await handleCompleteLogout();
}
