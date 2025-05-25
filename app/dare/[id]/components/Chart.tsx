'use client';

import { PieChart } from '@mui/x-charts/PieChart';

interface ChartProps {
	dareData: any;
}

const Chart: React.FC<ChartProps> = ({ dareData }) => {
	const totalParticipants = dareData?.[0]?.task.participants || 0;
	const positiveVotes = Number(dareData?.[0]?.task.positiveVotes) || 0;
	const negativeVotes = Number(dareData?.[0]?.task.negativeVotes) || 0;
	const totalVotes = positiveVotes + negativeVotes;
	const nonVoters = totalParticipants - totalVotes;

	const votedPercentage = totalParticipants > 0 ? ((totalVotes / totalParticipants) * 100).toFixed(2) : 0;
	const notVotedPercentage = totalParticipants > 0 ? ((nonVoters / totalParticipants) * 100).toFixed(2) : 0;
	const positiveVotePercentage = totalVotes > 0 ? ((positiveVotes / totalVotes) * 100).toFixed(2) : 0;
	const negativeVotePercentage = totalVotes > 0 ? ((negativeVotes / totalVotes) * 100).toFixed(2) : 0;

	const sizing = {
		margin: { right: 5 },
		width: 200,
		height: 200,
		legend: { hidden: true },
	};

	return (
		<div className="flex flex-row justify-between items-center w-[90%] mx-auto max-md:flex-col max-md:w-[95%]">
			{/* Voted Pie Chart Card */}
			<div className="flex flex-col w-[45%] max-md:w-full h-[378px] max-h-[378px] bg-background border border-secondary backdrop-blur-md rounded-xl overflow-auto">
				<div className="flex flex-col justify-start">
					<p className="text-base font-medium cursor-default px-4 py-3">Voted</p>
					<hr className="border-b border-secondary w-full" />
				</div>
				<div className="flex flex-col justify-center items-center w-full h-full">
					<PieChart
						series={[
							{
								data: [
									{ label: 'Voted', value: totalVotes, color: 'success.contrastText' },
									{ label: 'Not voted', value: nonVoters, color: 'error.contrastText' },
								],
								arcLabel: (params) => params.label ?? '',
								innerRadius: 8,
								outerRadius: 90,
								paddingAngle: 3,
								cornerRadius: 8,
							},
						]}
						slotProps={{
							legend: { hidden: true },
						}}
						{...sizing}
					/>
					<p className="text-center text-sm text-secondary mb-4">
						Voted: {votedPercentage}% | Not voted: {notVotedPercentage}%
					</p>
				</div>
			</div>

			{/* Voting Ratio Card */}
			<div className="flex flex-col w-[45%] max-md:w-full h-[378px] max-h-[378px] bg-background border border-secondary backdrop-blur-md rounded-xl overflow-auto mt-0 max-md:mt-8">
				<div className="flex flex-col justify-start">
					<p className="text-base font-medium cursor-default px-4 py-3">Voting Ratio</p>
					<hr className="border-b border-secondary w-full" />
				</div>
				<div className="flex flex-col justify-center items-center w-full h-full">
					{/* Optionally add a second PieChart here */}
					<p className="text-center text-sm text-secondary mb-4">
						True: {positiveVotePercentage}% | False: {negativeVotePercentage}%
					</p>
				</div>
			</div>
		</div>
	);
};

export default Chart;
