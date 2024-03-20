import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	width: 70%;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius} ${({ theme }) => theme.customShape.borderRadius} 0 0;

	@media (max-width: 960px) {
		width: 95%;
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
	max-width: 100%;
	height: auto;
	min-height: 500px;
	max-height: 500px;
	overflow: auto;

	@media (max-width: 960px) {
		min-height: auto;
		max-height: 300px;
	}
`;

interface ProofCardProps {
	dareData: any;
}

const ProofCard: React.FC<ProofCardProps> = ({ dareData }) => {
	const theme = useTheme();

	function getEmbedContent(url) {
		if (!url) return null;

		if (url.includes('twitch')) {
			const clipId = url.split('/').pop();
			const embedUrl = `https://clips.twitch.tv/embed?clip=${clipId}&parent=app.nerveglobal.com&parent=localhost`;
			return <iframe src={embedUrl} height="100%" width="100%" allowFullScreen={true} frameBorder="0" scrolling="no" title="Twitch Clip"></iframe>;
		} else if (url.includes('youtube')) {
			const videoId = url.split('v=')[1].split('&')[0];
			const embedUrl = `https://www.youtube.com/embed/${videoId}`;
			return <iframe src={embedUrl} height="100%" width="100%" allowFullScreen={true} frameBorder="0" title="YouTube Video"></iframe>;
		} else if (url.includes('instagram')) {
			// Instagram embedding is more complex; showing a simple link for now
			return (
				<a href={url} target="_blank" rel="noopener noreferrer">
					View on Instagram
				</a>
			);
		} else if (url.includes('tiktok')) {
			// TikTok embedding is more complex; showing a simple link for now
			return (
				<a href={url} target="_blank" rel="noopener noreferrer">
					View on TikTok
				</a>
			);
		} else {
			return (
				<a href={url} target="_blank" rel="noopener noreferrer">
					{url}
				</a>
			);
		}
	}

	const embedContent = getEmbedContent(dareData?.[0]?.task.proofLink);

	if (!dareData) return null;
	
	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Proof</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledTableContainer theme={theme}>{embedContent}</StyledTableContainer>
		</TaskCard>
	);
};

export default ProofCard;
