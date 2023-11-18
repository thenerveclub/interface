import styled from '@emotion/styled';
import { Box, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	width: 738px;
	max-width: 738px;
	height: 200px;
	max-height: 200px;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	overflow: auto;

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

const StyledContainer = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	cursor: default;

	div:first-of-type {
		margin-bottom: 1rem;
	}
`;

const StyledFirstRow = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	cursor: default;

	div {
		display: flex;
		flex-direction: column;
		justify-content: left;
		align-items: left;
	}
`;

const StyledSecondRow = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	cursor: default;

	div {
		display: flex;
		flex-direction: column;
		justify-content: left;
		align-items: left;
	}
`;

interface DetailsCardProps {
	id: string;
	network: string;
	dareData: any;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ id, network, dareData }) => {
	const theme = useTheme();
	const router = useRouter();

	const handleClickUser = (user) => {
		return () => {
			router.push(`/${network}/player/${user}`);
		};
	};

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Details</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledContainer theme={theme}>
				<StyledFirstRow theme={theme}>
					<div>
						<a>Player</a>
						<a onClick={handleClickUser(dareData?.[0]?.task.recipientName)}>{dareData?.[0]?.task.recipientName}</a>
					</div>
					<div>
						<a>Task ID</a>
						<a>{id}</a>
					</div>
					<div>
						<a>Participants</a>
						<a>{dareData?.[0]?.task.participants}</a>
					</div>
					<div>
						<a>Chain</a>
						<a>{network}</a>
					</div>
				</StyledFirstRow>
				<StyledSecondRow theme={theme}>
					<div>
						<a>Entry Amount</a>
						<a>{formatNumber(dareData?.[0]?.task.entranceAmount)}</a>
					</div>
					<div>
						<a>Total Amount</a>
						<a>{formatNumber(dareData?.[0]?.task.amount)}</a>
					</div>
				</StyledSecondRow>
			</StyledContainer>
		</TaskCard>
	);
};

export default DetailsCard;
