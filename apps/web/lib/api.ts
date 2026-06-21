import type {
  ApiResponse,
  Article,
  Category,
  DashboardStats
} from "@learning/shared";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    cache: init?.method && init.method !== "GET" ? "no-store" : "no-store"
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "请求失败");
  }
  return payload.data;
}

export const publicApi = {
  categories: () => request<Category[]>("/categories"),
  category: (idOrSlug: string) =>
    request<Category>(`/categories/${idOrSlug}`),
  articles: (category?: string) =>
    request<Article[]>(
      `/articles${category ? `?category=${encodeURIComponent(category)}` : ""}`
    ),
  article: (idOrSlug: string) => request<Article>(`/articles/${idOrSlug}`)
};

export function adminRequest<T>(
  path: string,
  token: string,
  init?: RequestInit
) {
  return request<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers
    }
  });
}

export async function uploadImage(file: File, token: string) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${API_URL}/uploads/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body
  });
  const payload = (await response.json()) as ApiResponse<{
    path: string;
    filename: string;
    size: number;
  }>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "图片上传失败");
  }
  return {
    ...payload.data,
    url: `${API_ORIGIN}${payload.data.path}`
  };
}

export type { Article, Category, DashboardStats };
