'use client';

import { PeopleAlt } from '@mui/icons-material';
import Link from 'next/link';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { SiEthereum, SiGooglemaps, SiPolygon } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';

import SelectFilter from '../../../../components/SelectFilter';
import SelectSort from '../../../../components/SelectSort';
import CreateAtPlayer from '../../../../components/modal/create/createAtPlayer';
import useActivePlayerTasks from '../../../../hooks/playerData/useActivePlayerTasks';
import useCompletedPlayerTasks from '../../../../hooks/playerData/useCompletedPlayerTasks';
import { currencySlice } from '../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../utils/chains';

interface PlayerDaresProps {
	recipientAddress: string;
	recipientENS: string;
	error: any;
}

export default function PlayerDares({ recipientAddress, recipientENS, error }: PlayerDaresProps) {
	const dispatch = useDispatch();
	const account = useSelector((state: any) => state.account);
	const currencyValue = useSelector((state: any) => state.currency);
	const currencyPrice = useSelector((state: any) => state.currencyPrice);
	const sort = useSelector((state: any) => state.sort);
	const filter = useSelector((state: any) => state.filter);

	const activePlayerTasks = useActivePlayerTasks(recipientAddress);
	const completedPlayerTasks = useCompletedPlayerTasks(recipientAddress);

	const [tab, setTab] = useState(1);
	const [filteredActiveTasks, setFilteredActiveTasks] = useState([]);
	const [filteredCompletedTasks, setFilteredCompletedTasks] = useState([]);

	useEffect(() => {
		const combine = (allTasks: any) => Object.values(allTasks).flat();

		const sortTasks = (tasks: any[], sortType: number) => {
			if (!tasks) return [];
			const sorterMap = {
				1: (a, b) => a.amount - b.amount,
				2: (a, b) => b.amount - a.amount,
				3: (a, b) => a.participants - b.participants,
				4: (a, b) => b.participants - a.participants,
				5: (a, b) => a.entranceAmount - b.entranceAmount,
				6: (a, b) => b.entranceAmount - a.entranceAmount,
			};
			return [...tasks].sort(sorterMap[sortType] || (() => 0));
		};

		const filterChains = (tasks: any[], selected: number[]) => {
			return tasks.filter((task) => selected.includes(Number(task.chainId)));
		};

		const sortedActive = sortTasks(combine(activePlayerTasks), sort);
		const sortedCompleted = sortTasks(combine(completedPlayerTasks), sort);

		setFilteredActiveTasks(filterChains(sortedActive, filter));
		setFilteredCompletedTasks(filterChains(sortedCompleted, filter));
	}, [sort, activePlayerTasks, completedPlayerTasks, filter]);

	const formatCrypto = (value) => (Number(value) / 1e18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

	const formatNumber = (value) => (Number(value) / 1e18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const getChainLogo = (id) =>
		id === 1 || id === 11155111 ? <SiEthereum size={18} className="mr-1" /> : id === 137 ? <SiPolygon size={18} className="mr-1" /> : null;

	const handleMapClick = (lat, lng) => router.push(`/map?lat=${lat}&lng=${lng}`);

	return (
		<>
			<div className="w-full border-b border-secondary mt-10">
				<div className="flex justify-center gap-4 text-sm font-medium">
					<button onClick={() => setTab(1)} className={`py-2 ${tab === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
						Active Tasks
					</button>
					<button onClick={() => setTab(2)} className={`py-2 ${tab === 2 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
						Completed Tasks
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
				<SelectFilter />
				<SelectSort />
				{/* Optional toggle for USD/ETH */}
				{!error && (
					<div className="hidden sm:flex ml-auto">
						{account && account.toLowerCase() !== recipientAddress.toLowerCase() && (
							<CreateAtPlayer recipientAddress={recipientAddress} recipientENS={recipientENS} />
						)}
					</div>
				)}
			</div>

			{/* Tasks */}
			<ul className="mt-6 mb-20 flex flex-wrap gap-6 justify-center">
				{(tab === 1 ? filteredActiveTasks : filteredCompletedTasks).map((task: any) => (
					<li key={`${task.chainId}-${task.id}`} className="list-none">
						<div className="w-[90vw] max-w-[450px] min-h-[300px] bg-background border border-secondary rounded-2xl p-4 flex flex-col justify-between">
							{/* Header */}
							<div className="flex justify-between items-center mb-4">
								{task.latitude && task.longitude && (
									<button
										onClick={() => handleMapClick(task.latitude, task.longitude)}
										className="flex items-center gap-1 text-sm bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition"
									>
										<SiGooglemaps size={16} />
										Map
									</button>
								)}
								<div className="flex items-center text-sm bg-white/10 px-3 py-1 rounded-md text-gray-700 dark:text-white">
									{getChainLogo(task.chainId)}
									{CHAINS[task.chainId]?.name}
								</div>
							</div>

							{/* Description */}
							<p className="text-sm text-center flex-grow">{task.description}</p>

							{/* Bottom */}
							<div className="mt-4 flex flex-col gap-2">
								<div className="flex justify-between text-sm">
									<span>#{task.id}</span>
									<span className="flex items-center gap-1">
										{task.participants}
										<PeopleAlt style={{ fontSize: '18px' }} />
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>
										{currencyValue === false
											? `${formatCrypto(task.entranceAmount)} ${CHAINS[task.chainId]?.nameToken}`
											: `$${formatNumber(task.entranceAmount * currencyPrice[CHAINS[task.chainId]?.nameToken?.toLowerCase()] || 0)}`}
									</span>
									<span>
										{currencyValue === false
											? `${formatCrypto(task.amount)} ${CHAINS[task.chainId]?.nameToken}`
											: `$${formatNumber(task.amount * currencyPrice[CHAINS[task.chainId]?.nameToken?.toLowerCase()] || 0)}`}
									</span>
								</div>
								<Link
									href={`/dare/${task.chainId}-${task.id}`}
									className="block mt-2 w-full text-center py-2 bg-accent text-white rounded-md text-sm font-semibold hover:bg-accent/90 transition"
								>
									View Task
								</Link>
							</div>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
