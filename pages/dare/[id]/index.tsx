import styled from '@emotion/styled';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

const StyledBox = styled(Box)`
	margin: 7.5rem 5rem auto 5rem;

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

const StyledSection = styled.section`
	display: flex;
	align-items: center;
	justify-content: center;
	align-content: center;
	margin: 5rem auto 0 auto;

	@media (max-width: 960px) {
		display: grid;
		align-items: center;
		margin: 0 auto 0 auto;
		grid-template-columns: 1fr;
		grid-gap: 2em;
	}
`;

const TaskCard = styled(Box)<{ theme: any }>`
	width: 350px;
	max-width: 350px;
	height: 300px;
	max-height: 300px;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	align-items: center;
	justify-content: center;
	position: relative;
	width: 90%;

	a {
		display: flex;
		margin: 0 auto 0 auto;
		font-size: 16px;
		cursor: default;
		justify-content: center;
		align-items: center;
	}

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const StyledDivider = styled(Divider)<{ theme: any }>`
	border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
`;

export default function TaskPage() {
	const theme = useTheme();

	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	const router = useRouter();
	const { id } = router.query;

	return (
		<StyledBox>
			<StyledSection>
				<a>{id}</a>
				<TaskCard theme={theme}>
					<a>Description</a>
					<StyledDivider theme={theme} />
				</TaskCard>
				<TaskCard theme={theme}>
					<a>Details</a>
					<StyledDivider theme={theme} />
				</TaskCard>
				<TaskCard theme={theme}>
					<a>Timer</a>
					<StyledDivider theme={theme} />
				</TaskCard>
				<TaskCard theme={theme}>
					<a>Activity</a>
					<StyledDivider theme={theme} />
				</TaskCard>
			</StyledSection>
		</StyledBox>
	);
}
