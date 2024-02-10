import styled from '@emotion/styled';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { Box, Fade, SpeedDial, SpeedDialIcon, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../../../components/LoadingScreen';
import BlacklistPlayer from '../../../../components/modal/blacklistPlayer';
import CreateTask from '../../../../components/modal/createTask';
import RegisterName from '../../../../components/modal/registerName';
import { useCheckNameRegister } from '../../../../hooks/useCheckNameRegister';
import usePlayerData from '../../../../hooks/usePlayerData';
import { CHAINS, nameToChainId } from '../../../../utils/chains';
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
	const network = router.query.network as string;

	// Name to Chain ID
	const chainIdUrl = nameToChainId[network];

	// Usernames
	const id = router.query.id as string;
	const playerID = id;

	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

	// Get data
	const registerStatus = useCheckNameRegister(isNetworkAvailable ? chainIdUrl : 137, playerID);

	// Address Checksumed And Lowercased
	const checksumAddress = registerStatus?.toLowerCase();
	const checksumAccount = account?.toLowerCase();

	const { playerData, isLoading } = usePlayerData(isNetworkAvailable ? chainIdUrl : 137, checksumAddress);

	// Copy Address To Clipboard && Tooltip
	const [copied, setCopied] = useState(false);
	function handleCopyAddress() {
		navigator.clipboard.writeText(playerData?.[0]?.id ? playerData?.[0]?.id.toUpperCase() : checksumAddress.toUpperCase());
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000); // Reset to "Copy Address" after 2 seconds
	}

	return (
		<>
			{isLoading ? (
				<LoadingScreen />
			) : (
				<StyledBox>
					<StyledSection>
						<StyledLeftSectionBox>
							<PlayerBox>
								{playerData?.[0]?.userName ? (
									<a>{playerData?.[0]?.userName}</a>
								) : (
									<a>
										{checksumAddress?.substring(0, 6)}...{checksumAddress?.substring(checksumAddress.length - 4)}
									</a>
								)}
								<a>
									{account ? (
										checksumAccount === checksumAddress ? (
											<RegisterName playerData={playerData} chainId={chainId} chainIdUrl={chainIdUrl} />
										) : (
											<BlacklistPlayer checksumAddress={checksumAddress} chainId={chainId} chainIdUrl={chainIdUrl} />
										)
									) : null}
								</a>
							</PlayerBox>
							<AddressBox>
								{playerData?.[0]?.id ? (
									<a>
										({playerData?.[0]?.id.substring(0, 6)}...{playerData?.[0]?.id.substring(playerData?.[0]?.id.length - 4)})
									</a>
								) : (
									<a>
										({checksumAddress?.substring(0, 6)}...{checksumAddress?.substring(checksumAddress?.length - 4)})
									</a>
								)}
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
								<Tooltip title="View On Explorer" placement="bottom" disableInteractive TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
									<a href={CHAINS[chainId]?.blockExplorerUrls[0] + 'address/' + playerData?.[0]?.id} target="_blank" style={{ cursor: 'pointer' }}>
										<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
									</a>
								</Tooltip>
							</AddressBox>
							<PlayerSocials
								checksumAddress={checksumAddress}
								checksumAccount={checksumAccount}
								playerData={playerData}
								chainId={chainId}
								chainIdUrl={chainIdUrl}
							/>
							<PlayerStatistics
								checksumAddress={checksumAddress}
								chainId={chainId}
								playerData={playerData}
								isNetworkAvailable={isNetworkAvailable}
								network={network}
							/>
						</StyledLeftSectionBox>
					</StyledSection>
					<PlayerDares
						registerStatus={registerStatus}
						checksumAddress={checksumAddress}
						checksumAccount={checksumAccount}
						network={network}
						chainIdUrl={chainIdUrl}
					/>
					<CreateTaskBox>
						{account && checksumAccount !== checksumAddress && (
							<CreateTask registerStatus={registerStatus} chainIdUrl={chainIdUrl} isNetworkAvailable={isNetworkAvailable} />
						)}
					</CreateTaskBox>
				</StyledBox>
			)}
		</>
	);
}
