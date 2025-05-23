'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import GoogleMap from '../../components/GoogleMap';
import CreateMapDare from '../../components/modal/create/createMap';

export default function IndexPage() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Extract lat, lng from query params (unchanged from your code).
	const latParam = searchParams.get('lat');
	const lngParam = searchParams.get('lng');

	// For logging only
	const fullPath = `${pathname}?${searchParams.toString()}`;
	console.log('Current URL:', fullPath);

	// Default location if no params
	const defaultLat = 20;
	const defaultLng = 0;
	const defaultZoom = 3;

	// Store location in state (unchanged from your code).
	const [location, setLocation] = useState({
		latitude: defaultLat,
		longitude: defaultLng,
		zoom: defaultZoom,
	});

	// On mount or if lat/lng changes, re-set location.
	useEffect(() => {
		let latitude = defaultLat;
		let longitude = defaultLng;
		let zoom = defaultZoom;

		if (latParam && lngParam) {
			latitude = Number(latParam);
			longitude = Number(lngParam);
			zoom = 7; // Example zoom if lat/lng are present
		}

		setLocation({ latitude, longitude, zoom });
	}, [latParam, lngParam]);

	// Adjust viewport height on mobile devices
	useEffect(() => {
		const adjustHeight = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};
		window.addEventListener('resize', adjustHeight);
		adjustHeight();
		return () => window.removeEventListener('resize', adjustHeight);
	}, []);

	// The lat/lng from the **map** click (instead of a modal):
	const [clickedLat, setClickedLat] = useState<number | null>(null);
	const [clickedLng, setClickedLng] = useState<number | null>(null);

	return (
		<div className="w-screen h-screen relative">
			<GoogleMap
				location={location}
				onMapClick={(lat, lng) => {
					setClickedLat(lat);
					setClickedLng(lng);
				}}
			/>
			{clickedLat !== null && clickedLng !== null && (
				<CreateMapDare
					modalCoords={{ lat: clickedLat, lng: clickedLng }}
					onClose={() => {
						setClickedLat(null);
						setClickedLng(null);
					}}
				/>
			)}
		</div>
	);
}
