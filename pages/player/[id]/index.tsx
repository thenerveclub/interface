import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import BlacklistPlayer from '../../../components/modal/blacklistPlayer';
import CreateTask from '../../../components/modal/createTask';
import RegisterName from '../../../components/modal/registerName';
import usePlayerData from '../../../hooks/usePlayerData';
import useTwitchStatus from '../../../hooks/useTwitchStatus';
// import useYouTubeStatus from '../../../hooks/useYouTubeStatus';
import styled from '@emotion/styled';
import { Box, Button, Fade, Grid, Link, Skeleton, Tab, Tabs, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import useActivePlayerTasks from '../../../hooks/useActivePlayerTasks';
import useCompletedPlayerTasks from '../../../hooks/useCompletedPlayerTasks';
import usePrice from '../../../hooks/usePrice';
import { CHAINS } from '../../../utils/chains';
import { CheckNameRegister } from '../../../utils/validation/checkNameRegister';
import PlayerStatistics from './components/PlayerStatistics';
import SocialBox from './components/SocialBox';

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
	margin: 7.5rem 5rem auto 5rem;

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
	display: grid;
	align-items: center;
	margin: 2rem auto 0 auto;
	grid-template-columns: repeat(6, 1fr);
	grid-gap: 1rem;

	li {
		grid-column: span 2;
	}

	li:last-child:nth-of-type(3n - 1) {
		grid-column-end: -2;
	}

	li:nth-last-of-type(2):nth-of-type(3n + 1) {
		grid-column-end: 4;
	}

	/* Dealing with single orphan */
	li:last-child:nth-of-type(3n - 2) {
		grid-column-end: 5;
	}

	@media (max-width: 960px) {
		display: grid;
		align-items: center;
		margin: 0 auto 0 auto;
		grid-template-columns: 1fr;
		grid-gap: 2em;
	}
`;

const TaskCard = styled(Box)`
	width: 350px;
	max-width: 350px;
	height: 300px;
	max-height: 300px;
	margin: 0 auto 0 auto;
	background-color: rgba(0, 0, 20, 0.25);
	backdrop-filter: blur(15px) brightness(70%);
	border: 1px solid;
	border-color: rgba(41, 50, 73, 1);
	border-radius: 24px;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 90%;

	a {
		display: flex;
		margin: 0 auto 0 auto;
		font-size: 16px;
		cursor: default;
		justify-content: center;
		align-items: center;
	}

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const TaskBoxSection = styled(Box)`
	display: flex;
	flex-direction: row;
	height: 25px;
	width: 100%;
	flex: 1;
	margin: 0 auto 0 auto;
	position: absolute;
	top: 10px;

	a {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 175px;
		width: 90%;
		overflow: auto;
		font-size: 16px;
		cursor: default;
		text-align: center;
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskBoxSectionOne = styled(Box)`
	display: flex;
	flex-direction: row;
	height: 25px;
	width: 100%;
	flex: 1;
	margin: 0 auto 0 auto;
	position: absolute;
	bottom: 85px;

	a {
		display: flex;
		flex: 1;
		height: 25px;
		font-size: 16px;
		cursor: default;
		align-items: center;
		justify-content: center;

		&:first-of-type {
			justify-content: flex-start;
			margin-left: 1.5rem;
		}

		&:last-child {
			justify-content: flex-end;
			margin-right: 1.5rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskBoxSectionTwo = styled(Box)`
	display: flex;
	flex-direction: row;
	height: 25px;
	width: 100%;
	flex: 1;
	margin: 0 auto 0 auto;
	position: absolute;
	bottom: 60px;

	a {
		display: flex;
		flex: 1;
		height: 25px;
		font-size: 16px;
		cursor: default;
		align-items: center;
		justify-content: center;

		&:first-of-type {
			justify-content: flex-start;
			margin-left: 1.5rem;
		}

		&:last-child {
			justify-content: flex-end;
			margin-right: 1.5rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskBoxButton = styled(Box)`
	display: flex;
	width: 90%;
	margin: 0 auto 0 auto;
	height: 40px;

	a {
		cursor: pointer;
		height: 40px;
		text-decoration: none;
		color: #fff;
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskButton = styled(Button)`
	color: #fff;
	height: 40px;
	width: 90%;
	border: none;
	background-color: rgba(255, 127.5, 0, 1);
	border-radius: 10px;
	position: absolute;
	bottom: 10px;
	text-transform: none;
	font-size: 16px;

	&:hover {
		background-color: rgba(255, 127.5, 0, 1);
	}
`;

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export default function PlayerPage() {
	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

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

	// Active Player Tasks
	const activePlayerTasks = useActivePlayerTasks(checksumAddress, chainId);
	const completedPlayerTasks = useCompletedPlayerTasks(checksumAddress, chainId);

	// Twitch Live Status
	const twitchLink = playerData[0]?.userSocialStat?.twitch.includes('twitch') ? playerData[0]?.userSocialStat?.twitch : '';
	const twitchSplit = twitchLink?.split('/');
	const twitchChannelName = twitchSplit[twitchSplit.length - 1];
	const isTwitchLive = useTwitchStatus(twitchChannelName);

	// YouTube Live Status
	// const youTubeLink = playerData[0]?.userSocialStat?.youtube.includes('youtube') ? playerData[0]?.userSocialStat?.youtube : '';
	// const youTubeSplit = youTubeLink?.split('/@');
	// const youTubeChannelName = youTubeSplit[youTubeSplit.length - 1];
	// const youTubeChannelName = 'inscope21';
	// const isYouTubeLive = useYouTubeStatus(youTubeChannelName);

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

	// Copy Address To Clipboard && Tooltip
	const [copied, setCopied] = useState(false);
	function handleCopyAddress() {
		navigator.clipboard.writeText(playerData[0]?.id ? playerData[0]?.id.toUpperCase() : checksumAddress.toUpperCase());
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000); // Reset to "Copy Address" after 2 seconds
	}

	return (
		<StyledBox>
			<PlayerBox>
				{playerData[0]?.userName ? <a>{playerData[0]?.userName}</a> : <a>{checksumAddress?.toUpperCase()}</a>}
				<a>{account ? checksumAccount === checksumAddress ? <RegisterName /> : <BlacklistPlayer /> : null}</a>
				{/* <iframe
					src="https://player.twitch.tv/?channel=amouranth&parent=localhost&parent=interface-alpha.vercel.app&autoplay=false"
					height="<height>"
					width="<width>"
				></iframe> */}

				{/* <iframe
					width="560"
					height="315"
					src="https://www.youtube-nocookie.com/embed/o605PgKGpzw"
					title="YouTube video player"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				></iframe> */}
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
				<Tooltip
					title={copied ? 'Copied!' : 'Copy Address'}
					placement="bottom"
					disableInteractive
					TransitionComponent={Fade}
					TransitionProps={{ timeout: 600 }}
				>
					<a onClick={handleCopyAddress} style={{ cursor: 'pointer' }}>
						<ContentCopy style={{ display: 'flex', fontSize: '14px', fill: 'rgba(152, 161, 192, 1)' }} />
					</a>
				</Tooltip>
				<a href={CHAINS[chainId]?.blockExplorerUrls[0] + 'address/' + playerData[0]?.id} target="_blank" style={{ cursor: 'pointer' }}>
					<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(152, 161, 192, 1)' }} />
				</a>
			</AddressBox>
			<SocialBox />
			<PlayerStatistics valueUSD={valueUSD} isNetworkAvailable={isNetworkAvailable} />
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
							<StyledToggleButton value={false}>{isNetworkAvailable ? <a>{CHAINS[chainId]?.nameToken}</a> : <a>MATIC</a>}</StyledToggleButton>
							<StyledToggleButton value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
					</ActiveTabLeftSection>
					<ActiveTabRightSection>{account ? checksumAccount !== checksumAddress ? <CreateTask /> : null : null}</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{activePlayerTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad}>
							<TaskCard>
								<TaskBoxSection>
									<a>{tad.description}</a>
								</TaskBoxSection>
								<TaskBoxSectionOne>
									<a>#{tad.id}</a>
									{tad?.participants && tad?.participants <= 0 ? <a>{tad.participants} Participants</a> : <a>{tad.participants} Participant</a>}
								</TaskBoxSectionOne>
								<TaskBoxSectionTwo>
									{tad?.amount ? (
										valueUSD === false ? (
											<a>
												{((tad?.amount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.amount / 1e18) * price).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
									{tad?.entranceAmount ? (
										valueUSD === false ? (
											<a>
												{((tad?.entranceAmount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.entranceAmount / 1e18) * price).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
								</TaskBoxSectionTwo>
								<TaskBoxButton>
									<a target="_blank" rel="noreferrer" href={'https://app.nerveglobal.com/task/' + tad.id}>
										<TaskButton>View Task</TaskButton>
									</a>
								</TaskBoxButton>
							</TaskCard>
						</li>
					))}
				</ActiveTabSection>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ActiveFilterBox>
					<ActiveTabLeftSection>
						<StyledToggleButtonGroup value={valueUSD} exclusive onChange={handleToggle}>
							<StyledToggleButton value={false}>{isNetworkAvailable ? <a>{CHAINS[chainId]?.nameToken}</a> : <a>MATIC</a>}</StyledToggleButton>
							<StyledToggleButton value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
					</ActiveTabLeftSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{completedPlayerTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad.id}>
							<TaskCard>
								<TaskBoxSection>
									<a>{tad.description}</a>
								</TaskBoxSection>
								<TaskBoxSectionOne>
									<a>#{tad.id}</a>
									{tad?.participants && tad?.participants <= 0 ? <a>{tad.participants} Participants</a> : <a>{tad.participants} Participant</a>}
								</TaskBoxSectionOne>
								<TaskBoxSectionTwo>
									{tad?.amount ? (
										valueUSD === false ? (
											<a>
												{((tad?.amount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.amount / 1e18) * price).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
									{tad?.entranceAmount ? (
										valueUSD === false ? (
											<a>
												{((tad?.entranceAmount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.entranceAmount / 1e18) * price).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
								</TaskBoxSectionTwo>
								<TaskBoxButton>
									<a target="_blank" rel="noreferrer" href={'https://app.nerveglobal.com/task/' + tad.id}>
										<TaskButton>View Task</TaskButton>
									</a>
								</TaskBoxButton>
							</TaskCard>
						</li>
					))}
				</ActiveTabSection>
			</TabPanel>
		</StyledBox>
	);
}
