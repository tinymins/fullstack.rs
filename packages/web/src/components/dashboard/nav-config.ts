type NavItem = {
  label: string;
  path: string;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "首页", path: "overview" },
      { label: "数据总览", path: "analytics" },
    ],
  },
  {
    title: "内容管理",
    items: [
      { label: "文章管理", path: "articles" },
      { label: "分类管理", path: "categories" },
      { label: "标签管理", path: "tags" },
      { label: "媒体库", path: "media" },
    ],
  },
  {
    title: "用户管理",
    items: [
      { label: "成员列表", path: "members" },
      { label: "角色权限", path: "roles" },
      { label: "邀请记录", path: "invites" },
    ],
  },
  {
    title: "运营工具",
    items: [
      { label: "公告管理", path: "announcements" },
      { label: "活动管理", path: "campaigns" },
      { label: "优惠券", path: "coupons" },
    ],
  },
  {
    title: "数据分析",
    items: [
      { label: "访问统计", path: "stats" },
      { label: "用户行为", path: "behaviors" },
      { label: "转化报表", path: "reports" },
    ],
  },
  {
    title: "系统设置",
    items: [
      { label: "通用设置", path: "settings" },
      { label: "外观主题", path: "appearance" },
      { label: "通知设置", path: "notifications" },
      { label: "API 密钥", path: "api-keys" },
      { label: "审计日志", path: "audit" },
    ],
  },
];

/** path → 中文名，由 NAV_SECTIONS 派生，无需手动维护 */
export const PAGE_NAMES: Record<string, string> = Object.fromEntries(
  NAV_SECTIONS.flatMap((s) => s.items.map((item) => [item.path, item.label])),
);
