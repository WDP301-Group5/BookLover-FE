import { instance } from "../lib/axios";

const HistoryService = {
	async getLast3History() {
		try {
			const response = await instance
				.get("/user/history/last3")
				.then((res) => res?.data || [])
				.catch((err) => {
					console.error("Error fetching user profile:", err);
					throw err;
				});
			return response?.data;
		} catch (error) {
			console.error("Error fetching user profile:", error);
			throw error;
		}
	},

	async deleteHistory(id: string) {
		try {
			const response = await instance
				.delete(`/user/history/${id}`)
				.then((res) => res?.data || [])
				.catch((err) => {
					console.error("Error fetching user profile:", err);
					throw err;
				});
			return response;
		} catch (error) {
			console.error("Error fetching user profile:", error);
			throw error;
		}
	},
};

export default HistoryService;
