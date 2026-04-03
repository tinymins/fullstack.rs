import { useTranslation } from "react-i18next";
import type { MetaFunction } from "react-router";
import ErrorPage from "@/components/error/ErrorPage";

export const meta: MetaFunction = () => [
  { title: "页面不存在 — AI Stack" },
  { name: "robots", content: "noindex, nofollow" },
];

export default function NotFoundRoute() {
  const { t } = useTranslation();
  return (
    <ErrorPage
      code="404"
      title={t("common.notFoundTitle")}
      description={t("common.notFoundDesc")}
      variant="primary"
      secondaryLabel={t("common.backToPrevious")}
    />
  );
}
