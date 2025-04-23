import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { CHAINS } from '../../../utils/chains';

const providerUrl = 'https://ethereum-rpc.publicnode.com';
const provider = new ethers.providers.StaticJsonRpcProvider(providerUrl);

let cachedGlobalStats;
let lastGlobalStatsFetchTime;

// Function to fetch currency prices
const fetchCurrencyPrices = async () => {
	try {
		const response = await fetch('https://canary.nerveglobal.com/api/tokenPriceData'); // Update with the correct URL/path
		if (!response.ok) throw new Error('Failed to fetch currency prices');
		return response.json();
	} catch (error) {
		console.error('Error fetching currency prices:', error);
		return null;
	}
};

// Function to format balance
const formatBalance = (value) => {
	return (Number(value) / 1e18).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

// Function to fetch global stats from a specific chain
const fetchStatsFromChain = async (chainId, chainData) => {
	const query = `
	{
		userStats(first: 100, orderBy: earned, orderDirection: desc) {
		  id
		  earned
		}
	 }
  `;

	try {
		const response = await fetch(chainData.graphApi, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query }),
		});

		const data = await response.json();
		return { [chainId]: data.data.userStats };
	} catch (error) {
		console.error(`Error fetching stats for chain ${chainId}:`, error);
		return { [chainId]: [] };
	}
};

// Function to fetch and sort player ranking based on a criterion
const fetchAndAggregateData = async () => {
	const currencyPrice = await fetchCurrencyPrices();
	if (!currencyPrice) {
		return null;
	}

	const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => fetchStatsFromChain(chainId, chainData));

	const allData = await Promise.all(fetchPromises);

	const userData = {};
	allData.forEach((chainData) => {
		if (chainData) {
			const chainId = Object.keys(chainData)[0];
			const users = chainData[chainId];
			users.forEach((user) => {
				const { id, earned } = user;
				const tokenName = CHAINS[chainId].nameToken.toLowerCase();
				const rate = currencyPrice[tokenName] || 1;

				if (!userData[id]) {
					userData[id] = { earned: 0 };
				}
				userData[id].earned += Number(earned) * rate;
			});
		}
	});

	const combinedData = Object.entries(userData).map(([id, data]) => ({
		id,
		earned: formatBalance(data.earned),
		ensName: null,
		ensAvatar: null,
	}));

	// Resolve ENS names for Ethereum addresses
	await Promise.all(
		combinedData.map(async (user) => {
			try {
				const ensName = await provider.lookupAddress(user.id);
				if (ensName) {
					user.ensName = ensName;
					// try getting the ens Avatar if available
					try {
						const avatar = await provider.getAvatar(ensName);
						if (avatar) {
							const response = await fetch(`/api/fetchAvatar?url=${encodeURIComponent(avatar)}`);
							if (!response.ok) {
								const errorData = await response.json();
								throw new Error(errorData.error || 'Failed to fetch avatar from proxy');
							}
							const blob = await response.blob();
							const url = URL.createObjectURL(blob);
							user.ensAvatar = url;
						}
					} catch (error) {
						console.error(`Error fetching ENS avatar for address ${user.id}:`, error);
					}
				}
			} catch (error) {
				console.error(`Error resolving ENS for address ${user.id}:`, error);
			}
		})
	);

	combinedData.sort((a, b) => parseFloat(b.earned) - parseFloat(a.earned));

	return combinedData;
};

export async function GET() {
	if (!cachedGlobalStats || new Date().getTime() - lastGlobalStatsFetchTime > 1 * 60 * 60 * 1000) {
		try {
			const aggregatedData = await fetchAndAggregateData();

			if (aggregatedData) {
				cachedGlobalStats = { rankedByEarned: aggregatedData };
				lastGlobalStatsFetchTime = new Date().getTime();
			}
			return NextResponse.json(cachedGlobalStats || { error: 'Failed to fetch top earners' });
		} catch (error) {
			console.error('Failed to fetch top earners:', error);
			if (cachedGlobalStats) {
				return NextResponse.json(cachedGlobalStats);
			}
			return NextResponse.json({ error: 'Failed to fetch top earners' }, { status: 500 });
		}
	}

	return NextResponse.json(cachedGlobalStats);
}
