import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import ErrorPage from "@/components/error/ErrorPage";

function parseLang(cookieHeader: string): "zh" | "en" {
  return /(?:^|;\s*)i18next=en/.test(cookieHeader) ? "en" : "zh";
}

export async function loader({ request }: LoaderFunctionArgs) {
  return { lang: parseLang(request.headers.get("Cookie") ?? "") };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title:
      data?.lang === "en"
        ? "Page Not Found — AI Stack"
        : "页面不存在 — AI Stack",
  },
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
