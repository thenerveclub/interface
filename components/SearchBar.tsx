'use client';

import { ClickAwayListener } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { SiEthereum, SiPolygon } from 'react-icons/si';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
import useTrendingPlayerList from '../hooks/searchData/trending/useTrendingPlayerList';
import useDareDataSearchList from '../hooks/searchData/useDareDataSearchList';
import usePlayerDataSearchList from '../hooks/searchData/usePlayerDataSearchList';
import { nameToChainId } from '../utils/chains';
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
	const { trendingPlayerList } = useTrendingPlayerList();
	const trendingDareList = useTrendingDareList(chainIdUrl);
	const dareSearchList = useDareDataSearchList(chainIdUrl, searchValueQuery);
	const [isListVisible, setListVisible] = useState(false);
	const [searchHistory, setSearchHistory] = useState<any[]>([]);

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
	};

	const handleListDareItemClick = (id: string, amount: string, participants: number) => {
		router.push(`/dare/${id}`);
		setSearchValue('');
		setListVisible(false);
		addToSearchHistory({ type: 'dare', id, amount, participants });
	};

	const formatNumber = (value: string) =>
		(Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

	return (
		<>
			<ClickAwayListener onClickAway={() => setListVisible(false)}>
				<form
					onSubmit={(e) => e.preventDefault()}
					className="hidden lg:flex relative w-full max-w-lg items-center border border-secondary rounded-md px-3 py-2 text-sm focus-within:border-accent transition-all bg-transparent"
				>
					{/* <IoSearch className="text-white mr-2" size={20} /> */}
					<span>Search</span>
					<input
						type="text"
						value={searchValue}
						onChange={handleSearchChange}
						onFocus={() => setListVisible(true)}
						placeholder="Search players and dares..."
						className="bg-transparent text-white placeholder-secondary w-full focus:outline-none"
					/>

					{isListVisible && (
						<div className="absolute top-full left-0 right-0 z-30 bg-background text-white rounded-b-md border border-accent max-h-[500px] overflow-y-auto shadow-lg">
							{searchValue.trim() === '' && searchHistory.length > 0 && (
								<div className="px-4 py-2 text-xs font-bold text-secondary flex justify-between items-center">
									<span>Recent Searches</span>
									<button onClick={clearSearchHistory} type="button" className="text-error text-sm">
										Clear
									</button>
								</div>
							)}

							{searchHistory.map((item) => (
								<div
									key={item.id}
									onClick={() => {
										if (item.type === 'player' || searchValue.includes('0x')) {
											handleListPlayerItemClick(item.id, item.address, searchValue.toLowerCase());
										} else {
											handleListDareItemClick(item.id, item.amount, item.participants);
										}
									}}
									className="px-4 py-2 cursor-pointer hover:bg-secondary/20 transition text-sm"
								>
									{item.type === 'player' ? (
										<div>
											<div>{item.id}</div>
											<div className="text-xs text-muted">{item.address}</div>
										</div>
									) : (
										<div>
											<div>{item.id}</div>
											<div className="text-xs text-muted">
												{formatNumber(item.amount)} {chainIdUrl === 137 ? <SiPolygon size={12} /> : <SiEthereum size={12} />} - {item.participants}{' '}
												participants
											</div>
										</div>
									)}
								</div>
							))}

							{(playerSearchList.length > 0 || dareSearchList.length > 0) && (
								<>
									{playerSearchList.length > 0 && <div className="px-4 py-2 text-xs font-bold text-secondary">Players</div>}
									{playerSearchList.map((player) => (
										<div
											key={player.id}
											onClick={() => handleListPlayerItemClick(player.name, player.resolver?.addr?.id)}
											className="px-4 py-2 cursor-pointer hover:bg-secondary/20 transition text-sm"
										>
											<div>{player.name}</div>
											<div className="text-xs text-muted">{player.resolver?.addr?.id}</div>
										</div>
									))}

									{dareSearchList.length > 0 && <div className="px-4 py-2 text-xs font-bold text-secondary">Dares</div>}
									{dareSearchList.map((dare) => (
										<div
											key={dare.id}
											onClick={() => handleListDareItemClick(dare.description, dare.amount, dare.participants)}
											className="px-4 py-2 cursor-pointer hover:bg-secondary/20 transition text-sm"
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

							{searchValue.trim() !== '' && playerSearchList.length === 0 && dareSearchList.length === 0 && (
								<div className="px-4 py-2 text-xs text-muted text-center">No players or dares found.</div>
							)}
						</div>
					)}
				</form>
			</ClickAwayListener>
			<SearchBarMobile network={network} />
		</>
	);
};

export default SearchBar;
