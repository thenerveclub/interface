import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import type { Web3ReactHooks } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect';
import { useCallback, useState } from 'react';
import { getAddChainParameters } from '../chains';
import { getLogo, getName } from '../utils/web3Utils';

const ConnectButton = styled(Button)({
	color: '#000',
	textTransform: 'none',
	justifyContent: 'flex-start',
	fontSize: 16,
	fontWeight: 400,
	height: 50,
	backgroundColor: 'rgba(89, 89, 91, 1)',
	borderRadius: 5,
	'&:hover': {
		backgroundColor: 'rgba(102, 102, 114, 1)',
		transition: 'all 0.75s ease',
	},
});

export function ConnectOnly({
	connector,
	chainId,
	isActivating,
	isActive,
	error,
	setError,
}: {
	connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe;
	chainId: ReturnType<Web3ReactHooks['useChainId']>;
	isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
	isActive: ReturnType<Web3ReactHooks['useIsActive']>;
	error: Error | undefined;
	setError: (error: Error | undefined) => void;
}) {
	const isNetwork = connector instanceof Network;
	const [desiredChainId] = useState(137);

	const onClick = useCallback((): void => {
		setError(undefined);
		if (connector instanceof GnosisSafe) {
			connector
				.activate()
				.then(() => setError(undefined))
				.catch(setError);
		} else if (connector instanceof WalletConnect || connector instanceof Network) {
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
				<ConnectButton style={{ justifyContent: 'center' }} onClick={onClick}>
					Try {getName(connector)} again?
				</ConnectButton>
			</div>
		);
	} else if (isActivating) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<ConnectButton style={{ justifyContent: 'center' }} startIcon={<CircularProgress thickness={2.5} size={25} />} disabled={true}>
					Connecting
				</ConnectButton>
			</div>
		);
	} else if (isActive) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<ConnectButton
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
						onClick={
							isActivating
								? undefined
								: () =>
										connector instanceof GnosisSafe
											? void connector
													.activate()
													.then(() => setError(undefined))
													.catch(setError)
											: connector instanceof WalletConnect || connector instanceof Network
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
