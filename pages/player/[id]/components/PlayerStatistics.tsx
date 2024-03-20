import styled from '@emotion/styled';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Box, Fade, Grid, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import useRankingEarned from '../../../../hooks/playerData/useRankingEarned';
import useRankingSpent from '../../../../hooks/playerData/useRankingSpent';

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
	playerData: any;
	checksumAddress: string;
}

const PlayerStatistics: React.FC<PlayerStatisticsProps> = ({ playerData, checksumAddress }) => {
	const theme = useTheme();

	// Ranking Data
	const rankingEarned = useRankingEarned(checksumAddress);
	const rankingSpent = useRankingSpent(checksumAddress);

	if (!playerData) return null;

	return (
		<StatisticBox>
			<StyledStatistics theme={theme}>
				<div>
					<p>${playerData?.allChains.earnedInUSD}</p>
				</div>
				<div>
					<p>Earnings</p>
				</div>
			</StyledStatistics>
			<StyledStatistics theme={theme}>
				<div>
					<p>${playerData?.allChains.spentInUSD}</p>
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
