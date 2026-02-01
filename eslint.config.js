const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");

module.exports = [
  // Ignore generated/3rd party folders
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "playwright-report/**",
      "test-results/**",
      "reports/**",
      "downloads/**",
      "logs/**",
    ],
  },

  // ✅ Node config files: allow require/module/__dirname
  {
    files: ["**/*.config.js", "eslint.config.js", "cucumber.js", "scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
  },

  // Prettier compatibility
  {
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      ...require("eslint-config-prettier").rules,
      "prettier/prettier": "warn",
    },
  },
];
