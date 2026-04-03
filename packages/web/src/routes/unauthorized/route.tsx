import { useTranslation } from "react-i18next";
import type { MetaFunction } from "react-router";
import ErrorPage from "@/components/error/ErrorPage";

export const meta: MetaFunction = () => [
  { title: "无权访问 — AI Stack" },
  { name: "robots", content: "noindex, nofollow" },
];

export default function UnauthorizedRoute() {
  const { t } = useTranslation();
  return (
    <ErrorPage
      code="403"
      title={t("common.unauthorizedTitle")}
      description={t("common.unauthorizedDesc")}
      variant="danger"
      secondaryLabel={t("common.signIn")}
      secondaryTo="/login"
    />
  );
}
