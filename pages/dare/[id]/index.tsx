import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect, useRef, useState } from 'react';
import NerveGlobalABI from '../../../abi/NerveGlobal.json';
import Connect from '../../../components/modal/Connect';
import Join from '../../../components/modal/joinTask';
import Vote from '../../../components/modal/voteTask';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitch from '/public/svg/socials/twitch.svg';
import Twitter from '/public/svg/socials/twitter.svg';
import Youtube from '/public/svg/socials/youtube.svg';

const StyledInstagram = styled(Instagram)`
	path {
		fill: #white;
	}

	width: 20px;
	height: 20px;

	:hover {
		transform: rotate(-10deg);
		transition: 0.5s;
		path {
			fill: #e1306c;
		}
	}
`;

const StyledTwitter = styled(Twitter)`
	path {
		fill: #white;
	}

	width: 20px;
	height: 20px;

	:hover {
		transform: rotate(-10deg);
		transition: 0.5s;
		path {
			transition: 0.5s;
			fill: #1da1f2;
		}
	}
`;

const StyledTikTok = styled(TikTok)`
	path {
		fill: #white;
	}

	width: 20px;
	height: 20px;

	:hover {
		transform: rotate(-10deg);
		transition: 0.5s;
		path {
			transition: 0.5s;
			fill: #00f2ea;
		}
	}
`;

const StyledYoutube = styled(Youtube)`
	path {
		fill: #white;
	}

	width: 20px;
	height: 20px;

	:hover {
		transform: rotate(-10deg);
		transition: 0.5s;
		path {
			transition: 0.5s;
			fill: #ff0000;
		}
	}
`;

const StyledTwitch = styled(Twitch)`
	path {
		fill: #white;
	}

	width: 20px;
	height: 20px;

	:hover {
		transform: rotate(-10deg);
		transition: 0.5s;
		path {
			transition: 0.5s;
			fill: #6441a5;
		}
	}
`;

const StyledCard = styled.div`
	background-color: rgba(0, 0, 20, 0.5);
	border: '1px';
	border-color: #00f2fc;
	padding: 2rem;
	border-radius: 24px;
`;

const GrantsCard = styled(StyledCard)`
	width: 500px;
	height: 500px;
	margin: 0 auto 0 auto;
	border: '1px';
	border-color: #00f2fc;

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const AnalyticsCard = styled(StyledCard)`
	width: 400px;
	height: 200px;
	margin: 0 auto 0 auto;

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const Positive = styled.div`
	color: green;
	align-items: left;
	text-align: left;
	display: flex;
	margin-left: 5px;
	flex: 1;
`;

const Negative = styled.div`
	color: red;
	align-items: left;
	text-align: left;
	display: flex;
	margin-left: 5px;
	flex: 1;
`;

const StyledItemRowSocials = styled.nav`
	display: flex;
	flex: 1;
	flex-direction: row;
	font-size: 16px;
	font-weight: 500;
	justify-content: space-between;
	width: 100%;
	margin: -0.5rem auto 0.75rem auto;

	p {
		font-size: 16px;
		justify-content: space-between;
	}

	a {
		font-size: 16px;

		:hover {
			transition: 0.5s;
			color: #00f2fc;
		}
	}

	@media (max-width: 960px) {
		font-size: 16px;
		justify-content: space-between;
		width: 100%;
		margin: 0 auto 0 auto;

		p {
			font-size: 12px;
		}

		& > * {
			margin-top: 1px;
			margin-bottom: 1px;
		}
		& > *:not(:first-of-type) {
			margin-top: 0;
			align-items: right;
		}
	}
`;

const StyledItemRowDescription = styled.nav`
	display: flex;
	flex: 1;
	flex-direction: row;
	height: 80px;
	font-size: 18px;
	font-weight: 500;
	justify-content: space-between;
	width: 100%;
	margin: 0 auto 0 auto;

	p {
		font-size: 12px;
		justify-content: space-between;
	}

	a {
		font-size: 18px;
	}

	@media (max-width: 960px) {
		font-size: 16px;
		justify-content: space-between;
		width: 100%;
		margin: 0 auto 0 auto;

		p {
			font-size: 12px;
		}

		& > * {
			margin-top: 1px;
			margin-bottom: 1px;
		}
		& > *:not(:first-of-type) {
			margin-top: 0;
			align-items: right;
		}
	}
`;

const StyledItemRowIntern = styled.nav`
	display: flex;
	flex: 1;
	flex-direction: row;
	font-size: 16px;
	font-weight: 500;
	justify-content: space-between;
	width: 100%;
	margin: 0 auto 0 auto;

	p {
		font-size: 16px;
		justify-content: space-between;
	}

	a {
		font-size: 16px;
	}

	negative {
		color: red;
	}

	positive {
		font-size: 16px;
		color: green;
	}

	@media (max-width: 960px) {
		font-size: 16px;
		justify-content: space-between;
		width: 100%;
		margin: 0 auto 0 auto;

		p {
			font-size: 12px;
		}

		& > * {
			margin-top: 1px;
			margin-bottom: 1px;
		}
		& > *:not(:first-of-type) {
			margin-top: 0;
			align-items: right;
		}
	}
`;

