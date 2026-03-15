import { instance } from "../lib/axios";

const ChatingService = {
  async getListChatingUser() {
    const res = await instance
      .get("/chating/contact")
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async getChatingContent(
    conversationId: string,
    lastMessageTime: string = new Date().getTime().toString(),
    limit: number = 20,
  ) {
    if (!conversationId) return null;
    const res = await instance
      .get(`/chating/message/${conversationId}`, {
        params: {
          lastMessageTime,
          limit,
        },
      })
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async searchUser(query: string) {
    if (!query || !String(query).trim()) return null;
    const res = await instance
      .get("/chating/user/search", {
        params: {
          keyword: query,
        },
      })
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async checkAndCreateConversation(receiverId: string) {
    const res = await instance
      .post(`/chating/conversation/${receiverId}`)
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res?.data;
  },
};

export default ChatingService;
