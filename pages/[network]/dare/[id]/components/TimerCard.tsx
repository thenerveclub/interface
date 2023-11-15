import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TaskCard = styled(Box)<{ theme: any }>`
	width: 90%;
	max-width: 350px;
	// height: 150px;
	// max-height: 150px;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	align-items: center;
	justify-content: center;
	position: relative;
	width: 90%;

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
	justify-content: center;
	align-items: center;
	height: 5rem;
`;

interface TimerCardProps {
	currentUnixTimestamp: number;
	taskEndTime: number;
}

const TimerCard: React.FC<TimerCardProps> = ({ currentUnixTimestamp, taskEndTime }) => {
	const theme = useTheme();

	// Format unix timestamp to human readable format
	const formatUnixTimestamp = (unixTimestamp: number) => {
		const date = new Date(unixTimestamp * 1000);
		const hours = date.getHours();
		const minutes = '0' + date.getMinutes();
		const seconds = '0' + date.getSeconds();
		const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		return formattedTime;
	};

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Timer</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledTableContainer theme={theme}>
				{taskEndTime > currentUnixTimestamp ? <p>{formatUnixTimestamp(taskEndTime)}</p> : <p>Task has ended!</p>}
			</StyledTableContainer>
		</TaskCard>
	);
};

export default TimerCard;
