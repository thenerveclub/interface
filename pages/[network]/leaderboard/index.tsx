import styled from '@emotion/styled';
import { Box, Switch, SwitchProps, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import { useState } from 'react';
import DareLeaderboard from './boards/dare';
import PlayerLeaderboard from './boards/player';

const TrueLies = localFont({ src: '../../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 90%;
	min-width: 1400px;
	max-width: 1400px;
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
	margin-bottom: 2.5rem;

	a {
		color: ${({ theme }) => theme.palette.text.primary};
		text-decoration: none;
	}

	@media (max-width: 680px) {
		font-size: 2rem;
	}
`;

const StyledDiv = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	text-transform: none;
	font-size: 1rem;
	cursor: default;
	margin-bottom: 2.5rem;
	gap: 1rem;

	@media (max-width: 680px) {
		font-size: 1rem;
	}
`;

const IOSSwitch = styled((props: SwitchProps) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)<{ theme: any }>`
	width: 42px;
	height: 26px;
	padding: 0;
	& .MuiSwitch-switchBase {
		padding: 0;
		margin: 2px;
		transition-duration: 300ms;
		&.Mui-checked {
			transform: translateX(16px);
			color: #fff;
			& + .MuiSwitch-track {
				background-color: ${({ theme }) => theme.palette.success.main};
				opacity: 1;
				border: 0;
			}
			&.Mui-disabled + .MuiSwitch-track {
				opacity: 0.5;
			}
		}
		&.Mui-focusVisible .MuiSwitch-thumb {
			color: #33cf4d;
			border: 6px solid #fff;
		}
		&.Mui-disabled .MuiSwitch-thumb {
			color: ${({ theme }) => theme.palette.secondary.main};
		}
		&.Mui-disabled + .MuiSwitch-track {
			opacity: ${(props) => (props.theme.palette.mode === 'light' ? 0.7 : 0.3)};
		}
	}
	& .MuiSwitch-thumb {
		box-sizing: border-box;
		width: 22px;
		height: 22px;
	}
	& .MuiSwitch-track {
		border-radius: 13px;
		background-color: ${({ theme }) => theme.palette.secondary.main};
		opacity: 1;
		transition: ${(props) =>
			props.theme.transitions.create(['background-color'], {
				duration: 500,
			})};
	}
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ theme: any }>`
	display: flex;
	align-self: flex-end;
	background-color: transparent;
	height: 35px;
	width: 150px;
	margin: 0 0 1rem 4rem;
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
		margin: 0 auto 1rem auto;
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

	// chnage ios switch if true show dare else show player
	const [checked, setChecked] = useState(false);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
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
					Player
					<IOSSwitch theme={theme} checked={checked} onChange={handleChange} name="checked" />
					Dare
				</StyledDiv>
				<StyledToggleButtonGroup theme={theme}>
					<StyledToggleButton theme={theme} value={false}>
						Player
					</StyledToggleButton>
					<StyledToggleButton theme={theme} value={true}>
						<a>Dare</a>
					</StyledToggleButton>
				</StyledToggleButtonGroup>
				{checked ? <DareLeaderboard /> : <PlayerLeaderboard />}
			</StyledBox>
		</>
	);
}
