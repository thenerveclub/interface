'use client';

import Head from 'next/head';
import Link from 'next/link';
import { FC, useState } from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
import { CHAINS } from '../../../utils/chains';

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
		<>
			<Head>
				<title>Ranking | Nerve Global</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex" />
				<meta property="og:title" content="Ranking | Nerve Global" />
				<meta property="og:site_name" content="Ranking | Nerve Global" />
				<meta property="og:description" content="Ranking | Nerve Global" />
				<meta property="og:image" content="https://app.nerveglobal.com/favicon.ico" />
				<meta property="og:url" content="https://app.nerveglobal.com/" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@nerveglobal_" />
				<meta name="twitter:title" content="Ranking | Nerve Global" />
				<meta name="twitter:description" content="Ranking | Nerve Global" />
				<meta name="twitter:image" content="https://app.nerveglobal.com/favicon.ico" />
			</Head>

			<div className="w-full">
				{loading || !sortedData ? (
					<LoadingScreen />
				) : (
					<div className="w-full max-w-[1400px] mx-auto">
						<table className="w-full table-auto border-collapse">
							<thead className="bg-zinc-900 border-b border-secondary text-left text-sm font-semibold text-white sticky top-0 z-10">
								<tr>
									<th className="px-4 py-3 w-[5%]">#</th>
									<th className="px-4 py-3 w-[55%]">Address</th>
									<th className="px-4 py-3 w-[40%] text-right">
										<button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} className="text-white hover:text-accent transition text-sm">
											Earnings
										</button>
									</th>
								</tr>
							</thead>
							<tbody className="text-sm text-white">
								{sortedData.length > 0 ? (
									sortedData.map((row, index) => (
										<tr key={index} className="hover:bg-zinc-800 transition-all">
											<td className="px-4 py-3">{index + 1}</td>
											<td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
												<Link
													href={`${CHAINS[137]?.blockExplorerUrls[0]}address/${row.id}`}
													target="_blank"
													className="flex items-center gap-1 text-white hover:text-accent transition truncate"
												>
													<span className="truncate">
														{typeof window !== 'undefined' && window.innerWidth < 680 ? `${row.id.slice(0, 6)}...${row.id.slice(-4)}` : row.id}
													</span>
													{/* <OpenInNew fontSize="small" className="text-gray-400" /> */}
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
				)}
			</div>
		</>
	);
};

export default TopEarners;
