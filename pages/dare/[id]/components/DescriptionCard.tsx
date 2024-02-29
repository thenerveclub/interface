import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Telegram from 'public/svg/socials/telegram.svg';
import WhatsApp from 'public/svg/socials/whatsapp.svg';
import XSVG from 'public/svg/socials/x.svg';

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	width: 90%;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	@media (max-width: 960px) {
		width: 95%;
	}
`;

const StyledCardHeader = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	div {
		display: flex;
		flex-direction: row; /* Aligns children in a row */
		justify-content: flex-end; /* Aligns children to the right */
		align-items: center; /* Centers children vertically */
		gap: 1rem; /* Ensures there is a 1rem gap between each child */
		width: 100%;
		height: 3rem;
		padding-right: 1rem; /* Ensures content is 1rem from the right end */
	}

	a {
		font-size: 16px;
		cursor: pointer;
		fill: ${({ theme }) => theme.palette.secondary.main};
		text-decoration: none;
		height: auto;
		&:hover {
			text-decoration: underline;
			fill: ${({ theme }) => theme.palette.warning.main};
		}
	}

	p {
		font-size: 1rem;
		padding: 1rem;
		margin-right: auto; /* Pushes everything else to the right */
	}
`;

const StyledDivider = styled(Divider)<{ theme: any }>`
	border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
`;

const StyledTableContainer = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: left;
	align-items: left;
	padding: 1rem;
	font-size: 1rem;
	cursor: default;

	a {
		color: ${({ theme }) => theme.palette.secondary.main};
		font-size: 0.925rem;
		cursor: default;
		padding: 1rem;
	}

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}

	@media (max-width: 600px) {
		font-size: 14px;
	}
`;

interface DescriptionCardProps {
	dareData: any;
	player: string;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ dareData, player }) => {
	const theme = useTheme();
	const router = useRouter();
	const path = `https://nerveglobal.com${router.asPath}`;

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<div>
					<p>Description</p>
					<a
						href={`https://twitter.com/intent/tweet?text=The stakes have never been higher! 💰 Dive into the excitement on %23Nerve 🚀 Whether you're playing, watching, or betting, be part of the thrill. How much is at stake for ${player}? Check it out and spread the word! ➡️ %20${path}%20%23DoYouDare`}
						target="_blank"
					>
						<XSVG />
					</a>
					<a
						href={`https://telegram.me/share/url?url=${path}&text=The stakes have never been higher! 💰 Dive into the excitement on %23Nerve 🚀 Whether you're playing, watching, or betting, be part of the thrill. How much is at stake for 0xd0ba...fe46? Check it out and spread the word! ➡️%20${player}?%20Check%20it%20out%20and%20spread%20the%20word!%20%23DoYouDare`}
						target="_blank"
					>
						<Telegram />
					</a>
					<a
						href={`https://api.whatsapp.com/send?text=The stakes have never been higher! 💰 Dive into the excitement on %23Nerve 🚀 Whether you're playing, watching, or betting, be part of the thrill. How much is at stake for 0xd0ba...fe46? Check it out and spread the word! ➡️%20${path}%20%23DoYouDare`}
						target="_blank"
					>
						<WhatsApp />
					</a>
				</div>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledTableContainer theme={theme}>
				{dareData?.[0]?.task.description}
				<a>
					By ({dareData?.[0]?.task.initiatorAddress.substring(0, 6)}...
					{dareData?.[0]?.task.initiatorAddress.substring(dareData?.[0]?.task.initiatorAddress.length - 4).toUpperCase()})
					{dareData?.[0]?.task.initiatorName}
				</a>
			</StyledTableContainer>
		</TaskCard>
	);
};

export default DescriptionCard;
