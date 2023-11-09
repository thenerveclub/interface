import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { CHAINS } from '../../utils/chains';

const BuyButton = styled(Button)({
	color: '#000',
	textTransform: 'none',
	width: '100px',
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 1.5,
	height: '100%',
	backgroundColor: 'rgba(3, 161, 31, 0.75)',
	borderRadius: 5,
	'&:hover': {
		backgroundColor: 'rgba(3, 161, 31, 0.75)',
		transition: 'all 0.75s ease',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#0062cc',
	},
});

export default function RedeemUser() {
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// Get Task ID
	const path = (global.window && window.location.pathname)?.toString() || '';
	const taskNumber = path.split('/').pop();

	const [pendingTx, setPendingTx] = useState(false);

	// Join Function
	async function onRegisterName() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.redeemUser(taskNumber);
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
		<div>
			{pendingTx ? (
				<BuyButton startIcon={<CircularProgress color="info" thickness={2.5} size={20} />} disabled={true}>
					Pending
				</BuyButton>
			) : (
				<BuyButton onClick={onRegisterName}>Claim</BuyButton>
			)}
		</div>
	);
}
