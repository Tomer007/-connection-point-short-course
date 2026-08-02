import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  // Base JS rules — both src/ and server/
  {
    files: ['src/**/*.{js,jsx}', 'server/**/*.js'],
    ...js.configs.recommended,
    rules: {
      ...js.configs.recommended.rules,

      // ── Code quality ──────────────────────────────────────────
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console':     ['warn', { allow: ['warn', 'error'] }],
      'no-debugger':    'error',
      'no-duplicate-imports': 'error',

      // ── Maintainability ───────────────────────────────────────
      'no-var':          'error',
      'prefer-const':    'warn',
      'eqeqeq':          ['warn', 'always', { null: 'ignore' }],
      'no-implicit-globals': 'error',

      // ── Error-prone patterns ──────────────────────────────────
      'no-undef':          'error',
      'no-use-before-define': ['warn', { functions: false, classes: true }],
      'no-shadow':         'warn',
      'no-throw-literal':  'error',
      'no-unreachable':    'error',
      'no-empty':          ['warn', { allowEmptyCatch: true }],

      // ── Duplication hints ─────────────────────────────────────
      'no-dupe-keys':      'error',
      'no-dupe-args':      'error',
      'no-dupe-class-members': 'error',
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType:  'module',
    },
  },

  // React-specific rules for src/
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react:       reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types':            'off',
      'react/react-in-jsx-scope':    'off',
      'react/no-unescaped-entities': 'off', // Hebrew text uses quotes naturally
      'react-hooks/rules-of-hooks':  'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/purity':          'off', // Date.now() in useMemo([]) is valid
    },
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType:  'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // Relax rules for server — Node.js environment
  {
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        process:    'readonly',
        __dirname:  'readonly',
        __filename: 'readonly',
        Buffer:     'readonly',
        URL:        'readonly',
        console:    'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },

  // Browser globals for src/
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        window:      'readonly',
        document:    'readonly',
        fetch:       'readonly',
        localStorage:'readonly',
        sessionStorage:'readonly',
        navigator:   'readonly',
        location:    'readonly',
        history:     'readonly',
        alert:       'readonly',
        confirm:     'readonly',
        console:     'readonly',
        setTimeout:  'readonly',
        clearTimeout:'readonly',
        setInterval: 'readonly',
        clearInterval:'readonly',
        URL:         'readonly',
        URLSearchParams: 'readonly',
        FormData:    'readonly',
        AbortController: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
      },
    },
  },

  // Allow console.log in scripts and startup files
  {
    files: ['server/seed-sample-data.js', 'server/storage/dataDir.js'],
    rules: { 'no-console': 'off' },
  },

  // Ignore build output and dependencies
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
]
