import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
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

	@media (max-width: 600px) {
	}
`;

interface GoogleMapProps {
	apiKey: string;
	chainIdUrl: number;
	registerStatus: any;
	isNetworkAvailable: boolean;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ apiKey, chainIdUrl, registerStatus, isNetworkAvailable }) => {
	const mapRef = useRef(null);
	const googleMapsScriptId = 'google-maps-script';
	const [map, setMap] = useState(null); // Using useState for map
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalCoords, setModalCoords] = useState({ lat: null, lng: null });

	const handleMapClick = (event) => {
		const clickedLat = event.latLng.lat();
		const clickedLng = event.latLng.lng();

		console.log('Clicked location: ', clickedLat, clickedLng);
		setModalCoords({ lat: clickedLat, lng: clickedLng });
		setModalVisible(true);
	};

	// Use the useMapData hook to get map data
	const { mapData, isLoading } = useMapData(chainIdUrl);

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
				// scrollwheel: false,
				disableDoubleClickZoom: true,
			});
			initializedMap.addListener('dblclick', handleMapClick);
			setMap(initializedMap); // Update the state
		}
	};

	const updateMarkers = () => {
		if (!map || isLoading || !Array.isArray(mapData)) return;

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
		});
	};

	useEffect(() => {
		if (window.google && window.google.maps) {
			// If the Google Maps script is already loaded
			initializeMap();
		} else if (!document.getElementById('google-maps-script')) {
			const script = document.createElement('script');
			script.id = 'google-maps-script';
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
			script.async = true;
			document.head.appendChild(script);

			script.onload = initializeMap;
			script.onerror = () => {
				console.error('Google Maps script failed to load.');
			};
		}
	}, [apiKey]);

	useEffect(() => {
		if (map && !isLoading && Array.isArray(mapData)) {
			updateMarkers();
		}
	}, [mapData, isLoading, map]);

	return (
		<StyledDiv ref={mapRef}>
			{isModalVisible && (
				<CreateMapDare
					// registerStatus={registerStatus}
					chainIdUrl={chainIdUrl}
					isNetworkAvailable={isNetworkAvailable}
					modalCoords={modalCoords}
					onClose={() => setModalVisible(false)}
				/>
			)}
		</StyledDiv>
	);
};

export default GoogleMap;
