import { ethers } from 'ethers/lib';
import NerveGlobalABI from '../constants/abi/nerveGlobal.json';
import { CHAINS } from './chains';

const getProvider = (function () {
	let cache = {};

	return function (chainId) {
		if (cache[chainId]) {
			return cache[chainId];
		}

		const providerUrls = CHAINS[chainId]?.urls[0];
		const networkProvider = new ethers.providers.JsonRpcProvider(providerUrls);

		const getContractProvider = () => {
			try {
				return new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, networkProvider);
			} catch (error) {
				console.error(error);
				// Provide a helpful error message to the user
				return null;
			}
		};

		const contractProvider = getContractProvider();
		const result = { networkProvider, contractProvider };
		cache[chainId] = result;

		return result;
	};
})();

export { getProvider };
