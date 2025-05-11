'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
import { CHAINS } from '../../../utils/chains';

interface TopContributorsProps {
	topContributors: any;
	loading: any;
	error: any;
}

const TopContributors: React.FC<TopContributorsProps> = ({ topContributors, loading, error }) => {
	const router = useRouter();
	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('rankedBySpent');

	const createSortHandler = (property: string) => () => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	let sortedData = [];

	if (topContributors) {
		sortedData = topContributors[orderBy] ? [...topContributors[orderBy]] : [];
		if (order === 'asc') {
			sortedData.reverse();
		}
	}

	const handlePlayer = (playerId: string) => () => {
		router.push(`/player/${playerId}`);
	};

	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const numberToOrdinal = (n: number) => {
		if (10 <= n % 100 && n % 100 <= 20) return n + 'th';
		switch (n % 10) {
			case 1:
				return n + 'st';
			case 2:
				return n + 'nd';
			case 3:
				return n + 'rd';
			default:
				return n + 'th';
		}
	};

	return (
		<>
			{loading || !sortedData ? (
				<LoadingScreen />
			) : (
				<>
					<Head>
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<meta name="robots" content="noindex" />
						<title>Ranking | Nerve Gloabl</title>
						<meta property="og:title" content="Ranking | Nerve Gloabl" key="title" />
						<meta property="og:site_name" content="Ranking | Nerve Gloabl" />
						<meta property="og:description" content="Ranking | Nerve Gloabl" />
						<meta property="og:image" content="https://app.nerveglobal.com/favicon.ico" />
						<meta property="og:url" content="https://app.nerveglobal.com/" />
						<meta property="og:type" content="website" />
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:site" content="@nerveglobal_" />
						<meta name="twitter:title" content="Ranking | Nerve Gloabl" />
						<meta name="twitter:description" content="Ranking | Nerve Gloabl" />
						<meta name="twitter:image" content="https://app.nerveglobal.com/favicon.ico" />
					</Head>

					<div className="flex flex-col items-center text-center w-full max-w-[1400px] px-4 md:px-8 mx-auto my-20">
						<div className="w-full overflow-x-auto">
							<table className="min-w-[750px] w-full text-left text-sm">
								<thead className="sticky top-0 z-10 bg-zinc-900 border-b border-secondary text-white font-semibold">
									<tr>
										<th className="w-[5%] px-4 py-3">#</th>
										<th className="w-[50%] px-4 py-3">Address</th>
										<th className="w-[45%] px-4 py-3 text-right">
											<button
												onClick={createSortHandler('rankedBySpent')}
												className="w-full flex justify-end items-center gap-1 text-white hover:text-accent text-sm"
											>
												Contributions
											</button>
										</th>
									</tr>
								</thead>
								<tbody className="text-white">
									{sortedData.length > 0 ? (
										sortedData.map((row, index) => (
											<tr key={index} className="even:bg-zinc-800 hover:bg-zinc-700 transition-all">
												<td className="px-4 py-3">{index + 1}</td>
												<td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
													<a
														href={`${CHAINS[137]?.blockExplorerUrls[0]}address/${row.id}`}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-1 hover:text-accent truncate"
													>
														<span>
															{typeof window !== 'undefined' && window.innerWidth < 680 ? `${row.id.slice(0, 6)}...${row.id.slice(-4)}` : row.id}
														</span>
													</a>
												</td>
												<td className="px-4 py-3 text-right">${row.spent}</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={3} className="text-center py-6 text-gray-400">
												No data available on this chain
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default TopContributors;
