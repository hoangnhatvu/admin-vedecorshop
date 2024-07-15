/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  env: {
    APP_API_URL: process.env.APP_API_URL,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/login',
        permanent: false,
      },
    ]
  }
}
