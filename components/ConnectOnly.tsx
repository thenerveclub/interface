import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import type { Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { useCallback, useState } from 'react';
import { getAddChainParameters } from '../utils/chains';
import { getLogo, getName } from '../utils/connectorsNameAndLogo';

const ConnectButton = styled(Button)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	justify-content: flex-start;
	font-size: 16px;
	font-weight: 500;
	height: 50px;
	background-color: ${({ theme }) => theme.palette.background.default};
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	transition: all 0.75s ease;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}
`;

export function ConnectOnly({
	connector,
	chainId,
	isActivating,
	isActive,
	error,
	setError,
}: {
	connector: MetaMask | WalletConnectV2 | CoinbaseWallet;
	chainId: ReturnType<Web3ReactHooks['useChainId']>;
	isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
	isActive: ReturnType<Web3ReactHooks['useIsActive']>;
	error: Error | undefined;
	setError: (error: Error | undefined) => void;
}) {
	const theme = useTheme();
	const [desiredChainId] = useState(137);

	const onClick = useCallback((): void => {
		setError(undefined);
		if (connector instanceof WalletConnectV2) {
			connector
				.activate(desiredChainId === -1 ? undefined : desiredChainId)
				.then(() => setError(undefined))
				.catch(setError);
		} else {
			connector
				.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
				.then(() => setError(undefined))
				.catch(setError);
		}
	}, [connector, desiredChainId, setError]);

	if (error) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<ConnectButton theme={theme} style={{ justifyContent: 'center' }} onClick={onClick}>
					Try {getName(connector)} again?
				</ConnectButton>
			</div>
		);
	} else if (isActivating) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<ConnectButton
					theme={theme}
					style={{ justifyContent: 'center' }}
					startIcon={<CircularProgress color="info" thickness={2.5} size={25} />}
					disabled={true}
				>
					Connecting
				</ConnectButton>
			</div>
		);
	} else if (isActive) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<ConnectButton
					theme={theme}
					onClick={() => {
						if (connector?.deactivate) {
							void connector.deactivate();
						} else {
							void connector.resetState();
						}
					}}
				>
					Disconnect
				</ConnectButton>
			</div>
		);
	} else {
		return (
			<>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<ConnectButton
						theme={theme}
						onClick={
							isActivating
								? undefined
								: () =>
										connector instanceof WalletConnectV2
											? connector
													.activate(desiredChainId === -1 ? undefined : desiredChainId)
													.then(() => setError(undefined))
													.catch(setError)
											: connector
													.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
													.then(() => setError(undefined))
													.catch(setError)
						}
						disabled={isActivating}
					>
						{getLogo(connector)}
						{getName(connector)}
					</ConnectButton>
				</div>
			</>
		);
	}
}
