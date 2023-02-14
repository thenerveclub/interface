//ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,

	webpack(config) {
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
};

module.exports = nextConfig;
