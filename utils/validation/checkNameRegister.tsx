import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CHAINS } from '../chains';
import { getProvider } from '../providerFactory';

export function CheckNameRegister() {
	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const [registerStatus, setRegisterStatus] = useState<string | null>(null);

	// Get URL Path
	const router = useRouter();
	const { id } = router.query;
	const pathLastPart = id?.toString();

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
	}, [pathLastPart, contractProvider]);

	return [registerStatus];
}
