import type { AddEthereumChainParameter } from '@web3-react/types';

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
	name: 'Ether',
	symbol: 'ETH',
	decimals: 18,
};

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
	name: 'Matic',
	symbol: 'MATIC',
	decimals: 18,
};

const CELO: AddEthereumChainParameter['nativeCurrency'] = {
	name: 'Celo',
	symbol: 'CELO',
	decimals: 18,
};

interface BasicChainInformation {
	urls: string[];
	name: string;
	contract?: string;
	blockTime?: number;
	graphApi?: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
	nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
	blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

function isExtendedChainInformation(
	chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
	return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
	const chainInformation = CHAINS[chainId];
	if (isExtendedChainInformation(chainInformation)) {
		return {
			chainId,
			chainName: chainInformation.name,
			nativeCurrency: chainInformation.nativeCurrency,
			rpcUrls: chainInformation.urls,
			blockExplorerUrls: chainInformation.blockExplorerUrls,
		};
	} else {
		return chainId;
	}
}

export const CHAINS: {
	[x: string]: any;
	[chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
	// 1: {
	// 	urls: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	name: 'Mainnet',
	// 	contract: '',
	// 	blockTime: 10000,
	// 	graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal',
	// },
	// 3: {
	//   urls: [process.env.infuraKey ? `https://ropsten.infura.io/v3/${process.env.infuraKey}` : ''].filter(
	//     (url) => url !== ''
	//   ),
	//   name: 'Ropsten',
	// },
	// 4: {
	//   urls: [process.env.infuraKey ? `https://rinkeby.infura.io/v3/${process.env.infuraKey}` : ''].filter(
	//     (url) => url !== ''
	//   ),
	//   name: 'Rinkeby',
	// },
	// Goerli
	5: {
		urls: [`https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`],
		name: 'Görli',
		contract: '0xd0d83FFcF0102E5cea570e565d8f5dFA2086C39C',
		blockTime: 10000,
		graphApi: '',
	},
	// 42: {
	//   urls: [process.env.infuraKey ? `https://kovan.infura.io/v3/${process.env.infuraKey}` : ''].filter(
	//     (url) => url !== ''
	//   ),
	//   name: 'Kovan',
	// },
	// // Optimism
	// 10: {
	//   urls: [
	//     process.env.infuraKey ? `https://optimism-mainnet.infura.io/v3/${process.env.infuraKey}` : '',
	//     'https://mainnet.optimism.io',
	//   ].filter((url) => url !== ''),
	//   name: 'Optimism',
	//   nativeCurrency: ETH,
	//   blockExplorerUrls: ['https://optimistic.etherscan.io'],
	// },
	// 69: {
	//   urls: [
	//     process.env.infuraKey ? `https://optimism-kovan.infura.io/v3/${process.env.infuraKey}` : '',
	//     'https://kovan.optimism.io',
	//   ].filter((url) => url !== ''),
	//   name: 'Optimism Kovan',
	//   nativeCurrency: ETH,
	//   blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
	// },
	// Arbitrum
	// 42161: {
	// 	urls: `https://arbitrum-mainnet.infura.io/v3/${process.env.infuraKey}`,
	// 	name: 'Arbitrum One',
	// 	nativeCurrency: ETH,
	// 	blockExplorerUrls: ['https://arbiscan.io'],
	// 	contract: '0x91596B44543016DDb5D410A51619D5552961a23b',
	// 	blockTime: 10000,
	// 	graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal',
	// },
	// 421611: {
	//   urls: [
	//     process.env.infuraKey ? `https://arbitrum-rinkeby.infura.io/v3/${process.env.infuraKey}` : '',
	//     'https://rinkeby.arbitrum.io/rpc',
	//   ].filter((url) => url !== ''),
	//   name: 'Arbitrum Testnet',
	//   nativeCurrency: ETH,
	//   blockExplorerUrls: ['https://testnet.arbiscan.io'],
	// },
	// Polygon
	137: {
		urls: [`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`],
		name: 'Polygon Mainnet',
		nativeCurrency: MATIC,
		blockExplorerUrls: ['https://polygonscan.com'],
		contract: '0x91596B44543016DDb5D410A51619D5552961a23b',
		blockTime: 10000,
		graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal',
	},
	80001: {
		urls: [`https://matic-mumbai.chainstacklabs.com`],
		name: 'Polygon Mumbai',
		nativeCurrency: MATIC,
		blockExplorerUrls: ['https://mumbai.polygonscan.com'],
	},
	// // Celo
	// 42220: {
	//   urls: ['https://forno.celo.org'],
	//   name: 'Celo',
	//   nativeCurrency: CELO,
	//   blockExplorerUrls: ['https://explorer.celo.org'],
	// },
	// 44787: {
	//   urls: ['https://alfajores-forno.celo-testnet.org'],
	//   name: 'Celo Alfajores',
	//   nativeCurrency: CELO,
	//   blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
	// },
};

export const URLS: { [chainId: number]: string } = Object.keys(CHAINS).reduce<{ [chainId: number]: string }>((accumulator, chainId) => {
	const validURLs: string = CHAINS[Number(chainId)].urls;

	if (validURLs.length) {
		accumulator[Number(chainId)] = validURLs;
	}

	return accumulator;
}, {});
