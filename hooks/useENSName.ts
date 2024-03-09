import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Custom hook to lookup ENS names
function useENSName(input) {
	const [ensName, setEnsName] = useState(null);
	const [address, setAddress] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	// Redux
	const customRPCValue = useSelector((state: { customRPC: string }) => state.customRPC);

	const providerUrl = customRPCValue ? 'https://ethereum-rpc.publicnode.com' : process.env.NEXT_PUBLIC_RPC_URL;

	useEffect(() => {
		if (!input) {
			setEnsName(null);
			setAddress(null);
			setError(null);
			return;
		}

		const provider = new ethers.providers.StaticJsonRpcProvider(providerUrl);

		const fetchData = async () => {
			setIsLoading(true);
			try {
				// Check if the input is likely an ENS name
				if (typeof input === 'string' && input.endsWith('.eth')) {
					const resolvedAddress = await provider.resolveName(input);
					if (resolvedAddress) {
						setAddress(resolvedAddress.toLowerCase());
						setEnsName(input);
						setError(false);
					} else {
						setError(true);
					}
				} else {
					// Assume the input is an address and look up its ENS name
					const resolvedENSName = await provider.lookupAddress(input);
					setAddress(input.toLowerCase());
					setEnsName(resolvedENSName);
					setError(false);
				}
			} catch (err) {
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [input, providerUrl]);

	return { ensName, address, isLoading, error };
}

export default useENSName;
