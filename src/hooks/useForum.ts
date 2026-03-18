import { useQuery } from "@tanstack/react-query";
import ForumService from "../services/ForumService";

export const useAllForums = () => {
  return useQuery({
    queryKey: ["allForums"],
    queryFn: ForumService.getAllForums,
  });
};

export const useForumBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["forumBySlug", slug],
    queryFn: () => ForumService.getForumBySlug(slug),
  });
};

export const useForumCategoryBySlug = (
  type: string,
  page: number,
  limit: number,
  slug: string,
) => {
  return useQuery({
    queryKey: ["forumCategoryBySlug", type, page, limit, slug],
    queryFn: () => ForumService.getForumCategoryBySlug(type, page, limit, slug),
  });
};

export const useOneForumCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["oneForumCategoryBySlug", slug],
    queryFn: () => ForumService.getOneForumCategory(slug),
  });
};

export const useForumPostByForumCategoryId = (forumCategoryId: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["forumPostByForumCategoryId", forumCategoryId, page, limit],
    queryFn: () => ForumService.getForumPostByForumCategoryId(forumCategoryId, page, limit),
  });
}

export const useUserReactOfForumCategory = (forumCategoryId: string) => {
  return useQuery({
    queryKey: ["userReactOfForumCategory", forumCategoryId],
    queryFn: () => ForumService.getUserReactOfForumCategory(forumCategoryId),
  });
}

export const useReplyForumPost = (forumPostId: string) => {
  return useQuery({
    queryKey: ["replyForumPost", forumPostId],
    queryFn: () => ForumService.getReplyForumPost(forumPostId),
  });
}
