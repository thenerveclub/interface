import styled from '@emotion/styled';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Button, Skeleton, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectFilter from '../../../../components/SelectFilter';
import SelectSort from '../../../../components/SelectSort';
import CreateAtPlayer from '../../../../components/modal/create/createAtPlayer';
import Connect from '../../../../components/modal/menu/Connect';
import useActivePlayerTasks from '../../../../hooks/playerData/useActivePlayerTasks';
import useCompletedPlayerTasks from '../../../../hooks/playerData/useCompletedPlayerTasks';
import { currencySlice } from '../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../utils/chains';
import EthereumLogo from '/public/svg/chains/ethereum.svg';
import PolygonLogo from '/public/svg/chains/polygon.svg';
import GoogleMaps from '/public/svg/tech/googlemaps.svg';

const ActiveBox = styled(Box)`
	display: flex;
	width: 100%;
	margin: 2.5rem auto 0 auto;
	border-bottom: 1px solid rgba(128, 128, 138, 1);

	@media (max-width: 750px) {
		width: fit-content;
		justify-content: center;
		align-items: center;
	}
`;

const StyledTabs = styled(Tabs)<{ theme: any }>`
	// target child element
	& .MuiTabs-indicator {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	@media (max-width: 750px) {
		width: 100%;
		justify-content: center;
		align-items: center;
	}
`;

const StyledTab = styled(Tab)<{ theme: any }>`
	font-size: 1rem;
	font-weight: 400;
	text-transform: none;
	min-width: 10rem;
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;

	&.Mui-selected {
		color: ${({ theme }) => theme.palette.text.primary};
		font-weight: 500;
		font-size: 1rem;
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
		height: auto;
	}
`;

