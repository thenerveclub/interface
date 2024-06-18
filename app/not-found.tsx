'use client';

import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Link from 'next/link';

const TrueLies = localFont({ src: '../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledBox = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 90%;
	max-width: 800px;
	height: 85vh;
	margin: 0 auto;
	background-color: transparent;

	h1 {
		color: ${(props) => props.theme.palette.text.primary};
		font-size: 5rem;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	@media (max-width: 750px) {
		width: 95%;
	}
`;

const Text = styled(Typography)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	align-content: center;
	color: #fff;
	cursor: default;
	text-transform: none;
	font-size: 0.9rem;

	&:hover {
		background-color: transparent;
	}

	@media (max-width: 750px) {
		font-size: 0.8rem;
	}
`;

export default function NotFound() {
	const theme = useTheme();

	return (
		<div>
			<StyledBox theme={theme}>
				<Link href={`/`} passHref style={{ textDecoration: 'none' }}>
					<h1>Sorry</h1>
				</Link>
				<Text>
					<a>We couldn&apos;t find that page.</a>
				</Text>
			</StyledBox>
		</div>
	);
}
