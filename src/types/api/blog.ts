// Create: src/types/api/blog.ts
import { Blog, BlogComment, BlogLike } from "@/types/blog";
// Request types
export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  category?: string;
  tags?: string;
  metaDescription?: string;
  metaKeywords?: string;
  published?: boolean;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {}

export interface CreateCommentRequest {
  content: string;
  parentId?: number | null;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string;
  authorId?: number;
  published?: boolean;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "likes";
  order?: "asc" | "desc";
}

// Response types
export interface BlogResponse {
  success: boolean;
  message: string;
  blog: Blog;
}

export interface BlogListResponse {
  success: boolean;
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogStatsResponse {
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
}

export interface BlogLikeResponse {
  success: boolean;
  message: string;
  liked: boolean;
  likesCount: number;
}

export interface BlogCommentsResponse {
  success: boolean;
  comments: BlogComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogCommentResponse {
  success: boolean;
  message: string;
  comment: BlogComment;
}

// Error response
export interface BlogErrorResponse {
  success: false;
  message: string;
  error?: string;
}