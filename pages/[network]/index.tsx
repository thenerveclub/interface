import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { CHAINS } from '../../utils/chains';

const TrueLies = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 90%;
	max-width: 1280px;
	height: auto;
	margin: 2% auto;
	background-color: transparent;

	@media (max-width: 600px) {
		width: 95%;
	}
`;

const StyledBox = styled(Box)<{ theme: any }>`
	margin: 7.5rem auto 0 auto;

	h1 {
		margin: 0 auto 0 auto;
		font-size: 5rem;
		font-weight: 100;
		font-family: ${TrueLies.style.fontFamily};
		textdecoration: 'none';
		color: ${(props) => props.theme.palette.text.primary};
	}

	h4 {
		margin: 1rem auto 0 auto;
		font-size: 1.3125rem;
		width: 70%;
	}

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

const StyledTrending = styled(Box)`
	margin: 7.5rem auto 0 auto;
	width: 100%;

	h2 {
		text-align: left;
		font-size: 2.25rem;
	}

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

const StyledTrendingGrid = styled(Box)`
	width: 100%;

	h2 {
		text-align: left;
		font-size: 2.25rem;
	}

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

export default function IndexPage() {
	const theme = useTheme();
	const router = useRouter();
	const { network } = router.query;
	const isLoading = false;

	// Define your valid networks
	// const validNetworks = ['polygon', 'goerli'];

	// use all urlNames from CHAINS to create a list of valid networks
	const validNetworks = Object.values(CHAINS).map((chain) => chain.urlName);

	useEffect(() => {
		// If the network is not valid, redirect to a default network or show a 404 page
		if (network && !validNetworks.includes(network as string)) {
			// Redirect to the default network
			// router.push('/defaultNetwork');

			// Or, redirect to the custom 404 page
			router.push('/404');
		}
	}, [network, router]);

	return (
		<>
			{isLoading ? (
				<LoadingScreen />
			) : (
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
						<StyledBox theme={theme}>
							<h1>Shape the Stream</h1>
							<h4>
								The ultimate playground where spectators fuel content with financial rewards, empowering players to push boundaries and foster vibrant
								communities.
							</h4>
						</StyledBox>
						<StyledTrending>
							<h2>Trending Dares</h2>
						</StyledTrending>
						<StyledTrendingGrid></StyledTrendingGrid>
						<StyledTrending>
							<h2>Trending Players</h2>
						</StyledTrending>
						<StyledTrendingGrid></StyledTrendingGrid>
					</StyledLayout>
				</>
			)}
		</>
	);
}
