module.exports = {
    extends: ["next/core-web-vitals", "next/typescript", "plugin:storybook/recommended"],
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        // 'no-restricted-imports': [
        //     'error',
        //     {
        //         patterns: [
        //             {
        //                 group: ['@/ui/*', '!@/ui/primitives'],
        //                 message: 'Use @/ui/primitives instead for consistent theming and easy UI library swaps',
        //             },
        //         ],
        //     },
        // ],
    },
};
