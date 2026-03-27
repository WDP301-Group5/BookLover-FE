import { instance } from "../lib/axios";

const RevenueService = {
  async getGeneralInfor() {
    // Tab 1
    const res = await instance
      .get("/author-revenue/general")
      .then((res) => res.data || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res;
  },

  async getAllRevenue(page: number = 1, limit: number = 20, storyId: string, fromDate?: string | null, toDate?: string | null) {
    // Tab 2
    const res = await instance
      .get("/author-revenue/all", { params: { page, limit, storyId, fromDate, toDate }})
      .then((res) => res.data || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res;
  },

  async getWithdrawHistory(fromDate: string | null, toDate: string | null) {
    // Tab 3
    const res = await instance
      .get("/author-revenue/withdraw", { params: { fromDate, toDate } })
      .then((res) => res.data || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res;
  },

  async requestWithdraw(phoneNumber: string, amount: number) {
    // Tab 4
    const res = await instance
      .post("/author-revenue/withdraw", { phoneNumber, amount })
      .then((res) => res.data || [])
      .catch((err) => {
        console.log(err);
        return false;
      });
    return res;
  },

  async getAllPremiumStory() {
    const res = await instance
      .get("/author-revenue/premium-story")
      .then((res) => res.data || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res;
  }
};

export default RevenueService;
