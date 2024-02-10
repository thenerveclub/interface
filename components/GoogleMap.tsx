import styled from '@emotion/styled';
import { Box, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useMapData from '../hooks/mapData/useMapData';
import CreateMapDare from './modal/createMapDare';

const StyledDiv = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	max-width: 100%;
	max-height: 100%;
	border: none;
	background-color: transparent;
	outline: none;
	margin: 0 auto 0 auto;

	.gm-style iframe + div {
		border: none !important;
	}
`;

interface GoogleMapProps {
	apiKey: string;
	chainIdUrl: number;
	// registerStatus: any;
	isNetworkAvailable: boolean;
	network: any;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ apiKey, chainIdUrl, isNetworkAvailable, network }) => {
	const mapRef = useRef(null);
	const router = useRouter();

	// Redux
	const { currentTheme, prefersSystemSetting } = useSelector((state: any) => state.theme);

	// State
	const [map, setMap] = useState(null);
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalCoords, setModalCoords] = useState({ lat: null, lng: null });
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [appliedTheme, setAppliedTheme] = useState(prefersDarkMode ? 'dark' : 'light');

	useEffect(() => {
		setAppliedTheme(prefersSystemSetting ? (prefersDarkMode ? 'dark' : 'light') : currentTheme);
	}, [prefersSystemSetting, prefersDarkMode, currentTheme]);

	const handleMapClick = (event) => {
		const clickedLat = event.latLng.lat();
		const clickedLng = event.latLng.lng();

		setModalCoords({ lat: clickedLat, lng: clickedLng });
		setModalVisible(true);
	};

	// Use the useMapData hook to get map data
	const { mapData, isLoading } = useMapData(chainIdUrl);

	const applyMapStyle = () => {
		if (map) {
			const styles =
				appliedTheme === 'dark'
					? [
							{
								featureType: 'administrative',
								elementType: 'geometry.stroke',
								stylers: [
									{ color: '#FFFFFF' }, // Weiße Linien für administrative Grenzen
									{ saturation: -100 }, // Keine Sättigung
									{ lightness: -20 }, // Geringere Helligkeit
								],
							},
							{
								featureType: 'water',
								elementType: 'geometry.fill',
								stylers: [
									{ color: '#000080' }, // Dunkelblaues Wasser
									{ saturation: -80 }, // Geringere Sättigung
									{ lightness: -50 }, // Geringere Helligkeit
								],
							},
							{
								featureType: 'landscape',
								elementType: 'geometry.fill',
								stylers: [
									// { color: '#0D0D0D' }, // Dunklere Füllung für Landschaft
									{ saturation: -70 }, // Geringere Sättigung
									{ lightness: -40 }, // Geringere Helligkeit
								],
							},
					  ]
					: []; // Empty array for light theme

			map.setOptions({ styles });
		}
	};

	useEffect(() => {
		applyMapStyle();
	}, [appliedTheme, map]);

	const initializeMap = () => {
		if (mapRef.current) {
			// Check if mapRef.current is not null
			const initializedMap = new google.maps.Map(mapRef.current, {
				center: { lat: 20, lng: 0 },
				zoom: 3,
				minZoom: 2,
				restriction: {
					latLngBounds: {
						north: 85, // Near the North Pole
						south: -85, // Near the South Pole
						east: 180, // Maximum longitude to the east
						west: -180, // Maximum longitude to the west
					},
					strictBounds: true,
				},
				mapTypeControl: false,
				fullscreenControl: false,
				streetViewControl: false,
				disableDoubleClickZoom: true,
				styles: [],
			});
			initializedMap.addListener('click', handleMapClick);
			setMap(initializedMap);
		}
	};

	const updateMarkers = () => {
		if (!map || isLoading || !Array.isArray(mapData)) return;

		// State or variable to keep track of the last clicked marker
		let lastClickedMarker = null;
		let lastOpenedInfoWindow = null;

		mapData.forEach((dataItem) => {
			const marker = new google.maps.Marker({
				position: { lat: parseFloat(dataItem.taskLatitude), lng: parseFloat(dataItem.taskLongitude) },
				map: map,
				animation: google.maps.Animation.DROP,
				// title: dataItem.description, // This is the title that appears on hover
			});

			// Create an info window with the description
			const infoWindow = new google.maps.InfoWindow({
				content: `
				<div style="max-width: 200px; overflow: hidden; word-wrap: break-word;">
				<h1 style="color: black; font-size: 0.875rem; font-weight: 400;">Player: ${dataItem.recipientName}</h1>
				<a style="color: black; font-size: 0.875rem; font-weight: 300;">${dataItem.description}</a>
				</div>`,
			});

			// Show the info window on mouseover
			marker.addListener('mouseover', () => {
				infoWindow.open(map, marker);
			});

			// Close the info window on mouseout
			marker.addListener('mouseout', () => {
				infoWindow.close();
			});

			// Add an onClick event listener
			marker.addListener('click', () => {
				if (window.innerWidth < 1024) {
					if (lastClickedMarker === marker) {
						router.push(`/${network}/dare/${dataItem.id}`);
						lastClickedMarker = null; // Reset the last clicked marker
					} else {
						if (lastOpenedInfoWindow) {
							lastOpenedInfoWindow.close();
						}
						lastClickedMarker = marker;
						infoWindow.open(map, marker);
						lastOpenedInfoWindow = infoWindow;
					}
				} else {
					router.push(`/${network}/dare/${dataItem.id}`);
				}
			});
		});
	};

	useEffect(() => {
		const loadGoogleMapsScript = () => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
			script.async = true;
			script.onload = initializeMap;
			script.onerror = () => console.error('Google Maps script failed to load.');
			document.head.appendChild(script);
		};

		if (window.google && window.google.maps) {
			initializeMap();
		} else if (!document.getElementById('google-maps-script')) {
			loadGoogleMapsScript();
		}
	}, [apiKey, appliedTheme]);

	useEffect(() => {
		if (map && !isLoading && Array.isArray(mapData)) {
			updateMarkers();
		}
	}, [mapData, isLoading, map]);

	return (
		<StyledDiv ref={mapRef}>
			{isModalVisible && (
				<CreateMapDare
					chainIdUrl={chainIdUrl}
					isNetworkAvailable={isNetworkAvailable}
					modalCoords={modalCoords}
					onClose={() => setModalVisible(false)}
					network={network}
				/>
			)}
		</StyledDiv>
	);
};

export default GoogleMap;
