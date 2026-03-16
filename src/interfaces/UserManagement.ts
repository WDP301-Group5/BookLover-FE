export interface ManagedUserAuth {
	provider: string;
	lastLoginAt: string | null;
	authEmail?: string | null;
	email?: string | null;
	username?: string;
	providerUserId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ManagedUser {
	_id: string;
	username: string;
	fullName: string;
	nickName?: string;
	penName?: string;
	email: string;
	dob?: string | null;
	bio?: string;
	role: "admin" | "author" | "user";
	status: "active" | "inactive" | "banned";
	avatarURL?: string;
	backgroundURL?: string;
	vipLevel: number;

	followersCount: number;
	followingCount: number;
	followingStoriesCount: number;
	storiesCount: number;
	totalViews: number;
	totalVotes: number;

	totalSpent: number;
	spiritStones: number;
	online?: string;

	banReason?: string;
	bannedAt?: string | null;
	bannedBy?: {
		_id: string;
		username: string;
		fullName: string;
		email: string;
		role: string;
	} | null;

	createdAt?: string;
	updatedAt?: string;

	auth?: ManagedUserAuth | null;
}

export interface ManagedUserListResponse {
	items: ManagedUser[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface UserManagementQuery {
	page?: number;
	limit?: number;
	keyword?: string;
	role?: "admin" | "author" | "user";
	status?: "active" | "inactive" | "banned";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface UpdateManagedUserPayload {
	fullName?: string;
	nickName?: string;
	penName?: string;
	email?: string;
	dob?: string | null;
	bio?: string;
	avatarURL?: string;
	backgroundURL?: string;
	vipLevel?: number;
}