import { createQuery, createMutation } from "@/lib/rust-api-runtime";
import type {
  WorkspaceOutput,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "@acme/types";

export const workspaceApi = {
  list: createQuery<void, WorkspaceOutput[]>({
    path: "/api/workspaces",
  }),
  create: createMutation<CreateWorkspaceInput, WorkspaceOutput>({
    path: "/api/workspaces",
  }),
  update: createMutation<UpdateWorkspaceInput, WorkspaceOutput>({
    method: "PATCH",
    path: "/api/workspaces",
  }),
};
