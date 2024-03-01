import styled from '@emotion/styled';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { Box, Fade, SpeedDial, SpeedDialIcon, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import BlacklistPlayer from '../../../components/modal/blacklistPlayer';
import CreateTask from '../../../components/modal/createTask';
import RegisterName from '../../../components/modal/registerName';
import useENSName from '../../../hooks/useENSName';
import usePlayerData from '../../../hooks/usePlayerData';
import { CHAINS, nameToChainId } from '../../../utils/chains';
import PlayerDares from './components/PlayerDares';
import PlayerSocials from './components/PlayerSocials';
import PlayerStatistics from './components/PlayerStatistics';

const StyledSection = styled(Box)`
	display: flex;
	flex-direction: row;
	width: 100%;
`;

const StyledLeftSectionBox = styled(Box)`
	display: inline-flex;
	flex-direction: column;
	width: 50%;

	@media (max-width: 1024px) {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const StyledBox = styled(Box)`
	margin: 7.5rem 5rem auto 5rem;
	width: 90%;

	@media (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 5rem auto 0 auto;
	}
`;

const PlayerBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	text-align: left;
	align-items: center;

	a {
		font-size: 30px;
		cursor: default;
	}

	@media (max-width: 1024px) {
		justify-content: center;
		width: 100%;
		margin: 0 auto 0 auto;
	}
`;

const AddressBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 25px;
	text-align: left;
	align-items: center;

	a {
		color: rgba(128, 128, 138, 1);
		font-size: 14px;
		cursor: default;

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}

	@media (max-width: 1024px) {
		justify-content: center;
	}
`;

const CreateTaskBox = styled(Box)`
	display: none;
	visibility: hidden;

	@media (max-width: 1024px) {
		display: flex;
		visibility: visible;
	}
`;

export default function PlayerPage() {
	const theme = useTheme();
	const router = useRouter();

	// Usernames
	const id = router.query.id as string;

	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const ens = useSelector((state: { ens: string }) => state.ens);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Address Checksumed And Lowercased
	const checksumAccount = account?.toLowerCase();

	const { ensName, address } = useENSName(id);

	const { playerData, isLoading } = usePlayerData(137, address);

	// Copy Address To Clipboard && Tooltip
	const [copied, setCopied] = useState(false);
	function handleCopyAddress() {
		navigator.clipboard.writeText(playerData?.[0]?.id ? playerData?.[0]?.id.toUpperCase() : address.toUpperCase());
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000); // Reset to "Copy Address" after 2 seconds
	}

	const [word, setWord] = useState('');
	const localStorageKey = 'mySimpleWord';

	// Load the word from localStorage when the component mounts
	useEffect(() => {
		const savedWord = localStorage.getItem(localStorageKey);
		if (savedWord) {
			setWord(savedWord);
		}
	}, []);

	// Function to handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		localStorage.setItem(localStorageKey, word);
		alert('Word saved to localStorage!');
	};

	return (
		<>
			{isLoading ? (
				<LoadingScreen />
			) : (
				<StyledBox>
					<StyledSection>
						<StyledLeftSectionBox>
							<PlayerBox>
								<a>{ensName ? ensName : address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null}</a>
								<a>{account && checksumAccount !== address ? <BlacklistPlayer checksumAddress={address} chainId={chainId} /> : null}</a>
							</PlayerBox>
							<AddressBox>
								<a>
									({address?.substring(0, 6)}...{address?.substring(address?.length - 4)})
								</a>
								<Tooltip
									title={copied ? 'Copied!' : 'Copy Address'}
									placement="bottom"
									disableInteractive
									TransitionComponent={Fade}
									TransitionProps={{ timeout: 600 }}
								>
									<a onClick={handleCopyAddress} style={{ cursor: 'pointer' }}>
										<ContentCopy style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
									</a>
								</Tooltip>
							</AddressBox>
							<PlayerStatistics checksumAddress={address} chainId={chainId} playerData={playerData} />
						</StyledLeftSectionBox>
					</StyledSection>
					{/* <PlayerDares
						registerStatus={ensName}
						checksumAddress={address}
						checksumAccount={checksumAccount}
						network={network}
						chainIdUrl={chainIdUrl}
					/> */}

					<CreateTaskBox>{account && checksumAccount !== address && <CreateTask registerStatus={ensName} chainIdUrl={137} />}</CreateTaskBox>
				</StyledBox>
			)}
		</>
	);
}
