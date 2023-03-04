import styled from '@emotion/styled';
import { Layers, LocalGasStation } from '@mui/icons-material';
import { Fade, IconButton, Tooltip } from '@mui/material';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CHAINS } from '../../utils/chains';
import { getProvider } from '../../utils/nerveGlobalProvider';
import Discord from '/public/svg/socials/discord.svg';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitter from '/public/svg/socials/twitter.svg';

const StyledFooter = styled.footer`
	width: auto;
	height: 40px;
	display: flex;
	flex: 1;
	margin: 5rem auto 0.5rem auto;
	justify-content: space-between;
	padding: 0 50px 0 50px;

	@media (max-width: 1155px) {
		display: block;
	}

	@media (max-width: 960px) {
		padding: 1rem;
	}
`;

const LeftItem = styled.div`
	flex: 1;
	text-align: left;
`;

const CenterItem = styled.div`
	flex: 1;
	text-align: center;

	// Gap between social icons
	& > *:not(:last-child) {
		margin-right: 1rem;
	}
`;

const RightItem = styled.div`
	flex: 1;
	text-align: right;
`;

const StyledPollingDot = styled.div`
	display: inline-block;
	width: 8px;
	height: 8px;
	min-height: 8px;
	min-width: 8px;
	border-radius: 50%;
`;

const LayersIconAnimated = styled(Layers)({
	// animation: `${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite`,
	color: 'rgba(0,128,0,1)',
});

const LocalGasStationIconAnimated = styled(LocalGasStation)({
	// animation: `${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite`,
	color: 'rgba(0,128,0,1)',
});

