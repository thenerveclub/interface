import styled from '@emotion/styled';
import { Box, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { CHAINS } from '../../../../utils/chains';

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

const StyledPlayerRow = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	cursor: default;

	// only the first two StyledRow's have margin-bottom
	&:not(:last-child) {
		margin-bottom: 2rem;
	}

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
	}

	// first div in the row takes 50% of the width
	& > div:first-child {
		width: 50%;
	}

	p {
		font-size: 1rem;
		cursor: default;
		text-align: left;
		margin: 0;
		padding: 0;
	}

	//second p in a div have a padding of 0.5rem
	div p:nth-of-type(2) {
		padding: 0.5rem 0 0 0;

		&:hover {
			text-decoration: underline;
		}
	}

	@media (max-width: 960px) {
		p {
			font-size: 0.925rem;
			cursor: default;
		}
	}
`;

const StyledRow = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	cursor: default;

	// only the first two StyledRow's have margin-bottom
	&:not(:last-child) {
		margin-bottom: 2rem;
	}

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
	}

	// first div in the row takes 50% of the width
	& > div:first-child {
		width: 50%;
	}

	p {
		font-size: 1rem;
		cursor: default;
		text-align: left;
		margin: 0;
		padding: 0;
	}

	//second p in a div have a padding of 0.5rem
	div p:nth-of-type(2) {
		padding: 0.5rem 0 0 0;
	}

	@media (max-width: 960px) {
		p {
			font-size: 0.925rem;
			cursor: default;
		}
	}
`;

interface DetailsCardProps {
	dareData: any;
	player: string;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ dareData, player }) => {
	const theme = useTheme();
	const router = useRouter();

	// Redux
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);

	const handleClickUser = (player) => {
		return () => {
			// if (player.endsWith('.eth')){
			router.push(`/player/${player}`);
			// } else router.push(`/${network}/player/${user}`);
		};
	};

	function formatCrypto(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});
	}

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	if (!dareData) return null;

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Details</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledContainer theme={theme}>
				<StyledPlayerRow theme={theme}>
					<div>
						<p>Player</p>
						<p
							style={{ display: 'flex', color: theme.palette.warning.main, cursor: 'pointer', width: 'fit-content' }}
							onClick={handleClickUser(player)}
						>
							{player?.includes('.eth') ? player : `${player?.substring(0, 6)}...${player?.substring(player.length - 4)}`}
						</p>
					</div>

					<div>
						<p>Total Participants</p>
						<p style={{ textDecoration: 'none' }}>{dareData[0]?.task.participants}</p>
					</div>
				</StyledPlayerRow>
				<StyledRow theme={theme}>
					{currencyValue === false ? (
						<>
							<div>
								<p>Entry Amount</p>
								<p>
									{formatCrypto(dareData[0]?.task.entranceAmount)} {CHAINS[dareData[0]?.task.chainId]?.nameToken}
								</p>
							</div>
							<div>
								<p>Total Amount</p>
								<p>
									{formatCrypto(dareData[0]?.task.amount)} {CHAINS[dareData[0]?.task.chainId]?.nameToken}
								</p>
							</div>
						</>
					) : (
						<>
							<div>
								<p>Entry Amount</p>
								<p>${formatNumber(dareData[0]?.task.entranceAmount * currencyPrice[CHAINS[dareData[0]?.task.chainId]?.nameToken?.toLowerCase()])}</p>
							</div>
							<div>
								<p>Total Amount</p>
								<p>${formatNumber(dareData[0]?.task.amount * currencyPrice[CHAINS[dareData[0]?.task.chainId]?.nameToken?.toLowerCase()])}</p>
							</div>
						</>
					)}
				</StyledRow>
				<StyledRow theme={theme}>
					<div>
						<p>Task ID</p>
						<p>{dareData[0]?.task.id}</p>
					</div>
					<div>
						<p>Network</p>
						<p style={{ textTransform: 'capitalize' }}>{CHAINS[dareData[0]?.task.chainId]?.name}</p>
					</div>
				</StyledRow>
			</StyledContainer>
		</TaskCard>
	);
};

export default DetailsCard;
