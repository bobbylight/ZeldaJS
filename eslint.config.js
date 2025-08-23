import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
// import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import vueEslintParser from 'vue-eslint-parser';

export default [
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
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
        //
        // plugins: {
        //     typescriptEslintPlugin,
        // },

        files: [
            '**/*.ts',
        ],

        rules: {
            "no-unused-vars": 0,
            "@typescript-eslint/adjacent-overload-signatures": 0,
            "@typescript-eslint/explicit-module-boundary-types": 0, // We don't want to specify ": void" everywhere
            "@typescript-eslint/no-empty-function": 0,
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-inferrable-types": 0,
            "@typescript-eslint/no-unnecessary-condition": ["error", { "allowConstantLoopConditions": true }],
            "@typescript-eslint/no-unused-vars": 0,
            "@typescript-eslint/restrict-template-expressions": ["error", {
                // Unfortunately we must enumerate all types with toString() implementations
                "allow": [
                    { from: "file", path: "./src/EnemyGroup.ts", name: [ "EnemyGroup" ] }
                ],
                //allow: [{ name: ['Error', 'URL', 'URLSearchParams'], from: 'lib' }],
                "allowNullish": true,
                "allowNumber": true,
            }],
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
