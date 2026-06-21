import { CategoryArticleManager } from "@/components/admin/category-manager";

export default async function AdminCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CategoryArticleManager categoryId={id} />;
}
