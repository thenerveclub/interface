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

	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
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
		if (total === 0) return <span className="text-white">—</span>;
		const percentage = (pos / total) * 100;
		const formatted = percentage.toFixed(2) + '%';
		return <span className={percentage >= 50 ? 'text-green-500' : 'text-red-500'}>{formatted}</span>;
	};

	const getValue = (row: any) => {
		if (orderBy === 'voters') {
			return Number(row.positiveVotes) + Number(row.negativeVotes);
		}

		if (orderBy === 'voting') {
			const pos = Number(row.positiveVotes);
			const neg = Number(row.negativeVotes);
			const total = pos + neg;
			if (total === 0) return { percentage: 0, totalVotes: 0, isNeutral: true };
			const percentage = (pos / total) * 100;
			return { percentage, totalVotes: total, isNeutral: false };
		}

		let base = Number(row[orderBy] || 0);
		if (currencyValue === true && (orderBy === 'amount' || orderBy === 'entranceAmount')) {
			const token = CHAINS[row.chainId]?.nameToken?.toLowerCase();
			const price = currencyPrice[token] || 0;
			base *= price;
		}
		return base;
	};

	const sortedData = [...topDares].sort((a, b) => {
		if (orderBy === 'voting') {
			const aVal = getValue(a);
			const bVal = getValue(b);

			// Handle ascending vs descending
			const direction = order === 'asc' ? -1 : 1;

			// Case 1: Both neutral (0 votes)
			if (aVal.isNeutral && bVal.isNeutral) {
				return (Number(a.id) - Number(b.id)) * direction;
			}

			// Case 2: One is neutral, the other is not
			if (aVal.isNeutral) return 1 * direction; // Neutral goes below in desc, above in asc
			if (bVal.isNeutral) return -1 * direction;

			// Case 3: Both have votes
			const aPercentage = aVal.percentage;
			const bPercentage = bVal.percentage;
			const aTotalVotes = aVal.totalVotes;
			const bTotalVotes = bVal.totalVotes;

			// Determine if green (≥50%) or red (<50%)
			const aIsGreen = aPercentage >= 50;
			const bIsGreen = bPercentage >= 50;

			// Case 4: One is green, the other is red
			if (aIsGreen && !bIsGreen) return -1 * direction; // Green above red in desc
			if (!aIsGreen && bIsGreen) return 1 * direction;

			// Case 5: Both green or both red
			if (aPercentage !== bPercentage) {
				return (bPercentage - aPercentage) * direction; // Higher percentage first in desc
			} else {
				// If percentages are equal, use vote count as tie-breaker
				if (aIsGreen) {
					// Green: more votes is better
					return (bTotalVotes - aTotalVotes) * direction;
				} else {
					// Red: fewer votes is better
					return (aTotalVotes - bTotalVotes) * direction;
				}
			}
		}

		const aVal = getValue(a);
		const bVal = getValue(b);
		return order === 'asc' ? aVal - bVal : bVal - aVal;
	});

	return (
		<div className="w-full">
			<div className="w-full max-w-[1400px] mb-32 mx-auto">
				<table className="w-full table-auto border-collapse">
					<thead className="bg-zinc-200 dark:bg-zinc-900 border-b border-accent text-left text-sm 3xl:text-xl font-semibold text-black dark:text-white sticky top-0 z-10">
						<tr>
							<th className="px-4 py-3 w-[2.5%]">#</th>
							<th className="px-4 py-3 w-[47.5%]">Description</th>
							<th
								onClick={createSortHandler('entranceAmount')}
								className="px-4 py-3 text-right hidden lg:table-cell cursor-pointer hover:text-accent transition"
							>
								Entry Amount
							</th>
							<th onClick={createSortHandler('amount')} className="px-4 py-3 text-right cursor-pointer hover:text-accent transition">
								<span className="block lg:hidden">Total</span>
								<span className="hidden lg:block">Total Amount</span>
							</th>
							<th
								onClick={createSortHandler('participants')}
								className="px-4 py-3 text-right hidden lg:table-cell cursor-pointer hover:text-accent transition"
							>
								Participants
							</th>
							<th
								onClick={createSortHandler('voters')}
								className="px-4 py-3 text-right hidden lg:table-cell cursor-pointer hover:text-accent transition"
							>
								Voters
							</th>
							<th
								onClick={createSortHandler('voting')}
								className="px-4 py-3 text-right hidden lg:table-cell cursor-pointer hover:text-accent transition"
							>
								Voting
							</th>
						</tr>
					</thead>
					<tbody className="group text-sm 3xl:text-xl text-black dark:text-white">
						{sortedData.length > 0 ? (
							sortedData.map((row: any, index: number) => (
								<tr key={index} className="even:bg-zinc-200 dark:even:bg-zinc-900 hover:text-accent transition-all">
									<td className="px-4 py-3">{index + 1}</td>
									<td className="px-4 py-3 max-w-[250px] sm:max-w-[600px] md:max-w-[750px] truncate">
										<Link href={`/dare/${row.chainId}-${row.id}`} className="truncate hover:underline cursor-pointer">
											{row.description.length > 75 ? row.description.slice(0, 75) + '...' : row.description}
										</Link>
									</td>
									<td className="px-4 py-3 text-right hidden lg:table-cell">
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
									<td className="px-4 py-3 text-right hidden lg:table-cell">{row.participants}</td>
									<td className="px-4 py-3 text-right hidden lg:table-cell">{Number(row.positiveVotes) + Number(row.negativeVotes)}</td>
									<td className="px-4 py-3 text-right hidden lg:table-cell">{calculatePositivePercentage(row.positiveVotes, row.negativeVotes)}</td>
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
