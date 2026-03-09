export interface Genre {
	_id: string;
	name: string;
	description: string;
	avatar: string;
	status: "active" | "inactive";
	createdAt: string;
	updatedAt: string;
}
