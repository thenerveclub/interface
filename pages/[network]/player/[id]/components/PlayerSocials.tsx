import styled from '@emotion/styled';
import { Badge, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RegisterSocials from '../../../../../components/modal/registerSocials';
import useTwitchStatus from '../../../../../hooks/useTwitchStatus';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitch from '/public/svg/socials/twitch.svg';
import Twitter from '/public/svg/socials/twitter.svg';
import Youtube from '/public/svg/socials/youtube.svg';

const SocialBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 25px;
	justify-content: left;
	margin: 1rem auto 0 auto;
	width: 100%;
	gap: 2.5rem;

	a {
		font-size: 30px;
		width: fit-content;
	}

	@media (max-width: 1024px) {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin: 1rem auto 0 auto;
		gap: 2.5rem;

		a {
			font-size: 30px;
			text-align: center;
			width: fit-content;
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

const StyledTwitter = styled(Twitter)<{ theme: any }>`
	display: flex;
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 1.25rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledInstagram = styled(Instagram)<{ theme: any }>`
	display: flex;
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 1.25rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledTikTok = styled(TikTok)<{ theme: any }>`
	display: flex;
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 1.25rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledTwitch = styled(Twitch)<{ theme: any }>`
	display: flex;
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 1.25rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledYouTube = styled(Youtube)<{ theme: any }>`
	display: flex;
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 1.25rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

interface PlayerSocialsProps {
	checksumAddress: string;
	checksumAccount: string;
	playerData: any;
	chainId: number;
	chainIdUrl: number;
}

const PlayerSocials: React.FC<PlayerSocialsProps> = ({ checksumAddress, checksumAccount, playerData, chainId, chainIdUrl }) => {
	const theme = useTheme();

	// Twitch Live Status
	const twitchLink = playerData?.[0]?.userSocialStat?.twitch.includes('twitch') ? playerData?.[0]?.userSocialStat?.twitch : '';
	const twitchSplit = twitchLink?.split('/');
	const twitchChannelName = twitchSplit[twitchSplit.length - 1];
	const isTwitchLive = useTwitchStatus(twitchChannelName);

	return (
		<SocialBox>
			{playerData?.[0]?.userSocialStat?.twitter.includes('twitter') && (
				<a target="_blank" rel="noreferrer" href={playerData?.[0]?.userSocialStat?.twitter}>
					<StyledTwitter />
				</a>
			)}
			{playerData?.[0]?.userSocialStat?.instagram.includes('instagram') && (
				<a target="_blank" rel="noreferrer" href={playerData?.[0]?.userSocialStat?.instagram}>
					<StyledInstagram />
				</a>
			)}
			{playerData?.[0]?.userSocialStat?.tiktok.includes('tiktok') && (
				<a target="_blank" rel="noreferrer" href={playerData?.[0]?.userSocialStat?.tiktok}>
					<StyledTikTok />
				</a>
			)}
			{playerData?.[0]?.userSocialStat?.youtube.includes('youtube') && (
				<a target="_blank" rel="noreferrer" href={playerData?.[0]?.userSocialStat?.youtube}>
					{/* {isYouTubeLive ? (
							<StyledBadge variant="dot">
								<StyledYouTube />
							</StyledBadge>
						) : ( */}
					<StyledYouTube />
					{/* )} */}
				</a>
			)}
			{playerData?.[0]?.userSocialStat?.twitch.includes('twitch') && (
				<a target="_blank" rel="noreferrer" href={playerData?.[0]?.userSocialStat?.twitch}>
					{isTwitchLive ? (
						<StyledBadge variant="dot">
							<StyledTwitch />
						</StyledBadge>
					) : (
						<StyledTwitch />
					)}
				</a>
			)}
			{checksumAccount === checksumAddress && <RegisterSocials playerData={playerData} chainId={chainId} chainIdUrl={chainIdUrl} />}
		</SocialBox>
	);
};

export default PlayerSocials;
