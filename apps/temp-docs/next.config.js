const withTM = require('next-transpile-modules')(['common'])

module.exports = withTM({
  basePath: '/docs',
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
})
