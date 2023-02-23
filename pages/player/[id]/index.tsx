import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
import { Box, Divider, Link, Tab, Tabs, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Connect from '../../../components/modal/Connect';
import CreateTask from '../../../components/modal/createTask';
import RegisterName from '../../../components/modal/registerName';
import RegisterSocial from '../../../components/modal/registerSocial';
import { CHAINS } from '../../../utils/chains';
import { CheckNameRegister } from '../../../utils/validation/checkNameRegister';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitch from '/public/svg/socials/twitch.svg';
import Twitter from '/public/svg/socials/twitter.svg';
import Youtube from '/public/svg/socials/youtube.svg';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const StyledItemRowSocials = styled.nav`
	display: flex;
	flex: 1;
	width: 100%;
	margin: 0 auto 0 auto;
	height: 100%;

	p {
		font-size: 16px;

		&:first-child {
			margin-right: 2.5rem;
		}

		&:last-child {
			vertical-align: middle;
		}
	}

	a {
		font-size: 30px;

		&:not(:last-child) {
			margin-right: 2.5rem;
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
	align-items: left;
	margin: 5rem 5rem 0 5rem;

	@media (max-width: 960px) {
		display: grid;
		align-items: center;
		margin: 0 auto 0 auto;
		grid-template-columns: 1fr;
		grid-gap: 2em;
	}
`;

const StyledTab = styled(Tab)`
	color: #fff;
	font-size: 16px;
	text-transform: none;

	&.Mui-selected {
		border-bottom: 1px solid #fff;
		z-index: 1;
	}

	&.MuiTab-root {
		color: rgba(152, 161, 192, 1);

		&.Mui-selected {
			color: #fff;
		}
	}
`;

const StyledBox = styled(Box)`
	margin: 2.5rem 5rem 0 5rem;
`;

export default function PlayerPage() {
	const { account } = useWeb3React();
	const [registerStatus] = CheckNameRegister();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

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
				const response = await fetch(CHAINS[chainId]?.graphApi, {
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
		const interval = setInterval(getTAD, 60000);

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
				const fetchTask = await fetch(CHAINS[chainId]?.graphApi, {
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

		const interval = setInterval(getTask, 60000);

		// Call the function on first page load
		getTask();

		// Clear the interval on unmount
		return () => clearInterval(interval);
	}, [chainId, checksumAddress]);

	function TabPanel(props: TabPanelProps) {
		const { children, value, index, ...other } = props;

		return (
			<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
				{value === index && (
					<StyledBox>
						<Typography>{children}</Typography>
					</StyledBox>
				)}
			</div>
		);
	}

	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<StyledSection>
				<StyledItemRow>
					<StyledItemRowSocials>
						<a>{playerData[0]?.userName}</a>
						<StyledItemRowIntern>
							{playerData[0]?.userSocialStat?.twitter.includes('twitter') ? (
								<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.twitter}>
									<Twitter style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
								</a>
							) : null}
							{playerData[0]?.userSocialStat?.instagram.includes('instagram') ? (
								<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.instagram}>
									<Instagram style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
								</a>
							) : null}
							{playerData[0]?.userSocialStat?.tiktok.includes('tiktok') ? (
								<Link target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.tiktok}>
									<TikTok style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
								</Link>
							) : null}
							{playerData[0]?.userSocialStat?.youtube.includes('youtube') ? (
								<Link target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.youtube}>
									<Youtube style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
								</Link>
							) : null}
							{playerData[0]?.userSocialStat?.twitch.includes('twitch') ? (
								<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.twitch}>
									<Twitch style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
								</a>
							) : null}
						</StyledItemRowIntern>
					</StyledItemRowSocials>
					<StyledItemRowSocials>
						<p>{playerData[0]?.id}</p>
						<Link href={CHAINS[chainId]?.blockExplorerUrls[0] + 'address/' + playerData[0]?.id} target="_blank">
							<OpenInNew style={{ fontSize: '16px', fill: 'rgba(152, 161, 192, 1)' }} />
						</Link>
					</StyledItemRowSocials>

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
			<Box sx={{ width: '100%', margin: '2.5rem 5rem 2.5rem 5rem' }}>
				<Tabs>
					<StyledTab label="Earned" disableRipple={true} />
					<StyledTab label="Spent" disableRipple={true} />
					<StyledTab label="Rank" disableRipple={true} />
				</Tabs>
			</Box>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'rgba(41, 50, 73, 1)', margin: '0 5rem 0 5rem' }}>
					<Tabs value={value} onChange={handleChange}>
						<StyledTab label="Active Tasks" disableRipple={true} />
						<StyledTab label="Completed Tasks" disableRipple={true} />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					Active Tasks
				</TabPanel>
				<TabPanel value={value} index={1}>
					Completed Tasks
				</TabPanel>
			</Box>
		</>
	);
}
