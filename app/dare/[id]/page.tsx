'use client';

import styled from '@emotion/styled';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
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
import ShareCard from './components/ShareCard';
import TimerCard from './components/TimerCard';

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	margin: 7.5rem auto 5rem auto;
	width: 90%;

	@media (max-width: 600px) {
		margin: 7.5rem auto 7.5rem auto;
		width: 95%;
	}
`;

const StyledGridBox = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	margin: 0 auto 2.5rem auto;
	gap: 2.5rem;

	@media (max-width: 960px) {
		flex-direction: column;
		margin: 0 auto 2rem auto;

		& > *:first-child {
			margin-top: 2rem;
			order: 2;
		}
	}
`;

const StyledLeftSection = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 100%;

	& > *:not(:last-child) {
		margin-bottom: 2.5rem;
	}

	@media (max-width: 960px) {
		display: flex;
		flex-direction: column;
	}
`;

const StyledRightSection = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 100%;

	& > *:not(:last-child) {
		margin-bottom: 2rem;
	}

	@media (max-width: 960px) {
		display: flex;
		flex-direction: column;
	}
`;

const StyledTimerAndShare = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: top;
	width: 100%;
	margin-bottom: 2rem;
	gap: 2.5rem;

	// both items in there get each 50% of the width
	& > * {
		width: 50%;
	}

	@media (max-width: 860px) {
		display: flex;
		flex-direction: column;
	}
`;

export default function TaskPage({ params }: { params: { id: string } }) {
	const theme = useTheme();
	const router = useRouter();
	const id = params.id;

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
	console.log('isPlayer', isPlayer, account);
	const playerAddress = dareData?.[0]?.task.recipientAddress;
	const { ensName, address, error } = useENSName(playerAddress);
	const player = ensName ? ensName : address;
	const proven = dareData?.[0]?.task.proofLink === '' ? false : true;
	const playerClaimed = dareData?.[0]?.task.executed;

	// Initialize variables to track if the user has joined and voted
	let hasJoined = false;
	let hasVoted = false;
	let userVote = null;
	let hasClaimed = false;

	console.log('hasJoined', hasJoined);
	console.log('hasVoted', hasVoted);

	// Iterate over dareData to check for both conditions
	dareData.forEach((data) => {
		if (data.userAddress.toLowerCase() === account.toLowerCase()) {
			console.log('data', data);
			hasJoined = true; // The user's address is in dareData, so they've joined

			if (data.voted) {
				hasVoted = true; // The user's address matched, and they have voted
				userVote = data.vote;
				hasClaimed = data.userStake === '0';
			}
		}
	});

	// console.log('playerClaimed ', playerClaimed);

	return (
		<div>
			<h1>Index Page</h1>
		</div>
		// <>
		// 	{isLoading ? (
		// 		<LoadingScreen />
		// 	) : (
		// 		<StyledBox>
		// 			<StyledGridBox>
		// 				<StyledLeftSection>
		// 					<DescriptionCard dareData={dareData} />
		// 					<DetailsCard dareData={dareData} player={player} />

		// 					{/* <Chart dareData={dareData} /> */}
		// 				</StyledLeftSection>
		// 				<StyledRightSection>
		// 					<StyledTimerAndShare>
		// 						<TimerCard dareData={dareData} />
		// 						<ShareCard dareData={dareData} player={player} />
		// 					</StyledTimerAndShare>
		// 					{account ? (
		// 						finished || timeover ? (
		// 							isPlayer ? (
		// 								voteIsTrue && !playerClaimed ? (
		// 									<Claim dareData={dareData} />
		// 								) : (
		// 									<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
		// 										<p>{playerClaimed ? 'You have claimed your win' : 'You has lost the dare'}</p>
		// 									</div>
		// 								)
		// 							) : hasJoined && !voteIsTrue && !hasClaimed ? (
		// 								<Redeem dareData={dareData} />
		// 							) : (
		// 								<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
		// 									<p>{hasClaimed ? 'You have claimed your stake' : 'Player has won the dare'}</p>
		// 								</div>
		// 							)
		// 						) : isPlayer ? (
		// 							!proven ? (
		// 								<ProveDare dareData={dareData} />
		// 							) : (
		// 								voteIsTrue && playerClaimed && <Redeem dareData={dareData} />
		// 							)
		// 						) : !hasJoined ? (
		// 							<JoinDare dareData={dareData} />
		// 						) : !hasVoted ? (
		// 							<VoteTask dareData={dareData} />
		// 						) : (
		// 							<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
		// 								<p>{userVote === true ? 'You voted true' : 'Yout voted false'}</p>
		// 							</div>
		// 						)
		// 					) : (
		// 						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
		// 							<Connect />
		// 						</div>
		// 					)}
		// 					{proof && <ProofCard dareData={dareData} />}
		// 				</StyledRightSection>
		// 			</StyledGridBox>
		// 			<ActivityTable dareData={dareData} />
		// 		</StyledBox>
		// 	)}
		// </>
	);
}
