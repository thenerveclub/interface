import { ethers } from 'ethers/lib';
import NerveGlobalABI from '../constants/abi/nerveGlobal.json';
import { CHAINS } from './chains';

export const getProvider = (chainId) => {
	const providerUrls = CHAINS[chainId]?.urls;
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

	return { networkProvider, contractProvider };
};
