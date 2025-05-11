'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CHAINS } from '../../../utils/chains';

interface TopDaresProps {
	topDares: any;
	loading: any;
	error: any;
}

const TopDares: React.FC<TopDaresProps> = ({ topDares, loading, error }) => {
	const currencyValue = useSelector((state: any) => state.currency);
	const currencyPrice = useSelector((state: any) => state.currencyPrice);

	const [order, setOrder] = useState<'asc' | 'desc'>('asc');
	const [orderBy, setOrderBy] = useState<string>('amount');

	const createSortHandler = (property: string) => () => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const formatNumber = (value: string | number) => {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const calculatePositivePercentage = (positiveVotes: string, negativeVotes: string) => {
		const pos = Number(positiveVotes);
		const neg = Number(negativeVotes);
		const total = pos + neg;
		if (total === 0) return <span className="text-white">0.00%</span>;
		const percentage = (pos / total) * 100;
		const formatted = percentage.toFixed(2) + '%';
		return <span className={percentage >= 50 ? 'text-green-500' : 'text-red-500'}>{formatted}</span>;
	};

	// Sort data based on selected property
	const sortedData = [...topDares].sort((a, b) => {
		const getValue = (row: any) => {
			if (orderBy === 'voters') {
				return Number(row.positiveVotes) + Number(row.negativeVotes);
			}

			let base = Number(row[orderBy] || 0);
			if (currencyValue === true && (orderBy === 'amount' || orderBy === 'entranceAmount')) {
				const token = CHAINS[row.chainId]?.nameToken?.toLowerCase();
				const price = currencyPrice[token] || 0;
				base *= price;
			}
			return base;
		};

		const aVal = getValue(a);
		const bVal = getValue(b);

		return order === 'asc' ? aVal - bVal : bVal - aVal;
	});

	return (
		<div className="w-full">
			<div className="w-full max-w-[1400px] mx-auto">
				<table className="w-full table-auto border-collapse">
					<thead className="bg-zinc-900 border-b border-secondary text-left text-sm font-semibold text-white sticky top-0 z-10">
						<tr>
							<th className="px-4 py-3 w-[2.5%]">#</th>
							<th className="px-4 py-3 w-[47.5%]">Description</th>
							<th
								onClick={createSortHandler('entranceAmount')}
								className="px-4 py-3 text-right hidden sm:table-cell cursor-pointer hover:text-accent transition"
							>
								Entry Amount
							</th>
							<th onClick={createSortHandler('amount')} className="px-4 py-3 text-right cursor-pointer hover:text-accent transition">
								Total Amount
							</th>
							<th
								onClick={createSortHandler('participants')}
								className="px-4 py-3 text-right hidden sm:table-cell cursor-pointer hover:text-accent transition"
							>
								Participants
							</th>
							<th
								onClick={createSortHandler('voters')}
								className="px-4 py-3 text-right hidden sm:table-cell cursor-pointer hover:text-accent transition"
							>
								Voters
							</th>
							<th
								onClick={createSortHandler('positiveVotes')}
								className="px-4 py-3 text-right hidden sm:table-cell cursor-pointer hover:text-accent transition"
							>
								Voting
							</th>
						</tr>
					</thead>
					<tbody className="text-sm text-black dark:text-white">
						{sortedData.length > 0 ? (
							sortedData.map((row: any, index: number) => (
								<tr key={index} className="even:bg-zinc-900 hover:text-accent transition-all">
									<td className="px-4 py-3">{index + 1}</td>
									<td className="px-4 py-3">
										<Link href={`/dare/${row.chainId}-${row.id}`} className="truncate hover:underline cursor-pointer">
											{row.description.length > 75 ? row.description.slice(0, 75) + '...' : row.description}
										</Link>
									</td>
									<td className="px-4 py-3 text-right hidden sm:table-cell">
										{currencyValue === false ? (
											<>
												{formatNumber(row.entranceAmount)} {CHAINS[row.chainId]?.nameToken}
											</>
										) : (
											<>${formatNumber(row.entranceAmount * currencyPrice[CHAINS[row.chainId]?.nameToken.toLowerCase()])}</>
										)}
									</td>
									<td className="px-4 py-3 text-right">
										{currencyValue === false ? (
											<>
												{formatNumber(row.amount)} {CHAINS[row.chainId]?.nameToken}
											</>
										) : (
											<>${formatNumber(row.amount * currencyPrice[CHAINS[row.chainId]?.nameToken.toLowerCase()])}</>
										)}
									</td>
									<td className="px-4 py-3 text-right hidden sm:table-cell">{row.participants}</td>
									<td className="px-4 py-3 text-right hidden sm:table-cell">{Number(row.positiveVotes) + Number(row.negativeVotes)}</td>
									<td className="px-4 py-3 text-right hidden sm:table-cell">{calculatePositivePercentage(row.positiveVotes, row.negativeVotes)}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={7} className="text-center py-6 text-gray-400">
									No data available on this chain
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TopDares;
