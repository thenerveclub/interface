import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ dareData }) => {
	const theme = useTheme();

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Description</a>
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
