import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

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
	justify-content: space-between;

	div {
		display: flex;
		flex-direction: row; /* Aligns children in a row */
		justify-content: flex-end; /* Aligns children to the right */
		align-items: center; /* Centers children vertically */
		gap: 1rem; /* Ensures there is a 1rem gap between each child */
		width: 100%;
		height: 3rem;
		padding-right: 1rem; /* Ensures content is 1rem from the right end */
	}

	a {
		font-size: 16px;
		cursor: pointer;
		fill: ${({ theme }) => theme.palette.secondary.main};
		text-decoration: none;
		height: auto;
		&:hover {
			text-decoration: underline;
			fill: ${({ theme }) => theme.palette.warning.main};
		}
	}

	p {
		font-size: 1rem;
		padding: 1rem;
		margin-right: auto; /* Pushes everything else to the right */
	}
`;

const StyledDivider = styled(Divider)<{ theme: any }>`
	border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
`;

const StyledTableContainer = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 5rem;
`;

interface TimerCardProps {
	dareData: any;
}

const TimerCard: React.FC<TimerCardProps> = ({ dareData }) => {
	const theme = useTheme();
	const [countdown, setCountdown] = useState('');

	// State
	const unixTimestamp = Number(dareData?.[0]?.task.endTask);

	const getFormattedCountdown = (endTimeUnix: number) => {
		const taskEndTime = new Date(endTimeUnix * 1000);
		const now = new Date();
		const timeLeft = taskEndTime.getTime() - now.getTime();

		if (timeLeft < 0) {
			return 'Task has ended'; // Task has ended
		}

		const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
			.toString()
			.padStart(2, '0');
		const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			.toString()
			.padStart(2, '0');
		const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
			.toString()
			.padStart(2, '0');

		return `${days}d ${hours}h ${minutes}m ${seconds}s`;
	};

	useEffect(() => {
		const updateCountdown = () => setCountdown(getFormattedCountdown(unixTimestamp));
		updateCountdown(); // Initialize the countdown on mount
		const interval = setInterval(updateCountdown, 1000); // Update every second

		return () => clearInterval(interval); // Cleanup on unmount
	}, [unixTimestamp]);

	if (!dareData) return null;

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<div>
					<p>Timer</p>
				</div>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledTableContainer theme={theme}>{countdown}</StyledTableContainer>
		</TaskCard>
	);
};

export default TimerCard;
