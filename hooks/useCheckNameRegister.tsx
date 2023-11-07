import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';
import { getProvider } from '../utils/providerFactory';

export function useCheckNameRegister(chainId, playerID) {
	const [registerStatus, setRegisterStatus] = useState(null);

	useEffect(() => {
		if (playerID == null) {
			return;
		}

		const isAddress = ethers.utils.isAddress(playerID);
		const { contractProvider } = getProvider(chainId);

		let intervalId;

		const checkRegisterStatus = async () => {
			if (isAddress) {
				setRegisterStatus(playerID);
			} else {
				try {
					const nameToHex = ethers.utils.formatBytes32String(playerID);
					const checkNameRegister = await contractProvider.nameRegister(nameToHex);
					setRegisterStatus(checkNameRegister);
				} catch (error) {
					console.error(error);
				}
			}
		};

		checkRegisterStatus();

		if (!isAddress && CHAINS[chainId]?.blockTime) {
			intervalId = setInterval(checkRegisterStatus, CHAINS[chainId].blockTime);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [chainId, playerID]);

	return registerStatus;
}
