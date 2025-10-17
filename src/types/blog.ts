// Create: src/types/blog.ts
export interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  authorId: number;
  author: {
    id: number;
    username: string;
    name: string | null;
    image: string | null;
  };
  featuredImage: string | null;
  category: string | null;
  tags: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface BlogWithStats extends Blog {
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
}

export interface BlogLike {
  id: number;
  blogId: number;
  userId: number;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    name: string | null;
    image: string | null;
  };
}

export interface BlogComment {
  id: number;
  blogId: number;
  userId: number;
  content: string;
  parentId: number | null;
  isApproved: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    name: string | null;
    image: string | null;
    profile?: {
      profilePicture: string | null;
    };
  };
  replies?: BlogComment[];
  _count?: {
    replies: number;
  };
}

export interface BlogCommentWithReplies extends BlogComment {
  replies: BlogComment[];
}

// Form types
export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  metaDescription?: string;
  metaKeywords?: string;
  published?: boolean;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  id: number;
}

export interface CreateCommentData {
  blogId: number;
  content: string;
  parentId?: number | null;
}

export interface UpdateCommentData {
  id: number;
  content: string;
}

// Filter and pagination types
export interface BlogFilters {
  category?: string;
  tags?: string[];
  authorId?: number;
  published?: boolean;
  search?: string;
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogListResponse {
  blogs: Blog[];
  pagination: BlogPagination;
}

export interface BlogStats {
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
}

// API response types
export interface BlogLikeResponse {
  message: string;
  liked: boolean;
}

export interface BlogStatsResponse {
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
}

export interface BlogCommentResponse {
  comment: BlogComment;
  message: string;
}

export interface BlogCommentsResponse {
  comments: BlogComment[];
  pagination: BlogPagination;
}

// Blog categories enum
export enum BlogCategory {
  TUTORIAL = "Tutorial",
  EVENT = "Event",
  INTERVIEW = "Interview",
  REVIEW = "Review",
  NEWS = "News",
  TIPS = "Tips",
  BEHIND_THE_SCENES = "Behind the Scenes",
  SHOWCASE = "Showcase",
  COMMUNITY = "Community",
}

// Blog tag suggestions
export const BLOG_TAGS = [
  "cosplay",
  "armor",
  "props",
  "sewing",
  "makeup",
  "wig",
  "photography",
  "crafting",
  "foam",
  "3d-printing",
  "painting",
  "weathering",
  "competition",
  "convention",
  "anime",
  "gaming",
  "movie",
  "comics",
  "character-design",
  "costume-making",
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];