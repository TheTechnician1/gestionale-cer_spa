// @ts-check
import eslintJs from "@eslint/js";
import { config, configs as _configs } from "typescript-eslint";
import { configs as __configs, processInlineTemplates } from "angular-eslint";
const { configs } = eslintJs;

export default config(
  // Blocchi per file .ts
  {
    files: ["**/*.ts", "i18n-loader.ts"],
    extends: [configs.recommended, ..._configs.recommended, ..._configs.stylistic, ...__configs.tsRecommended],
    processor: processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-empty-lifecycle-method": "off",
      "no-console": "off",

      // Regole che si vogliono far rispettare
      complexity: ["warn", 150],
      "max-lines": ["warn", 2000],
      "max-params": ["warn", 10],

      // Angular style off
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/no-output-on-prefix": "off",
      "@angular-eslint/no-input-rename": "off",
    },
  },
  // Blocchi per file HTML Angular template
  {
    files: ["**/*.html"],
    extends: [...__configs.templateRecommended, ...__configs.templateAccessibility],
    rules: {
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/label-has-associated-control": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/elements-content": "off",
    },
  },
);
