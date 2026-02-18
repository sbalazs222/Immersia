import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import nPlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';
import boundariesPlugin from 'eslint-plugin-boundaries';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,

  {
    plugins: {
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      boundaries: boundariesPlugin,
      prettier: prettierPlugin,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'apps/*' },
        { type: 'repo', pattern: 'packages/*' },
      ],
    },

    rules: {
      'prettier/prettier': 'error',
      'object-curly-spacing': ['error', 'always'],
      'no-unused-vars': 'warn',
      'import/no-unresolved': 'off',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['repo'] },
            { from: 'repo', allow: ['repo'] },
          ],
        },
      ],
    },
  },
];
