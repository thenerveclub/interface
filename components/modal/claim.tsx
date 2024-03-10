import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
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

interface RedeemUserProps {
	dareData: any;
}

const RedeemUser: React.FC<RedeemUserProps> = ({ dareData }) => {
	const theme = useTheme();
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// State
	const [pendingTx, setPendingTx] = useState(false);

	// Claim Function
	async function claim() {
		let shouldProceed = true;

		if (chainId !== dareData[0]?.task.chainId) {
			if (metaMask) {
				try {
					await metaMask.activate(Number(dareData[0]?.task?.chainId));
				} catch (error) {
					console.error(error);
					shouldProceed = false;
				}
			} else {
				try {
					await metaMask.activate(getAddChainParameters(Number(dareData[0]?.task?.chainId)));
				} catch (error) {
					console.error(error);
					shouldProceed = false;
				}
			}
		}

		if (shouldProceed) {
			const signer = provider.getSigner();
			const nerveGlobal = new ethers.Contract(CHAINS[dareData[0]?.task.chainId]?.contract, NerveGlobalABI, signer);

			try {
				setPendingTx(true);
				const tx = await nerveGlobal.claim(dareData[0]?.task.id);
				await tx.wait();
				if (tx.hash) {
					setPendingTx(false);
				}
			} catch (error) {
				setPendingTx(false);
				console.log(error);
			}
		}
	}

	return (
		<>
			{pendingTx ? (
				<BuyButton theme={theme} startIcon={<CircularProgress color="info" thickness={2.5} size={20} />} disabled={true}>
					Pending
				</BuyButton>
			) : (
				<BuyButton theme={theme} onClick={claim}>
					Redeem User
				</BuyButton>
			)}
		</>
	);
};

export default RedeemUser;
