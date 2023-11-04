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
	url?: string;
	publicUrl: string;
	infura: string;
	alchemy: string;
	urlName: string;
	name: string;
	nameToken: string;
	blockExplorerUrls: string[];
	contract?: string;
	blockTime?: number;
	graphApi?: string;
	coingeckoApiId?: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
	nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
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
	// Goerli
	5: {
		urls: [`https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`],
		url: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		publicUrl: 'https://1rpc.io/matic',
		infura: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		alchemy: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		urlName: 'goerli',
		name: 'Görli',
		nameToken: 'ETH',
		blockExplorerUrls: ['https://goerli.etherscan.io/'],
		contract: '0xd0d83FFcF0102E5cea570e565d8f5dFA2086C39C',
		blockTime: 10000,
		graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal-goerli',
		coingeckoApiId: 'ethereum',
	},
	// Polygon
	137: {
		urls: [`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`],
		url: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		publicUrl: 'https://1rpc.io/matic',
		infura: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		alchemy: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
		urlName: 'polygon',
		name: 'Polygon Mainnet',
		nameToken: 'MATIC',
		nativeCurrency: MATIC,
		blockExplorerUrls: ['https://polygonscan.com/'],
		contract: '0x91596B44543016DDb5D410A51619D5552961a23b',
		blockTime: 10000,
		graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal',
		coingeckoApiId: 'matic-network',
	},
	// Sepolia
	// 11155111: {
	// 	urls: [`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`],
	// 	url: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	publicUrl: 'https://1rpc.io/sepolia',
	// infura: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	alchemy: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	urlName: 'sepolia',
	// 	name: 'Sepolia',
	// 	nameToken: 'ETH',
	// 	blockExplorerUrls: ['https://sepolia.etherscan.io/'],
	// 	contract: '',
	// 	blockTime: 10000,
	// 	graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal-goerli',
	// 	coingeckoApiId: 'ethereum',
	// },
};

// Create a reverse mapping from urlName to chainId
export const nameToChainId = Object.keys(CHAINS).reduce((accumulator, key) => {
	const chain = CHAINS[key];
	if (chain && chain.urlName) {
		accumulator[chain.urlName] = Number(key);
	}
	return accumulator;
}, {});

export const URLS: { [chainId: number]: string } = Object.keys(CHAINS).reduce<{ [chainId: number]: string }>((accumulator, chainId) => {
	const urls: string[] = CHAINS[Number(chainId)].urls;

	if (urls && urls.length) {
		accumulator[Number(chainId)] = urls[0];
	}

	return accumulator;
}, {});
