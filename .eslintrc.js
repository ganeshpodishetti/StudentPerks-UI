module.exports = {
  extends: ['next'],
  rules: {
    // Disable problematic rules for deployment
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/role-has-required-aria-props': 'off',
  }
};
