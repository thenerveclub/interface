'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BiSolidMapPin } from 'react-icons/bi';
import { BsLightningChargeFill } from 'react-icons/bs';
import { IoIosContact } from 'react-icons/io';
import { IoStatsChartSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import AccountModal from '../modal/menu/Account';
import Connect from '../modal/menu/Connect';
import Setting from '../modal/menu/Settings';
import SearchBar from '../SearchBar';

export default function Header() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMap = pathname?.includes('/map');
	const network = searchParams.get('network');
	const headerRef = useRef(null);

	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const ens = useSelector((state: { ens: string }) => state.ens);

	// State
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isScrolled, setIsScrolled] = useState<boolean>(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	// Detect scrolling
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<>
			<motion.div
				ref={headerRef}
				className={`hidden md:flex flex-row justify-center items-center fixed top-0 left-0 right-0 h-16 bg-transparent shadow-none z-50 ${
					isScrolled || isMap ? 'backdrop-blur-lg bg-black/50' : 'bg-transparent'
				}`}
			>
				<div className="flex justify-center md:justify-between items-center w-[95%]">
					<div className="flex items-center space-x-4">
						<Link className="cursor-pointer" href="/" passHref>
							<h1 className="font-normal text-2xl 3xl:text-4xl cursor-pointer text-black dark:text-white hover:text-accent dark:hover:text-accent transition">
								THE NERVE CLUB
							</h1>
						</Link>
					</div>

					<div className={`hidden md:flex items-center space-x-4 ${isMap ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}>
						<div className="flex-grow flex justify-center">
							<SearchBar network={network} />
						</div>
						{/* {account && <SelectChain />} */}
						<Link href="/leaderboard" passHref>
							<h3 className="py-1 bg-transparent hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg">Leaderboard</h3>
						</Link>
						<Link href="/map" passHref>
							<h3 className="py-1 bg-transparent hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg">Map</h3>
						</Link>
						<Setting />
						{account ? <AccountModal account={account} ens={ens} network={network} /> : <Connect />}
					</div>
				</div>
			</motion.div>

			<motion.div
				ref={headerRef}
				className={`flex md:hidden fixed top-0 left-0 right-0 h-16 bg-transparent z-50 items-center justify-center m-0 p-0 ${
					isScrolled || isMap ? 'backdrop-blur-lg bg-black/50' : 'bg-transparent'
				}`}
			>
				<div className="flex items-center justify-between w-full">
					{/* {!isMap && ( */}
					<Link href="/" passHref>
						<h1 className="font-bold text-2xl text-black dark:text-white ml-4">THE NERVE CLUB</h1>
					</Link>
					{/* )} */}
				</div>
				<div className="flex items-center mr-4">
					<Setting />
				</div>
			</motion.div>
			<motion.div className="flex md:hidden fixed bottom-0 left-0 right-0 justify-evenly dark:bg-black bg-white py-4 z-50 border-t border-b border-secondary items-center">
				<Link href="/" passHref>
					<button className={`flex items-center justify-center ${pathname === '/' ? 'text-accent' : 'text-black dark:text-white'} w-8 h-8`}>
						<BsLightningChargeFill size={20} />
					</button>
				</Link>
				<Link href="/map" passHref>
					<button className={`flex items-center justify-center ${pathname === '/map' ? 'text-accent' : 'text-black dark:text-white'} w-8 h-8`}>
						<BiSolidMapPin size={24} />
					</button>
				</Link>
				<SearchBar network={network} />
				<Link href="/leaderboard" passHref>
					<button
						className={`flex items-center justify-center ${pathname === '/leaderboard' ? 'text-accent' : 'text-black dark:text-white'} w-8 h-8`}
					>
						<IoStatsChartSharp size={20} />
					</button>
				</Link>
				{account ? (
					<Link href={`/player/${account}`} passHref>
						<button
							className={`flex items-center justify-center ${
								pathname === `/player/${account}` ? 'text-accent' : 'text-black dark:text-white'
							} w-8 h-8`}
						>
							<AccountModal account={account} ens={ens} network={network} />
						</button>
					</Link>
				) : (
					<button className={`flex items-center justify-center ${pathname === '/connect' ? 'text-accent' : 'text-black dark:text-white'} w-8 h-8`}>
						<Connect />
					</button>
				)}
			</motion.div>
		</>
	);
}
