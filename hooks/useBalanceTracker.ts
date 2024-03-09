import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

function useBalanceTracker(provider, account) {
	const [balance, setBalance] = useState<string>('0.00');

	// console.log('provider', provider, 'account', account);

	useEffect(() => {
		if (provider && account) {
			let stale = false;

			const fetchBalance = async () => {
				try {
					const balance = await provider.getBalance(account);
					if (stale) return;
					const formattedBalance = ethers.utils.formatEther(balance);
					setBalance(formattedBalance);
				} catch (error) {
					console.error('Error fetching balance:', error);
					if (!stale) {
						setBalance('Error');
					}
				}
			};

			fetchBalance();

			return () => {
				stale = true;
			};
		}
	}, [provider, account]);

	return balance;
}

export default useBalanceTracker;
