'use client';

import { useState } from 'react';
import { FaArrowDown, FaArrowUp, FaLightbulb, FaUserPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { currencySlice } from '../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../utils/chains';

interface ActivityTableProps {
	dareData: any;
}

export default function ActivityTable({ dareData }: ActivityTableProps) {
	const dispatch = useDispatch();
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: any }) => state.currencyPrice);

	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('blockNumber');
	const [isParticipantsSelected, setIsParticipantsSelected] = useState(true);
	const [isVotedSelected, setIsVotedSelected] = useState(false);

	const createSortHandler = (property: string) => () => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	let sortedData: any[] = [];
	if (dareData && Array.isArray(dareData)) {
		sortedData = [...dareData].sort((a, b) => {
			let aValue = Number(a[orderBy]);
			let bValue = Number(b[orderBy]);
			return order === 'asc' ? aValue - bValue : bValue - aValue;
		});
	}

	const filteredData = sortedData.filter((row) => {
		if (isVotedSelected && !row.voted) return false;
		return true;
	});

	const participantData = filteredData.filter((row) => {
		return isParticipantsSelected || row.task.initiatorAddress === row.userAddress;
	});

	const handleToggle = (event: any, newCurrency: boolean) => {
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	const formatCrypto = (value: number) =>
		(Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});

	const formatNumber = (value: number) =>
		(Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

	if (!dareData) return null;

	const chainId = dareData[0]?.task?.chainId;
	const token = CHAINS[chainId]?.nameToken?.toLowerCase();

	return (
		<div className="w-full max-h-[500px] bg-white dark:bg-neutral-900 border border-neutral-700 rounded-xl overflow-auto backdrop-blur-md">
			<div className="px-4 pt-4">
				<h2 className="text-base font-medium mb-2">Activity</h2>
				<hr className="border-b border-neutral-700" />
			</div>

			<div className="flex justify-between items-center px-4 py-2 text-sm">
				<div className="flex gap-2">
					<button
						onClick={() => setIsParticipantsSelected(!isParticipantsSelected)}
						className={`px-3 py-1 border rounded-md ${isParticipantsSelected ? 'text-white border-white' : 'text-gray-400 border-gray-500'}`}
					>
						Participants
					</button>
					<button
						onClick={() => setIsVotedSelected(!isVotedSelected)}
						className={`px-3 py-1 border rounded-md ${isVotedSelected ? 'text-white border-white' : 'text-gray-400 border-gray-500'}`}
					>
						Voted
					</button>
				</div>
				<div className="flex gap-2 text-sm">
					<button
						onClick={() => handleToggle(null, false)}
						disabled={!currencyValue}
						className={`px-3 py-1 border rounded-md ${!currencyValue ? 'text-white border-white' : 'text-gray-400 border-gray-500'}`}
					>
						{CHAINS[chainId]?.nameToken}
					</button>
					<button
						onClick={() => handleToggle(null, true)}
						disabled={currencyValue}
						className={`px-3 py-1 border rounded-md ${currencyValue ? 'text-white border-white' : 'text-gray-400 border-gray-500'}`}
					>
						USD
					</button>
				</div>
			</div>

			<table className="min-w-full text-sm text-left px-4">
				<thead className="sticky top-0 z-10 bg-neutral-800 text-gray-300">
					<tr>
						<th className="px-4 py-2">Event</th>
						<th className="px-4 py-2">Amount</th>
						<th className="px-4 py-2">Address</th>
						<th className="px-4 py-2 cursor-pointer" onClick={createSortHandler('voted')}>
							Voted {orderBy === 'voted' && (order === 'asc' ? <FaArrowUp className="inline ml-1" /> : <FaArrowDown className="inline ml-1" />)}
						</th>
						<th className="px-4 py-2 cursor-pointer" onClick={createSortHandler('vote')}>
							Vote {orderBy === 'vote' && (order === 'asc' ? <FaArrowUp className="inline ml-1" /> : <FaArrowDown className="inline ml-1" />)}
						</th>
						<th className="px-4 py-2 cursor-pointer" onClick={createSortHandler('blockNumber')}>
							Time {orderBy === 'blockNumber' && (order === 'asc' ? <FaArrowUp className="inline ml-1" /> : <FaArrowDown className="inline ml-1" />)}
						</th>
					</tr>
				</thead>
				<tbody>
					{participantData.length > 0 ? (
						participantData.map((row, index) => (
							<tr key={index} className="border-t border-neutral-800 hover:bg-neutral-800/30 transition">
								<td className="px-4 py-3 flex items-center gap-2">
									{row.task.initiatorAddress === row.userAddress ? (
										<>
											<FaLightbulb className="text-green-400 text-xs" />
											<span className="text-green-400">Creator</span>
										</>
									) : (
										<>
											<FaUserPlus className="text-orange-400 text-xs" />
											<span className="text-orange-400">Joined</span>
										</>
									)}
								</td>
								<td className="px-4 py-3 whitespace-nowrap">
									{row.task.initiatorAddress === row.userAddress
										? currencyValue
											? `$${formatNumber(row.task.entranceAmount * currencyPrice[token])}`
											: `${formatCrypto(row.task.entranceAmount)} ${CHAINS[chainId].nameToken}`
										: currencyValue
										? `$${formatNumber(row.userStake * currencyPrice[token])}`
										: `${formatCrypto(row.userStake)} ${CHAINS[chainId].nameToken}`}
								</td>
								<td className="px-4 py-3">{`${row.userAddress.slice(0, 6)}...${row.userAddress.slice(-4)}`}</td>
								<td className="px-4 py-3 text-right">{row.voted ? 'Yes' : 'No'}</td>
								<td className="px-4 py-3 text-right">{row.voted ? (row.vote ? 'True' : 'False') : ''}</td>
								<td className="px-4 py-3 text-right">{row.blockNumber}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={6} className="px-4 py-4 text-center text-gray-500">
								No activities yet
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
