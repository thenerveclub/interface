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
import SearchBar from '../SearchBar';
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
	const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const disableScrolling = () => {
		document.body.style.overflow = 'hidden';
	};

	const enableScrolling = () => {
		document.body.style.overflow = 'auto';
	};

	const toggleMenu = () => {
		if (isMenuOpen) {
			setIsClosing(true);
			setTimeout(() => {
				setIsMenuOpen(false);
				setIsClosing(false);
				enableScrolling();
			}, 500); // 500ms for the slide-down duration
		} else {
			setIsMenuOpen(true);
			disableScrolling();
		}
	};

	useEffect(() => {
		function handleResize() {
			setWindowWidth(window.innerWidth);
		}
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const header = headerRef.current;
			if (header) {
				const headerHeight = header.clientHeight;
				const scrollThreshold = headerHeight / 2;
				const opacity = Math.min(scrollPosition / scrollThreshold, 1);
				header.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
				header.style.boxShadow = `0px 0.25px 0.25px rgba(0, 0, 0, ${opacity})`;
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<>
			{windowWidth && windowWidth > 1024 ? (
				<motion.div
					ref={headerRef}
					className="flex flex-row justify-center items-center fixed top-0 left-0 right-0 h-16 bg-transparent shadow-none z-50"
				>
					<div className="flex justify-between items-center w-[95%]">
						<div className="flex items-center space-x-4">
							<Link href="/" passHref>
								<h1 className="font-bold text-2xl 3xl:text-4xl cursor-pointer text-accent">THE NERVE CLUB</h1>
							</Link>
						</div>
						<div className="flex-grow flex justify-center">
							<SearchBar network={network} />
						</div>
						<div className="flex items-center space-x-4">
							{/* {account && <SelectChain />} */}
							<Link href="/leaderboard" passHref>
								<h3 className="text-lg 3xl:text-2xl text-black dark:text-white cursor-pointer">Leaderboard</h3>
							</Link>
							<Link href="/map" passHref>
								<h3 className="text-lg 3xl:text-2xl text-black dark:text-white cursor-pointer">Map</h3>
							</Link>
							<Setting />
							{account ? <AccountModal account={account} ens={ens} network={network} /> : <Connect />}
						</div>
					</div>
				</motion.div>
			) : (
				<>
					<motion.div ref={headerRef} className="fixed top-0 left-0 right-0 h-16 bg-black z-50 flex items-center justify-between px-4">
						<div className="flex items-center">
							{!isMap && (
								<Link href="/" passHref>
									<h1 className="font-bold text-2xl text-accent cursor-pointer">THE NERVE CLUB</h1>
								</Link>
							)}
						</div>
						<div className="flex items-center space-x-4">
							{/* {account && <SelectChain />} */}
							<Setting />
							{!account && <Connect />}
						</div>
					</motion.div>
					<motion.div className="fixed bottom-4 left-0 right-0 flex justify-evenly bg-black py-2">
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
						<SearchBar network={network} />
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
			)}
		</>
	);
}
