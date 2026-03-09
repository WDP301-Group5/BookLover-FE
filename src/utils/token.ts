import { decodeJwt } from "jose";

export const isTokenExpired = (token: string): boolean => {
	try {
		const { exp } = decodeJwt(token);
		if (typeof exp !== "number") return false;
		return exp * 1000 < Date.now();
	} catch {
		return true;
	}
};
