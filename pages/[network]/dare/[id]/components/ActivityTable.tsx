import styled from '@emotion/styled';
import { Box, ClickAwayListener, Divider, IconButton, InputBase, List, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currencySlice } from '../../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../../utils/chains';

const TaskCard = styled(Box)<{ theme: any }>`
	// display: flex;
	// flex-direction: column;
	width: 738px;
	max-width: 738px;
	height: 189px;
	max-height: 189px;
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
		justify-content: left;
		padding: 1rem;
	}

	@media (max-width: 960px) {
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const StyledCardHeader = styled(Box)<{ theme: any }>`
	a {
		font-size: 16px;
		cursor: default;
		justify-content: left;
		text-align: left;
		align-items: left;
	}
`;

const StyledCardDetails = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	width: 100%;
	margin: 0 auto 0 auto;
`;

const StyledDivider = styled(Divider)<{ theme: any }>`
	border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ theme: any }>`
	display: flex;
	align-self: flex-end;
	background-color: transparent;
	height: 40px;
	width: 150px;
	margin-left: 1rem;
	cursor: not-allowed;

	& .MuiToggleButton-root {
		&:hover {
			background-color: transparent;
			border: 1px solid ${({ theme }) => theme.palette.warning.main};
			border-left: 1px solid ${({ theme }) => theme.palette.warning.main};
		}
	}
`;

const StyledToggleButton = styled(ToggleButton)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	cursor: pointer;
	// font-size: 1rem;
	font-weight: 500;
	width: 150px;

	&.Mui-selected {
		color: ${({ theme }) => theme.palette.text.primary};
		background-color: transparent;
		border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	}
`;

interface ActivityTableProps {
	id: string;
	dareData: any;
	chainIdUrl: number;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ id, dareData, chainIdUrl }) => {
	const theme = useTheme();
	const router = useRouter();

	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainIdUrl);

	// State declarations

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Activityyyy</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledCardDetails theme={theme}>
				<StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
					<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
						{isNetworkAvailable ? <a>{CHAINS[chainIdUrl]?.nameToken}</a> : <a>MATIC</a>}
					</StyledToggleButton>
					<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
						<a>USD</a>
					</StyledToggleButton>
				</StyledToggleButtonGroup>
			</StyledCardDetails>
		</TaskCard>
	);
};

export default ActivityTable;
