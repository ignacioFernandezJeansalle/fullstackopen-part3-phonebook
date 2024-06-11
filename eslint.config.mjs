import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { ignores: ["dist/"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
];
