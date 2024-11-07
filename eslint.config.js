import js from '@eslint/js';
import globals from 'globals';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import vueEslintParser from 'vue-eslint-parser';

export default [
    js.configs.recommended,
    // "plugin:vue/essential",
    // "@vue/standard",
    // "@vue/typescript/recommended"

    {
        languageOptions: {
            parser: vueEslintParser,
            parserOptions: {
                parser: "@typescript-eslint/parser",
                project: "tsconfig.json",
                sourceType: "module",
                extraFileExtensions: [".vue"],
            },
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        },

        ignores: [
            ".eslintrc.config.js",
            "jest.config.js",
            "vite.config.js",
        ],

        plugins: {
            typescriptEslintPlugin,
        },

        files: [
            '**/*.ts',
        ],

        rules: {
            "no-unused-vars": 0,
            "@typescript-eslint/adjacent-overload-signatures": 0,
            "@typescript-eslint/ban-types": 0, // We use "Function"
            "@typescript-eslint/explicit-module-boundary-types": 0,
            "@typescript-eslint/no-empty-function": 0,
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-inferrable-types": 0,
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/no-unused-vars": 0,
            "brace-style": ["error", "stroustrup"],
            indent: ["error", 4, {"SwitchCase": 1}],
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            semi: "off",
            "space-before-function-paren": ["error", "never"],
        },

        // overrides: [
        //     {
        //         files: [
        //             "**/__tests__/*.{j,t}s?(x)",
        //             "**/tests/unit/**/*.spec.{j,t}s?(x)"
        //         ],
        //         env: {
        //             jest: true
        //         }
        //     }
        // ]
    },
];