const StyledItemRow = styled.nav`
	display: flex;
	flex-direction: row;
	margin: 0 auto 0 auto;

	& > * {
		margin-right: 10px;
	}

	@media (max-width: 960px) {
		flex-direction: column-reverse;

		& > * {
			margin-right: 0;
			margin-top: 10px;
		}
	}
`;

const SmallStyledItemRow = styled.nav`
	display: flex;
	flex-direction: column;
	margin: 0 20px 0 auto;

	& > * {
		margin: 0 auto 0 auto;
	}

	& > *:not(:first-of-type) {
		margin: 20px 20px 0 auto;
	}

	@media (max-width: 960px) {
		flex-direction: column-reverse;

		& > * {
			margin-right: 0;
			margin-top: 10px;
		}
	}
`;

const StyledSection = styled.section`
	display: flex;
	align-items: center;
	justify-content: center;
	align-content: center;
	margin: 5rem auto 0 auto;

	@media (max-width: 960px) {
		display: grid;
		align-items: center;
		margin: 0 auto 0 auto;
		grid-template-columns: 1fr;
		grid-gap: 2em;
	}
`;

export default function DarePage() {
	// Get Task ID
	const path = (global.window && window.location.pathname)?.toString() || '';
	const dareNumber = path.split('/').pop();
	const Id = '0x'.concat(dareNumber);

	// Query The Graph -> Dares
	const [tad, setTAD] = useState<any[]>([]);
	useEffect(() => {
		const getTask = async () => {
			try {
				const fetchTask = await fetch('https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForDare }),
				})
					.then((response) => response.json())
					.then((data) => setTAD(data.data.tasks));
			} catch (error) {}
		};
		const interval = setInterval(getTask, 1000);

		return () => clearInterval(interval);
	}, []);

	const QueryForDare = `
{
  tasks(where: { id:"${Id}"}) 
  {
   description
	recipientAddress
   recipientName
   endTask
   proofLink
   positiveVotes
   negativeVotes
   amount
	entranceAmount
   participants
  }
}
`;

	// Query The Graph -> User -> Joined Dare || Voted Dare || Claimed Dare
	const [queryForUser, setQueryForUser] = useState<any[]>([]);
	useEffect(() => {
		const getUser = async () => {
			try {
				const fetchUserTask = await fetch('https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForUser }),
				}).then((response) => {
					if (response.ok) {
						response
							.json()

							.then((data) => setQueryForUser(data.data.userTasks));
					}
					throw console.log('Array is Empty');
				});
			} catch (error) {}
		};
		const interval = setInterval(getUser, 1000);

		return () => clearInterval(interval);
	}, []);

	const { account, provider, isActive } = useWeb3React();
	const acc = account?.toLowerCase();
	// TODO -> Get ${account} as userAddress
	const QueryForUser = `
{
	userTasks(where: { id:"0x52B28292846c59dA23114496d6e6BfC875f54FF5-${Id}"}) {
	  userStake
	  voted
	  vote
	  endTask
	  finished
	 }
	}
`;

	const matic = Number(usePrice());

	// Merge The Graph Queries
	let merged = [] as any;
	for (let i = 0; i < tad.length; i++) {
		merged[i] = { ...tad[i], ...queryForUser[i] };
	}

	// User joined?
	let joined = queryForUser.length === 0 ? false : true;

	//Claim Function
	const [pendingTx, setPendingTx] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	async function claimFunction() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract('0x91596B44543016DDb5D410A51619D5552961a23b', NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			await nerveGlobal.redeemUser(Id, { gasLimit: 250000 });
			enqueueSnackbar('Transaction signed succesfully!', {
				variant: 'success',
			});
		} catch (error) {
			enqueueSnackbar('Transaction failed!', {
				variant: 'error',
				action: (key) => (
					<Fragment>
						<Button size="small" onClick={() => alert(`${error}${key}`)}>
							Detail
						</Button>
					</Fragment>
				),
			});
			setPendingTx(false);
		}
	}

	// TODO Countdown Timer
	const [dareTimer, setDareTimer] = useState(false);
	const [days, setDays] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const timestamp = merged['endTask'];

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const difference = Math.floor(1669138345 * 1000) - now;
			console.log('ENDTASK', timestamp);

			// ENDTASK 0

			const d = Math.floor(difference / (1000 * 60 * 60 * 24));
			setDays(d);

			const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			setHours(h);

			const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
			setMinutes(m);

			const s = Math.floor((difference % (1000 * 60)) / 1000);
			setSeconds(s);

			if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
				setDareTimer(true);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<StyledSection>
				{merged.map((merged) => (
					<li style={{ listStyle: 'none' }} key={merged.participants}>
						<StyledItemRow>
							<SmallStyledItemRow>
								<AnalyticsCard>
									<StyledItemRowIntern>
										<p>Total Votes</p>
										<p>{Number(merged.positiveVotes) + Number(merged.negativeVotes)}</p>
									</StyledItemRowIntern>
									<Divider variant="fullWidth" color={'#fff'} />

									<StyledItemRowIntern>
										<p>Positive Votes</p>
										<p>{merged.positiveVotes}</p>
									</StyledItemRowIntern>
									<StyledItemRowIntern>
										<p>Negative Votes</p>
										<p>{merged.negativeVotes}</p>
									</StyledItemRowIntern>
								</AnalyticsCard>

								{/* <AnalyticsCard>
									<StyledItemRowIntern>
									</StyledItemRowIntern>
								</AnalyticsCard> */}
							</SmallStyledItemRow>

							<GrantsCard>
								<StyledItemRowSocials style={{ fontSize: '16px' }}>
									{merged.recipientName.length > 0 ? (
										<a
											key={merged.recipientName}
											target="_blank"
											rel="noreferrer"
											href={'https://app.nerveglobal.com/player/#' + merged.recipientName}
										>
											{merged.recipientName}↗
										</a>
									) : (
										<a
											key={merged.recipientAddress}
											target="_blank"
											rel="noreferrer"
											href={'https://app.nerveglobal.com/#' + merged.recipientAddress}
										>
											{merged.recipientAddress.substring(0, 6)}...{merged.recipientAddress.substring(merged.recipientAddress.length - 4)}
										</a>
									)}
								</StyledItemRowSocials>

								<StyledItemRowDescription>{merged.description}</StyledItemRowDescription>

								<StyledItemRowIntern>
									<p>Proof</p>
									{merged.proofLink.length === 0 ? (
										<p>Outstanding</p>
									) : merged.proofLink.includes('instagram') ? (
										<a target="_blank" rel="noreferrer" href={merged.proofLink}>
											<StyledInstagram />
										</a>
									) : merged.proofLink.includes('twitter') ? (
										<a target="_blank" rel="noreferrer" href={merged.proofLink}>
											<StyledTwitter />
										</a>
									) : merged.proofLink.includes('tiktok') ? (
										<a target="_blank" rel="noreferrer" href={merged.proofLink}>
											<StyledTikTok />
										</a>
									) : merged.proofLink.includes('youtube') ? (
										<a target="_blank" rel="noreferrer" href={merged.proofLink}>
											<StyledYoutube />
										</a>
									) : (
										<a target="_blank" rel="noreferrer" href={merged.proofLink}>
											<StyledTwitch />
										</a>
									)}
								</StyledItemRowIntern>
								<StyledItemRowIntern>
									<p>Time</p>
									{dareTimer ? (
										<p>Time's over</p>
									) : (
										<p>
											<div className="timer-wrapper">
												<div className="timer-inner">
													<a className="timer-segment">
														<span className="time">{days}:</span>
													</a>
													<a className="timer-segment">
														<span className="time">{hours}:</span>
													</a>
													<a className="timer-segment">
														<span className="time">{minutes}:</span>
													</a>
													<a className="timer-segment">
														<span className="time">{seconds}</span>
													</a>
												</div>
											</div>
										</p>
									)}
								</StyledItemRowIntern>
								<StyledItemRowIntern>
									<p>Participants</p>
									<p>{merged.participants}</p>
								</StyledItemRowIntern>
								<StyledItemRowIntern>
									<p>Entry Amount</p>
									<p>${((merged.entranceAmount / 1e18) * matic).toFixed(2)}</p>
								</StyledItemRowIntern>
								<StyledItemRowIntern>
									<p>Total Amount</p>
									<p>${((merged.amount / 1e18) * matic).toFixed(2)}</p>
								</StyledItemRowIntern>

								{account ? (
									joined === false ? (
										<Join />
									) : merged.voted === false ? (
										<Vote />
									) : dareTimer && merged.positiveVotes - merged.negativeVotes < 0 ? (
										<Button fullWidth={true} onClick={claimFunction}>
											Claim
										</Button>
									) : (
										<Button fullWidth={true} color="primary" disabled={true}>
											Wait for vote
										</Button>
									)
								) : (
									<Connect />
								)}
							</GrantsCard>
						</StyledItemRow>
					</li>
				))}
			</StyledSection>
		</>
	);
}

function usePrice() {
	const [maticPrice, setPrice] = useState<number[]>([]);

	useEffect(() => {
		fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object),
		})
			.then((response) => response.json())
			.then((data) => setPrice(data['matic-network'].usd));
	}, []);

	return maticPrice;
}