const ActiveTabLeftSection = styled(Box)`
	min-width: 50%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;

const ActiveTabRightSection = styled(Box)`
	// min-width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	// gap: 1rem;
	margin: 0 0 0 auto;

	// & > :not(:last-child) {
	// 	margin-right: 1rem;
	// }

	@media (max-width: 750px) {
		min-width: auto;
		flex-direction: row;
		justify-content: center;
		margin: 0 auto 0 auto;
		gap: 0.5rem;
	}
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

	@media (max-width: 750px) {
		display: flex;
		justify-content: center;
		margin: 0.5rem auto 0 auto;
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

	@media (max-width: 750px) {
		min-width: 90vw;
		max-width: 90vw;
	}
`;

const StyledInfo = styled.div<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin: 0 auto 0 auto;

	@media (max-width: 750px) {
	}
`;

const StyledMap = styled.div<{ theme: any }>`
	display: flex;
	justify-content: left;
	align-items: center;
	width: fit-content;
	margin: 0 auto 0 0;
	height: 35px;
	color: rgba(255, 255, 255, 0.75);
	font-size: 0.925rem;
	background-color: rgba(134, 134, 139, 0.25);
	border-radius: 12px;
	padding: 0.5rem;
	color: ${({ theme }) => theme.palette.text.primary};
	cursor: default;

	&:hover {
		cursor: pointer;
	}
`;

const StyledNetwork = styled.div<{ theme: any }>`
	display: flex;
	justify-content: right;
	align-items: center;
	width: fit-content;
	margin: 0 0 0 auto;
	height: 35px;
	color: rgba(255, 255, 255, 0.75);
	font-size: 0.925rem;
	background-color: rgba(134, 134, 139, 0.25);
	border-radius: 12px;
	padding: 0.5rem;
	color: ${({ theme }) => theme.palette.text.primary};
	cursor: default;
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
	recipientAddress: any;
	recipientENS: any;
	error: any;
}

const PlayerDares: React.FC<PlayerDaresProps> = ({ recipientAddress, recipientENS, error }) => {
	const theme = useTheme();

	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const sort = useSelector((state: { sort: number }) => state.sort);
	const filter = useSelector((state: { filter: number[] }) => state.filter);

	// console.log('filter', selectedChains);
	function getChainLogoComponent(chainId) {
		if (!chainId) return null;

		const LogoComponent = {
			1: EthereumLogo,
			11155111: EthereumLogo,
			137: PolygonLogo,
		}[chainId];

		return <LogoComponent style={{ display: 'flex', marginRight: '8px' }} width="18" height="18" alt="Logo" />;
	}

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	// Active Player Tasks
	const activePlayerTasks = useActivePlayerTasks(recipientAddress);
	const completedPlayerTasks = useCompletedPlayerTasks(recipientAddress);

	const [filteredActiveTasks, setFilteredActiveTasks] = useState([]);
	const [filteredCompletedTasks, setFilteredCompletedTasks] = useState([]);

	// console.log('filteredActiveTasks', filteredActiveTasks);

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
		// Combine tasks from all chains into a single array
		const combineTasks = (allTasks) => {
			return Object.values(allTasks).flat();
		};

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

		// Filter tasks by selected chains
		const filterBySelectedChains = (tasks, selectedChains) => {
			return tasks.filter((task) => {
				const taskChainIdNum = Number(task.chainId); // Convert to number
				return selectedChains?.includes(taskChainIdNum);
			});
		};

		// Combine, sort, and then filter tasks
		const combinedActiveTasks = combineTasks(activePlayerTasks);
		const combinedCompletedTasks = combineTasks(completedPlayerTasks);

		const sortedActiveTasks = sortTasks(combinedActiveTasks, sort);
		const sortedCompletedTasks = sortTasks(combinedCompletedTasks, sort);

		const filteredActiveTasks = filterBySelectedChains(sortedActiveTasks, filter);
		const filteredCompletedTasks = filterBySelectedChains(sortedCompletedTasks, filter);

		// Update the state with the filtered and sorted tasks
		setFilteredActiveTasks(filteredActiveTasks);
		setFilteredCompletedTasks(filteredCompletedTasks);
	}, [sort, activePlayerTasks, completedPlayerTasks, filter]); // Include 'selectedChains' in the dependencies array

	function formatCrypto(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});
	}

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Function to handle map click
	const handleMapClick = (latitude, longitude) => {
		router.push(`/map?lat=${latitude}&lng=${longitude}`);
	};

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
						<SelectFilter />
						<SelectSort />

						{/* <StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
								ETH
							</StyledToggleButton>
							<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup> */}
						{!error && (
							<CreateTaskBox>
								{account && account.toLowerCase() !== recipientAddress && (
									<CreateAtPlayer recipientAddress={recipientAddress} recipientENS={recipientENS} />
								)}
							</CreateTaskBox>
						)}
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{filteredActiveTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={`${tad.chainId}-${tad.id}`}>
							<TaskCard theme={theme}>
								<StyledInfo theme={theme}>
									{tad?.latitude && tad?.longitude !== '0' && (
										<StyledMap theme={theme} onClick={() => handleMapClick(tad.latitude, tad.longitude)}>
											<GoogleMaps style={{ fill: theme.palette.text.primary, display: 'flex', fontSize: '20px', marginRight: '0.5rem' }} />
											Google Map
										</StyledMap>
									)}
									<StyledNetwork theme={theme}>
										{getChainLogoComponent(tad?.chainId)}
										{CHAINS[tad.chainId].name}
									</StyledNetwork>
								</StyledInfo>
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
												{formatCrypto(tad?.entranceAmount)} {CHAINS[tad?.chainId].nameToken}
											</p>
										) : (
											<p>${formatNumber(tad?.entranceAmount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
										)}
										{currencyValue === false ? (
											<p>
												{formatCrypto(tad?.amount)} {CHAINS[tad?.chainId].nameToken}
											</p>
										) : (
											<p>${formatNumber(tad?.amount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
										)}
									</TaskBoxSectionTwo>
									<TaskButton>
										<Link href={`/dare/${tad.chainId}-${tad.id}`}>View Task</Link>
									</TaskButton>
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
						<SelectFilter />
						<SelectSort />

						{/* <StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
								ETH
							</StyledToggleButton>
							<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup> */}
						{!error && (
							<CreateTaskBox>
								{account && account.toLowerCase() !== recipientAddress && (
									<CreateAtPlayer recipientAddress={recipientAddress} recipientENS={recipientENS} />
								)}
							</CreateTaskBox>
						)}
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{filteredCompletedTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={`${tad.chainId}-${tad.id}`}>
							<TaskCard theme={theme}>
								<StyledNetwork theme={theme}>
									{getChainLogoComponent(tad?.chainId)}
									{CHAINS[tad.chainId].name}
								</StyledNetwork>
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
												{((tad?.entranceAmount / 1e18) * 1).toFixed(2)} {CHAINS[tad?.chainId].nameToken}
											</p>
										) : (
											<p>${formatNumber(tad?.entranceAmount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
										)}
										{currencyValue === false ? (
											<p>
												{((tad?.amount / 1e18) * 1).toFixed(2)} {CHAINS[tad?.chainId].nameToken}
											</p>
										) : (
											<p>${formatNumber(tad?.amount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
										)}
									</TaskBoxSectionTwo>
									<TaskButton onClick={() => router.push(`/dare/${tad.chainId}-` + tad.id)}>View Task</TaskButton>
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
