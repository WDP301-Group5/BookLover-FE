export interface AdminUser {
	_id: string;
	email: string;
	username: string;
	fullName: string;
	nickName?: string;
	penName?: string;
	role: "admin" | "author" | "user";
	status: "active" | "inactive" | "banned";
	dob?: string;
	avatarURL?: string;
	backgroundURL?: string;
	vipLevel: number;
	spiritStones: number;
	totalSpent: number;
	totalViews: number;
	totalVotes: number;
	createdAt: string;
	updatedAt: string;
}
