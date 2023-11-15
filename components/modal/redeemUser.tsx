import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { CHAINS } from '../../utils/chains';

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
	id: string;
	dareData: any;
	chainIdUrl: number;
	network: string;
	isNetworkAvailable: boolean;
}

const RedeemUser: React.FC<RedeemUserProps> = ({ id, dareData, chainIdUrl, network, isNetworkAvailable }) => {
	const theme = useTheme();
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// State
	const [pendingTx, setPendingTx] = useState(false);

	// Join Function
	async function onRegisterName() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.redeemUser(id);
			enqueueSnackbar('Transaction signed succesfully!', {
				variant: 'success',
			});
			await tx.wait();
			if (tx.hash) {
				enqueueSnackbar('Transaction mined succesfully!', {
					variant: 'success',
				});
				setPendingTx(false);
			}
		} catch (error) {
			enqueueSnackbar('Transaction failed!', {
				variant: 'error',
			});
			setPendingTx(false);
			console.log(error);
		}
	}

	return (
		<>
			{pendingTx ? (
				<BuyButton theme={theme} startIcon={<CircularProgress color="info" thickness={2.5} size={20} />} disabled={true}>
					Pending
				</BuyButton>
			) : (
				<BuyButton theme={theme} onClick={onRegisterName}>
					Redeem User
				</BuyButton>
			)}
		</>
	);
};

export default RedeemUser;
