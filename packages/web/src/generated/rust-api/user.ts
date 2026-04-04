import { createQuery, createMutation } from "@/lib/rust-api-runtime";
import type { User, UserUpdateInput } from "@acme/types";

export const userApi = {
  getProfile: createQuery<void, User>({
    path: "/api/user/profile",
  }),
  updateProfile: createMutation<UserUpdateInput, User>({
    method: "PATCH",
    path: "/api/user/profile",
  }),
  deleteAvatar: createMutation<void, User>({
    method: "DELETE",
    path: "/api/user/avatar",
  }),
};
