import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Telegram from '/public/svg/socials/telegram.svg';
import WhatsApp from '/public/svg/socials/whatsapp.svg';
import XSVG from '/public/svg/socials/x.svg';

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	width: 100%;
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
	justify-content: center;
	padding: 1rem;
	font-size: 1rem;
	cursor: default;
	height: 250px;

	div {
		display: flex;
		justify-content: center;
		align-items: right;
		margin: 0.5rem 0 0.5rem 0;
	}

	p {
		color: white;
		font-size: 0.925rem;
		cursor: default;
		padding: 0;
		margin: 0 0.5rem 0 0;
	}

	a {
		color: ${({ theme }) => theme.palette.secondary.main};
		font-size: 0.925rem;
		cursor: default;
		padding: 0;
		margin: 0;
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}
	}

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}

	@media (max-width: 600px) {
		font-size: 14px;
	}
`;

const DescriptionSection = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	height: 100%;
	flex-grow: 1;

	p {
		font-size: 1rem;
		text-align: center;
	}

	@media (max-width: 750px) {
	}
`;

interface DescriptionCardProps {
	dareData: any;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ dareData }) => {
	const theme = useTheme();
	const router = useRouter();

	if (!dareData) return null;

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<div>
					<p>Description</p>
				</div>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledTableContainer theme={theme}>
				<DescriptionSection>{dareData[0]?.task.description}</DescriptionSection>
				<div>
					<p>By</p>
					<a onClick={() => router.push(`/player/${dareData[0]?.task.initiatorAddress}`)}>
						({dareData[0]?.task.initiatorAddress?.substring(0, 6)}...
						{dareData[0]?.task.initiatorAddress?.substring(dareData[0]?.task.initiatorAddress?.length - 4).toLowerCase()})
					</a>
				</div>
			</StyledTableContainer>
		</TaskCard>
	);
};

export default DescriptionCard;
