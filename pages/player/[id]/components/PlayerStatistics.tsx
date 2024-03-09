import styled from '@emotion/styled';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Box, Fade, Grid, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import useRankingEarned from '../../../../hooks/useRankingEarned';
import useRankingSpent from '../../../../hooks/useRankingSpent';

const StatisticBox = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: left;
	width: 100%;

	@media (max-width: 750px) {
		width: 80%;
		justify-content: space-between;
		padding: 0.5rem 0 0.5rem 0;
	}
`;

const StyledStatistics = styled(Grid)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	padding: 1rem 1rem 1rem 0;
	margin-right: 5rem;

	div {
		display: flex;
		flex-direction: column;
	}

	p {
		display: flex;
		color: ${({ theme }) => theme.palette.text.primary};
		font-size: 1rem;
		cursor: default;
		margin: 0;
	}

	@media (max-width: 750px) {
		margin-right: 0;
		padding: 0;

		div {
			display: flex;
			flex-direction: column;
		}

		p {
			display: flex;
			color: ${({ theme }) => theme.palette.text.primary};
			font-size: 0.925rem;
			cursor: default;
			width: 100%;
		}
	}
`;

interface PlayerStatisticsProps {
	checksumAddress: string;
	network: any;
	playerData: any;
}

const PlayerStatistics: React.FC<PlayerStatisticsProps> = ({ checksumAddress, network, playerData }) => {
	const theme = useTheme();

	// console.log('PlayerStatists:', checksumAddress, network, playerData);

	// Redux
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);

	// Ranking Data
	const rankingEarned = useRankingEarned(checksumAddress, network);
	const rankingSpent = useRankingSpent(checksumAddress, network);

	return (
		<StatisticBox>
			<StyledStatistics theme={theme}>
				<div>
					{currencyValue === false ? (
						<p>
							{((playerData?.[0]?.earned / 1e18) * 1).toFixed(2)} {'MATIC'}
						</p>
					) : (
						<p>${((playerData?.[0]?.earned / 1e18) * currencyPrice['polygon']?.usd).toFixed(2)}</p>
					)}
				</div>
				<div>
					<p>Earnings</p>
				</div>
			</StyledStatistics>
			<StyledStatistics theme={theme}>
				<div>
					{currencyValue === false ? (
						<p>
							{((playerData?.[0]?.spent / 1e18) * 1).toFixed(2)} {'MATIC'}
						</p>
					) : (
						<p>${((playerData?.[0]?.spent / 1e18) * currencyPrice['polygon']?.usd).toFixed(2)}</p>
					)}
				</div>
				<div>
					<p>Contributions</p>
				</div>
			</StyledStatistics>
			<StyledStatistics theme={theme}>
				<div>
					<p>
						{rankingEarned} | {rankingSpent}
						<Tooltip
							title="Player Ranking: Most Earned | Most Spent"
							placement="top"
							disableInteractive
							TransitionComponent={Fade}
							TransitionProps={{ timeout: 600 }}
						>
							<InfoOutlined
								style={{
									display: 'flex',
									marginLeft: '0.5rem',
									fontSize: '1rem',
									color: theme.palette.secondary.main,
									cursor: 'help',
								}}
							/>
						</Tooltip>
					</p>
				</div>
				<div>
					<p>Rank</p>
				</div>
			</StyledStatistics>
		</StatisticBox>
	);
};

export default PlayerStatistics;
