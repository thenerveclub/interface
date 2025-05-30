import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortSlice } from '../state/sort/sortSlice';

export default function SelectSort() {
	const dispatch = useDispatch();
	const sort = useSelector((state: { sort: number }) => state.sort);

	const [menuOpen, setMenuOpen] = useState(false);

	const handleChange = (value: number) => {
		dispatch(sortSlice.actions.updateSort(value)); // Update the sort in Redux
		setMenuOpen(false); // Close the menu
	};

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};

	const getOptionClasses = (isSelected: boolean) =>
		`flex items-center justify-between m-1 px-1 py-1 rounded-lg transition-all ${
			isSelected ? 'bg-transparent text-black dark:text-white cursor-not-allowed' : 'hover:bg-gray-500 text-gray-700'
		}`;

	const getSortLabel = (sort: number) => {
		switch (sort) {
			case 1:
				return 'Stake: Low to High';
			case 2:
				return 'Stake: High to Low';
			case 3:
				return 'Participants: Low to High';
			case 4:
				return 'Participants: High to Low';
			case 5:
				return 'Entry Amount: Low to High';
			case 6:
				return 'Entry Amount: High to Low';
			default:
				return 'Select an Option';
		}
	};

	return (
		<div className="relative inline-block size-fit md:w-[250px] h-[50px] max-w-sm z-20">
			{/* Select Button */}
			<button
				onClick={toggleMenu}
				className={`flex justify-between items-center w-full px-5 py-3 bg-transparent border rounded-lg shadow-lg transition-all focus:outline-none ${
					menuOpen
						? 'border-accent text-accent dark:border-accent dark:text-accent'
						: 'text-black dark:text-white hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent'
				}`}
			>
				{/* Selected Option */}
				<span className="text-sm font-medium">{getSortLabel(sort)}</span>
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
					{/* Stake Section */}
					<div className="px-4 py-2 text-sm font-semibold bg-zinc-200 dark:bg-zinc-900 text-black dark:text-white rounded-t-lg">Stake</div>
					<div>
						<button
							onClick={() => handleChange(1)}
							disabled={sort === 1}
							className={`w-full flex justify-between mx-auto hover:bg-transparent px-3 py-2 ${
								sort === 1 ? 'text-accent dark:text-accent' : 'text-gray-400 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
							}`}
						>
							<span>Low to High</span>
							{sort === 1 && <span className="text-xs italic text-accent mr-2">Selected</span>}
						</button>
						<button
							onClick={() => handleChange(2)}
							disabled={sort === 2}
							className={`w-full flex justify-between mx-auto hover:bg-transparent px-3 py-2 ${
								sort === 2 ? 'text-accent dark:text-accent' : 'text-gray-400 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
							}`}
						>
							<span>High to Low</span>
							{sort === 2 && <span className="text-xs italic text-accent mr-2">Selected</span>}
						</button>
					</div>

					{/* Participants Section */}
					<div className="px-4 py-2 mt-2 text-sm font-semibold bg-zinc-200 dark:bg-zinc-900 text-black dark:text-white">Participants</div>
					<div>
						<button
							onClick={() => handleChange(3)}
							disabled={sort === 3}
							className={`w-full flex justify-between mx-auto hover:bg-transparent px-3 py-2 ${
								sort === 3 ? 'text-accent dark:text-accent' : 'text-gray-400 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
							}`}
						>
							<span>Low to High</span>
							{sort === 3 && <span className="text-xs italic text-accent mr-2">Selected</span>}
						</button>

						<button
							onClick={() => handleChange(4)}
							disabled={sort === 4}
							className={`w-full flex justify-between mx-auto hover:bg-transparent px-3 py-2 ${
								sort === 4 ? 'text-accent dark:text-accent' : 'text-gray-400 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
							}`}
						>
							<span>High to Low</span>
							{sort === 4 && <span className="text-xs italic text-accent mr-2">Selected</span>}
						</button>
					</div>

					{/* Entry Amount Section */}
					<div className="px-4 py-2 mt-2 text-sm font-semibold bg-zinc-200 dark:bg-zinc-900 text-black dark:text-white">Entry Amount</div>
					<div>
						<button
							onClick={() => handleChange(5)}
							disabled={sort === 5}
							className={`w-full flex justify-between mx-auto hover:bg-transparent px-3 py-2 ${
								sort === 5 ? 'text-accent dark:text-accent' : 'text-gray-400 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
							}`}
						>
							<span>Low to High</span>
							{sort === 5 && <span className="text-xs italic text-accent mr-2">Selected</span>}
						</button>
						<button
							onClick={() => handleChange(6)}
							disabled={sort === 6}
							className={`w-full flex justify-between mx-auto hover:bg-transparent px-3 py-2 ${
								sort === 6 ? 'text-accent dark:text-accent' : 'text-gray-400 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
							}`}
						>
							<span>High to Low</span>
							{sort === 6 && <span className="text-xs italic text-accent mr-2">Selected</span>}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
