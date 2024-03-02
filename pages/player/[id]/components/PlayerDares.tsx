import styled from '@emotion/styled';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Button, Skeleton, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectSort from '../../../../components/SelectSort';
import CreateTask from '../../../../components/modal/createTask';
import Connect from '../../../../components/modal/menu/Connect';
import useActivePlayerTasks from '../../../../hooks/useActivePlayerTasks';
import useCompletedPlayerTasks from '../../../../hooks/useCompletedPlayerTasks';
import { currencySlice } from '../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../utils/chains';

const StyledTabs = styled(Tabs)<{ theme: any }>`
	// target child element
	& .MuiTabs-indicator {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	@media (max-width: 750px) {
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

	@media (max-width: 750px) {
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
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 40px;

	@media (max-width: 750px) {
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

	@media (max-width: 750px) {
		justify-content: center;
	}
`;

const CreateTaskBox = styled(Box)`
	display: flex;
	// justify-content: flex-end;

	@media (max-width: 750px) {
		display: none;
		visibility: hidden;
	}
`;

const ActiveTabSection = styled(Box)`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-evenly;
	margin: 1rem auto 5rem auto;
	gap: 2rem;
	min-width: 100%;

	@media (max-width: 750px) {
		flex-direction: column;
		margin: 1rem auto 5rem auto;
		width: 100%;
	}
`;

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto 0 auto;
	min-width: 450px;
	max-width: 450px;
	min-height: 300px;
	max-height: 300px;
	background-color: ${({ theme }) => theme.palette.background.default};
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	padding: 1rem;

	@media (max-width: 750px) {
		min-width: 350px;
		max-width: 350px;
	}

	@media (max-width: 680px) {
		min-width: 90vw;
		max-width: 90vw;
	}
`;

const TaskBoxSection = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	height: 100%;
	flex-grow: 1;

	p {
		font-size: 1rem;
		text-align: center;
	}

	@media (max-width: 750px) {
	}
`;

const TaskBoxSectionOne = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 25px;
	width: 100%;
	margin: 0 auto 0 auto;
	padding: 0;

	p {
		display: flex;
		height: 25px;
		font-size: 1rem;
		cursor: default;
		margin: 0;
	}

	@media (max-width: 750px) {
	}
`;

const TaskBoxSectionTwo = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 25px;
	width: 100%;
	margin: 0 auto 0 auto;
	padding: 0;

	p {
		display: flex;
		height: 25px;
		font-size: 1rem;
		cursor: default;
		margin: 0;
	}

	@media (max-width: 750px) {
	}
`;

const BottomContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin: 0 auto 0 auto;
`;

const TaskButton = styled(Button)`
	color: #fff;
	width: 100%;
	font-size: 16px;
	margin: 0.5rem auto 0 auto;
	text-transform: none;
	background-color: rgba(255, 127.5, 0, 1);

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
	chainIdUrl: number;
}

const PlayerDares: React.FC<PlayerDaresProps> = ({ registerStatus, checksumAddress, checksumAccount, network, chainIdUrl }) => {
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
						<CreateTaskBox>
							{account && checksumAccount !== checksumAddress && (
								<CreateTask registerStatus={registerStatus} chainIdUrl={chainIdUrl} isNetworkAvailable={isNetworkAvailable} />
							)}
						</CreateTaskBox>
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{filteredActiveTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad}>
							<TaskCard theme={theme}>
								<TaskBoxSection>
									<p>{tad.description}</p>
								</TaskBoxSection>
								<BottomContainer>
									<TaskBoxSectionOne>
										<p>#{tad.id}</p>
										<p>
											{tad.participants}{' '}
											<PeopleAltIcon style={{ display: 'felx', fontSize: '18px', fill: 'white', height: '100%', marginLeft: '0.5rem' }} />
										</p>
									</TaskBoxSectionOne>
									<TaskBoxSectionTwo>
										{currencyValue === false ? (
											<p>
												{((tad?.amount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</p>
										) : (
											<p>${((tad?.amount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</p>
										)}
										{currencyValue === false ? (
											<p>
												{((tad?.entranceAmount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</p>
										) : (
											<p>${((tad?.entranceAmount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</p>
										)}
									</TaskBoxSectionTwo>
									<TaskButton onClick={() => router.push(`/dare/` + tad.id)}>View Task</TaskButton>
								</BottomContainer>
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
						<CreateTaskBox>
							{account && checksumAccount !== checksumAddress && (
								<CreateTask registerStatus={registerStatus} chainIdUrl={chainIdUrl} isNetworkAvailable={isNetworkAvailable} />
							)}
						</CreateTaskBox>
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{filteredCompletedTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad.id}>
							<TaskCard theme={theme}>
								<TaskBoxSection>
									<p>{tad.description}</p>
								</TaskBoxSection>
								<BottomContainer>
									<TaskBoxSectionOne>
										<p>#{tad.id}</p>
										<p>
											{tad.participants} <PeopleAltIcon style={{ fontSize: '18px', fill: 'white', height: '100%', marginLeft: '0.5rem' }} />
										</p>
									</TaskBoxSectionOne>
									<TaskBoxSectionTwo>
										{currencyValue === false ? (
											<p>
												{((tad?.amount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</p>
										) : (
											<p>${((tad?.amount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</p>
										)}
										{currencyValue === false ? (
											<p>
												{((tad?.entranceAmount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
											</p>
										) : (
											<p>${((tad?.entranceAmount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</p>
										)}
									</TaskBoxSectionTwo>
									<TaskButton onClick={() => router.push(`/dare/` + tad.id)}>View Task</TaskButton>
								</BottomContainer>
							</TaskCard>
						</li>
					))}
				</ActiveTabSection>
			</TabPanel>
		</>
	);
};

export default PlayerDares;
