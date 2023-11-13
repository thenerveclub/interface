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

		config.module.rules.push({
			test: /\.svg$/i,
			use: [{ loader: '@svgr/webpack', options: { icon: true } }],
		});

		return config;
	},

	env: {
		infuraKey: process.env.INFURA_KEY,
		alchemyKey: process.env.ALCHEMY_KEY,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/polygon',
				permanent: true,
			},
		];
	},
};

module.exports = withBundleAnalyzer(nextConfig);
