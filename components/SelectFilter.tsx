import { useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { SiEthereum, SiPolygon } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import { filterSlice } from '../state/filter/filterSlice';
import { CHAINS } from '../utils/chains';

export default function SelectFilter() {
	const dispatch = useDispatch();
	const filter = useSelector((state: { filter: number[] }) => state.filter);

	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};

	const toggleChain = (chainId: number) => {
		dispatch(filterSlice.actions.toggleFilterItem(chainId));
	};

	return (
		<div className="relative inline-block size-fit w-1/3 md:w-[250px] md:max-w-sm h-[50px] z-20">
			{/* Select Button */}
			<button
				onClick={toggleMenu}
				className={`flex justify-between items-center w-full px-5 py-3 bg-transparent border rounded-lg shadow-lg transition-all focus:outline-none ${
					menuOpen
						? 'border-accent text-accent dark:border-accent dark:text-accent'
						: 'text-black dark:text-white hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent'
				}`}
			>
				<div className="flex items-center text-sm font-medium">
					<IoFilter fontSize="small" className="mr-2 md:mr-2" />
					<span className="hidden md:block">Filter Chains</span>
				</div>

				<svg
					className={`w-5 h-5 transform transition-transform ${menuOpen ? 'rotate-180' : 'rotate-0'}`}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>

			{/* Dropdown Menu */}
			{menuOpen && (
				<div className="absolute z-20 w-full mt-2 bg-white dark:bg-black border border-accent rounded-lg">
					{Object.entries(CHAINS).map(([chainId, chainInfo]) => {
						if (!chainInfo?.name || !chainInfo.logo) return null;

						const isSelected = filter.includes(Number(chainId));

						return (
							<div
								key={chainId}
								className={`w-full flex items-center justify-between gap-3 px-3 py-3 text-sm font-medium transition-all ${
									isSelected
										? 'text-black dark:text-white hover:text-accent dark:hover:text-accent'
										: 'text-gray-400 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
								}`}
							>
								<div className="flex items-center gap-2">
									{Number(chainId) === 137 ? <SiPolygon className="w-5 h-5" /> : <SiEthereum className="w-5 h-5" />}
									<span className="hidden md:block">{chainInfo.name}</span>
								</div>

								{/* Slider Toggle */}
								<button
									onClick={() => toggleChain(Number(chainId))}
									className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
										isSelected ? 'bg-accent' : 'bg-zinc-500 dark:bg-zinc-700'
									}`}
								>
									<span
										className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
											isSelected ? 'translate-x-5' : 'translate-x-1'
										}`}
									/>
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
