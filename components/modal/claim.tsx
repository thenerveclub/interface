import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { claimTriggerSlice } from '../../state/trigger/claimTriggerSlice';
import { CHAINS, getAddChainParameters } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';

const BuyButton = styled(Button)<{ theme: any }>`
	color: #fff;
	text-transform: none;
	font-size: 16px;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
	width: 90%;
	margin: 0 auto 0 auto;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}
`;

const ChangeNetworkButton = styled(Button)<{ theme: any }>`
	display: flex;
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	width: 150px;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	height: 100%;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	&:disabled {
		color: ${({ theme }) => theme.palette.secondary.main};
		background-color: ${({ theme }) => theme.palette.warning.dark};
	}
`;

interface RedeemUserProps {
	dareData: any;
}

const RedeemUser: React.FC<RedeemUserProps> = ({ dareData }) => {
	const theme = useTheme();
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();

	// Redux
	const dispatch = useDispatch();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// State
	const [pendingTx, setPendingTx] = useState(false);
	const network = dareData[0]?.task.chainId;

	// Claim Function
	async function claim() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[dareData[0]?.task.chainId]?.contract, NerveGlobalABI, signer);

		try {
			setPendingTx(true);
			const tx = await nerveGlobal.claim(dareData[0]?.task.id);
			await tx.wait();
			if (tx.hash) {
				// wait 2 seconds
				await new Promise((resolve) => setTimeout(resolve, 2000));
				dispatch(claimTriggerSlice.actions.setClaimTrigger(true));
				setPendingTx(false);
			}
		} catch (error) {
			setPendingTx(false);
			console.log(error);
		}
	}

	// Change Network
	const handleNetworkChange = async () => {
		if (metaMask) {
			try {
				await metaMask.activate(Number(network));
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				await metaMask.activate(getAddChainParameters(Number(network)));
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<>
			{chainId === Number(network) ? (
				pendingTx ? (
					<BuyButton theme={theme} startIcon={<CircularProgress color="info" thickness={2.5} size={20} />} disabled={true}>
						Pending
					</BuyButton>
				) : (
					<BuyButton theme={theme} onClick={claim} disabled={pendingTx}>
						Claim Reward
					</BuyButton>
				)
			) : (
				network && (
					<ChangeNetworkButton
						theme={theme}
						onClick={handleNetworkChange}
						startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
					>
						Change Network
					</ChangeNetworkButton>
				)
			)}
		</>
	);
};

export default RedeemUser;
