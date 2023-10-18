import styled from '@emotion/styled';
import { Box, Fade, Grid, Skeleton, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import usePlayerData from '../../../../hooks/usePlayerData';
import usePrice from '../../../../hooks/usePrice';
import useRankingEarned from '../../../../hooks/useRankingEarned';
import useRankingSpent from '../../../../hooks/useRankingSpent';
import { CHAINS } from '../../../../utils/chains';
import { CheckNameRegister } from '../../../../utils/validation/checkNameRegister';

const StatisticBox = styled(Box)`
	width: 100%;
	margin: 2rem 0 auto 0;
	text-align: center;
`;

const StyledGridFirst = styled(Grid)`
	display: flex;
	flex-direction: row;
	font-size: 16px;
	color: #fff;

	a {
		display: flex;
		color: #fff;
		font-size: 16px;
		width: 150px;
		cursor: default;
		justify-content: center;
		align-items: center;
	}
`;

const StyledGridSecond = styled(Grid)`
	display: flex;
	flex-direction: row;
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

export default function SocialBoxComponent({ valueUSD, isNetworkAvailable }: { valueUSD: boolean; isNetworkAvailable: boolean }) {
	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// Checked Name Register
	const [registerStatus] = CheckNameRegister();

	// Address Checksumed And Lowercased
	const checksumAddress = registerStatus?.toLowerCase();

	// Player Data
	const playerData = usePlayerData(checksumAddress, chainId);

	// Token Price
	const price = usePrice(chainId);

	// Ranking Data
	const rankingEarned = useRankingEarned(checksumAddress, chainId);
	const rankingSpent = useRankingSpent(checksumAddress, chainId);

	return (
		<StatisticBox>
			<StyledGridFirst>
				{playerData[0]?.earned ? (
					valueUSD === false ? (
						<a>
							{((playerData[0]?.earned / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
						</a>
					) : (
						<a>${((playerData[0]?.earned / 1e18) * price).toFixed(2)}</a>
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
				{playerData[0]?.spent ? (
					valueUSD === false ? (
						<a>
							{((playerData[0]?.spent / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
						</a>
					) : (
						<a>${((playerData[0]?.spent / 1e18) * price).toFixed(2)}</a>
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
				{playerData[0]?.spent ? (
					<Tooltip
						title="Player Ranking: Most Earned | Most Spent"
						placement="top"
						disableInteractive
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<a>
							{rankingEarned} | {rankingSpent}
						</a>
					</Tooltip>
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
				<a>Total earned</a>
				<a>Total spent</a>
				<a>Global rank</a>
			</StyledGridSecond>
		</StatisticBox>
	);
}
