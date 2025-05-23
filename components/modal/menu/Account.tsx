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
	const formattedAddress = account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : '';

	return (
		<button
			onClick={() => router.push(`/player/${account}`)}
			className="flex items-center justify-center gap-2 border border-accent text-xs text-accent dark:text-accent px-4 py-2 rounded-md transition focus:outline-none"
		>
			<Identicon />

			{/* ENS or short address shown only on large screens */}
			<span className="hidden lg:flex">{formattedAddress}</span>
		</button>
	);
};

export default AccountModal;
