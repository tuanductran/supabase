import withTM from 'next-transpile-modules'

const nextConfig = {
  reactStrictMode: true,
  basePath: '/open-source',
  images: {
    domains: ['github.com'],
  },
}

export default () => {
  const plugins = [withTM(['ui', 'common'])]
  return plugins.reduce((acc, next) => next(acc), nextConfig)
}
