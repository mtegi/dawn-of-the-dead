const pkg = require('./package.json');

const { dependencies, devDependencies } = pkg;
const getDepsNames = (deps) => Object.keys(deps).map((depsName) => depsName.replace(/\/.*/, ''));
const depsNameList = Array.from(new Set([
  ...getDepsNames(dependencies),
  ...getDepsNames(devDependencies),
]));

const thirdPartyRegex = `^(path|fs|child_process|https|${depsNameList.join('|')})`;

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: { browser: true, es2020: true },
  plugins: ['react-hooks', 'simple-import-sort', 'react-refresh'],
  extends: [
    './node_modules/gts/',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'node/no-unpublished-import': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-empty': 'off',
    'no-unused-vars': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-require': 'off',
    'node/no-unpublished-require': 'off',
    'prettier/prettier': ['error', { 'endOfLine': 'auto' }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        'groups': [
          [thirdPartyRegex],
          [
            '^(assets|containers|components|store|utils|queries|context|hooks|pages|services|svgs|types|u9)',
          ],
          ['^[./]'],
          ['[.]styles$'],
        ],
      }
    ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    }
  },
  ignorePatterns: ['**/*.js', 'dist', '.eslintrc.cjs'],
};
