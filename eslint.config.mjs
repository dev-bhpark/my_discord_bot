import js from "@eslint/js";
import globals from "globals";

export default [
  // 1. 기본 추천 규칙 적용
  js.configs.recommended,

  {
    // 2. 모든 자바스크립트 파일에 대한 공통 설정
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // 일단 기본을 module로 설정해서 import 에러를 방지합니다.
      globals: {
        ...globals.node,
      },
    },
  },

  {
    // 3. 특히 봇 코드(.js)에서 require를 쓸 수 있게 허용
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      // 디스코드 가이드의 엄격한 규칙들
      "arrow-spacing": ["warn", { before: true, after: true }],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": "error",
      "comma-style": "error",
      curly: ["error", "multi-line", "consistent"],
      "dot-location": ["error", "property"],
      "handle-callback-err": "off",
      indent: ["error", "tab"],
      "keyword-spacing": "error",
      "max-nested-callbacks": ["error", { max: 4 }],
      "max-statements-per-line": ["error", { max: 2 }],
      "no-console": "off",
      "no-empty-function": "error",
      "no-floating-decimal": "error",
      "no-inline-comments": "error",
      "no-lonely-if": "error",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
      "no-shadow": ["error", { allow: ["err", "resolve", "reject"] }],
      "no-trailing-spaces": ["error"],
      "no-var": "error",
      "no-undef": "error",
      "object-curly-spacing": ["error", "always"],
      "prefer-const": "error",
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "space-before-blocks": "error",
      "space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-in-parens": "error",
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "spaced-comment": "error",
      yoda: "error",
    },
  },
];
