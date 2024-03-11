import styled from '@emotion/styled';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import Claim from '../../../components/modal/claim';
import JoinDare from '../../../components/modal/join';
import Connect from '../../../components/modal/menu/Connect';
import ProveDare from '../../../components/modal/prove';
import Redeem from '../../../components/modal/redeem';
import VoteTask from '../../../components/modal/vote';
import useDareData from '../../../hooks/dareData/useDareData';
import useENSName from '../../../hooks/useENSName';
import { nameToChainId } from '../../../utils/chains';
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
	const id = router.query.id as string;

	// split id to get chainId before "-" and task id after "-"
	const network = id?.split('-')[0];
	const taskId = id?.split('-')[1];

	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);

	// State declarations

	// Hooks
	const { dareData, isLoading } = useDareData(network, taskId);

	// console.log('dareData', dareData);

	const finished = dareData?.[0]?.task.finished;
	const timeover = dareData?.[0]?.task.endTask <= Math.floor(Date.now() / 1000);
	const voteIsTrue = dareData?.[0]?.task.positiveVotes > dareData?.[0]?.task.negativeVotes ? true : false;
	const proof = dareData?.[0]?.task.proofLink === '' ? false : true;
	const isPlayer = dareData?.[0]?.task.recipientAddress.toLowerCase() === account.toLowerCase();
	const playerAddress = dareData?.[0]?.task.recipientAddress;
	const { ensName, address, error } = useENSName(playerAddress);
	const player = ensName ? ensName : address;
	console.log('player', playerAddress);
	const proven = dareData?.[0]?.task.proofLink === '' ? false : true;
	const playerClaimed = dareData?.[0]?.task.executed;

	const description = dareData?.[0]?.task.description;
	const initiator = dareData?.[0]?.task.initiatorAddress;
	const participants = dareData?.[0]?.task.participants;
	const entranceAmount = dareData?.[0]?.task.entranceAmount;
	const amount = dareData?.[0]?.task.amount;

	// Initialize variables to track if the user has joined and voted
	let hasJoined = false;
	let hasVoted = false;
	let userVote = null;
	let hasClaimed = false;

	// Iterate over dareData to check for both conditions
	dareData.forEach((data) => {
		if (data.userAddress.toLowerCase() === account.toLowerCase()) {
			hasJoined = true; // The user's address is in dareData, so they've joined

			if (data.voted) {
				hasVoted = true; // The user's address matched, and they have voted
				userVote = data.vote;
				hasClaimed = data.userStake === '0';
			}
		}
	});

	// console.log('playerClaimed ', playerClaimed);

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

	return (
		<>
			<StyledBox>
				<StyledGridBox>
					<StyledLeftSection>
						<DescriptionCard description={description} initiator={initiator} player={player} />
						<DetailsCard network={network} id={taskId} player={player} participants={participants} entranceAmount={entranceAmount} amount={amount} />
						<ActivityTable network={network} id={taskId} dareData={dareData} />
						{/* <Chart dareData={dareData} /> */}
					</StyledLeftSection>
					<StyledRightSection>
						<TimerCard dareData={dareData} />
						{account ? (
							finished || timeover ? (
								isPlayer ? (
									voteIsTrue && !playerClaimed ? (
										<Claim dareData={dareData} />
									) : (
										<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
											<p>{playerClaimed ? 'You have claimed your win' : 'You has lost the dare'}</p>
										</div>
									)
								) : !voteIsTrue && !hasClaimed ? (
									<Redeem dareData={dareData} />
								) : (
									<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
										<p>{hasClaimed ? 'You have claimed your stake' : 'Player has won the dare'}</p>
									</div>
								)
							) : isPlayer ? (
								!proven ? (
									<ProveDare dareData={dareData} />
								) : (
									voteIsTrue && playerClaimed && <Redeem dareData={dareData} />
								)
							) : !hasJoined ? (
								<JoinDare dareData={dareData} />
							) : !hasVoted ? (
								<VoteTask dareData={dareData} />
							) : (
								<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
									<p>{userVote === true ? 'You voted true' : 'Yout voted false'}</p>
								</div>
							)
						) : (
							<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
								<Connect />
							</div>
						)}
						{proof && <ProofCard dareData={dareData} />}
					</StyledRightSection>
				</StyledGridBox>
			</StyledBox>
		</>
	);
}
