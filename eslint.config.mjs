import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'prisma/generated/**',
  ]),
  {
    rules: {
      // Enforce no unused vars (except prefixed with _)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Allow explicit any only when unavoidable
      '@typescript-eslint/no-explicit-any': 'warn',
      // Enforce consistent imports
      'import/order': 'off',
    },
  },
])

export default eslintConfig
