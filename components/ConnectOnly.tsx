import type { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import type { Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { useCallback, useState } from 'react';
import { getAddChainParameters } from '../utils/chains';
import { getLogo, getName } from '../utils/connectorsNameAndLogo';

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
				<div className="bg-secondary text-white py-3 px-4 rounded-lg mt-2 hover:bg-secondary flex justify-center items-center" onClick={onClick}>
					Try {getName(connector)} again?
				</div>
			</div>
		);
	} else if (isActivating) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div className="bg-secondary text-white py-3 px-4 rounded-lg mt-2 hover:bg-secondary flex justify-center items-center" onClick={onClick}>
					Connecting
				</div>
			</div>
		);
	} else if (isActive) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div
					className="bg-secondary text-white py-3 px-4 rounded-lg mt-2 hover:bg-secondary flex justify-center items-center"
					onClick={() => {
						if (connector?.deactivate) {
							void connector.deactivate();
						} else {
							void connector.resetState();
						}
					}}
				>
					Disconnect
				</div>
			</div>
		);
	} else {
		return (
			<>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div
						className="bg-secondary text-white py-3 px-4 rounded-lg mt-2 hover:bg-secondary flex justify-center items-center"
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
						// disabled={isActivating}
					>
						{/* {getLogo(connector)} */}
						{getName(connector)}
					</div>
				</div>
			</>
		);
	}
}
