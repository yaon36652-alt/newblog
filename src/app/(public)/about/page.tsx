import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "关于我",
};

export default async function AboutPage() {
  const about = await prisma.about.findFirst();

  const fallbackIntro =
    "你好，欢迎来到我的博客。这里还没有填写介绍，敬请期待。";
  const intro = about?.intro || fallbackIntro;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">关于我</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* 头像 */}
        {about?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={about.avatar}
            alt="博主头像"
            className="mb-6 h-24 w-24 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-500">
            M
          </div>
        )}

        {/* 简介（按空行分段） */}
        <div className="space-y-4">
          {intro.split(/\n+/).map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 联系方式 */}
        {about?.contact && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-500">联系方式</h2>
            <div className="space-y-1.5">
              {about.contact.split("\n").map((line, i) => (
                <p key={i} className="text-sm text-gray-600">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
