import type { ReactTypeValue } from "../interfaces/ReactComment";
import { instance } from "../lib/axios";

const ForumService = {
  async getAllForums() {
    const res = await instance
      .get("/forum/all")
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async getForumBySlug(slug: string) {
    const res = await instance
      .get(`/forum/one/${slug}`)
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async getForumCategoryBySlug(
    type: string,
    page: number = 1,
    limit: number = 24,
    slug: string,
  ) {
    if (!slug || !String(slug).trim()) return null;
    const res = await instance
      .get(`/forum/category/all/${slug}`, {
        params: {
          type,
          page,
          limit,
        },
      })
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data || {};
  },

  async createForumCategory(
    forumId: string,
    title: string,
    description: string,
    storyId: string,
    type: string,
  ) {
    if (!title || !description || (type === "story" && !storyId)) return null;
    const res = await instance
      .post("/forum/category", { forumId, title, description, storyId, type })
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async getOneForumCategory(slug: string) {
    if (!slug || !String(slug).trim()) return null;
    const res = await instance
      .get(`/forum/category/one/${slug}`)
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async getUserReactOfForumCategory(forumCategoryId: string) {
    if (!forumCategoryId || !String(forumCategoryId).trim()) return null;
    const res = await instance
      .get(`/forum/category/react/${forumCategoryId}`)
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async userReactForumPost(
    forumCategoryId: string,
    forumPostId: string,
    react: ReactTypeValue,
  ) {
    if (!forumCategoryId || !forumPostId || !react) return null;
    const res = await instance
      .post(`/forum/category/react/${forumCategoryId}`, {
        forumPostId,
        react,
      })
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async createForumPost(forumCategoryId: string, content: string) {
    if (!forumCategoryId || !content) return null;
    const res = await instance
      .post(`/forum/category/post/${forumCategoryId}`, { content })
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async getForumPostByForumCategoryId(
    forumCategoryId: string,
    page: number = 1,
    limit: number = 24,
  ) {
    if (!forumCategoryId || !String(forumCategoryId).trim()) return null;
    const res = await instance
      .get(`/forum/category/post/${forumCategoryId}`, {
        params: {
          page,
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

  async replyForumPost(forumPostId: string, content: string) {
    if (!forumPostId || !content) return null;
    const res = await instance
      .post(`/forum/category/reply/${forumPostId}`, { content })
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },

  async getReplyForumPost(forumPostId: string) {
    if (!forumPostId || !String(forumPostId).trim()) return null;
    const res = await instance
      .get(`/forum/category/reply/${forumPostId}`)
      .then((res) => res || [])
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return res.data;
  },
};

export default ForumService;
