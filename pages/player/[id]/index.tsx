import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
import { Box, Button, Divider, Grid, IconButton, Link, Tab, Tabs, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Connect from '../../../components/modal/Connect';
import BlacklistPlayer from '../../../components/modal/blacklistPlayer';
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

const StyledTab = styled(Tab)`
	color: #fff;
	font-size: 16px;
	text-transform: none;
	min-width: 150px;

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
	margin: 5rem 5rem auto 5rem;
`;

const PlayerBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	text-align: left;
	align-items: center;

	a {
		font-size: 30px;

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}
`;

const AddressBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	text-align: left;
	align-items: center;

	a {
		font-size: 16px;

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}
`;

const SocialBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	align-items: center;

	a {
		font-size: 30px;

		&:not(:last-child) {
			margin-right: 2.5rem;
		}
	}
`;

const StatisticBox = styled(Box)`
	width: 100%;
	margin: 3rem 0 auto 0;
	text-align: center;
`;

const StyledGridFirst = styled(Grid)`
	display: flex;
	flex-direction: row;
	font-size: 16px;
	color: #fff;

	a {
		color: #fff;
		font-size: 16px;
		width: 150px;
	}
`;

const StyledGridSecond = styled(Grid)`
	display: flex;
	flex-direction: row;
	font-size: 16px;
	color: #fff;
	margin-top: 0.25rem;

	a {
		color: rgba(152, 161, 192, 1);
		font-size: 16px;
		width: 150px;
	}
`;

const ActiveBox = styled(Box)`
	margin: 3rem 0 auto 0;
`;

const PanelBox = styled(Box)`
	margin: 2.5rem 0 auto 0;
`;

export default function PlayerPage() {
	const [registerStatus] = CheckNameRegister();
	const account = useSelector((state: { account: string }) => state.account);
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
					<PanelBox>
						<Typography>{children}</Typography>
					</PanelBox>
				)}
			</div>
		);
	}

	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<StyledBox>
			<PlayerBox>
				<a>{playerData[0]?.userName}</a>
				<a>{account ? checksumAccount === checksumAddress ? <RegisterName /> : <BlacklistPlayer /> : null}</a>
			</PlayerBox>

			<AddressBox>
				<a>
					({playerData[0]?.id.substring(0, 6)}...{playerData[0]?.id.substring(playerData[0]?.id.length - 4).toUpperCase()})
				</a>
				<a href={CHAINS[chainId]?.blockExplorerUrls[0] + 'address/' + playerData[0]?.id} target="_blank">
					<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(152, 161, 192, 1)' }} />
				</a>
			</AddressBox>

			<SocialBox>
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
				<a>{checksumAccount === checksumAddress ? <RegisterSocial /> : null}</a>
			</SocialBox>

			<StatisticBox>
				<StyledGridFirst>
					{playerData[0]?.earned ? (
						<a>
							{((playerData[0]?.earned / 1e18) * 1).toFixed(2)} {CHAINS[chainId]?.nameToken}
						</a>
					) : (
						<a>0.00</a>
					)}
					{playerData[0]?.spent ? (
						<a>
							{((playerData[0]?.spent / 1e18) * 1).toFixed(2)} {CHAINS[chainId]?.nameToken}
						</a>
					) : (
						<a>0.00</a>
					)}
					<a>Earned</a>
				</StyledGridFirst>
				<StyledGridSecond>
					<a>Total earned</a>
					<a>Total spent</a>
					<a>Global rank</a>
				</StyledGridSecond>
			</StatisticBox>

			<ActiveBox sx={{ borderBottom: 1, borderColor: 'rgba(41, 50, 73, 1)' }}>
				<Tabs value={value} onChange={handleChange}>
					<StyledTab label="Active Tasks" disableRipple={true} />
					<StyledTab label="Completed Tasks" disableRipple={true} />
				</Tabs>
			</ActiveBox>
			<TabPanel value={value} index={0}>
				{account ? (
					checksumAccount !== checksumAddress ? (
						<div>
							<CreateTask />
						</div>
					) : null
				) : null}
			</TabPanel>
			<TabPanel value={value} index={1}>
				Completed Tasks
			</TabPanel>
		</StyledBox>
	);
}
