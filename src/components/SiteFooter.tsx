export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} MyBlog · 记录技术笔记与生活思考
        </p>
      </div>
    </footer>
  );
}
