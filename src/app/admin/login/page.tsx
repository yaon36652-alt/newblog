import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "管理员登录",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold text-gray-900">
            My<span className="text-indigo-600">Blog</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">管理后台登录</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          仅限博主本人登录 · 未登录用户无法访问后台
        </p>
      </div>
    </div>
  );
}
