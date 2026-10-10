/** 日期格式化为中文，如 2026年10月11日 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
