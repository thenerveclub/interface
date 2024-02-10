import styled from '@emotion/styled';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Box, Fade, Grid, Skeleton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import useRankingEarned from '../../../../../hooks/useRankingEarned';
import useRankingSpent from '../../../../../hooks/useRankingSpent';
import { CHAINS } from '../../../../../utils/chains';

const StatisticBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	margin: 2rem auto 0 auto;
	text-align: center;

	@media (max-width: 1024px) {
		width: 95%;
	}
`;

const StyledGridFirst = styled(Grid)<{ theme: any }>`
	display: flex;
	justify-content: center;
	// gap: 1rem;
	font-size: 16px;

	a {
		display: flex;
		color: ${({ theme }) => theme.palette.text.primary};
		font-size: 16px;
		width: 150px;
		cursor: default;
		justify-content: center;
		align-items: center;
	}
`;

const StyledGridSecond = styled(Grid)`
	display: flex;
	justify-content: center;
	color: #fff;
	margin-top: 0.25rem;

	a {
		font-size: 0.875rem;
		font-weight: 400;
		color: rgba(128, 128, 138, 1);
		width: 150px;
		cursor: default;
	}
`;

interface PlayerStatisticsProps {
	checksumAddress: string;
	chainId: number;
	playerData: any;
	isNetworkAvailable: boolean;
	network: string;
}

const PlayerStatistics: React.FC<PlayerStatisticsProps> = ({ checksumAddress, chainId, playerData, isNetworkAvailable, network }) => {
	const theme = useTheme();

	// Redux
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);

	// Ranking Data
	const rankingEarned = useRankingEarned(checksumAddress, chainId);
	const rankingSpent = useRankingSpent(checksumAddress, chainId);

	return (
		<StatisticBox>
			<StyledGridFirst theme={theme}>
				{playerData?.[0]?.earned ? (
					currencyValue === false ? (
						<a>
							{((playerData?.[0]?.earned / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
						</a>
					) : (
						<a>${((playerData?.[0]?.earned / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</a>
					)
				) : (
					<a>
						<Skeleton
							sx={{
								backgroundColor: 'rgba(152, 161, 192, 0.4)',
								borderRadius: '10px',
							}}
							variant="text"
							width={75}
							height={30}
						/>
					</a>
				)}
				{playerData?.[0]?.spent ? (
					currencyValue === false ? (
						<a>
							{((playerData?.[0]?.spent / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
						</a>
					) : (
						<a>${((playerData?.[0]?.spent / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</a>
					)
				) : (
					<a>
						<Skeleton
							sx={{
								backgroundColor: 'rgba(152, 161, 192, 0.4)',
								borderRadius: '10px',
							}}
							variant="text"
							width={75}
							height={30}
						/>
					</a>
				)}
				{playerData?.[0]?.spent ? (
					<>
						<a>
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
						</a>
					</>
				) : (
					<a>
						<Skeleton
							sx={{
								backgroundColor: 'rgba(152, 161, 192, 0.4)',
								borderRadius: '10px',
							}}
							variant="text"
							width={75}
							height={30}
						/>
					</a>
				)}
			</StyledGridFirst>
			<StyledGridSecond>
				<a>Earnings</a>
				<a>Contributions</a>
				<a>Rank</a>
			</StyledGridSecond>
		</StatisticBox>
	);
};

export default PlayerStatistics;
