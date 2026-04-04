import common from "./common.js";
import dashboard from "./dashboard.js";
import errors from "./errors.js";
import features from "./features.js";
import footer from "./footer.js";
import hero from "./hero.js";
import login from "./login.js";
import nav from "./nav.js";
import systemSettings from "./systemSettings.js";
import userMenu from "./userMenu.js";
import workspace from "./workspace.js";

export const zhCN = {
  translation: {
    brand: "AI Stack",
    common,
    errors,
    login,
    userMenu,
    dashboard,
    workspace,
    systemSettings,
    hero,
    nav,
    footer,
    features,
  },
};

export type TranslationSchema = typeof zhCN;
