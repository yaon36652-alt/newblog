import PasswordForm from "@/components/PasswordForm";

export const metadata = {
  title: "修改密码",
};

export default function PasswordPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">修改密码</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <PasswordForm />
      </div>
    </div>
  );
}
