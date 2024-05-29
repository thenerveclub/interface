'use client';

import styled from '@emotion/styled';
import { Box, Switch, SwitchProps, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import { useState } from 'react';
import useTopContributors from '../../hooks/rankingData/useTopContributors';
import useTopDares from '../../hooks/rankingData/useTopDares';
import useTopEarners from '../../hooks/rankingData/useTopEarners';
import TopContributors from './boards/topContributors';
import TopDares from './boards/topDares';
import TopEarners from './boards/topEarners';

const TrueLies = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100%;
	// height: 85vh;
	margin: 5rem auto 0 auto;
	background-color: transparent;

	@media (max-width: 680px) {
		width: 95%;
		min-width: 100vw;
		max-width: 100vw;
	}
`;

const Title = styled(Typography)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-family: ${TrueLies.style.fontFamily};
	text-transform: none;
	font-size: 5rem;
	cursor: default;
	margin: 2.5rem auto 5rem auto;
	width: 100%;

	a {
		color: ${({ theme }) => theme.palette.text.primary};
		text-decoration: none;
	}

	@media (max-width: 680px) {
		font-size: 3rem;
	}
`;

const StyledDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	text-transform: none;
	font-size: 1rem;
	cursor: default;
	margin: 0 auto 0 auto;
	width: 100%;

	@media (max-width: 680px) {
		font-size: 1rem;
		margin: 0 auto 0 auto;
	}
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ theme: any }>`
	display: flex;
	justify-content: center;
	background-color: transparent;
	height: 35px;
	width: 400px;
	margin: 0 auto 0 auto;
	cursor: not-allowed;

	& .MuiToggleButton-root {
		&:hover {
			background-color: transparent;
			border: 1px solid ${({ theme }) => theme.palette.warning.main};
			border-left: 1px solid ${({ theme }) => theme.palette.warning.main};
		}
	}

	@media (max-width: 680px) {
		display: flex;
		justify-content: center;
		margin: 0 auto 0 auto;
		// width: 100%;
	}
`;

const StyledToggleButton = styled(ToggleButton)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	cursor: pointer;
	// font-size: 1rem;
	font-weight: 500;
	width: 150px;

	&.Mui-selected {
		color: ${({ theme }) => theme.palette.text.primary};
		background-color: transparent;
		border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	}
`;

export default function LeaderboardPage() {
	const theme = useTheme();

	// hooks
	const { topEarners, topEarnersLoading, topEarnersError } = useTopEarners();
	const { topContributors, topContributorsLoading, topContributorsError } = useTopContributors();
	const { topDares, topDaresLoading, topDaresError } = useTopDares();

	// State declaration
	const [leaderboardType, setLeaderboardType] = useState('topEarners');

	const handleToggleChange = (event, newType) => {
		if (newType !== null) {
			setLeaderboardType(newType);
		}
	};

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex" />
				<title>Ranking | Nerve Gloabl</title>
				<meta property="og:title" content="Ranking | Nerve Gloabl" key="title" />
				<meta property="og:site_name" content="Ranking | Nerve Gloabl" />
				<meta property="og:description" content="Ranking | Nerve Gloabl" />
				<meta property="og:image" content="https://app.nerveglobal.com/favicon.ico" />
				<meta property="og:url" content="https://app.nerveglobal.com/" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@nerveglobal_" />
				<meta name="twitter:title" content="Ranking | Nerve Gloabl" />
				<meta name="twitter:description" content="Ranking | Nerve Gloabl" />
				<meta name="twitter:image" content="https://app.nerveglobal.com/favicon.ico" />
			</Head>
			<StyledBox>
				<Title theme={theme}>
					<a>Leaderboard</a>
				</Title>
				<StyledDiv>
					<>
						<StyledToggleButtonGroup theme={theme} value={leaderboardType} exclusive onChange={handleToggleChange}>
							<StyledToggleButton theme={theme} value="topEarners" disabled={leaderboardType === 'topEarners'}>
								Earnings
							</StyledToggleButton>
							<StyledToggleButton theme={theme} value="topContributors" disabled={leaderboardType === 'topContributors'}>
								Contributions
							</StyledToggleButton>
							<StyledToggleButton theme={theme} value="topDares" disabled={leaderboardType === 'topDares'}>
								Dares
							</StyledToggleButton>
						</StyledToggleButtonGroup>
					</>
				</StyledDiv>
				{leaderboardType === 'topEarners' && <TopEarners topEarners={topEarners} loading={topEarnersLoading} error={topEarnersError} />}
				{leaderboardType === 'topContributors' && (
					<TopContributors topContributors={topContributors} loading={topContributorsLoading} error={topContributorsError} />
				)}
				{leaderboardType === 'topDares' && <TopDares topDares={topDares} loading={topDaresLoading} error={topDaresError} />}
			</StyledBox>
		</>
	);
}
