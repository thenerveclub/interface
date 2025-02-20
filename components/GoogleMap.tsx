'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useMapData from '../hooks/mapData/useMapData';
import { CHAINS } from '../utils/chains';

interface LocationState {
	latitude: number;
	longitude: number;
	zoom: number;
}

interface GoogleMapProps {
	location: LocationState;
	onMapClick?: (lat: number, lng: number) => void; // callback for map clicks
}

export default function GoogleMap({ location, onMapClick }: GoogleMapProps) {
	const router = useRouter();
	const mapRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<google.maps.Map | null>(null);

	// Redux
	const { currentTheme, prefersSystemSetting } = useSelector((state: any) => state.theme);
	const currencyValue = useSelector((state: any) => state.currency);
	const currencyPrice = useSelector((state: any) => state.currencyPrice);

	// from your custom hook
	const { mapData, loading, error } = useMapData();

	const [clickedMarkers, setClickedMarkers] = useState<any[]>([]);

	// Display clicked marker on map
	useEffect(() => {
		if (clickedMarkers.length > 0) {
			// remove old marker before adding new one
			clickedMarkers.forEach((marker) => {
				marker.setMap(null);
			});
			const marker = new google.maps.Marker({
				position: {
					lat: clickedMarkers[0].lat,
					lng: clickedMarkers[0].lng,
				},
				map,
				animation: google.maps.Animation.DROP,
			});
		}
	}, [clickedMarkers]);

	// Track theme: remove MUI’s useMediaQuery; use raw matchMedia or your store
	const [appliedTheme, setAppliedTheme] = useState<'light' | 'dark'>('light');

	// On mount, load the theme
	useEffect(() => {
		const darkMatch = window.matchMedia('(prefers-color-scheme: dark)');
		const systemPrefersDark = darkMatch.matches;

		if (prefersSystemSetting) {
			setAppliedTheme(systemPrefersDark ? 'dark' : 'light');
		} else {
			setAppliedTheme(currentTheme); // from your store
		}
	}, [prefersSystemSetting, currentTheme]);

	// When user clicks the map
	function handleMapClick(e: google.maps.MapMouseEvent) {
		if (!e.latLng) return;
		const clickedLat = e.latLng.lat();
		const clickedLng = e.latLng.lng();
		if (onMapClick) {
			onMapClick(clickedLat, clickedLng);
			setClickedMarkers([{ lat: clickedLat, lng: clickedLng }]);
		}
	}

	// Any numeric formatting
	function formatCrypto(value: any) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});
	}
	function formatNumber(value: any) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Apply custom styles for dark theme
	const applyMapStyle = () => {
		if (!map) return;
		if (appliedTheme === 'dark') {
			const darkStyles: google.maps.MapTypeStyle[] = [
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
			];
			map.setOptions({ styles: darkStyles });
		} else {
			// Light theme => no custom style
			map.setOptions({ styles: [] });
		}
	};

	// Initialize map
	const initializeMap = () => {
		if (!mapRef.current) return;
		const newMap = new google.maps.Map(mapRef.current, {
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
			styles: [], // We'll apply them later
		});

		// Listen for clicks
		newMap.addListener('click', handleMapClick);
		setMap(newMap);
	};

	useEffect(() => {
		const scriptId = 'google-maps-script';
		// If Google Maps is not yet loaded, add the script
		if (!window.google || !window.google.maps) {
			if (!document.getElementById(scriptId)) {
				const script = document.createElement('script');
				script.id = scriptId;
				script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
				script.async = true;
				script.onload = () => {
					initializeMap();
				};
				script.onerror = () => {
					console.error('Google Maps script failed to load.');
				};
				document.head.appendChild(script);
			}
		} else {
			// Already loaded
			initializeMap();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	// Update the map style if theme changes
	useEffect(() => {
		applyMapStyle();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appliedTheme, map]);

	// Update markers
	const updateMarkers = () => {
		if (!map || loading || !Array.isArray(mapData)) return;
		let lastClickedMarker: google.maps.Marker | null = null;
		let lastOpenedInfoWindow: google.maps.InfoWindow | null = null;

		mapData.forEach((dataItem: any) => {
			const marker = new google.maps.Marker({
				position: {
					lat: parseFloat(dataItem?.latitude),
					lng: parseFloat(dataItem?.longitude),
				},
				map,
				animation: google.maps.Animation.DROP,
			});

			// Info window content
			const content = `
        <div style="max-width: 200px; word-wrap: break-word;">
          <div style="display:flex;align-items:center;justify-content:center;margin:0.5rem 0;">
            <img src="${CHAINS[dataItem?.chainId]?.logo}" width="18" height="18" style="margin-right:0.5rem;" alt="Chain Logo"/>
            <span>${CHAINS[dataItem?.chainId]?.name}</span>
          </div>
          <p style="margin:0.5rem 0;font-size:0.875rem;">${dataItem?.description}</p>
          <p style="margin:0.5rem 0;font-size:0.875rem;">
            Amount: ${
							currencyValue
								? '$' + formatNumber(dataItem?.amount * currencyPrice[CHAINS[dataItem?.chainId]?.nameToken.toLowerCase()])
								: formatCrypto(dataItem?.amount) + ' ' + CHAINS[dataItem?.chainId]?.nameToken
						}
          </p>
          <p style="margin:0.5rem 0;font-size:0.875rem;">
            Player: ${dataItem?.recipientAddress.substring(0, 6).toLowerCase()}...${dataItem?.recipientAddress
				.substring(dataItem?.recipientAddress.length - 4)
				.toLowerCase()}
          </p>
        </div>
      `;

			const infoWindow = new google.maps.InfoWindow({
				content,
			});

			// Mouseover => open
			marker.addListener('mouseover', () => {
				infoWindow.open(map, marker);
			});
			// Mouseout => close
			marker.addListener('mouseout', () => {
				infoWindow.close();
			});

			// Click => open Dare page
			marker.addListener('click', () => {
				// If mobile, maybe do a "double-click" logic
				if (window.innerWidth < 1024) {
					if (lastClickedMarker === marker) {
						// second click => go to page
						router.push(`/dare/${dataItem.chainId}-${dataItem.id}`);
						lastClickedMarker = null;
					} else {
						if (lastOpenedInfoWindow) {
							lastOpenedInfoWindow.close();
						}
						lastClickedMarker = marker;
						infoWindow.open(map, marker);
						lastOpenedInfoWindow = infoWindow;
					}
				} else {
					// Desktop => single click
					router.push(`/dare/${dataItem.chainId}-${dataItem.id}`);
				}
			});
		});
	};

	useEffect(() => {
		if (map && !loading && Array.isArray(mapData)) {
			updateMarkers();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mapData, loading, map, currencyValue]);

	return (
		<div
			ref={mapRef}
			className="w-full h-full relative"
			style={
				{
					// Replicate your old “StyledDiv” from @emotion
					// Additional style to remove border from the .gm-style iframe+div
					// We can add a style tag or do a global CSS approach
				}
			}
		>
			{/* Tailwind container for the map */}
			<style jsx>{`
				.gm-style iframe + div {
					border: none !important;
				}
			`}</style>
		</div>
	);
}
