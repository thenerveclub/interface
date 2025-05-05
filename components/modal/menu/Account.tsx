'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Identicon from '../../Identicon';

interface AccountModalProps {
	account: string | null;
	ens: string | null;
	network: any;
}

const AccountModal: React.FC<AccountModalProps> = ({ account, ens }) => {
	const router = useRouter();

	console.log('ens', ens);
	console.log('account', account);

	const formattedAddress = account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : '';

	return (
		<button
			onClick={() => router.push(`/player/${account}`)}
			className="flex items-center justify-center gap-2 border border-secondary text-xs text-white dark:text-white px-4 py-2 rounded-md transition hover:border-accent hover:text-accent dark:hover:text-accent focus:outline-none"
		>
			<Identicon />

			{/* ENS or short address shown only on large screens */}
			<span className="hidden lg:flex">{formattedAddress}</span>
		</button>
	);
};

export default AccountModal;
