import styled from '@emotion/styled';
import { Box, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

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

const StyledContainer = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1rem;
	cursor: default;
`;

const StyledFirstRow = styled(Box)<{ theme: any }>`
	display: grid;
	grid-template-rows: 1fr;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	cursor: default;
	margin-bottom: 1rem;

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
	}

	a {
		font-size: 1rem;
		cursor: default;
	}

	@media (max-width: 960px) {
		a {
			font-size: 0.925rem;
			cursor: default;
		}
	}
`;

const StyledSecondRow = styled(Box)<{ theme: any }>`
	display: grid;
	grid-template-rows: 1fr;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-gap: 0;
	cursor: default;

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
	}

	a {
		font-size: 1rem;
		cursor: default;
	}

	@media (max-width: 960px) {
		grid-template-columns: 1fr 1fr;

		a {
			font-size: 0.925rem;
			cursor: default;
		}
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

	const handleClickUser = (user, address) => {
		return () => {
			if (user === '') {
				router.push(`/${network}/player/${address}`);
			} else router.push(`/${network}/player/${user}`);
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
						<a
							style={{ display: 'flex', color: theme.palette.warning.main }}
							onClick={handleClickUser(dareData?.[0]?.task.recipientName, dareData?.[0]?.task.recipientAddress)}
						>
							<span style={{ cursor: 'pointer' }}>
								{dareData?.[0]?.task.recipientName === ''
									? `${dareData?.[0]?.task.recipientAddress.substring(0, 6)}...${dareData?.[0]?.task.recipientAddress.substring(
											dareData?.[0]?.task.recipientAddress.length - 4
									  )}`
									: dareData?.[0]?.task.recipientName}
							</span>
						</a>
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
						<a style={{ textTransform: 'capitalize' }}>{network}</a>
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
