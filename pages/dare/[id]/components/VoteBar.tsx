import { useEffect, useState } from 'react';

interface Props {
	positiveVotes: number;
	negativeVotes: number;
	notVotedYet: number;
}

const VoteBar = ({ positiveVotes, negativeVotes, notVotedYet }: Props) => {
	const [notVotedPercentage, setNotVotedPercentage] = useState(0);

	useEffect(() => {
		let currentValue = -50; // start earlier
		const interval = setInterval(() => {
			currentValue = currentValue >= 150 ? -50 : currentValue + 1; // move farther to the right
			setNotVotedPercentage(currentValue);
		}, 10);
		return () => clearInterval(interval);
	}, []);

	const totalVotes = positiveVotes + negativeVotes + notVotedYet;
	const positiveVotesPercentage = (positiveVotes / totalVotes) * 100;
	const negativeVotesPercentage = (negativeVotes / totalVotes) * 100;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				height: '4px',
				backgroundColor: 'lightgray',
				borderRadius: '4px',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					width: `${positiveVotesPercentage}%`,
					height: '100%',
					backgroundColor: 'green',
				}}
			/>
			<div
				style={{
					width: `${negativeVotesPercentage}%`,
					height: '100%',
					backgroundColor: 'red',
				}}
			/>
			<div
				style={{
					width: `${100 - positiveVotesPercentage - negativeVotesPercentage}%`,
					height: '100%',
					backgroundColor: 'purple',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: `${notVotedPercentage}%`,
						width: `calc(${100 - positiveVotesPercentage - negativeVotesPercentage}% - ${totalVotes}%)`,
						height: '100%',
						backgroundColor: 'white',
						boxShadow: '0px 0px 10px 5px rgba(255,255,255,0.5)',
						borderRadius: '10px',
					}}
				/>
			</div>
		</div>
	);
};

export default VoteBar;
