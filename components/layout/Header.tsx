import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import localFont from '@next/font/local';
import { useWeb3React } from '@web3-react/core';
import SelectChain from '../SelectChain';
import AccountModal from '../modal/Account';
import Connect from '../modal/Connect';

const trueLies = localFont({ src: '../../public/fonts/trueLies.ttf' });

const StyledSectionLeft = styled.section`
	width: 25%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
`;

const StyledSectionRight = styled.section`
	width: 75%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

export default function Header() {
	const { account } = useWeb3React();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar sx={{ background: 'transparent', boxShadow: 'none', height: '2rem' }} position="static">
				<Toolbar>
					<StyledSectionLeft>
						<Typography
							component="a"
							className={trueLies.className}
							href="/"
							sx={{
								display: 'block',
								fontSize: '1.25rem',
								width: 'auto',
								color: '#fff',
								textDecoration: 'none',
							}}
						>
							NERVE GLOBAL
						</Typography>
					</StyledSectionLeft>
					<StyledSectionRight>
						<SelectChain />
						{account ? <AccountModal /> : <Connect />}
					</StyledSectionRight>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
