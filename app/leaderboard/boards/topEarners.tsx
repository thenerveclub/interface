'use client';

import Link from 'next/link';
import { FC, useState } from 'react';

interface TopEarnerProps {
	topEarners: Record<string, any[]> | null;
	loading: boolean;
	error: any;
}

const TopEarners: FC<TopEarnerProps> = ({ topEarners, loading }) => {
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
	const [orderBy, setOrderBy] = useState<string>('rankedByEarned');

	let sortedData: any[] = [];

	if (topEarners) {
		sortedData = topEarners[orderBy] ? [...topEarners[orderBy]] : [];
		if (order === 'asc') {
			sortedData.reverse();
		}
	}

	return (
		<div className="w-full">
			<div className="w-full max-w-[1400px] mb-32 mx-auto">
				<table className="w-full table-auto border-collapse">
					<thead className="bg-zinc-200 dark:bg-zinc-900 border-b border-accent text-left text-sm 3xl:text-xl font-semibold text-black dark:text-white sticky top-0 z-10">
						<tr>
							<th className="px-4 py-3 w-[5%]">#</th>
							<th className="px-4 py-3 w-[55%]">Address</th>
							<th className="px-4 py-3 w-[40%] text-right">
								<button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} className="hover:text-accent transition">
									Earnings
								</button>
							</th>
						</tr>
					</thead>
					<tbody className="group text-sm 3xl:text-xl text-black dark:text-white">
						{sortedData.length > 0 ? (
							sortedData.map((row, index) => (
								<tr key={index} className="even:bg-zinc-200 dark:even:bg-zinc-900 hover:text-accent">
									<td className="px-4 py-3">{index + 1}</td>
									<td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
										<Link href={`/player/${row.id}`} className="flex items-center gap-1 truncate cursor-default">
											<span className="truncate hover:underline cursor-pointer">
												{typeof window !== 'undefined' && window.innerWidth < 680 ? `${row.id.slice(0, 6)}...${row.id.slice(-4)}` : row.id}
											</span>
										</Link>
									</td>
									<td className="px-4 py-3 text-right">${row.earned}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={3} className="text-center py-6 text-gray-400">
									No data available on this chain.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TopEarners;
