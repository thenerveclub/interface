'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import CreateMapDare from '../components/modal/create/createMap';
import useMapData from '../hooks/mapData/useMapData';
import { CHAINS } from '../utils/chains';

interface GoogleMapProps {
	location: { latitude: number; longitude: number; zoom: number };
	onMapClick: (lat: number, lng: number) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ location }) => {
	const mapRef = useRef(null);
	const router = useRouter();

	const { currentTheme, prefersSystemSetting } = useSelector((state: any) => state.theme);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);

	const [map, setMap] = useState<any>(null);
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalCoords, setModalCoords] = useState({ lat: null, lng: null });
	const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const [appliedTheme, setAppliedTheme] = useState(prefersDarkMode ? 'dark' : 'light');

	const formatCrypto = (value: number) =>
		(Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});

	const formatNumber = (value: number) =>
		(Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

	useEffect(() => {
		setAppliedTheme(prefersSystemSetting ? (prefersDarkMode ? 'dark' : 'light') : currentTheme);
	}, [prefersSystemSetting, prefersDarkMode, currentTheme]);

	const handleMapClick = (event: any) => {
		const clickedLat = event.latLng.lat();
		const clickedLng = event.latLng.lng();
		setModalCoords({ lat: clickedLat, lng: clickedLng });
		setModalVisible(true);
	};

	const { mapData, loading } = useMapData();

	const applyMapStyle = () => {
		if (map) {
			const styles =
				appliedTheme === 'dark'
					? [
							{
								featureType: 'administrative',
								elementType: 'geometry.stroke',
								stylers: [{ color: '#FFFFFF' }, { saturation: -100 }, { lightness: -20 }],
							},
							{
								featureType: 'water',
								elementType: 'geometry.fill',
								stylers: [{ color: '#000080' }, { saturation: -80 }, { lightness: -50 }],
							},
							{
								featureType: 'landscape',
								elementType: 'geometry.fill',
								stylers: [{ saturation: -70 }, { lightness: -40 }],
							},
					  ]
					: [];
			map.setOptions({ styles });
		}
	};

	useEffect(() => {
		applyMapStyle();
	}, [appliedTheme, map]);

	const initializeMap = () => {
		if (mapRef.current) {
			const initializedMap = new google.maps.Map(mapRef.current, {
				center: { lat: location.latitude, lng: location.longitude },
				zoom: location.zoom,
				minZoom: 2,
				restriction: {
					latLngBounds: {
						north: 85,
						south: -85,
						east: 180,
						west: -180,
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
		if (!map || loading || !Array.isArray(mapData)) return;
		let lastClickedMarker = null;
		let lastOpenedInfoWindow = null;
		mapData.forEach((dataItem) => {
			const marker = new google.maps.Marker({
				position: { lat: parseFloat(dataItem.latitude), lng: parseFloat(dataItem.longitude) },
				map: map,
				animation: google.maps.Animation.DROP,
			});

			const infoWindow = new google.maps.InfoWindow({
				content: `
    <div style="
      max-width: 240px;
      padding: 0.75rem;
      border-radius: 12px;
      background: rgba(22, 22, 25, 0.95);
      color: white;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
    ">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
        <img src="${CHAINS[dataItem.chainId]?.logo}" width="18" height="18" alt="Logo" />
        <span style="margin-left: 0.5rem; font-size: 0.875rem; font-weight: 600;">
          ${CHAINS[dataItem.chainId]?.name}
        </span>
      </div>
      <p style="font-size: 0.875rem; margin-bottom: 0.25rem;">
        <strong>Description:</strong><br />${dataItem.description}
      </p>
      <p style="font-size: 0.875rem; margin-bottom: 0.25rem;">
        <strong>Amount:</strong><br />
        ${
					currencyValue
						? `$${formatNumber(dataItem.amount * currencyPrice[CHAINS[dataItem.chainId]?.nameToken.toLowerCase()])}`
						: `${formatCrypto(dataItem.amount)} ${CHAINS[dataItem.chainId]?.nameToken}`
				}
      </p>
      <p style="font-size: 0.875rem;">
        <strong>Player:</strong><br />
        ${dataItem.recipientAddress.slice(0, 6)}...${dataItem.recipientAddress.slice(-4)}
      </p>
    </div>
  `,
			});

			marker.addListener('mouseover', () => infoWindow.open(map, marker));
			marker.addListener('mouseout', () => infoWindow.close());

			marker.addListener('click', () => {
				if (window.innerWidth < 1024) {
					if (lastClickedMarker === marker) {
						router.push(`/dare/${dataItem.chainId}-${dataItem.id}`);
						lastClickedMarker = null;
					} else {
						if (lastOpenedInfoWindow) lastOpenedInfoWindow.close();
						infoWindow.open(map, marker);
						lastClickedMarker = marker;
						lastOpenedInfoWindow = infoWindow;
					}
				} else {
					router.push(`/dare/${dataItem.chainId}-${dataItem.id}`);
				}
			});
		});
	};

	useEffect(() => {
		const loadGoogleMapsScript = () => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
			script.async = true;
			script.onload = initializeMap;
			document.head.appendChild(script);
		};

		if (window.google && window.google.maps) {
			initializeMap();
		} else {
			loadGoogleMapsScript();
		}
	}, [appliedTheme, currencyValue, location]);

	useEffect(() => {
		if (map && !loading && Array.isArray(mapData)) {
			updateMarkers();
		}
	}, [mapData, loading, map, currencyValue]);

	return (
		<div ref={mapRef} className="w-screen h-screen max-w-full max-h-full">
			{isModalVisible && <CreateMapDare modalCoords={modalCoords} onClose={() => setModalVisible(false)} />}
		</div>
	);
};

export default GoogleMap;
