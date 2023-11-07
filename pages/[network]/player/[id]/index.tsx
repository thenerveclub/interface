import styled from '@emotion/styled';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { Box, Fade, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import BlacklistPlayer from '../../../../components/modal/blacklistPlayer';
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

	@media (max-width: 600px) {
		width: 100%;
	}
`;

const StyledBox = styled(Box)`
	margin: 7.5rem 5rem auto 5rem;

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
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

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}

	@media (max-width: 600px) {
		justify-content: center;
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

	@media (max-width: 600px) {
		justify-content: center;
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

	const playerData = usePlayerData(isNetworkAvailable ? chainIdUrl : 137, checksumAddress);

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
		<StyledBox>
			<StyledSection>
				<StyledLeftSectionBox>
					<PlayerBox>
						{playerData?.[0]?.userName ? <a>{playerData?.[0]?.userName}</a> : <a>{checksumAddress?.toUpperCase()}</a>}
						<a>
							{account ? (
								checksumAccount === checksumAddress ? (
									<RegisterName />
								) : (
									<BlacklistPlayer checksumAddress={checksumAddress} chainId={chainId} />
								)
							) : null}
						</a>
					</PlayerBox>
					<AddressBox>
						{playerData?.[0]?.id ? (
							<a>
								({playerData?.[0]?.id.substring(0, 6)}...{playerData?.[0]?.id.substring(playerData?.[0]?.id.length - 4).toUpperCase()})
							</a>
						) : (
							<a>
								({checksumAddress?.substring(0, 6)}...{checksumAddress?.substring(checksumAddress?.length - 4).toUpperCase()})
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
					<PlayerSocials checksumAddress={checksumAddress} checksumAccount={checksumAccount} playerData={playerData} />
					<PlayerStatistics
						checksumAddress={checksumAddress}
						chainId={chainId}
						playerData={playerData}
						isNetworkAvailable={isNetworkAvailable}
						network={network}
					/>
				</StyledLeftSectionBox>
			</StyledSection>
			<PlayerDares registerStatus={registerStatus} checksumAddress={checksumAddress} checksumAccount={checksumAccount} network={network} />
		</StyledBox>
	);
}
