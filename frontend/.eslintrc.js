module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['generated/**'],
  rules: {
    semi: 0,
    'react-native/no-inline-styles': 0,
  },
}
