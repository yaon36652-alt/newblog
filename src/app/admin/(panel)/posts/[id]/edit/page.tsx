import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id, 10) || 0 },
    select: { title: true },
  });
  return { title: post ? `编辑：${post.title}` : "编辑文章" };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (Number.isNaN(postId)) notFound();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">编辑文章</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <PostForm
          post={{
            id: post.id,
            title: post.title,
            summary: post.summary,
            content: post.content,
          }}
        />
      </div>
    </div>
  );
}
