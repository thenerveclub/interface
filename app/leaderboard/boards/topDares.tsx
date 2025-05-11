'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import { currencySlice } from '../../../state/currency/currencySlice';
import { CHAINS } from '../../../utils/chains';

interface TopDaresProps {
	topDares: any;
	loading: any;
	error: any;
}

const TopDares: React.FC<TopDaresProps> = ({ topDares, loading, error }) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const currencyValue = useSelector((state: any) => state.currency);
	const currencyPrice = useSelector((state: any) => state.currencyPrice);

	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('amount');

	const createSortHandler = (property: string) => () => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const handleDare = (chainID: number, dareID: string) => () => {
		router.push(`/dare/${chainID}-${dareID}`);
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

	return (
		<>
			{loading || !topDares ? (
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

					<div className="flex flex-col w-full max-w-[1400px] mx-auto px-4 md:px-8 my-20">
						<div className="overflow-x-auto w-full">
							<table className="min-w-[750px] w-full text-left text-sm">
								<thead className="bg-zinc-900 border-b border-secondary text-white font-semibold">
									<tr>
										<th className="px-4 py-3 w-[2.5%]">#</th>
										<th className="px-4 py-3 w-[47.5%]">Description</th>
										<th className="px-4 py-3 text-right hidden sm:table-cell">Entry Amount</th>
										<th className="px-4 py-3 text-right">Total Amount</th>
										<th className="px-4 py-3 text-right hidden sm:table-cell">Participants</th>
										<th className="px-4 py-3 text-right hidden sm:table-cell">Voters</th>
										<th className="px-4 py-3 text-right hidden sm:table-cell">Voting</th>
									</tr>
								</thead>
								<tbody className="text-white">
									{topDares.length > 0 ? (
										topDares.map((row: any, index: number) => (
											<tr key={index} onClick={handleDare(row.chainId, row.id)} className="cursor-pointer hover:bg-zinc-800 transition-all">
												<td className="px-4 py-3">{index + 1}</td>
												<td className="px-4 py-3">
													<a>{row.description.length > 75 ? row.description.slice(0, 75) + '...' : row.description}</a>
												</td>
												<td className="px-4 py-3 text-right hidden sm:table-cell">
													{currencyValue === false ? (
														<a>
															{formatNumber(row.entranceAmount)} {CHAINS[row.chainId]?.nameToken}
														</a>
													) : (
														<a>${formatNumber(row.entranceAmount * currencyPrice[CHAINS[row.chainId]?.nameToken.toLowerCase()])}</a>
													)}
												</td>
												<td className="px-4 py-3 text-right">
													{currencyValue === false ? (
														<a>
															{formatNumber(row.amount)} {CHAINS[row.chainId]?.nameToken}
														</a>
													) : (
														<a>${formatNumber(row.amount * currencyPrice[CHAINS[row.chainId]?.nameToken.toLowerCase()])}</a>
													)}
												</td>
												<td className="px-4 py-3 text-right hidden sm:table-cell">{row.participants}</td>
												<td className="px-4 py-3 text-right hidden sm:table-cell">{Number(row.positiveVotes) + Number(row.negativeVotes)}</td>
												<td className="px-4 py-3 text-right hidden sm:table-cell">
													{calculatePositivePercentage(row.positiveVotes, row.negativeVotes)}
												</td>
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
				</>
			)}
		</>
	);
};

export default TopDares;
