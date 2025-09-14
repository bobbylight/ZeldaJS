import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import vueEslintParser from 'vue-eslint-parser';
import pluginVue from 'eslint-plugin-vue';

export default [
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...pluginVue.configs["flat/recommended"],

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
            '@stylistic': stylistic,
        },

        files: [
            '**/*.ts',
            '**/*.vue',
        ],

        rules: {
            "no-unused-vars": 0,
            "@stylistic/array-bracket-spacing": ["error", "always"],
            "@stylistic/arrow-parens": ["error", "always"],
            "@stylistic/arrow-spacing": "error",
            "@stylistic/brace-style": ["error", "stroustrup"],
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "@stylistic/eol-last": "error",
            "@stylistic/function-call-spacing": ["error", "never"],
            "@stylistic/keyword-spacing": "error",
            "@stylistic/no-extra-parens": "error",
            "@stylistic/no-extra-semi": "error",
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/no-tabs": "error",
            "@stylistic/no-trailing-spaces": "error",
            "@typescript-eslint/adjacent-overload-signatures": 0,
            "@typescript-eslint/explicit-module-boundary-types": 0, // We don't want to specify ": void" everywhere
            "@typescript-eslint/naming-convention": [
                "error",
                { selector: ["class", "enum", "interface", "typeAlias"], format: ["PascalCase"] },
                { selector: "classicAccessor", format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "forbid" },
                { selector: "classProperty", modifiers: ["readonly"], format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "forbid" },
                { selector: "default", format: ["camelCase", "UPPER_CASE"] },
                { selector: "enumMember", format: ["UPPER_CASE"] },
                { selector: "import", format: ["camelCase", "PascalCase"] },
                { selector: "objectLiteralProperty", format: ["camelCase", "PascalCase", "UPPER_CASE"], leadingUnderscore: "forbid" },
                { selector: "typeParameter", format: ["PascalCase"] },
                { selector: "variable", modifiers: ["const"], format: ["camelCase", "UPPER_CASE"] },
            ],
            "@typescript-eslint/no-empty-function": 0,
            "@typescript-eslint/no-unnecessary-condition": ["error", { "allowConstantLoopConditions": true }],
            "@typescript-eslint/no-unused-vars": 0,
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/restrict-template-expressions": ["error", {
                // Unfortunately we must enumerate all types with toString() implementations
                "allow": [
                    { from: "file", path: "./src/EnemyGroup.ts", name: [ "EnemyGroup" ] },
                    { from: 'lib', name: [ 'Date' ] }
                ],
                "allowNullish": true,
                "allowNumber": true,
            }],
            indent: ["error", 4, {"SwitchCase": 1}],
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            semi: "off",
            //"sort-imports": "error",
            "space-before-function-paren": ["error", "never"],
            "vue/html-indent": ["error", 4],
            // Needed for v-data-table "item.colName" renderer slots
            "vue/valid-v-slot": [ "error", { allowModifiers: true } ]
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
