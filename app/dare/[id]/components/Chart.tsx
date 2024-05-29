import styled from '@emotion/styled';
import { Palette } from '@mui/icons-material';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

const StyledVotingBox = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 90%;
	margin: 0 auto 0 auto;

	@media (max-width: 960px) {
		flex-direction: column;
		margin 0 auto 0 auto;
		justify-content: center;
		width: 95%;

		& > *:last-child {
			margin: 2rem auto 0 auto;
		}
	}
`;

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	width: 45%;
	// max-width: 350px;
	height: 378px;
	max-height: 378px;
	margin: 0 0 0 0;
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

const StyledTableContainer = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	margin: 0 auto 0 auto;
`;

interface ChartProps {
	dareData: any;
}

const Chart: React.FC<ChartProps> = ({ dareData }) => {
	const theme = useTheme();

	// Get the total participants
	const totalParticipants = dareData?.[0]?.task.participants || 0;

	// Calculate the total votes
	const positiveVotes = Number(dareData?.[0]?.task.positiveVotes) || 0;
	const negativeVotes = Number(dareData?.[0]?.task.negativeVotes) || 0;
	const totalVotes = Number(positiveVotes) + Number(negativeVotes);

	// Participants who didn't vote
	const nonVoters = totalParticipants - totalVotes;

	// Calculate the percentages for Voted and Not Voted
	const votedPercentage = totalParticipants > 0 ? ((totalVotes / totalParticipants) * 100).toFixed(2) : 0;
	const notVotedPercentage = totalParticipants > 0 ? ((nonVoters / totalParticipants) * 100).toFixed(2) : 0;

	// Calculate the percentages
	const positiveVotePercentage = totalVotes > 0 ? ((positiveVotes / totalVotes) * 100).toFixed(2) : 0;
	const negativeVotePercentage = totalVotes > 0 ? ((negativeVotes / totalVotes) * 100).toFixed(2) : 0;

	const sizing = {
		margin: { right: 5 },
		width: 200,
		height: 200,
		legend: { hidden: true },
	};

	return (
		<StyledVotingBox theme={theme}>
			<TaskCard theme={theme}>
				<StyledCardHeader theme={theme}>
					<a>Voted</a>
					<StyledDivider theme={theme} />
				</StyledCardHeader>
				<StyledTableContainer theme={theme}>
					<PieChart
						series={[
							{
								data: [
									{ label: 'Voted', value: totalVotes, color: theme.palette.success.contrastText },
									{ label: 'Not voted', value: nonVoters, color: theme.palette.error.contrastText },
								],
								arcLabel: (params) => params.label ?? '',
								innerRadius: 12,
								outerRadius: 90,
								paddingAngle: 3,
								cornerRadius: 12,
								// dataIndex
							},
						]}
						slotProps={{
							legend: { hidden: true },
						}}
						{...sizing}
					/>
					<Box style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.925rem', color: theme.palette.secondary.main }}>
						<div>
							Voted: {votedPercentage}% | Not voted: {notVotedPercentage}%
						</div>
					</Box>
				</StyledTableContainer>
			</TaskCard>
			<TaskCard theme={theme}>
				<StyledCardHeader theme={theme}>
					<a>Voting Ratio</a>
					<StyledDivider theme={theme} />
				</StyledCardHeader>
				<StyledTableContainer theme={theme}>
					{/* <PieChart
						series={[
							{
								data: [
									{ label: 'True', value: positiveVotes, color: theme.palette.success.main },
									{ label: 'False', value: negativeVotes, color: theme.palette.error.main },
								],
								innerRadius: 12,
								outerRadius: 90,
								paddingAngle: 3,
								cornerRadius: 12,
								// dataIndex
							},
						]}
						{...sizing}
					/> */}
					<Box style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.925rem', color: theme.palette.secondary.main }}>
						<div>
							True: {positiveVotePercentage}% | False: {negativeVotePercentage}%
						</div>
					</Box>
				</StyledTableContainer>
			</TaskCard>
		</StyledVotingBox>
	);
};

export default Chart;
