import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Map from '../../../components/GoogleMap';
import LoadingScreen from '../../../components/LoadingScreen';
import { useCheckNameRegister } from '../../../hooks/useCheckNameRegister';
import { CHAINS, nameToChainId } from '../../../utils/chains';

const StyledLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100vw;
	max-height: calc(100vh - 4rem);
	margin: 4rem auto 0 auto;
	background-color: transparent;

	@media (max-width: 600px) {
		width: 100vw;
		height: calc(100vh - 4rem);
		max-height: calc(100vh - 4rem);
		margin: 4rem auto 0 auto;
	}
`;

export default function IndexPage() {
	const theme = useTheme();
	const isLoading = false;
	const router = useRouter();
	const network = router.query.network as string;

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Name to Chain ID
	const chainIdUrl = nameToChainId[network];

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

	// Get data
	// const registerStatus = useCheckNameRegister(isNetworkAvailable ? chainIdUrl : 137, playerID);

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
						<Map
							apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
							chainIdUrl={chainIdUrl}
							isNetworkAvailable={isNetworkAvailable}
							network={network}
						/>
					</StyledLayout>
				</>
			)}
		</>
	);
}
