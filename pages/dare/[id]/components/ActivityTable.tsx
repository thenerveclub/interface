import styled from '@emotion/styled';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import { Box, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currencySlice } from '../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../utils/chains';

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	width: 90%;
	max-height: 500px;
	margin: 0 auto 0 auto;
	background-color: ${({ theme }) => theme.palette.background.default};
	backdrop-filter: blur(15px) brightness(70%);
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	overflow: auto;

	@media (max-width: 960px) {
		width: 95%;
		max-width: auto;
		height: 100%;
		max-height: auto;
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

const StyledCardFilter = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	padding: 1rem 1rem 0 1rem;
`;

const StyledTableContainer = styled(Box)<{ theme: any }>`
	overflow-y: auto;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ theme: any }>`
	display: flex;
	align-self: flex-end;
	background-color: transparent;
	height: 35px;
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

	@media (max-width: 960px) {
		margin-left: 0.5rem;
	}
`;

const StyledFilterGroup = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	background-color: transparent;
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

const StyledSortButton = styled(Button)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	cursor: pointer;
	font-weight: 500;
	width: auto;
	height: 35px;
	text-transform: none;
	margin-right: 1rem;

	&:hover {
		background-color: transparent;
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}

	@media (max-width: 960px) {
		margin-right: 0.5rem;
	}
`;

const StyledTable = styled(Table)<{ theme: any }>`
	max-height: 378px;
	padding: 0 1rem 0 1rem;

	@media (max-width: 600px) {
		font-size: 3rem;
	}
`;

const StyledButton = styled(Button)<{ theme: any }>`
	display: flex-end;
	flex-direction: row;
	justify-content: right;
	align-items: right;
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: transparent;
	text-transform: none;
	width: 100%;

	@media (max-width: 600px) {
		font-size: auto;
	}
`;

const StyledTableRow = styled(TableRow)<{ theme: any }>`
	transition: transform 0.3s;
	box-shadow 0.3s;
	cursor: default;

	&:nth-of-type(odd) {
		background-color: ${({ theme }) => theme.palette.background.default};
	}
