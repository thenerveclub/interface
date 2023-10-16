import styled from '@emotion/styled';
import { Badge, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import RegisterSocial from '../../../../components/modal/registerSocial';
import usePlayerData from '../../../../hooks/usePlayerData';
import useTwitchStatus from '../../../../hooks/useTwitchStatus';
import { CheckNameRegister } from '../../../../utils/validation/checkNameRegister';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitch from '/public/svg/socials/twitch.svg';
import Twitter from '/public/svg/socials/twitter.svg';
import Youtube from '/public/svg/socials/youtube.svg';

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

export default function SocialBoxComponent() {
	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

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

	console.log(twitchChannelName);

	const isTwitchLive = useTwitchStatus(twitchChannelName);

	console.log(isTwitchLive);

	return (
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
				<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.tiktok}>
					<TikTok style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
				</a>
			) : null}
			{playerData[0]?.userSocialStat?.youtube.includes('youtube') ? (
				<a target="_blank" rel="noreferrer" href={playerData[0]?.userSocialStat?.youtube}>
					{/* {isYouTubeLive ? (
							<StyledBadge variant="dot">
								<Youtube style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
							</StyledBadge>
						) : ( */}
					<Youtube style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 1)' }} />
					{/* )} */}
				</a>
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
	);
}
