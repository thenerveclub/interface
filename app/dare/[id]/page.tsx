'use client';

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
import ActivityTable from './components/ActivityTable';
import DescriptionCard from './components/DescriptionCard';
import DetailsCard from './components/DetailsCard';
import ProofCard from './components/ProofCard';
import ShareCard from './components/ShareCard';
import TimerCard from './components/TimerCard';

export default function TaskPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const id = params.id;

	const network = id?.split('-')[0];
	const taskId = id?.split('-')[1];

	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);

	const { dareData, isLoading } = useDareData(network, taskId);
	const task = dareData?.[0]?.task;

	const finished = task?.finished;
	const timeover = task?.endTask <= Math.floor(Date.now() / 1000);
	const voteIsTrue = task?.positiveVotes > task?.negativeVotes;
	const proof = !!task?.proofLink;
	const isPlayer = task?.recipientAddress.toLowerCase() === account?.toLowerCase();
	const playerAddress = task?.recipientAddress;
	const { ensName, address } = useENSName(playerAddress);
	const player = ensName || address;
	const playerClaimed = task?.executed;

	let hasJoined = false;
	let hasVoted = false;
	let hasClaimed = false;
	let userVote: boolean | null = null;

	dareData.forEach((data) => {
		if (data.userAddress.toLowerCase() === account?.toLowerCase()) {
			hasJoined = true;
			if (data.voted) {
				hasVoted = true;
				userVote = data.vote;
				hasClaimed = data.userStake === '0';
			}
		}
	});

	return isLoading ? (
		<LoadingScreen />
	) : (
		<div className="flex flex-col w-[90%] max-w-7xl mx-auto mt-32 mb-20 sm:mt-28">
			<div className="flex flex-col lg:flex-row gap-10 mb-16">
				{/* Left Section */}
				<div className="flex flex-col w-full gap-10">
					<DescriptionCard dareData={dareData} />
					<DetailsCard dareData={dareData} player={player} />
				</div>

				{/* Right Section */}
				<div className="flex flex-col w-full gap-8">
					<div className="flex flex-col md:flex-row justify-between items-start gap-6">
						<TimerCard dareData={dareData} />
						<ShareCard dareData={dareData} player={player} />
					</div>

					{/* Conditional Action Section */}
					<div className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 px-6 py-4 flex justify-center items-center text-center min-h-[60px]">
						{account ? (
							finished || timeover ? (
								isPlayer ? (
									voteIsTrue && !playerClaimed ? (
										<Claim dareData={dareData} />
									) : (
										<p>{playerClaimed ? 'You have claimed your win' : 'You have lost the dare'}</p>
									)
								) : hasJoined && !voteIsTrue && !hasClaimed ? (
									<Redeem dareData={dareData} />
								) : (
									<p>{hasClaimed ? 'You have claimed your stake' : 'Player has won the dare'}</p>
								)
							) : isPlayer ? (
								!proof ? (
									<ProveDare dareData={dareData} />
								) : (
									voteIsTrue && playerClaimed && <Redeem dareData={dareData} />
								)
							) : !hasJoined ? (
								<JoinDare dareData={dareData} />
							) : !hasVoted ? (
								<VoteTask dareData={dareData} />
							) : (
								<p>{userVote ? 'You voted true' : 'You voted false'}</p>
							)
						) : (
							<Connect />
						)}
					</div>

					{proof && <ProofCard dareData={dareData} />}
				</div>
			</div>

			<ActivityTable dareData={dareData} />
		</div>
	);
}
