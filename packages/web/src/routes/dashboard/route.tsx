import { useEffect } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Outlet, useNavigate, useNavigation } from "react-router";
import { WorkspaceRedirectSkeleton } from "@/components/skeleton";
import { useAuth, WorkspaceListContext } from "@/hooks";
import { trpc } from "@/lib/trpc";

function parseLang(cookieHeader: string): "zh" | "en" {
  return /(?:^|;\s*)i18next=en/.test(cookieHeader) ? "en" : "zh";
}

export async function loader({ request }: LoaderFunctionArgs) {
  return { lang: parseLang(request.headers.get("Cookie") ?? "") };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.lang === "en" ? "Dashboard — AI Stack" : "控制台 — AI Stack",
  },
  { name: "robots", content: "noindex, nofollow" },
];

export default function DashboardRoot() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const workspacesQuery = trpc.workspace.list.useQuery(undefined, {
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      const params = new URLSearchParams({
        redirect: window.location.pathname + window.location.search,
      });
      navigate(`/login?${params}`, { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading || navigation.state === "loading") {
    return <WorkspaceRedirectSkeleton />;
  }

  if (!user) return null;

  return (
    <WorkspaceListContext.Provider
      value={{
        workspaces: workspacesQuery.data ?? [],
        isLoading: workspacesQuery.isLoading,
      }}
    >
      <Outlet />
    </WorkspaceListContext.Provider>
  );
}
