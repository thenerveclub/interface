'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SiEthereum, SiPolygon } from 'react-icons/si';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
import useTrendingPlayerList from '../hooks/searchData/trending/useTrendingPlayerList';
import useDareDataSearchList from '../hooks/searchData/useDareDataSearchList';
import usePlayerDataSearchList from '../hooks/searchData/usePlayerDataSearchList';
import { nameToChainId } from '../utils/chains';
import PortalModal from './PortalModal';
import SearchBarMobile from './SearchBarMobile';

interface SearchBarProps {
	network: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ network }) => {
	const router = useRouter();
	const chainIdUrl = nameToChainId[network];
	const [searchValue, setSearchValue] = useState('');
	const [searchValueQuery, setSearchValueQuery] = useState('');
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const playerSearchList = usePlayerDataSearchList(searchValueQuery);
	const trendingPlayersList = useTrendingPlayerList(chainIdUrl);
	const trendingDareList = useTrendingDareList(chainIdUrl);
	const dareSearchList = useDareDataSearchList(chainIdUrl, searchValueQuery);
	const [isListVisible, setListVisible] = useState(false);
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
		setListVisible(true);
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
		typingTimeoutRef.current = setTimeout(() => setSearchValueQuery(value), 500);
	};

	const handleListPlayerItemClick = (id: string, address: string, value?: string) => {
		if (id && address === '') router.push(`/player/${value}`);
		else if (!id && address) router.push(`/player/${address}`);
		else router.push(`/player/${id}`);
		setSearchValue('');
		setListVisible(false);
		addToSearchHistory({ type: 'player', id, address });
		setIsOpen(false);
	};

	const handleListDareItemClick = (id: string, amount: string, participants: number) => {
		router.push(`/dare/${id}`);
		setSearchValue('');
		setListVisible(false);
		addToSearchHistory({ type: 'dare', id, amount, participants });
		setIsOpen(false);
	};

	const formatNumber = (value: string) =>
		(Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

	// Modal visibility
	const [open, setOpen] = useState(false);
	const handleModalToggle = () => {
		const newState = !open;
		setOpen(newState);

		if (newState) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	};

	return (
		<>
			{/* Search Button */}
			<button
				onClick={handleModalToggle}
				className="hidden md:flex py-1 bg-transparent hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg"
			>
				Search
			</button>

			{/* Modal */}
			<PortalModal isOpen={open} onClose={handleModalToggle}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center -mt-24 md:-mt-0">Search</h2>
					<input
						type="text"
						value={searchValue}
						onChange={handleSearchChange}
						onFocus={() => setListVisible(true)}
						placeholder="Search players and dares..."
						autoFocus
						className="w-full bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 placeholder:text-md text-lg px-4 py-3 rounded-md focus:outline-none focus:ring-0 focus:border-accent border-gray-400"
					/>

					{/* Dropdown List */}
					{isListVisible && (
						<div className="mt-2 rounded-md bg-background text-black dark:text-white max-h-[400px] w-full">
							{searchValue.trim() === '' && searchHistory.length > 0 && (
								<div className="px-4 py-3 text-md font-bold flex justify-between items-center">
									<span>Recent Searches</span>
									<button onClick={clearSearchHistory} type="button" className="hover:text-accent dark:hover:text-accent">
										Clear
									</button>
								</div>
							)}

							{/* Search History */}
							{searchHistory.map((item, index) => (
								<div
									key={item.id}
									onClick={() => {
										if (item.type === 'player' || searchValue.includes('0x')) {
											handleListPlayerItemClick(item.id, item.address, searchValue.toLowerCase());
										} else {
											handleListDareItemClick(item.id, item.amount, item.participants);
										}
									}}
									className={`group px-4 py-3 cursor-pointer transition text-sm 
                text-black dark:text-white 
                ${index % 2 === 1 ? 'bg-zinc-200 dark:bg-zinc-900' : ''} 
                hover:bg-secondary/20`}
								>
									{item.type === 'player' ? (
										<div>
											<div className="group-hover:text-accent">{item.id}</div>
											<div className="text-gray-400 dark:text-gray-400 group-hover:text-accent">{item.address}</div>
										</div>
									) : (
										<div>
											<div className="group-hover:text-accent">{item.id}</div>
											<div className="text-gray-400 dark:text-gray-400 group-hover:text-accent">
												{formatNumber(item.amount)} {chainIdUrl === 137 ? <SiPolygon size={12} /> : <SiEthereum size={12} />} – {item.participants}{' '}
												participants
											</div>
										</div>
									)}
								</div>
							))}

							{/* Player Search List */}
							{(playerSearchList.length > 0 || dareSearchList.length > 0) && (
								<>
									{playerSearchList.length > 0 && <div className="px-4 py-3 text-xs font-bold text-secondary">Players</div>}
									{playerSearchList.map((player) => (
										<div
											key={player.id}
											onClick={() => handleListPlayerItemClick(player.name, player.resolver?.addr?.id)}
											className="px-4 py-3 cursor-pointer hover:bg-secondary/20 transition text-sm"
										>
											<div>{player.name}</div>
											<div className="text-xs text-muted">{player.resolver?.addr?.id}</div>
										</div>
									))}

									{/* Dare Search List */}
									{dareSearchList.length > 0 && <div className="px-4 py-3 text-xs font-bold text-secondary">Dares</div>}
									{dareSearchList.map((dare) => (
										<div
											key={dare.id}
											onClick={() => handleListDareItemClick(dare.description, dare.amount, dare.participants)}
											className="px-4 py-3 cursor-pointer hover:bg-secondary/20 transition text-sm"
										>
											<div>{dare.description.length > 25 ? `${dare.description.substring(0, 25)}...` : dare.description}</div>
											<div className="text-xs text-muted">
												{formatNumber(dare.amount)} {chainIdUrl === 137 ? <SiPolygon size={12} /> : <SiEthereum size={12} />} - {dare.participants}{' '}
												participants
											</div>
										</div>
									))}
								</>
							)}

							{/* No players or dares found */}
							{searchValue.trim() !== '' && playerSearchList.length === 0 && dareSearchList.length === 0 && (
								<div className="px-4 py-3 text-xs text-muted text-center">No players or dares found.</div>
							)}

							{/* Trending Players */}
							{searchValue.trim() === '' && (
								<div className="flex flex-col mt-8 px-4 py-3">
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
														{formatNumber(dare.amount)} {chainIdUrl === 137 ? <SiPolygon size={12} /> : <SiEthereum size={12} />} -{' '}
														{dare.participants} participants
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
					)}
					{/* Close Button */}
					{/* <div className="hidden md:flex mt-16 mb-0 justify-center">
						<button onClick={handleModalToggle} className="px-4 py-2 bg-accent text-white rounded-md transition">
							Close
						</button>
					</div> */}
				</div>

				{/* Close Button */}
				{/* <div className="absolute md:hidden bottom-5 mb-10 left-0 right-0 flex justify-center">
					<button onClick={handleModalToggle} className="px-4 py-2 bg-accent text-white rounded-md transition">
						Close
					</button>
				</div> */}
			</PortalModal>

			{/* Mobile Version */}
			<SearchBarMobile network={network} />
		</>
	);
};

export default SearchBar;
