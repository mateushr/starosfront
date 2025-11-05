import vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: ["node_modules/**"]
  },
  {
    files: ["**/*.js", "**/*.vue"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "error"
    }
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser
    },
    plugins: {
      vue: pluginVue
    },
    rules: {
      "vue/no-unused-vars": "error",
      "vue/multi-word-component-names": "off"
    }
  },
  prettier
];