import PostForm from "@/components/PostForm";

export const metadata = {
  title: "新建文章",
};

export default function NewPostPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">新建文章</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <PostForm />
      </div>
    </div>
  );
}
