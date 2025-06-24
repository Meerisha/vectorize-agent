/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['axios']
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    VECTORIZE_API_KEY: process.env.VECTORIZE_API_KEY,
    VECTORIZE_ORG_ID: process.env.VECTORIZE_ORG_ID,
    VECTORIZE_PIPELINE_ID: process.env.VECTORIZE_PIPELINE_ID,
  }
}

module.exports = nextConfig 