export default function BlockNumber() {
	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const provider = useSelector((state: { provider: any }) => state.provider);

	const memoizedChainId = useMemo(() => chainId, [chainId]);
	const { networkProvider } = getProvider(memoizedChainId);

	// TEST
	// const [blockNumber, setBlockNumber] = useState(0);
	// console.log('blockNumber', blockNumber);
	// useEffect(() => {
	// 	let isMounted = true;

	// 	const updateBlockNumber = (block: number) => {
	// 		if (isMounted) {
	// 			setBlockNumber(block);
	// 		}
	// 	};

	// 	if (provider) {
	// 		provider.getBlockNumber().then(updateBlockNumber);
	// 		provider.on('block', updateBlockNumber);
	// 	}

	// 	return () => {
	// 		isMounted = false;

	// 		if (provider) {
	// 			provider.removeListener('block', updateBlockNumber);
	// 		}
	// 	};
	// }, [provider]);
	// TEST END

	// let chainId = 137;
	// const [blockNumber, setBlockNumber] = useState(0);
	// const [gasPrice, setGasPrice] = useState('0');
	// const [isMountingBlock, setIsMountingBlock] = useState(false);
	// const [isMountingGas, setIsMountingGas] = useState(false);
	// const [lastGasPriceRendered, setLastGasPriceRendered] = useState(Date.now());

	// useEffect(() => {
	// 	// Get Block Height
	// 	const getBlock = async () => {
	// 		try {
	// 			const blockNumber = await networkProvider.getBlockNumber();
	// 			setBlockNumber(blockNumber);
	// 		} catch (error) {}
	// 	};
	// 	getBlock();
	// 	const intervalBlock = setInterval(getBlock, CHAINS[memoizedChainId]?.blockTime);

	// 	// Get Gas Price in gwei
	// 	const getGwei = async () => {
	// 		try {
	// 			const GasPrice = await networkProvider.getGasPrice();
	// 			const gweiPrice = ethers.utils.formatUnits(GasPrice, 'gwei');
	// 			const gwei = gweiPrice.split('.', 1).pop();
	// 			setGasPrice(gwei);
	// 		} catch (error) {}
	// 	};
	// 	getGwei();
	// 	const interval = setInterval(getGwei, CHAINS[memoizedChainId]?.blockTime);

	// 	return () => clearInterval(interval && intervalBlock);
	// }, [networkProvider]);

	// useEffect(
	// 	() => {
	// 		if (!blockNumber) {
	// 			return;
	// 		}

	// 		setIsMountingBlock(true);
	// 		const mountingTimerBlock = setTimeout(() => setIsMountingBlock(false), CHAINS[memoizedChainId]?.blockTime);

	// 		// this will clear Timeout when component unmount like in willComponentUnmount
	// 		return () => {
	// 			clearTimeout(mountingTimerBlock);
	// 		};
	// 	},
	// 	[blockNumber] //useEffect will run only one time
	// 	//if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
	// );

	// useEffect(() => {
	// 	if (!gasPrice) {
	// 		return;
	// 	}

	// 	setIsMountingGas(true);
	// 	const mountingTimerGas = setTimeout(() => setIsMountingGas(false), CHAINS[memoizedChainId]?.blockTime);

	// 	// this will clear Timeout when component unmount like in willComponentUnmount
	// 	return () => {
	// 		clearTimeout(mountingTimerGas);
	// 	};
	// }, [gasPrice]); //useEffect will run only one time when gasPrice changes

	// useEffect(() => {
	// 	setIsMountingGas(true);
	// 	const mountingTimerGas = setTimeout(() => setIsMountingGas(false), CHAINS[memoizedChainId]?.blockTime);
	// 	return () => clearTimeout(mountingTimerGas);
	// }, [gasPrice]);

	// useEffect(() => {
	// 	if (Date.now() - lastGasPriceRendered >= CHAINS[memoizedChainId]?.blockTime) {
	// 		console.log("It's been 10 seconds or more since the gasPrice was last rendered!");
	// 	}
	// 	setLastGasPriceRendered(Date.now());
	// }, [gasPrice]);

	return (
		<StyledFooter>
			<LeftItem></LeftItem>
			<CenterItem>
				<a target="_blank" rel="noreferrer" href="https://twitter.com/nerveglobal_">
					<Twitter style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 0.75)' }} />
				</a>
				<a target="_blank" rel="noreferrer" href="https://www.instagram.com/nerveglobal">
					<Instagram style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 0.75)' }} />
				</a>
				<a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@nerveglobal">
					<TikTok style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 0.75)' }} />
				</a>
				<a target="_blank" rel="noreferrer" href="https://discord.gg/Xuh5enTNB6">
					<Discord style={{ fontSize: '18px', fill: 'rgba(152, 161, 192, 0.75)' }} />
				</a>
			</CenterItem>
			<RightItem>Item 3</RightItem>
			{/* {memoizedChainId === 137 ? (
				<div>
					<Tooltip
						title={
							<>
								The current best guess of the gas amount for sending a transaction on L1. Gas fees are paid in Polygon's native currency Matic (MATIC)
								and denominated in GWEI.
								<div>
									<div>
										<StyledPollingDot style={{ backgroundColor: 'rgba(0,128,0,1)' }} /> Up to date
									</div>
									<div>
										<StyledPollingDot style={{ backgroundColor: 'rgba(130,71,229,1)' }} /> Last fetch {'<'} 10 seconds ago
									</div>
									<div>
										<StyledPollingDot style={{ backgroundColor: 'rgba(165,42,42,1)' }} /> Last fetch {'>'} 10 seconds ago
									</div>
								</div>
							</>
						}
						placement="top-start"
						disableInteractive
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<IconButton target="_blank" rel="noreferrer" href={'https://polygonscan.com/gastracker'} sx={{ color: '#5D6785', fontSize: '0.75rem' }}>
							{isMountingGas ? (
								<LocalGasStationIconAnimated fontSize="small" sx={{ mr: '0.5rem' }} />
							) : (
								<LocalGasStationIcon fontSize="small" sx={{ color: 'rgba(0,128,0,0.75)', mr: '0.5rem' }} />
							)}
							{gasPrice}
						</IconButton>
					</Tooltip>
					<Tooltip
						title="The most recent block height on this network. Prices update on every block."
						placement="top-start"
						disableInteractive
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<IconButton
							target="_blank"
							rel="noreferrer"
							href={`https://polygonscan.com/block/${blockNumber}`}
							sx={{ color: '#5D6785', fontSize: '0.75rem' }}
						>
							{isMountingBlock ? (
								<LayersIconAnimated fontSize="small" sx={{ mr: '0.5rem' }} />
							) : (
								<LayersIcon fontSize="small" sx={{ color: 'rgba(0,128,0,0.75)', mr: '0.5rem' }} />
							)}
							{blockNumber}
						</IconButton>
					</Tooltip>
				</div>
			) : memoizedChainId === 1 ? (
				<div>
					<Tooltip
						title="The current fast gas amount for sending a transaction on L1. Gas fees are paid in Ethereum's
                      native currency Ether (ETH) and denominated in GWEI."
						placement="top-start"
						disableInteractive
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<IconButton target="_blank" rel="noreferrer" href={'https://etherscan.io/gastracker'} sx={{ color: '#5D6785', fontSize: '0.75rem' }}>
							<LocalGasStationIcon fontSize="small" sx={{ mr: '0.5rem' }} />
							{gasPrice}
						</IconButton>
					</Tooltip>

					<Tooltip
						title="The most recent block height on this network. Prices update on every block."
						placement="top-start"
						disableInteractive
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<IconButton
							target="_blank"
							rel="noreferrer"
							href={`https://etherscan.io/block/${blockNumber}`}
							sx={{ color: '#5D6785', fontSize: '0.75rem' }}
						>
							{isMountingBlock ? (
								<LayersIconAnimated fontSize="small" sx={{ mr: '0.5rem' }} />
							) : (
								<LayersIcon fontSize="small" sx={{ color: 'rgba(0,128,0,0.75)', mr: '0.5rem' }} />
							)}
							{blockNumber}
						</IconButton>
					</Tooltip>
				</div>
			) : (
				<div>
					<Tooltip
						title="The most recent block height on this network. Prices update on every block."
						placement="top-start"
						disableInteractive
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<IconButton
							// target="_blank"
							// rel="noreferrer"
							// href={`https://etherscan.io/block/${blockNumber}`}
							sx={{ color: '#5D6785', fontSize: '0.75rem' }}
						>
							{isMountingBlock ? (
								<LayersIconAnimated fontSize="small" sx={{ mr: '0.5rem' }} />
							) : (
								<LayersIcon fontSize="small" sx={{ color: 'rgba(0,128,0,0.75)', mr: '0.5rem' }} />
							)}
							{blockNumber}
						</IconButton>
					</Tooltip>
				</div>
			)} */}
		</StyledFooter>
	);
}
