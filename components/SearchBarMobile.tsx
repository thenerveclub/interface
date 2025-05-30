'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { SiEthereum, SiPolygon } from 'react-icons/si';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
import useTrendingPlayerList from '../hooks/searchData/trending/useTrendingPlayerList';
import useDareDataSearchList from '../hooks/searchData/useDareDataSearchList';
import usePlayerDataSearchList from '../hooks/searchData/usePlayerDataSearchList';
import { nameToChainId } from '../utils/chains';

interface SearchBarMobileProps {
	network: string;
}

const SearchBarMobile: React.FC<SearchBarMobileProps> = ({ network }) => {
	const router = useRouter();
	const chainIdUrl = nameToChainId[network];
	const [searchValue, setSearchValue] = useState('');
	const [searchValueQuery, setSearchValueQuery] = useState('');
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const playerSearchList = usePlayerDataSearchList(searchValueQuery);
	const trendingPlayersList = useTrendingPlayerList(chainIdUrl);
	const trendingDareList = useTrendingDareList(chainIdUrl);
	const dareSearchList = useDareDataSearchList(chainIdUrl, searchValueQuery);
	const [searchHistory, setSearchHistory] = useState<any[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const savedHistory = localStorage.getItem('searchHistory');
		setSearchHistory(savedHistory ? JSON.parse(savedHistory) : []);
	}, []);

	const addToSearchHistory = (item: any) => {
		const newHistory = [item, ...searchHistory.filter((i) => i.id !== item.id)].slice(0, 3);
		localStorage.setItem('searchHistory', JSON.stringify(newHistory));
		setSearchHistory(newHistory);
	};

	const clearSearchHistory = () => {
		setSearchHistory([]);
		localStorage.removeItem('searchHistory');
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
		typingTimeoutRef.current = setTimeout(() => setSearchValueQuery(value), 500);
	};

	const handleListPlayerItemClick = (id: string, address: string) => {
		router.push(`/player/${id || address}`);
		setSearchValue('');
		setIsOpen(false);
		addToSearchHistory({ type: 'player', id, address });
	};

	const handleListDareItemClick = (id: string, amount: string, participants: number) => {
		router.push(`/dare/${id}`);
		setSearchValue('');
		setIsOpen(false);
		addToSearchHistory({ type: 'dare', id, amount, participants });
	};

	const formatNumber = (value: string) =>
		(Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

	return (
		<div className="flex md:hidden">
			<button onClick={() => setIsOpen(true)} className="p-2 text-black dark:text-white">
				<IoSearchSharp size={24} />
			</button>

			{isOpen && (
				<div className="fixed inset-0 bg-background z-50 p-4 overflow-y-auto flex flex-col">
					<div className="flex justify-between items-center mb-4">
						<input
							type="text"
							value={searchValue}
							onChange={handleSearchChange}
							placeholder="Search players and dares..."
							className="bg-transparent w-full p-2 rounded border text-black dark:text-white border-secondary placeholder-gray-400 dark:placeholder-gray-400 placeholder:text-md text-lg px-4 py-3 rounded-md focus:outline-none focus:ring-accent focus:border-transparent"
						/>
						{/* <button onClick={() => setIsOpen(false)} className="ml-2 text-white">
							<CloseOutlined />
						</button> */}
					</div>

					{/* Search History */}
					{searchValue.trim() === '' && searchHistory.length > 0 && (
						<div className="mb-4 text-black dark:text-white">
							<div className="text-md font-semibold flex justify-between mb-2">
								<span>Recent Searches</span>
								<button onClick={clearSearchHistory} className="hover:text-accent dark:hover:text-accent">
									Clear
								</button>
							</div>
							{searchHistory.map((item, index) => (
								<div
									key={item.id}
									onClick={() => {
										if (item.type === 'player') handleListPlayerItemClick(item.id, item.address);
										else handleListDareItemClick(item.id, item.amount, item.participants);
									}}
									className={`px-0 py-3 text-sm cursor-pointer ${index % 2 === 1 ? 'bg-zinc-200 dark:bg-zinc-900' : ''}`}
								>
									{item.id}
								</div>
							))}
						</div>
					)}

					{/* Player Search List */}
					<div className="space-y-4 flex-grow">
						{playerSearchList.length > 0 && (
							<div>
								<div className="text-sm font-semibold text-secondary mb-2">Players</div>
								{playerSearchList.map((player) => (
									<div
										key={player.id}
										onClick={() => handleListPlayerItemClick(player.name, player.resolver?.addr?.id)}
										className="p-2 border-b border-secondary text-sm cursor-pointer"
									>
										<div>{player.name}</div>
										<div className="text-xs text-muted">{player.resolver?.addr?.id}</div>
									</div>
								))}
							</div>
						)}

						{/* Dare Search List */}
						{dareSearchList.length > 0 && (
							<div>
								<div className="text-sm font-semibold text-secondary mb-2">Dares</div>
								{dareSearchList.map((dare) => (
									<div
										key={dare.id}
										onClick={() => handleListDareItemClick(dare.description, dare.amount, dare.participants)}
										className="p-2 border-b border-secondary text-sm cursor-pointer"
									>
										<div>{dare.description.length > 25 ? `${dare.description.substring(0, 25)}...` : dare.description}</div>
										<div className="text-xs text-muted">
											{formatNumber(dare.amount)} {chainIdUrl === 137 ? <SiPolygon size={12} /> : <SiEthereum size={12} />} - {dare.participants}{' '}
											participants
										</div>
									</div>
								))}
							</div>
						)}

						{/* No players or dares found */}
						{playerSearchList.length === 0 && dareSearchList.length === 0 && searchValue.trim() !== '' && (
							<div className="text-sm text-gray-400 dark:text-gray-400">No players or dares found.</div>
						)}

						{/* Trending Players */}
						{searchValue.trim() === '' && (
							<div className="flex flex-col">
								<div className="flex flex-col">
									<div className="text-md font-semibold text-black dark:text-white mt-0 mb-2">Trending Players</div>
									{trendingPlayersList.length > 0 ? (
										trendingPlayersList.map((player) => (
											<div
												key={player.id}
												onClick={() => handleListPlayerItemClick(player.userName, player.id)}
												className="p-2 border-b border-secondary cursor-pointer"
											>
												<div>{player.userName}</div>
												<div className="">{player.id}</div>
											</div>
										))
									) : (
										<div className="text-sm text-gray-400 dark:text-gray-400">No trending players found.</div>
									)}
								</div>

								{/* Trending Dares */}
								<div className="flex flex-col mt-8">
									<div className="text-md font-semibold text-black dark:text-white mt-0 mb-2">Trending Dares</div>
									{trendingDareList.length > 0 ? (
										trendingDareList.map((dare) => (
											<div
												key={dare.id}
												onClick={() => handleListDareItemClick(dare.description, dare.amount, dare.participants)}
												className="p-2 border-b border-secondary text-sm cursor-pointer"
											>
												<div>{dare.description.length > 25 ? `${dare.description.substring(0, 25)}...` : dare.description}</div>
												<div className="text-xs text-muted">
													{formatNumber(dare.amount)} {chainIdUrl === 137 ? <SiPolygon size={12} /> : <SiEthereum size={12} />} - {dare.participants}{' '}
													participants
												</div>
											</div>
										))
									) : (
										<div className="text-sm text-gray-400 dark:text-gray-400">No trending dares found.</div>
									)}
								</div>
							</div>
						)}
					</div>
					{/* Close Button */}
					<div className="text-center mb-10">
						<button onClick={() => setIsOpen(false)} className="py-2 px-4 bg-accent text-white rounded-md transition">
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchBarMobile;
