import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

// TypeScript types for better code quality and type safety
interface UseENSAvatarResult {
	ensAvatar: string | null;
	avatarLoading: boolean;
	avatarError: string | null;
}

// Custom hook to lookup ENS avatar
function useENSAvatar(ensName: string): UseENSAvatarResult {
	const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
	const [avatarLoading, setIsLoading] = useState<boolean>(false);
	const [avatarError, setError] = useState<string | null>(null);

	// Use environment variable for RPC URL with fallback
	const providerUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-rpc.publicnode.com';

	useEffect(() => {
		const fetchData = async () => {
			if (!ensName) {
				setEnsAvatar(null);
				setError(null);
				return;
			}

			const provider = new ethers.providers.StaticJsonRpcProvider(providerUrl);

			setIsLoading(true);
			setError(null);

			try {
				const avatar = await provider.getAvatar(ensName);
				console.log('avatar', avatar);
				if (avatar) {
					setEnsAvatar(avatar);
				} else {
					setError('Avatar not found');
				}
			} catch (err) {
				setError(`Error fetching avatar: ${err.message}`);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [ensName, providerUrl]);

	return { ensAvatar, avatarError, avatarLoading };
}

export default useENSAvatar;
