import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { CHAINS } from '../chains';
import { getProvider } from '../providerFactory';

export function CheckNameRegister() {
	const [registerStatus, setRegisterStatus] = useState<string | null>(null);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// Get URL Path
	const path = (global.window && window.location.pathname)?.toString() || '';
	const pathLastPart = path.split('/').pop();

	// Check if pathLastPart is an address
	const isAddress = ethers.utils.isAddress(pathLastPart);
	const { contractProvider } = getProvider(chainId);

	useEffect(() => {
		if (isAddress) {
			setRegisterStatus(pathLastPart);
		} else {
			try {
				const nameToHex = ethers.utils.formatBytes32String(pathLastPart);

				const getStake = async () => {
					try {
						// Check name register
						const checkNameRegister = await contractProvider.nameRegister(nameToHex);
						setRegisterStatus(checkNameRegister);
					} catch (error) {}
				};

				getStake();
				const interval = setInterval(getStake, CHAINS[chainId]?.blockTime);

				return () => clearInterval(interval);
			} catch (error) {
				console.log(error);
			}
		}
	}, [isAddress, pathLastPart, contractProvider]);

	return [registerStatus];
}
