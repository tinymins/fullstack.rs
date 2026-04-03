import { adminZh } from "./admin/zh.js";
import { authZh } from "./auth/zh.js";
import { commonZh } from "./common/zh.js";
import { dashboardZh } from "./dashboard/zh.js";
import { landingZh } from "./landing/zh.js";
import { userZh } from "./user/zh.js";
import { workspaceZh } from "./workspace/zh.js";

type TranslationErrors = {
  common: typeof commonZh.errors;
  auth: typeof authZh.errors;
  user: typeof userZh.errors;
  workspace: typeof workspaceZh.errors;
  admin: typeof adminZh.errors;
  dashboard: typeof dashboardZh.errors;
};

export const zh = {
  translation: {
    errors: {
      common: commonZh.errors,
      auth: authZh.errors,
      user: userZh.errors,
      workspace: workspaceZh.errors,
      admin: adminZh.errors,
      dashboard: dashboardZh.errors,
    } satisfies TranslationErrors,
    auth: authZh.ui,
    common: commonZh.ui,
    dashboard: dashboardZh.ui,
    landing: landingZh.ui,
    user: userZh.ui,
    workspace: workspaceZh.ui,
    admin: adminZh.ui,
  },
};

export type TranslationSchema = typeof zh;
