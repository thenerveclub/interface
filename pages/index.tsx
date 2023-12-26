// ipfs only
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

export default function IndexPage() {
	const router = useRouter();

	useEffect(() => {
		router.push('/polygon');
	}, [router]);

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
			<LoadingScreen />
		</>
	);
}
