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
import PlayerSocials from './components/PlayerSocials';
import PlayerDares from './components/PlayerDares';

const StyledSection = styled(Box)`
	display: flex;
	flex-direction: row;
	width: 100%;
`;

const StyledLeftSectionBox = styled(Box)`
	display: inline-flex;
	flex-direction: column;
	width: 50%;

	@media (max-width: 600px) {
		width: 100%;
	}
`;

const StyledRightSectionBox = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 50%;

	@media (max-width: 600px) {
		display: none;
		visibility: hidden;
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
		color: rgba(128, 128, 138, 1);
		font-size: 14px;
		cursor: default;

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;



export default function PlayerPage() {
	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

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
	const isTwitchLive = useTwitchStatus(twitchChannelName);

	// YouTube Live Status
	// const youTubeLink = playerData[0]?.userSocialStat?.youtube.includes('youtube') ? playerData[0]?.userSocialStat?.youtube : '';
	// const youTubeSplit = youTubeLink?.split('/@');
	// const youTubeChannelName = youTubeSplit[youTubeSplit.length - 1];
	// const youTubeChannelName = 'inscope21';
	// const isYouTubeLive = useYouTubeStatus(youTubeChannelName);

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
			<StyledSection>
				<StyledLeftSectionBox>
					<PlayerBox>
						{playerData[0]?.userName ? <a>{playerData[0]?.userName}</a> : <a>{checksumAddress?.toUpperCase()}</a>}
						<a>{account ? checksumAccount === checksumAddress ? <RegisterName /> : <BlacklistPlayer /> : null}</a>
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
								<ContentCopy style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
							</a>
						</Tooltip>
						<Tooltip title="View On Explorer" placement="bottom" disableInteractive TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
							<a href={CHAINS[chainId]?.blockExplorerUrls[0] + 'address/' + playerData[0]?.id} target="_blank" style={{ cursor: 'pointer' }}>
								<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
							</a>
						</Tooltip>
					</AddressBox>
					<PlayerSocials />
					<PlayerStatistics isNetworkAvailable={isNetworkAvailable} />
				</StyledLeftSectionBox>
				<StyledRightSectionBox>
					<iframe
						src={`https://player.twitch.tv/?channel=${twitchChannelName}&parent=localhost&parent=interface-alpha.vercel.app&autoplay=false`}
						height="250px"
						width="500px"
						frameBorder="0"
						scrolling="no"
						allowFullScreen={true}
						allow="autoplay; fullscreen; picture-in-picture"
						style={{ display: isTwitchLive ? 'block' : 'none', margin: '0 auto' }}
					></iframe>

					{/* <iframe
					width="560"
					height="315"
					src="https://www.youtube-nocookie.com/embed/o605PgKGpzw"
					title="YouTube video player"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				></iframe> */}
				</StyledRightSectionBox>
			</StyledSection>
			<PlayerDares />
		</StyledBox>
	);
}
