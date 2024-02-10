import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

const TaskCard = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 70%;
	margin: 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	@media (max-width: 960px) {
		width: 95%;
	}
`;

const StyledCardHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: left;

	a {
		font-size: 16px;
		cursor: default;
		padding: 1rem;
	}
`;

const StyledDivider = styled(Divider)`
	border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
`;

const StyledTableContainer = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 5rem;
`;

interface TimerCardProps {
	unixTimestamp: number;
}

const TimerCard: React.FC<TimerCardProps> = ({ unixTimestamp }) => {
	const theme = useTheme();
	const [countdown, setCountdown] = useState('');

	const getFormattedCountdown = (endTimeUnix: number) => {
		const taskEndTime = new Date(endTimeUnix * 1000);
		const now = new Date();
		const timeLeft = taskEndTime.getTime() - now.getTime();

		if (timeLeft < 0) {
			return '00d 00h 00m 00s'; // Task has ended
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

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Time till task ends</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledTableContainer theme={theme}>{countdown}</StyledTableContainer>
		</TaskCard>
	);
};

export default TimerCard;
