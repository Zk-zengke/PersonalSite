export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: { articles: number };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  categoryId: string;
  category?: Pick<Category, "id" | "name" | "slug">;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  categories: number;
  articles: number;
  photos: number;
  moments: number;
  recentArticles: Article[];
}
