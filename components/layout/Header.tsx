'use client';

import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// import SearchBar from '../SearchBar';
import SelectLeaderboard from '../SelectLeaderboard';
import AccountModal from '../modal/menu/Account';
import Connect from '../modal/menu/Connect';
import Setting from '../modal/menu/Settings';

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
					isScrolled ? 'backdrop-blur-lg bg-black/50' : 'bg-transparent'
				}`}
			>
				<div className="flex justify-between items-center w-[95%]">
					<div className="flex items-center space-x-4">
						<Link className="cursor-pointer" href="/" passHref>
							<h1 className="font-normal text-2xl 3xl:text-4xl cursor-pointer text-black dark:text-white hover:text-accent dark:hover:text-accent transition">
								THE NERVE CLUB
							</h1>
						</Link>
					</div>
					{/* <div className="flex-grow flex justify-center">
							<SearchBar network={network} />
						</div> */}
					<div className="flex items-center space-x-4">
						{/* {account && <SelectChain />} */}
						<Link href="/leaderboard" passHref>
							<h3 className="py-1 bg-transparent text-[#999999] dark:text-[#999999] hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg">
								Leaderboard
							</h3>
						</Link>
						<Link href="/map" passHref>
							<h3 className="py-1 bg-transparent text-[#999999] dark:text-[#999999] hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg">
								Map
							</h3>
						</Link>
						<Setting />
						{account ? <AccountModal account={account} ens={ens} network={network} /> : <Connect />}
					</div>
				</div>
			</motion.div>

			<motion.div
				ref={headerRef}
				className={`flex md:hidden fixed top-0 left-0 right-0 h-16 bg-black z-50 items-center justify-between px-4 ${
					isScrolled ? 'backdrop-blur-lg bg-black/50' : 'bg-transparent'
				}`}
			>
				<div className="flex items-center">
					{!isMap && (
						<Link href="/" passHref>
							<h1 className="font-bold text-2xl text-black dark:text-white cursor-pointer">THE NERVE CLUB</h1>
						</Link>
					)}
				</div>
				<div className="flex items-center space-x-4">
					{/* {account && <SelectChain />} */}
					<Setting />
					{!account && <Connect />}
				</div>
			</motion.div>
			<motion.div className="flex md:hidden fixed bottom-4 left-0 right-0 justify-evenly bg-black py-2 z-50">
				<Link href="/" passHref>
					<button className="text-white">
						<HomeIcon />
					</button>
				</Link>
				<Link href="/map" passHref>
					<button className="text-white">
						<LocationOnIcon />
					</button>
				</Link>
				{/* <SearchBar network={network} /> */}
				<Link href="/leaderboard" passHref>
					<button className="text-white">
						<LeaderboardIcon />
					</button>
				</Link>
				{account ? (
					<Link href={`/player/${account}`} passHref>
						<button className="text-white">
							<AccountModal account={account} ens={ens} network={network} />
						</button>
					</Link>
				) : (
					<button className="text-white">
						<PersonIcon />
					</button>
				)}
			</motion.div>
		</>
	);
}
