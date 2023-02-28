import styled from '@emotion/styled';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { Badge, Box, Button, Grid, Link, Skeleton, Switch, Tab, Tabs, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BlacklistPlayer from '../../../components/modal/blacklistPlayer';
import CreateTask from '../../../components/modal/createTask';
import RegisterName from '../../../components/modal/registerName';
import RegisterSocial from '../../../components/modal/registerSocial';
import usePlayerData from '../../../hooks/usePlayerData';
import usePrice from '../../../hooks/usePrice';
import useTwitchStatus from '../../../hooks/useTwitchStatus';
// import useYouTubeStatus from '../../../hooks/useYouTubeStatus';
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

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

const PlayerBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	text-align: left;
	align-items: center;

	a {
		font-size: 30px;
		cursor: default;

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const AddressBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 25px;
	text-align: left;
	align-items: center;

	a {
		font-size: 16px;
		cursor: default;

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const SocialBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 25px;
	align-items: center;

	a {
		font-size: 30px;

		&:not(:last-child) {
			margin-right: 2.5rem;
		}
	}

	@media (max-width: 600px) {
		display: flex;
		flex-direction: row;
		justify-content: center;

		a {
			font-size: 30px;
			text-align: center;
			width: 100%;

			&:not(:last-child) {
				margin-right: 0rem;
			}
		}
	}
`;

const StyledBadge = styled(Badge)`
	& .MuiBadge-dot {
		background-color: #ff0000;
		animation: blink 3s infinite;

		@keyframes blink {
			0% {
				opacity: 1;
			}
			50% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
	}
`;

const StatisticBox = styled(Box)`
	width: 100%;
	margin: 2rem 0 auto 0;
	text-align: center;
`;

const StyledGridFirst = styled(Grid)`
	display: flex;
	flex-direction: row;
	font-size: 16px;
	color: #fff;

	a {
		display: flex;
		color: #fff;
		font-size: 16px;
		width: 150px;
		cursor: default;
		justify-content: center;
		align-items: center;
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
		cursor: default;
	}
`;

const ActiveBox = styled(Box)`
	margin: 3rem auto 0 auto;
	border-bottom: 1px solid rgba(41, 50, 73, 1);

	@media (max-width: 600px) {
		width: 300px;
		justify-content: center;
		align-items: center;
	}
`;

const StyledTabs = styled(Tabs)`
	@media (max-width: 600px) {
		width: 350px;
		justify-content: center;
		align-items: center;
	}
`;

const PanelBox = styled(Box)`
	margin: 1rem auto 0 auto;
`;

const ActiveFilterBox = styled(Box)`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 40px;
`;

const ActiveTabLeftSection = styled(Box)`
	min-width: 50%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
	background-color: rgba(152, 161, 192, 0.5);
	border-radius: 10px;
`;

const StyledToggleButton = styled(ToggleButton)`
	color: rgba(152, 161, 192, 1);
`;

const ActiveTabRightSection = styled(Box)`
	min-width: 50%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

const ActiveTabSection = styled(Box)`
	display: block;
	margin: 2rem auto 0 auto;
`;

export default function PlayerPage() {
	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// Token Price
	const price = usePrice(chainId);

	// Toogle Button For Token Price
	const [valueUSD, setValueUSD] = useState<boolean>(false);
	const handleToggle = (event, newValueUSD) => {
		setValueUSD(newValueUSD);
	};

	// Checked Name Register
	const [registerStatus] = CheckNameRegister();

	// Address Checksumed And Lowercased
	const checksumAddress = registerStatus?.toLowerCase();
	const checksumAccount = account?.toLowerCase();

	// Player Data
	const playerData = usePlayerData(checksumAddress, chainId);

	// Twitch Live Status
	const twitchLink = playerData[0]?.userSocialStat?.twitch.includes('twitch') ? playerData[0]?.userSocialStat?.twitch : '';
	const twitchSplit = twitchLink?.split('/');
	const twitchChannelName = twitchSplit[twitchSplit.length - 1];
	console.log('TWITCH LIVE ???', twitchChannelName);
	const isTwitchLive = useTwitchStatus(twitchChannelName);
	console.log('TWITCH LIVE ???', isTwitchLive);

	// YouTube Live Status
	// const youTubeLink = playerData[0]?.userSocialStat?.youtube.includes('youtube') ? playerData[0]?.userSocialStat?.youtube : '';
	// const youTubeSplit = youTubeLink?.split('/@');
	// const youTubeChannelName = youTubeSplit[youTubeSplit.length - 1];
	// const isYouTubeLive = useYouTubeStatus(youTubeChannelName);
	// console.log('YT LIVE ???', isYouTubeLive);

	// Tab Panel
	function TabPanel(props: TabPanelProps) {
		const { children, value, index, ...other } = props;

		return (
			<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
				{value === index && <PanelBox>{children}</PanelBox>}
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
				{playerData[0]?.userName ? <a>{playerData[0]?.userName}</a> : <a>{checksumAddress?.toUpperCase()}</a>}
				<a>{account ? checksumAccount === checksumAddress ? <RegisterName /> : <BlacklistPlayer /> : null}</a>
				<iframe
					src="https://player.twitch.tv/?channel=amouranth&parent=localhost&parent=interface-alpha.vercel.app&autoplay=false"
					height="<height>"
					width="<width>"
				></iframe>

				<iframe
					width="560"
					height="315"
					src="https://www.youtube-nocookie.com/embed/o605PgKGpzw"
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				></iframe>
			</PlayerBox>
			<AddressBox>
				{playerData[0]?.id ? (
					<a>
						({playerData[0]?.id.substring(0, 6)}...{playerData[0]?.id.substring(playerData[0]?.id.length - 4).toUpperCase()})
					</a>
				) : (
					<a>
						({checksumAddress?.substring(0, 6)}...{checksumAddress?.substring(checksumAddress?.length - 4).toUpperCase()})
					</a>
				)}
				<a
					onClick={() => navigator.clipboard.writeText(playerData[0]?.id ? playerData[0]?.id.toUpperCase() : checksumAddress.toUpperCase())}
					style={{ cursor: 'pointer' }}
				>
					<ContentCopy style={{ display: 'flex', fontSize: '14px', fill: 'rgba(152, 161, 192, 1)' }} />
				</a>
				<a href={CHAINS[chainId]?.blockExplorerUrls[0] + 'address/' + playerData[0]?.id} target="_blank" style={{ cursor: 'pointer' }}>
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
						{isTwitchLive ? (
							<StyledBadge variant="dot">
								<Twitch style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
							</StyledBadge>
						) : (
							<Twitch style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
						)}
					</a>
				) : null}
				<a>{checksumAccount === checksumAddress ? <RegisterSocial /> : null}</a>
			</SocialBox>
			<StatisticBox>
				<StyledGridFirst>
					{playerData[0]?.earned ? (
						valueUSD === false ? (
							<a>
								{((playerData[0]?.earned / 1e18) * 1).toFixed(2)} {CHAINS[chainId]?.nameToken}
							</a>
						) : (
							<a>{((playerData[0]?.earned / 1e18) * price).toFixed(2)} USD</a>
						)
					) : (
						<a>
							<Skeleton
								sx={{
									backgroundColor: 'rgba(152, 161, 192, 0.4)',
									borderRadius: '10px',
								}}
								variant="text"
								width={75}
								height={30}
							/>
						</a>
					)}
					{playerData[0]?.spent ? (
						valueUSD === false ? (
							<a>
								{((playerData[0]?.spent / 1e18) * 1).toFixed(2)} {CHAINS[chainId]?.nameToken}
							</a>
						) : (
							<a>{((playerData[0]?.spent / 1e18) * price).toFixed(2)} USD</a>
						)
					) : (
						<a>
							<Skeleton
								sx={{
									backgroundColor: 'rgba(152, 161, 192, 0.4)',
									borderRadius: '10px',
								}}
								variant="text"
								width={75}
								height={30}
							/>
						</a>
					)}
					<a>
						<Skeleton
							sx={{
								backgroundColor: 'rgba(152, 161, 192, 0.4)',
								borderRadius: '10px',
							}}
							variant="text"
							width={75}
							height={30}
						/>
					</a>
				</StyledGridFirst>
				<StyledGridSecond>
					<a>Total earned</a>
					<a>Total spent</a>
					<a>Global rank</a>
				</StyledGridSecond>
			</StatisticBox>
			<ActiveBox>
				<StyledTabs value={value} onChange={handleChange}>
					<StyledTab label="Active Tasks" disableRipple={true} />
					<StyledTab label="Completed Tasks" disableRipple={true} />
				</StyledTabs>
			</ActiveBox>
			<TabPanel value={value} index={0}>
				<ActiveFilterBox>
					<ActiveTabLeftSection>
						<StyledToggleButtonGroup value={valueUSD} exclusive onChange={handleToggle}>
							<StyledToggleButton value={false}>
								<a>{CHAINS[chainId]?.nameToken}</a>
							</StyledToggleButton>
							<StyledToggleButton value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
					</ActiveTabLeftSection>
					<ActiveTabRightSection>{account ? checksumAccount !== checksumAddress ? <CreateTask /> : null : null}</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					<a>Active Tasks</a>
				</ActiveTabSection>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ActiveFilterBox>
					<ActiveTabLeftSection>
						<StyledToggleButtonGroup value={valueUSD} exclusive onChange={handleToggle}>
							<StyledToggleButton value={false}>
								<a>{CHAINS[chainId]?.nameToken}</a>
							</StyledToggleButton>
							<StyledToggleButton value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
					</ActiveTabLeftSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					<a>Completed Tasks</a>
				</ActiveTabSection>
			</TabPanel>
		</StyledBox>
	);
}
