import styled from '@emotion/styled';
import { Box, Button, Fade, Grid, Link, Skeleton, Tab, Tabs, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectFilter from '../../../../components/SelectFilter';
import CreateTask from '../../../../components/modal/createTask';
import useActivePlayerTasks from '../../../../hooks/useActivePlayerTasks';
import useCompletedPlayerTasks from '../../../../hooks/useCompletedPlayerTasks';
import usePrice from '../../../../hooks/usePrice';
import { currencySlice } from '../../../../state/currency/currencySlice';
import { CHAINS } from '../../../../utils/chains';
import { CheckNameRegister } from '../../../../utils/validation/checkNameRegister';

const StyledTab = styled(Tab)`
	color: rgba(128, 128, 138, 1);
	font-size: 1rem;
	text-transform: none;
	min-width: 9.375rem;

	&.Mui-selected {
		border-bottom: 1px solid #fff;
		z-index: 1;
	}

	&.MuiTab-root {
		color: rgba(128, 128, 138, 1);

		&.Mui-selected {
			color: #fff;
		}
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

const StyledTabs = styled(Tabs)`
	@media (max-width: 600px) {
		width: 350px;
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
	background-color: rgba(38, 38, 56, 1);
	border: 1px solid rgba(74, 74, 98, 1);
	border-radius: 15px;
	height: 40px;
	width: 125px;
`;

const StyledToggleButton = styled(ToggleButton)`
	color: rgba(128, 128, 138, 1);

	&.Mui-selected {
		color: #fff;
		background-color: rgba(58, 58, 76, 1);
		border-radius: 15px;

		&:hover {
			background-color: rgba(58, 58, 76, 1);
		}
	}

	&:hover {
		background-color: rgba(58, 58, 76, 1);
		border-radius: 15px;
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

const TaskCard = styled(Box)`
	width: 350px;
	max-width: 350px;
	height: 300px;
	max-height: 300px;
	margin: 0 auto 0 auto;
	background-color: rgba(0, 0, 20, 0.25);
	backdrop-filter: blur(15px) brightness(70%);
	border: 1px solid;
	border-color: rgba(41, 50, 73, 1);
	border-radius: 24px;
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

export default function PlayerDares() {
	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Checked Name Register
	const [registerStatus] = CheckNameRegister();

	// Address Checksumed And Lowercased
	const checksumAddress = registerStatus?.toLowerCase();
	const checksumAccount = account?.toLowerCase();

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

	// Token Price
	const price = usePrice(chainId);

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	// Active Player Tasks
	const activePlayerTasks = useActivePlayerTasks(checksumAddress, chainId);
	const completedPlayerTasks = useCompletedPlayerTasks(checksumAddress, chainId);

	// Tab Panel
	function TabPanel(props: TabPanelProps) {
		const { children, value, index, ...other } = props;

		return (
			<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
				{value === index && <PanelBox>{children}</PanelBox>}
			</div>
		);
	}

	const [value, setValue] = useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<ActiveBox>
				<StyledTabs value={value} onChange={handleChange}>
					<StyledTab label="Active Tasks" disableRipple={true} />
					<StyledTab label="Completed Tasks" disableRipple={true} />
				</StyledTabs>
			</ActiveBox>
			<TabPanel value={value} index={0}>
				<ActiveFilterBox>
					{/* <ActiveTabLeftSection></ActiveTabLeftSection> */}
					<ActiveTabRightSection>
						{/* // Filter StyledSection */}
						<SelectFilter />

						<StyledToggleButtonGroup value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton disabled={currencyValue === false} value={false}>
								{isNetworkAvailable ? <a>{CHAINS[chainId]?.nameToken}</a> : <a>MATIC</a>}
							</StyledToggleButton>
							<StyledToggleButton disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
						{account ? checksumAccount !== checksumAddress ? <CreateTask /> : null : null}
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{activePlayerTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad}>
							<TaskCard>
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
											<a>${((tad?.amount / 1e18) * price).toFixed(2)}</a>
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
											<a>${((tad?.entranceAmount / 1e18) * price).toFixed(2)}</a>
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
									<a target="_blank" rel="noreferrer" href={'https://app.nerveglobal.com/dare/' + tad.id}>
										<TaskButton>View Task</TaskButton>
									</a>
								</TaskBoxButton>
							</TaskCard>
						</li>
					))}
				</ActiveTabSection>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ActiveFilterBox>
					{/* <ActiveTabLeftSection></ActiveTabLeftSection> */}
					<ActiveTabRightSection>
						<StyledToggleButtonGroup value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton disabled={currencyValue === false} value={false}>
								{isNetworkAvailable ? <a>{CHAINS[chainId]?.nameToken}</a> : <a>MATIC</a>}
							</StyledToggleButton>
							<StyledToggleButton disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
					</ActiveTabRightSection>
				</ActiveFilterBox>
				<ActiveTabSection>
					{completedPlayerTasks.map((tad) => (
						<li style={{ listStyle: 'none' }} key={tad.id}>
							<TaskCard>
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
											<a>${((tad?.amount / 1e18) * price).toFixed(2)}</a>
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
											<a>${((tad?.entranceAmount / 1e18) * price).toFixed(2)}</a>
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
									<a target="_blank" rel="noreferrer" href={'https://app.nerveglobal.com/dare/' + tad.id}>
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
}
