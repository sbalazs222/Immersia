import base from '@repo/config/eslint/base.js';

export default [
  ...base,

  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  },
];
