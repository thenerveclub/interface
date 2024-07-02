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
	transpilePackages: ['@mui/x-charts'],

	modularizeImports: {
		'@mui/material': {
			transform: '@mui/material/{{member}}',
		},
		'@mui/icons-material': {
			transform: '@mui/icons-material/{{member}}',
		},
	},

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

		const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
				use: ['@svgr/webpack'],
			}
		);

		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	},

	env: {
		infuraKey: process.env.INFURA_KEY,
		alchemyKey: process.env.ALCHEMY_KEY,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	experimental: {
		missingSuspenseWithCSRBailout: false,
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
