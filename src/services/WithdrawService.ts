import { instance } from "../lib/axios";

const WithdrawService = {
  async getAllWithdraws(
    page: number = 1,
    limit: number = 20,
    status: string = "",
  ) {
    const response = await instance
      .get("/admin/withdraw/all", {
        params: { page, limit, status },
      })
      .then((res) => res.data || [])
      .catch((err) => {
        throw err;
      });
    return response;
  },

  async updateWithdraw(id: string, status: string) {
    const response = await instance
      .patch(`/admin/withdraw/${id}`, { status })
      .then((res) => res.data || [])
      .catch((err) => {
        throw err;
      });
    return response;
  },
};

export default WithdrawService;
