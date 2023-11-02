import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CHAINS } from '../utils/chains';

function useBalanceTracker() {
	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const customRpcUrl = CHAINS[chainId]?.url;
	const provider = new ethers.providers.StaticJsonRpcProvider(customRpcUrl);
	const [maticBalance, setMaticBalance] = useState<string>('');

	useEffect(() => {
		if (!provider || !account) return;

		let mounted = true;

		// Function to fetch MATIC balance
		const fetchMaticBalance = async () => {
			const balance = await provider.getBalance(account);
			if (mounted) {
				setMaticBalance(ethers.utils.formatEther(balance));
			}
		};

		// Listen to new blocks
		provider.on('block', async (blockNumber) => {
			// Fetch transactions from the block
			const block = await provider.getBlockWithTransactions(blockNumber);
			const isUserInvolved = block.transactions.some((tx) => tx.from === account || tx.to === account);

			// If user's address is involved in any transaction, update the balance
			if (isUserInvolved) {
				fetchMaticBalance();
			}
		});

		// Initial fetch
		fetchMaticBalance();

		// Clean up
		return () => {
			mounted = false;
			provider.removeAllListeners('block');
		};
	}, [provider, account]);

	return maticBalance;
}

export default useBalanceTracker;
