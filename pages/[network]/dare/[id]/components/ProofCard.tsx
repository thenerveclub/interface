import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TaskCard = styled(Box)<{ theme: any }>`
	width: 90%;
	max-width: 350px;
	height: auto;
	// max-height: 300px;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius} ${({ theme }) => theme.customShape.borderRadius} 0 0;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 90%;

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const StyledCardHeader = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: left;

	a {
		font-size: 16px;
		cursor: default;
		padding: 1rem;
	}
`;

const StyledDivider = styled(Divider)<{ theme: any }>`
	border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
`;

const StyledTableContainer = styled(Box)<{ theme: any }>`
	display: flex;
	width: 100%;
	max-width: 350px;
	height: 100%;
	// max-height: 250px;
	overflow: auto;
`;

interface ProofCardProps {
	dareData: any;
}

const ProofCard: React.FC<ProofCardProps> = ({ dareData }) => {
	const theme = useTheme();

	// Extract clip ID from the URL
	const clipId = dareData?.[0]?.task.proofLink.split('/').pop();

	// Construct the embed URL with parent domains
	const embedUrl = `https://clips.twitch.tv/embed?clip=${clipId}&parent=app.nerveglobal.com&parent=localhost`;

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Proof</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledTableContainer theme={theme}>
				<iframe src={embedUrl} height="480" width="100%" allowFullScreen={true} frameBorder="0" scrolling="no" title="Twitch Clip"></iframe>
			</StyledTableContainer>
		</TaskCard>
	);
};

export default ProofCard;
