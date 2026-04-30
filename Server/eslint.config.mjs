import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], 
    plugins: ["prettier"], 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser },
    rules: {
      'prettier/prettier': 'error',
    }},
]);
