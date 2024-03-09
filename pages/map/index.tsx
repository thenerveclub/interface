import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Map from '../../components/GoogleMap';

const StyledLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100vw;
	background-color: transparent;
	margin: 4rem auto 0 auto;
	height: calc(var(--vh, 1vh) * 100 - 4rem);
	overflow: hidden;
	position: fixed;

	@media (max-width: 1024px) {
		margin: 0 auto 0 auto;
		height: calc(var(--vh, 1vh) * 100 - 4rem);
		position: fixed;
	}
`;

export default function IndexPage() {
	const theme = useTheme();
	const [network, setNetwork] = useState(1);

	// Adjust the viewport height on mobile devices
	useEffect(() => {
		const adjustHeight = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};

		window.addEventListener('resize', adjustHeight);
		adjustHeight(); // Trigger it on mount

		return () => window.removeEventListener('resize', adjustHeight);
	}, []);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Nerve Global Dapp</title>
				<meta property="og:title" content="Nerve Global Dapp" key="title" />
				<meta property="og:site_name" content="Nerve Global Dapp" />
				<meta property="og:description" content="Nerve Global Dapp." />
				<meta property="og:image" content="https://dapp.nerveglobal.com/favicon.ico" />
				<meta property="og:url" content="https://dapp.nerveglobal.com/" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@nerveglobal_" />
				<meta name="twitter:title" content="Nerve Global Dapp" />
				<meta name="twitter:description" content="Nerve Global Dapp." />
				<meta name="twitter:image" content="https://dapp.nerveglobal.com/favicon.ico" />
			</Head>
			<StyledLayout>
				<Map network={network} />
			</StyledLayout>
		</>
	);
}
