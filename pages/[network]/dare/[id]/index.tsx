import styled from '@emotion/styled';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import JoinDare from '../../../../components/modal/joinDare';
import useDareData from '../../../../hooks/dareData/useDareData';
import { nameToChainId } from '../../../../utils/chains';
import ActivityTable from './components/ActivityTable';

const StyledBox = styled(Box)`
	margin: 7.5rem 5rem auto 5rem;

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

const StyledBoxInternal = styled(Box)`
	display: flex;
	flex-direction: row;
	margin: 0 auto 0 auto;
	padding: 1.125rem;
	gap: 5rem;

	div {
		display: flex;
		flex-direction: column;
		align-items: left;
		width: 25%;
	}

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

const SideWall = styled(Box)`
	display: flex;
	width: 350px;
	max-width: 350px;
	height: 300px;
	max-height: 300px;
	margin: 0 auto 0 auto;
	background-color: #e0e0e0; // Some background color for visualization
`;

const StyledSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	align-content: center;
	margin: 5rem auto 0 auto;

	& > *:not(:last-child) {
		margin-bottom: 2rem;
	}

	@media (max-width: 960px) {
		display: grid;
		align-items: center;
		margin: 0 auto 0 auto;
		grid-template-columns: 1fr;
		grid-gap: 2em;
	}
`;

const TaskCardLeftSide = styled(Box)<{ theme: any }>`
	width: 738px;
	max-width: 738px;
	height: 189px;
	max-height: 189px;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	align-items: center;
	justify-content: center;
	position: relative;
	width: 90%;

	a {
		display: flex;
		margin: 0 auto 0 auto;
		font-size: 16px;
		cursor: default;
		justify-content: left;
		padding: 1rem;
	}

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const TaskCardRightSide = styled(Box)<{ theme: any }>`
	width: 350px;
	max-width: 350px;
	height: 300px;
	max-height: 300px;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	align-items: center;
	justify-content: center;
	position: relative;
	width: 90%;

	a {
		display: flex;
		margin: 0 auto 0 auto;
		font-size: 16px;
		cursor: default;
		justify-content: left;
		padding: 1rem;
	}

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const StyledDivider = styled(Divider)<{ theme: any }>`
	border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
`;

export default function TaskPage() {
	const theme = useTheme();
	const router = useRouter();
	const network = router.query.network as string;
	const id = router.query.id as string;

	// Name to Chain ID
	const chainIdUrl = nameToChainId[network];

	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// State declarations

	// Hooks
	const dareData = useDareData(chainIdUrl, id);

	const prove = false;

	// Twitch Live Status
	// const twitchLink = playerData[0]?.userSocialStat?.twitch.includes('twitch') ? playerData[0]?.userSocialStat?.twitch : '';
	// const twitchSplit = twitchLink?.split('/');
	// const twitchChannelName = twitchSplit[twitchSplit.length - 1];
	// const isTwitchLive = useTwitchStatus(twitchChannelName);

	// YouTube Live Status
	// const youTubeLink = playerData[0]?.userSocialStat?.youtube.includes('youtube') ? playerData[0]?.userSocialStat?.youtube : '';
	// const youTubeSplit = youTubeLink?.split('/@');
	// const youTubeChannelName = youTubeSplit[youTubeSplit.length - 1];
	// const youTubeChannelName = 'inscope21';
	// const isYouTubeLive = useYouTubeStatus(youTubeChannelName);

	const handleClickUser = (user) => {
		return () => {
			router.push(`/${network}/player/${user}`);
		};
	};

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	return (
		<StyledBox>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<StyledSection>
						<TaskCardLeftSide theme={theme}>
							<a>Description</a>
							<StyledDivider theme={theme} />
							<a>
								By ({dareData?.[0]?.task.initiatorAddress.substring(0, 6)}...
								{dareData?.[0]?.task.initiatorAddress.substring(dareData?.[0]?.task.initiatorAddress.length - 4).toUpperCase()})
								{/* <a onClick={handleClickUser(dareData?.[0]?.task.initiatorName)}>{dareData?.[0]?.task.initiatorName}</a> */}
							</a>
							{dareData?.[0]?.task.description}
						</TaskCardLeftSide>
						<TaskCardLeftSide theme={theme}>
							<a>Details</a>
							<StyledDivider theme={theme} />
							<StyledBoxInternal>
								<div>
									<Typography variant="body1">Player</Typography>
									<Typography variant="body2" onClick={handleClickUser(dareData?.[0]?.task.recipientName)}>
										{dareData?.[0]?.task.recipientName}
									</Typography>
								</div>
								<div>
									<Typography variant="body1">Task ID</Typography>
									<Typography variant="body2">{id}</Typography>
								</div>
								<div>
									<Typography variant="body1">Participants</Typography>
									<Typography variant="body2">{dareData?.[0]?.task.participants}</Typography>
								</div>
								<div>
									<Typography variant="body1">Chain</Typography>
									<Typography variant="body2">{network}</Typography>
								</div>
							</StyledBoxInternal>
							<StyledBoxInternal>
								<div>
									<Typography variant="body1">Entry Amount</Typography>
									<Typography variant="body2">{formatNumber(dareData?.[0]?.task.entranceAmount)}</Typography>
								</div>
								<div>
									<Typography variant="body1">Total Amount</Typography>
									<Typography variant="body2">{formatNumber(dareData?.[0]?.task.amount)}</Typography>
								</div>
							</StyledBoxInternal>
						</TaskCardLeftSide>

						<ActivityTable id={id} dareData={dareData} chainIdUrl={chainIdUrl} />
					</StyledSection>
				</Grid>

				{/* Side Wall (30% width) */}
				<Grid item xs={3}>
					<StyledSection>
						{prove === false ? (
							<TaskCardRightSide theme={theme}>
								<a>Prove</a>
								<StyledDivider theme={theme} />
							</TaskCardRightSide>
						) : (
							''
						)}
						<TaskCardRightSide theme={theme}>
							<a>Task ends</a>
							<StyledDivider theme={theme} />
						</TaskCardRightSide>
						<JoinDare />
					</StyledSection>
				</Grid>
			</Grid>
		</StyledBox>
	);
}
