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
	logo?: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
	nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
}

function isExtendedChainInformation(
	chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
	return !!(chainInformation as ExtendedChainInformation)?.nativeCurrency;
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
	// // Ethereum
	// 1: {
	// 	urls: [`https://ethereum-rpc.publicnode.com`],
	// 	url: `https://ethereum-rpc.publicnode.com`,
	// 	publicUrl: 'https://ethereum-rpc.publicnode.com',
	// 	infura: `https://infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	alchemy: `https://infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	urlName: 'ethereum',
	// 	name: 'ETH',
	// 	nameToken: 'ETH',
	// 	blockExplorerUrls: ['https://etherscan.io/'],
	// 	contract: '',
	// 	blockTime: 10000,
	// 	graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal',
	// 	coingeckoApiId: 'ethereum',
	// },
	// // Goerli
	// 5: {
	// 	urls: [`https://ethereum-goerli-rpc.publicnode.com`],
	// 	url: `https://ethereum-goerli-rpc.publicnode.com`,
	// 	publicUrl: 'https://ethereum-goerli-rpc.publicnode.com',
	// 	infura: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	alchemy: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
	// 	urlName: 'goerli',
	// 	name: 'Görli',
	// 	nameToken: 'ETH',
	// 	blockExplorerUrls: ['https://goerli.etherscan.io/'],
	// 	contract: '0xd0d83FFcF0102E5cea570e565d8f5dFA2086C39C',
	// 	blockTime: 10000,
	// 	graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal-goerli',
	// 	coingeckoApiId: 'ethereum',
	// },
	// Polygon
	137: {
		urls: [`https://polygon-bor-rpc.publicnode.com`],
		url: `https://polygon-bor-rpc.publicnode.com`,
		publicUrl: 'https://polygon-bor-rpc.publicnode.com',
		infura: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		alchemy: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
		urlName: 'polygon',
		name: 'Polygon',
		nameToken: 'MATIC',
		nativeCurrency: MATIC,
		blockExplorerUrls: ['https://polygonscan.com/'],
		contract: '0xE72b2d8bcda0Fd5cA49119deB98Ea042D9Ec5B5b',
		blockTime: 10000,
		// graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal-polygon',
		graphApi: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_THEGRAPH_POLYGON_API}/subgraphs/id/Gt9HY9zEVhZ8ntBYXdPMPVXUtdrUD2JX3hP6oikfwCRV`,
		coingeckoApiId: 'matic-network',
		logo: '/svg/chains/polygon.svg',
	},
	// Sepolia
	11155111: {
		urls: [`https://ethereum-sepolia-rpc.publicnode.com`],
		url: `https://ethereum-sepolia-rpc.publicnode.com`,
		publicUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
		infura: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		alchemy: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
		urlName: 'sepolia',
		name: 'Sepolia',
		nameToken: 'ETH',
		nativeCurrency: ETH,
		blockExplorerUrls: ['https://sepolia.etherscan.io/'],
		contract: '0x2abB51B241c7363651cb51C76AE989Bd0458DA6B',
		blockTime: 10000,
		// graphApi: 'https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal-sepolia',
		graphApi: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_THEGRAPH_SEPOLIA_API}/subgraphs/id/xmhZV7Uvmkp28CEdpiuFw7Gz4AdhU3vRGQPXkCTo16w`,
		coingeckoApiId: 'ethereum',
		logo: '/svg/chains/ethereum.svg',
	},
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
