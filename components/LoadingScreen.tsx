import styled from '@emotion/styled';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import React from 'react';

const TrueLies = localFont({ src: '../public/fonts/TrueLies.woff2', display: 'swap' });

const LoadingSection = styled.section<{ theme: any }>`
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: ${({ theme }) => theme.palette.background.default};
	background-image: ${({ theme }) => theme.components.MuiCssBaseline.styleOverrides.body.backgroundImage};
	font-family: ${TrueLies.style.fontFamily};
	font-size: 3rem;
	font-weight: 400;
	animation: pulse 2s infinite;
	z-index: 9999;

	@keyframes pulse {
		0% {
			transform: scale(1);
			color: ${({ theme }) => theme.palette.secondary.main};
		}
		50% {
			transform: scale(1.1);
			color: ${({ theme }) => theme.palette.text.primary};
		}
		100% {
			transform: scale(1);
			color: ${({ theme }) => theme.palette.secondary.main};
		}
	}
`;

const LoadingScreen: React.FC = () => {
	const theme = useTheme();

	return (
		<>
			<LoadingSection theme={theme}>NERVE</LoadingSection>
		</>
	);
};

export default LoadingScreen;
