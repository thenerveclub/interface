import styled from '@emotion/styled';
import { Redeem } from '@mui/icons-material';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../../components/LoadingScreen';
import JoinDare from '../../../../components/modal/joinDare';
import RedeemRecipient from '../../../../components/modal/redeemRecipient';
import RedeemUser from '../../../../components/modal/redeemUser';
import useDareData from '../../../../hooks/dareData/useDareData';
import { nameToChainId } from '../../../../utils/chains';
import ActivityTable from './components/ActivityTable';
import Chart from './components/Chart';
import DescriptionCard from './components/DescriptionCard';
import DetailsCard from './components/DetailsCard';
import ProofCard from './components/ProofCard';
import TimerCard from './components/TimerCard';

const StyledBox = styled(Box)`
	margin: 10rem auto 0 auto;
	width: 90%;

	@media (max-width: 600px) {
		margin: 5rem auto 0 auto;
	}
`;

const StyledGridBox = styled(Box)`
	display: flex;
	flex-direction: row;

	@media (min-width: 961px) {
		& > *:first-child {
			flex: 0 0 60%; // The first child takes 70% of the space
		}

		& > *:not(:first-child) {
			flex: 1; // Other children share the remaining space
		}
	}

	@media (max-width: 960px) {
		flex-direction: column;
		margin: 0 auto 0 auto;

		& > *:first-child {
			margin-top: 2rem;
			order: 2;
		}
	}
`;

const StyledLeftSection = styled.section`
	display: flex;
	flex-direction: column;

	& > *:not(:last-child) {
		margin-bottom: 2rem;
	}

	@media (max-width: 960px) {
		display: flex;
		flex-direction: column;
	}
`;

const StyledRightSection = styled.section`
	display: flex;
	flex-direction: column;

	& > *:not(:last-child) {
		margin-bottom: 2rem;
	}

	@media (max-width: 960px) {
		display: flex;
		flex-direction: column;
	}
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

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainIdUrl);

	// State declarations

	// Hooks
	const { dareData, isLoading } = useDareData(isNetworkAvailable ? chainIdUrl : 137, id);

	const finished = dareData?.[0]?.task.finished;
	const voteIsTrue = dareData?.[0]?.task.positiveVotes > dareData?.[0]?.task.negativeVotes ? true : false;
	const proof = dareData?.[0]?.task.proofLink === '' ? false : true;

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

	// Get current unix timestamp
	const currentUnixTimestamp = Math.floor(Date.now() / 1000);

	// Task end time to unix timestamp in number
	const taskEndTime = Number(dareData?.[0]?.task.endTask);

	return (
		<>
			{isLoading ? (
				<LoadingScreen />
			) : (
				<StyledBox>
					<StyledGridBox>
						<StyledLeftSection>
							<DescriptionCard dareData={dareData} />
							<DetailsCard id={id} network={network} dareData={dareData} />
							<ActivityTable id={id} dareData={dareData} chainIdUrl={chainIdUrl} network={network} />
							{/* <Chart dareData={dareData} /> */}
						</StyledLeftSection>
						<StyledRightSection>
							<TimerCard currentUnixTimestamp={currentUnixTimestamp} taskEndTime={taskEndTime} />
							{account &&
								(finished ? (
									voteIsTrue ? (
										<RedeemRecipient id={id} dareData={dareData} chainIdUrl={chainIdUrl} network={network} isNetworkAvailable={isNetworkAvailable} />
									) : (
										<RedeemUser id={id} dareData={dareData} chainIdUrl={chainIdUrl} network={network} isNetworkAvailable={isNetworkAvailable} />
									)
								) : (
									<JoinDare id={id} dareData={dareData} chainIdUrl={chainIdUrl} network={network} isNetworkAvailable={isNetworkAvailable} />
								))}
							{proof && <ProofCard dareData={dareData} />}
						</StyledRightSection>
					</StyledGridBox>
				</StyledBox>
			)}
		</>
	);
}
