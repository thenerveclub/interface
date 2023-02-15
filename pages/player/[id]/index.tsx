import styled from '@emotion/styled';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import Connect from '../../../components/modal/Connect';
import RegisterName from '../../../components/modal/RegisterName';
import RegisterSocial from '../../../components/modal/RegisterSocial';
import CreateTask from '../../../components/modal/createTask';
import { CheckNameRegister } from '../../../utils/validation/checkNameRegister';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitch from '/public/svg/socials/twitch.svg';
import Twitter from '/public/svg/socials/twitter.svg';
import Youtube from '/public/svg/socials/youtube.svg';

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
	flex-direction: column;
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

export default function PlayerPage() {
	const { account } = useWeb3React();
	const [registerStatus] = CheckNameRegister();
	// checksum address to lowercase
	const checksumAddress = registerStatus?.toLowerCase();
	const checksumAccount = account?.toLowerCase();

	// Get Task ID
	const path = (global.window && window.location.pathname)?.toString() || '';
	const playerName = path.split('/').pop();
	const playerNameAddress = playerName?.toLowerCase();

	// 0x52b28292846c59da23114496d6e6bfc875f54ff5

	// Query The Graph -> Dare Data
	const QueryForDare = `
{
  tasks(where: { id:"0xa2"}) 
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

	const [tad, setTAD] = useState<any[]>([]);
	useEffect(() => {
		const getTAD = async () => {
			try {
				const response = await fetch('https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForDare }),
				});
				if (response.ok) {
					const data = await response.json();
					setTAD(data.data.tasks);
				} else {
					console.log('Array is Empty');
				}
			} catch (error) {
				console.error(error);
			}
		};
		const interval = setInterval(getTAD, 1000);

		return () => clearInterval(interval);
	}, []);

	// Query The Graph -> Player Data
	const [playerData, setPlayerData] = useState<any[]>([]);

	useEffect(() => {
		const getTask = async () => {
			const QueryForPlayerData = `
		{
			userDashStats(where: {id: "${checksumAddress}"}) {
			  id
			  earned
			  spent
			  userName
			  userSocialStat {
				 instagram
				 tiktok
				 twitch
				 twitter
				 youtube
			  }
			}
		 }
		`;

			try {
				const fetchTask = await fetch('https://api.thegraph.com/subgraphs/name/nerveglobal/nerveglobal', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForPlayerData }),
				});

				const data = await fetchTask.json();
				setPlayerData(data.data.userDashStats);
			} catch (error) {
				console.error(error);
			}
		};

		const interval = setInterval(getTask, 1000);

		return () => clearInterval(interval);
	}, [checksumAddress]);

	return (
		<>
			<StyledSection>
				<StyledItemRow>
					<StyledItemRowSocials style={{ fontSize: '16px' }}>
						<a>{playerData[0]?.userName}</a>
						<a>{playerData[0]?.id}</a>
					</StyledItemRowSocials>
					<StyledItemRowIntern>
						{playerData[0]?.userSocialStat?.twitter.includes('twitter') ? (
							<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.twitter}>
								<Twitter style={{ fontSize: '20px', fill: 'rgba(152, 161, 192, 1)' }} />
							</a>
						) : null}
						{playerData[0]?.userSocialStat?.instagram.includes('instagram') ? (
							<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.instagram}>
								<Instagram style={{ fontSize: '20px', fill: 'rgba(152, 161, 192, 1)' }} />
							</a>
						) : null}
						{playerData[0]?.userSocialStat?.tiktok.includes('tiktok') ? (
							<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.tiktok}>
								<TikTok style={{ fontSize: '20px', fill: 'rgba(152, 161, 192, 1)' }} />
							</a>
						) : null}
						{playerData[0]?.userSocialStat?.youtube.includes('youtube') ? (
							<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.youtube}>
								<Youtube style={{ fontSize: '20px', fill: 'rgba(152, 161, 192, 1)' }} />
							</a>
						) : null}
						{playerData[0]?.userSocialStat?.twitch.includes('twitch') ? (
							<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.twitch}>
								<Twitch style={{ fontSize: '20px', fill: 'rgba(152, 161, 192, 1)' }} />
							</a>
						) : null}
					</StyledItemRowIntern>
					{checksumAccount === checksumAddress ? (
						<div>
							<StyledItemRowIntern>
								<RegisterSocial />
							</StyledItemRowIntern>
							<StyledItemRowIntern>
								<RegisterName />
							</StyledItemRowIntern>
						</div>
					) : null}

					{!checksumAccount ? (
						<div>
							<StyledItemRowIntern>
								<Connect />
							</StyledItemRowIntern>
						</div>
					) : checksumAccount !== checksumAddress ? (
						<div>
							<StyledItemRowIntern>
								<CreateTask />
							</StyledItemRowIntern>
						</div>
					) : null}
				</StyledItemRow>
			</StyledSection>
		</>
	);
}
