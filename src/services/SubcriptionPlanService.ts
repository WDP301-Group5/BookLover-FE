import { instance } from "../lib/axios";

const SubcriptionPlanService = {
	async getSubcriptionPlans() {
		try {
			const response = await instance
				.get("/purchase/plans")
				.then((res) => res || [])
				.catch((err) => {
					console.error("Error fetching subscription plans:", err);
					throw err;
				});
			return response?.data;
		} catch (error) {
			console.error("Error fetching subscription plans:", error);
			throw error;
		}
	},

	async purchasePlan(planId: string) {
		try {
			const response = await instance.post("/purchase/subscribe", { planId });
			return response.data;
		} catch (error) {
			console.error("Error purchasing subscription plan:", error);
			throw error;
		}
	},
};

export default SubcriptionPlanService;
