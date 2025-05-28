import { useState } from 'react';
import { IoFilter } from 'react-icons/io5';
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
		<div className="relative inline-block size-fit md:w-[250px] h-[50px] max-w-sm z-20">
			{/* Select Button */}
			<button
				onClick={toggleMenu}
				className={`flex justify-between items-center w-full px-5 py-3 bg-transparent text-black dark:text-white border rounded-lg shadow-lg transition-all focus:outline-none hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent ${
					menuOpen ? 'border-accent text-accent dark:border-accent dark:text-accent' : ''
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
				<div className="absolute z-20 w-full mt-2 bg-white dark:bg-black border border-gray-400 rounded-lg">
					{Object.entries(CHAINS).map(([chainId, chainInfo]) => {
						if (!chainInfo?.name || !chainInfo.logo) return null;

						const isSelected = filter.includes(Number(chainId));
						return (
							<button
								key={chainId}
								onClick={() => toggleChain(Number(chainId))}
								className="w-full flex items-center px-4 py-3 text-sm font-medium transition-all"
							>
								<input type="checkbox" checked={isSelected} readOnly className="mr-3" />
								<img src={chainInfo.logo} alt={`${chainInfo.name} Logo`} className="w-5 h-5 mr-3 text-white dark:text-white fill-white" />
								<span className="hidden md:block">{chainInfo.name}</span>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
