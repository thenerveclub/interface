//ts-check

/**
 * @type {import('next').NextConfig}
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const nextConfig = {
	reactStrictMode: true,

	webpack(config, { isServer }) {
		// Add the next-bundle-analyzer plugin for client builds
		if (!isServer && process.env.ANALYZE === 'true') {
			config.plugins.push(
				new BundleAnalyzerPlugin({
					analyzerMode: 'server',
					analyzerPort: 8888,
				})
			);
		}

		config.resolve.fallback = { fs: false, net: false, tls: false };
		config.externals.push('pino-pretty', 'lokijs', 'encoding');

		// Find the existing file loader rule that handles SVGs
		// const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));

		const fileLoaderRule = config.module.rules.find((rule) => rule.test instanceof RegExp && rule.test.test('.svg'));

		// Ensure we exclude SVGs from the default file loader
		if (fileLoaderRule) {
			fileLoaderRule.exclude = /\.svg$/i;
		}

		// Add new rules for handling SVGs
		config.module.rules.push(
			// Allow importing SVGs as URLs when using ?url
			{
				test: /\.svg$/i,
				type: 'asset/resource',
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/, // Ensure it's used inside JS/TS files
				resourceQuery: { not: [/url/] }, // Exclude ?url imports
				use: ['@svgr/webpack'],
			}
		);

		return config;
	},

	env: {
		infuraKey: process.env.INFURA_KEY,
		alchemyKey: process.env.ALCHEMY_KEY,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	// async redirects() {
	// 	return [
	// 		{
	// 			source: '/',
	// 			destination: '/polygon',
	// 			permanent: true,
	// 		},
	// 	];
	// },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'euc.li',
				port: '',
				pathname: '/**',
			},
		],
	},
};

module.exports = withBundleAnalyzer(nextConfig);
