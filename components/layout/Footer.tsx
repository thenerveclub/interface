import styled from '@emotion/styled';
import Discord from '/public/svg/socials/discord.svg';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitter from '/public/svg/socials/twitter.svg';

const StyledFooter = styled.footer`
	width: auto;
	height: 40px;
	display: flex;
	flex: 1;
	margin: 5rem auto 0.5rem auto;
	justify-content: space-between;
	padding: 0 50px 0 50px;

	@media (max-width: 1155px) {
		display: block;
	}

	@media (max-width: 960px) {
		padding: 1rem;
	}
`;

const LeftItem = styled.div`
	flex: 1;
	text-align: left;
`;

const CenterItem = styled.div`
	flex: 1;
	text-align: center;

	// Gap between social icons
	& > *:not(:last-child) {
		margin-right: 1rem;
	}
`;

const RightItem = styled.div`
	flex: 1;
	text-align: right;
`;

const StyledTwitter = styled(Twitter)`
	path {
		fill: rgba(128, 128, 138, 1);
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: #fff;
		}
	}
`;

const StyledInstagram = styled(Instagram)`
	path {
		fill: rgba(128, 128, 138, 1);
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: #fff;
		}
	}
`;

const StyledTikTok = styled(TikTok)`
	path {
		fill: rgba(128, 128, 138, 1);
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: #fff;
		}
	}
`;

const StyledDiscord = styled(Discord)`
	path {
		fill: rgba(128, 128, 138, 1);
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: #fff;
		}
	}
`;

export default function BlockNumber() {
	return (
		<StyledFooter>
			<LeftItem></LeftItem>
			<CenterItem>
				<a target="_blank" rel="noreferrer" href="https://twitter.com/nerveglobal_">
					<StyledTwitter />
				</a>
				<a target="_blank" rel="noreferrer" href="https://www.instagram.com/nerveglobal">
					<StyledInstagram />
				</a>
				<a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@nerveglobal">
					<StyledTikTok />
				</a>
				<a target="_blank" rel="noreferrer" href="https://discord.gg/Xuh5enTNB6">
					<StyledDiscord />
				</a>
			</CenterItem>
			<RightItem></RightItem>
		</StyledFooter>
	);
}
