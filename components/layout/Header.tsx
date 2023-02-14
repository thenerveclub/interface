import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { providers } from 'ethers';
import Link from 'next/link';
import { useState } from 'react';
import ConnectHeader from '../connectWithHeader';

import { useWeb3React } from '@web3-react/core';
import { CHAINS } from '../../chains';
import { ConnectWithSelect } from '../SelectChainTest';
import AccountModal from '../modal/account';
import Connect from '../modal/connect';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Header() {
	const { account } = useWeb3React();
	const [light, setLight] = useState(true);
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const mainnetUrls = CHAINS[1].urls[0];
	console.log(mainnetUrls);

	const mainnetProvider = new providers.JsonRpcProvider(mainnetUrls);

	// switch network
	const [chainId, setChainId] = useState(1);
	const [provider, setProvider] = useState(mainnetProvider);

	const handleChainChange = (chainId: number) => {
		setChainId(chainId);
	};

	const handleProviderChange = (provider: providers.JsonRpcProvider) => {
		setProvider(provider);
	};

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<>
			<AppBar sx={{ background: 'transparent', boxShadow: 'none' }} position="static">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								fontFamily: 'TrueLies',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							NERVE GLOBAL
						</Typography>
						<Typography
							variant="h5"
							noWrap
							component="a"
							href=""
							sx={{
								mr: 2,
								display: { xs: 'flex', md: 'none' },
								flexGrow: 1,
								fontFamily: 'TrueLies',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							Logo
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
							{/* <Link href="/player">Player</Link>
							<Link href="/dare">Dare</Link> */}
						</Box>
						{/* <Tooltip title="Theme">
							<Button onClick={() => setLight((prev) => !prev)}>Toggle Theme</Button>
						</Tooltip> */}
						{account ? <AccountModal /> : <Connect />}
					</Toolbar>
				</Container>
			</AppBar>
		</>
	);
}
