'use client';

import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Extract lat and lng from searchParams
	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');

	// Combine pathname and searchParams
	const fullPath = `${pathname}?${searchParams.toString()}`;
	console.log('Current URL:', fullPath);

	// Set default location values if necessary
	const defaultLat = 20; // Example default latitude
	const defaultLng = 0; // Example default longitude
	const defaultZoom = 3; // Example default zoom level

	const [location, setLocation] = useState({ latitude: defaultLat, longitude: defaultLng, zoom: defaultZoom });

	useEffect(() => {
		let latitude = defaultLat;
		let longitude = defaultLng;
		let zoom = defaultZoom;

		if (lat && lng) {
			// Convert URL parameters to numbers
			latitude = Number(lat);
			longitude = Number(lng);
			zoom = Number(7); // Example zoom level
		}

		setLocation({ latitude, longitude, zoom });
	}, [lat, lng]);

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
				<Map location={location} />
			</StyledLayout>
		</>
	);
}
