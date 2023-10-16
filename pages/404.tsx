import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import localFont from 'next/font/local';
import Head from 'next/head';

const TrueLies = localFont({ src: '../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledBox = styled(Box)`
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

	@media (max-width: 600px) {
		width: 95%;
	}
`;

const Title = styled(Typography)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-family: ${TrueLies.style.fontFamily};
	color: #fff;
	text-transform: none;
	font-size: 5rem;
	cursor: default;
	margin-bottom: 2.5rem;

	a {
		color: #fff;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	@media (max-width: 600px) {
		font-size: 3rem;
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

	@media (max-width: 600px) {
		font-size: 0.8rem;
	}
`;

export default function Page() {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex" />
				<title>404 Not Found | Nerve Gloabl</title>
				<meta property="og:title" content="404 Not Found | Nerve Gloabl" key="title" />
				<meta property="og:site_name" content="404 Not Found | Nerve Gloabl" />
				<meta property="og:description" content="404 Not Found | Nerve Gloabl" />
				<meta property="og:image" content="https://app.nerveglobal.com/favicon.ico" />
				<meta property="og:url" content="https://app.nerveglobal.com/" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@nerveglobal_" />
				<meta name="twitter:title" content="404 Not Found | Nerve Gloabl" />
				<meta name="twitter:description" content="404 Not Found | Nerve Gloabl" />
				<meta name="twitter:image" content="https://app.nerveglobal.com/favicon.ico" />
			</Head>
			<StyledBox>
				<Title>
					<a href={'/'} aria-label="Return to home page">
						Sorry
					</a>
				</Title>
				<Text>
					<a>We couldn't find that page.</a>
				</Text>
			</StyledBox>
		</>
	);
}
