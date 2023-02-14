import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useWeb3React } from '@web3-react/core';
// import NetworkDropdown from '../chainLogoSize';
import AccountModal from '../modal/account';
import Connect from '../modal/connect';

export default function Header() {
	const { account } = useWeb3React();

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
						{/* <NetworkDropdown /> */}
						{account ? <AccountModal /> : <Connect />}
					</Toolbar>
				</Container>
			</AppBar>
		</>
	);
}