`;

interface ActivityTableProps {
	id: string;
	dareData: any;
	chainIdUrl: number;
	network: string;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ id, dareData, chainIdUrl, network }) => {
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
	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('blockNumber');
	const [isParticipantsSelected, setIsParticipantsSelected] = useState(true);
	const [isVotedSelected, setIsVotedSelected] = useState(false);

	const createSortHandler = (property) => (event) => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	let sortedData = [];

	// Check if dareData is defined and is an array
	if (dareData && Array.isArray(dareData)) {
		sortedData = [...dareData].sort((a, b) => {
			let aValue = Number(a[orderBy]);
			let bValue = Number(b[orderBy]);

			return order === 'asc' ? aValue - bValue : bValue - aValue;
		});
	}

	const filteredData = sortedData.filter((row) => {
		if (isVotedSelected && !row.voted) {
			return false;
		}
		return true;
	});

	const participantData = filteredData.filter((row) => {
		return isParticipantsSelected || row.task.initiatorAddress === row.userAddress;
	});

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	return (
		<TaskCard theme={theme}>
			<StyledCardHeader theme={theme}>
				<a>Activity</a>
				<StyledDivider theme={theme} />
			</StyledCardHeader>
			<StyledCardFilter theme={theme}>
				<StyledFilterGroup theme={theme}>
					<StyledSortButton
						theme={theme}
						onClick={() => setIsParticipantsSelected(!isParticipantsSelected)}
						style={{ color: isParticipantsSelected ? theme.palette.text.primary : theme.palette.secondary.main }}
					>
						Participants
					</StyledSortButton>
					<StyledSortButton
						theme={theme}
						onClick={() => setIsVotedSelected(!isVotedSelected)}
						style={{ color: isVotedSelected ? theme.palette.text.primary : theme.palette.secondary.main }}
					>
						Voted
					</StyledSortButton>
				</StyledFilterGroup>
				<StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
					<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
						{isNetworkAvailable ? <a>{CHAINS[chainIdUrl]?.nameToken}</a> : <a>MATIC</a>}
					</StyledToggleButton>
					<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
						<a>USD</a>
					</StyledToggleButton>
				</StyledToggleButtonGroup>
			</StyledCardFilter>
			<StyledTableContainer theme={theme}>
				<StyledTable stickyHeader theme={theme}>
					<TableHead>
						<TableRow>
							<TableCell>Event</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Address</TableCell>
							<TableCell>Name</TableCell>

							<TableCell>
								<StyledButton theme={theme} onClick={createSortHandler('voted')}>
									Voted
									{orderBy === 'voted' ? (
										order === 'asc' ? (
											<ArrowDropUpIcon style={{ color: theme.palette.text.primary }} />
										) : (
											<ArrowDropDownIcon style={{ color: theme.palette.text.primary }} />
										)
									) : order === 'asc' ? (
										<ArrowDropUpIcon style={{ color: theme.palette.secondary.main }} />
									) : (
										<ArrowDropDownIcon style={{ color: theme.palette.secondary.main }} />
									)}
								</StyledButton>
							</TableCell>

							<TableCell>
								<StyledButton theme={theme} onClick={createSortHandler('vote')}>
									Vote
									{orderBy === 'vote' ? (
										order === 'asc' ? (
											<ArrowDropUpIcon style={{ color: theme.palette.text.primary }} />
										) : (
											<ArrowDropDownIcon style={{ color: theme.palette.text.primary }} />
										)
									) : order === 'asc' ? (
										<ArrowDropUpIcon style={{ color: theme.palette.secondary.main }} />
									) : (
										<ArrowDropDownIcon style={{ color: theme.palette.secondary.main }} />
									)}
								</StyledButton>
							</TableCell>

							<TableCell>
								<StyledButton theme={theme} onClick={createSortHandler('blockNumber')}>
									Time
									{orderBy === 'blockNumber' ? (
										order === 'asc' ? (
											<ArrowDropUpIcon style={{ color: theme.palette.text.primary }} />
										) : (
											<ArrowDropDownIcon style={{ color: theme.palette.text.primary }} />
										)
									) : order === 'asc' ? (
										<ArrowDropUpIcon style={{ color: theme.palette.secondary.main }} />
									) : (
										<ArrowDropDownIcon style={{ color: theme.palette.secondary.main }} />
									)}
								</StyledButton>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{participantData.length > 0 ? (
							participantData.map((row, index) => (
								<StyledTableRow theme={theme} key={index}>
									<TableCell style={{ display: 'flex', alignItems: 'center' }}>
										{row.task.initiatorAddress === row.userAddress ? (
											<>
												<TipsAndUpdatesOutlinedIcon
													style={{
														color: theme.palette.success.main,
														fontSize: '1rem',
														marginRight: '0.5rem',
													}}
												/>
												<span style={{ color: theme.palette.success.main }}>Creator</span>
											</>
										) : (
											<>
												<GroupAddOutlinedIcon
													style={{
														color: theme.palette.warning.main,
														fontSize: '1rem',
														marginRight: '0.5rem',
													}}
												/>
												<span style={{ color: theme.palette.warning.main }}>Joined</span>
											</>
										)}
									</TableCell>

									<TableCell style={{ textAlign: 'left' }}>
										{currencyValue === false ? (
											<a>
												{formatNumber(row.userStake)} {isNetworkAvailable ? CHAINS[chainIdUrl]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${formatNumber(row.userStake * currencyPrice[network]?.usd)}</a>
										)}
									</TableCell>
									<TableCell style={{ textAlign: 'left' }}>{`${row.userAddress.slice(0, 6)}...${row.userAddress.slice(-4)}`}</TableCell>
									<TableCell style={{ textAlign: 'left' }}>
										<a>{row.userName}</a>
									</TableCell>
									<TableCell style={{ textAlign: 'right', color: row.voted ? theme.palette.success.contrastText : theme.palette.error.contrastText }}>
										{row.voted ? 'Yes' : 'No'}
									</TableCell>
									<TableCell style={{ textAlign: 'right', color: row.vote ? theme.palette.success.main : theme.palette.error.main }}>
										{row.voted ? (row.vote ? 'True' : 'False') : ''}
									</TableCell>

									<TableCell style={{ textAlign: 'right' }}>{row.blockNumber}</TableCell>
								</StyledTableRow>
							))
						) : (
							<StyledTableRow theme={theme}>
								<TableCell colSpan={7} style={{ textAlign: 'center' }}>
									No activities yet
								</TableCell>
							</StyledTableRow>
						)}
					</TableBody>
				</StyledTable>
			</StyledTableContainer>
		</TaskCard>
	);
};

export default ActivityTable;
