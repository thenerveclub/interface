import styled from '@emotion/styled';
import { Box, Button, Skeleton, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectSort from '../../../../../components/SelectSort';
import CreateTask from '../../../../../components/modal/createTask';
import useActivePlayerTasks from '../../../../../hooks/useActivePlayerTasks';
import useCompletedPlayerTasks from '../../../../../hooks/useCompletedPlayerTasks';
import { currencySlice } from '../../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../../utils/chains';

const StyledTabs = styled(Tabs)<{ theme: any }>`
	// target child element
	& .MuiTabs-indicator {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	@media (max-width: 600px) {
		width: 350px;
		justify-content: center;
		align-items: center;
	}
`;

const StyledTab = styled(Tab)<{ theme: any }>`
	font-size: 0.925rem;
	font-weight: 400;
	text-transform: none;
	min-width: 9.375rem;
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;

	&.Mui-selected {
		color: ${({ theme }) => theme.palette.text.primary};
		font-weight: 500;
		font-size: 1rem;
	}
`;

const ActiveBox = styled(Box)`
	margin: 3rem auto 0 auto;
	border-bottom: 1px solid rgba(128, 128, 138, 1);

	@media (max-width: 600px) {
		width: 300px;
		justify-content: center;
		align-items: center;
	}
`;

const PanelBox = styled(Box)`
	margin: 1rem auto 0 auto;
`;

const ActiveFilterBox = styled(Box)`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 40px;

	@media (max-width: 600px) {
		flex-direction: column;
		align-items: center;
	}
`;

const ActiveTabLeftSection = styled(Box)`
	min-width: 50%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ theme: any }>`
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

const ActiveTabRightSection = styled(Box)`
	min-width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const ActiveTabSection = styled(Box)`
	display: grid;
	align-items: center;
	margin: 2rem auto 0 auto;
	grid-template-columns: repeat(6, 1fr);
	grid-gap: 1rem;

	li {
		grid-column: span 2;
	}

	li:last-child:nth-of-type(3n - 1) {
		grid-column-end: -2;
	}

	li:nth-last-of-type(2):nth-of-type(3n + 1) {
		grid-column-end: 4;
	}

	/* Dealing with single orphan */
	li:last-child:nth-of-type(3n - 2) {
		grid-column-end: 5;
	}

	@media (max-width: 960px) {
		display: grid;
		align-items: center;
		margin: 1rem auto 0 auto;
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

const TaskBoxSection = styled(Box)`
	display: flex;
	flex-direction: row;
	height: 25px;
	width: 100%;
	flex: 1;
	margin: 0 auto 0 auto;
	position: absolute;
	top: 10px;

	a {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 175px;
		width: 90%;
		overflow: auto;
		font-size: 16px;
		cursor: default;
		text-align: center;
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskBoxSectionOne = styled(Box)`
	display: flex;
	flex-direction: row;
	height: 25px;
	width: 100%;
	flex: 1;
	margin: 0 auto 0 auto;
	position: absolute;
	bottom: 85px;

	a {
		display: flex;
		flex: 1;
		height: 25px;
		font-size: 16px;
		cursor: default;
		align-items: center;
		justify-content: center;

		&:first-of-type {
			justify-content: flex-start;
			margin-left: 1.5rem;
		}

		&:last-child {
			justify-content: flex-end;
			margin-right: 1.5rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskBoxSectionTwo = styled(Box)`
	display: flex;
	flex-direction: row;
	height: 25px;
	width: 100%;
	flex: 1;
	margin: 0 auto 0 auto;
	position: absolute;
	bottom: 60px;

	a {
		display: flex;
		flex: 1;
		height: 25px;
		font-size: 16px;
		cursor: default;
		align-items: center;
		justify-content: center;

		&:first-of-type {
			justify-content: flex-start;
			margin-left: 1.5rem;
		}

		&:last-child {
			justify-content: flex-end;
			margin-right: 1.5rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskBoxButton = styled(Box)`
	display: flex;
	width: 90%;
	margin: 0 auto 0 auto;
	height: 40px;

	a {
		cursor: pointer;
		height: 40px;
		text-decoration: none;
		color: #fff;
	}

	@media (max-width: 600px) {
		justify-content: center;
	}
`;

const TaskButton = styled(Button)`
	color: #fff;
	height: 40px;
	width: 90%;
	border: none;
	background-color: rgba(255, 127.5, 0, 1);
	border-radius: 10px;
	position: absolute;
	bottom: 10px;
	text-transform: none;
	font-size: 16px;

	&:hover {
		background-color: rgba(255, 127.5, 0, 1);
	}
`;

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

interface PlayerDaresProps {
	registerStatus: any;
	checksumAddress: string;
	checksumAccount: string;
	network: string;
}

const PlayerDares: React.FC<PlayerDaresProps> = ({ registerStatus, checksumAddress, checksumAccount, network }) => {
	const theme = useTheme();
	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);
	const sort = useSelector((state: { sort: number }) => state.sort);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	// Active Player Tasks
	const activePlayerTasks = useActivePlayerTasks(checksumAddress, chainId);
	const completedPlayerTasks = useCompletedPlayerTasks(checksumAddress, chainId);

	const [filteredActiveTasks, setFilteredActiveTasks] = useState(activePlayerTasks);
	const [filteredCompletedTasks, setFilteredCompletedTasks] = useState(completedPlayerTasks);

	// Tab Panel
	function TabPanel(props: TabPanelProps) {
		const { children, value, index, ...other } = props;

		return (
			<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
				{value === index && <PanelBox>{children}</PanelBox>}
			</div>
		);
	}

	const [tabValue, setTabValue] = useState(1);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	useEffect(() => {
		// Create a function that returns sorted tasks based on the sort option
		const sortTasks = (tasks, sortOption) => {
			if (!tasks) return [];
			switch (sortOption) {
				case 1:
					return [...tasks].sort((a, b) => a.amount - b.amount);
				case 2:
					return [...tasks].sort((a, b) => b.amount - a.amount);
				case 3:
					return [...tasks].sort((a, b) => a.participants - b.participants);
				case 4:
					return [...tasks].sort((a, b) => b.participants - a.participants);
				case 5:
					return [...tasks].sort((a, b) => a.entranceAmount - b.entranceAmount);
				case 6:
					return [...tasks].sort((a, b) => b.entranceAmount - a.entranceAmount);
				default:
					return tasks; // return original tasks if no sort option matches
			}
		};

		// Apply the sorting function to both active and completed tasks
		const sortedActiveTasks = sortTasks(activePlayerTasks, sort);
		const sortedCompletedTasks = sortTasks(completedPlayerTasks, sort);

		// Update the state with the sorted tasks
		setFilteredActiveTasks(sortedActiveTasks);
		setFilteredCompletedTasks(sortedCompletedTasks);
	}, [sort, activePlayerTasks, completedPlayerTasks]); // dependencies include sort value and the tasks themselves

	return (
		<>
			<ActiveBox>
				<StyledTabs theme={theme} value={tabValue} onChange={handleChange}>
					<StyledTab theme={theme} value={1} label="Active Tasks" />
					<StyledTab theme={theme} value={2} label="Completed Tasks" />
				</StyledTabs>
			</ActiveBox>
			<TabPanel value={tabValue} index={1}>
				<ActiveFilterBox>
					{/* <ActiveTabLeftSection></ActiveTabLeftSection> */}
					<ActiveTabRightSection>
						{/* // Filter StyledSection */}
						<SelectSort />

						<StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
								{isNetworkAvailable ? <a>{CHAINS[chainId]?.nameToken}</a> : <a>MATIC</a>}
							</StyledToggleButton>
							<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
						{account ? checksumAccount !== checksumAddress ? <CreateTask registerStatus={registerStatus} /> : null : null}
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{filteredActiveTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad}>
							<TaskCard theme={theme}>
								<TaskBoxSection>
									<a>{tad.description}</a>
								</TaskBoxSection>
								<TaskBoxSectionOne>
									<a>#{tad.id}</a>
									{tad?.participants && tad?.participants <= 0 ? <a>{tad.participants} Participants</a> : <a>{tad.participants} Participant</a>}
								</TaskBoxSectionOne>
								<TaskBoxSectionTwo>
									{tad?.amount ? (
										currencyValue === false ? (
											<a>
												{((tad?.amount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.amount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
									{tad?.entranceAmount ? (
										currencyValue === false ? (
											<a>
												{((tad?.entranceAmount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.entranceAmount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
								</TaskBoxSectionTwo>
								<TaskBoxButton>
									<a onClick={() => router.push(`/${network}/dare/` + tad.id)}>
										<TaskButton>View Task</TaskButton>
									</a>
								</TaskBoxButton>
							</TaskCard>
						</li>
					))}
				</ActiveTabSection>
			</TabPanel>
			<TabPanel value={tabValue} index={2}>
				<ActiveFilterBox>
					{/* <ActiveTabLeftSection></ActiveTabLeftSection> */}
					<ActiveTabRightSection>
						{/* // Filter StyledSection */}
						<SelectSort />
						<StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
								{isNetworkAvailable ? <a>{CHAINS[chainId]?.nameToken}</a> : <a>MATIC</a>}
							</StyledToggleButton>
							<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{filteredCompletedTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad.id}>
							<TaskCard theme={theme}>
								<TaskBoxSection>
									<a>{tad.description}</a>
								</TaskBoxSection>
								<TaskBoxSectionOne>
									<a>#{tad.id}</a>
									{tad?.participants && tad?.participants <= 0 ? <a>{tad.participants} Participants</a> : <a>{tad.participants} Participant</a>}
								</TaskBoxSectionOne>
								<TaskBoxSectionTwo>
									{tad?.amount ? (
										currencyValue === false ? (
											<a>
												{((tad?.amount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.amount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
									{tad?.entranceAmount ? (
										currencyValue === false ? (
											<a>
												{((tad?.entranceAmount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${((tad?.entranceAmount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</a>
										)
									) : (
										<span>
											<Skeleton
												sx={{
													backgroundColor: 'rgba(152, 161, 192, 0.4)',
													borderRadius: '10px',
												}}
												variant="text"
												width={75}
												height={30}
											/>
										</span>
									)}
								</TaskBoxSectionTwo>
								<TaskBoxButton>
									<a onClick={() => router.push(`/${network}/dare/` + tad.id)}>
										<TaskButton>View Task</TaskButton>
									</a>
								</TaskBoxButton>
							</TaskCard>
						</li>
					))}
				</ActiveTabSection>
			</TabPanel>
		</>
	);
};

export default PlayerDares;
