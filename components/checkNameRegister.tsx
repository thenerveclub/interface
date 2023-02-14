import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import NerveGlobalABI from '../abi/NerveGlobal.json';

export function CheckNameRegister() {
	const [registerStatus, setRegisterStatus] = useState<string | null>(null);

	// Get URL Path
	const path = (global.window && window.location.pathname)?.toString() || '';
	const pathLastPart = path.split('/').pop();

	// Check if pathLastPart is an address
	const isAddress = ethers.utils.isAddress(pathLastPart);

	useEffect(() => {
		if (isAddress) {
			setRegisterStatus(pathLastPart);
		} else {
			try {
				const nameToHex = ethers.utils.formatBytes32String(pathLastPart);

				const getStake = async () => {
					try {
						const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`);
						const nerveGlobal = new ethers.Contract('0x91596B44543016DDb5D410A51619D5552961a23b', NerveGlobalABI, provider);

						// Check name register
						const checkNameRegister = await nerveGlobal.nameRegister(nameToHex);
						setRegisterStatus(checkNameRegister);
					} catch (error) {}
				};

				getStake();
				const interval = setInterval(getStake, 60000);

				return () => clearInterval(interval);
			} catch (error) {
				console.log('error', error);
			}
		}
	}, [isAddress, pathLastPart]);

	return [registerStatus];
}
