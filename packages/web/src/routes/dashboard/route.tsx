import { useEffect } from "react";
import type { MetaFunction } from "react-router";
import { Outlet, useNavigate, useNavigation } from "react-router";
import { WorkspaceRedirectSkeleton } from "@/components/skeleton";
import { useAuth, WorkspaceListContext } from "@/hooks";
import { trpc } from "@/lib/trpc";

export const meta: MetaFunction = () => [
  { title: "控制台 — AI Stack" },
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
