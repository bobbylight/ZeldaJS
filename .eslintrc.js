module.exports = {
    env: {
        browser: true,
        node: true
    },

    parser: "vue-eslint-parser",

    parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2020,
        extraFileExtensions: [ ".vue" ]
    },

    ignorePatterns: [
        ".eslintrc.js",
        "jest.config.js",
        "vue.config.js"
    ],

    plugins: [
        "@typescript-eslint"
    ],

    rules: {
        "@typescript-eslint/adjacent-overload-signatures": 0,
        "@typescript-eslint/ban-types": 0, // We use "Function"
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "brace-style": [ "error", "stroustrup" ],
        indent: [ "error", 4, { "SwitchCase": 1 } ],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        semi: "off",
        "space-before-function-paren": ["error", "never"],
    },

    root: true,

    extends: [
        "plugin:@typescript-eslint/recommended",
        // "plugin:vue/essential",
        // "@vue/standard",
        // "@vue/typescript/recommended"
    ],

    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)",
                "**/tests/unit/**/*.spec.{j,t}s?(x)"
            ],
            env: {
                jest: true
            }
        }
    ]
};
