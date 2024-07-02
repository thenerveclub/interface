'use client';

import styled from '@emotion/styled';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { Box, Fade, SpeedDial, SpeedDialIcon, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import CreateAtPlayer from '../../../components/modal/create/createAtPlayer';
import usePlayerData from '../../../hooks/playerData/usePlayerData';
import useENSName from '../../../hooks/useENSName';
import PlayerDares from './components/PlayerDares';
import PlayerStatistics from './components/PlayerStatistics';

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	margin: 7.5rem auto 0 auto;
	width: 90%;

	@media (max-width: 750px) {
		width: 100%;
		margin: 5rem auto 0 auto;
	}
`;

const StyledSection = styled(Box)`
	display: flex;
	flex-direction: row;
	width: 100%;
`;

const StyledLeftSectionBox = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;

	@media (max-width: 750px) {
		justify-content: center;
		align-items: center;
		margin: 0 auto 0 auto;
	}
`;

// const PlayerBox = styled(Box)`
// 	display: flex;
// 	flex-direction: row;
// 	min-height: 50px;
// 	text-align: left;
// 	align-items: center;

// 	p {
// 		font-size: 30px;
// 		cursor: default;
// 		margin: 0;
// 	}

// 	@media (max-width: 750px) {
// 		flex-direction: column;
// 		justify-content: center;
// 		width: 100%;
// 		margin: 0 auto 0 auto;
// 	}
// `;

const PlayerBox = styled(Box)<{ imageUrl: string }>`
	position: relative;
	display: flex;
	flex-direction: row;
	min-height: 50px;
	text-align: left;
	align-items: center;

	p {
		font-size: 30px;
		cursor: default;
		margin: 0;
		z-index: 1;
	}

	@media (max-width: 750px) {
		flex-direction: column;
		justify-content: center;
		width: 100%;
		margin: 0 auto;
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: ${({ imageUrl }) => `url(${imageUrl})`};
		background-size: cover;
		background-position: center;
		filter: blur(20px);
		transform: scale(1);
		opacity: 0.5;
		z-index: -1;
	}

	img {
		z-index: 1;
		border-radius: 8px;
	}
`;

const AddressBox = styled(Box)`
	display: flex;
	flex-direction: row;
	min-height: 25px;
	text-align: left;
	align-items: center;

	p {
		color: rgba(128, 128, 138, 1);
		font-size: 14px;
		cursor: default;

		&:not(:last-child) {
			margin-right: 1rem;
		}
	}

	@media (max-width: 750px) {
		justify-content: center;
	}
`;

const CreateTaskBox = styled(Box)`
	display: none;
	visibility: hidden;

	@media (max-width: 750px) {
		display: flex;
		visibility: visible;
	}
`;

export default function PlayerPage({ params }: { params: { id: string } }) {
	const theme = useTheme();
	const router = useRouter();
	const pathname = usePathname();

	// Usernames
	const id = params.id;

	// console.log('id', id);

	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);

	// Address Checksumed And Lowercased
	const checksumAccount = account?.toLowerCase();

	const { ensName, address, error } = useENSName(id?.toLowerCase());

	const { playerData, isLoading } = usePlayerData(address, currencyPrice);

	// Copy Address To Clipboard && Tooltip
	const [copied, setCopied] = useState(false);
	function handleCopyAddress() {
		navigator.clipboard.writeText(address);
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
							<PlayerBox imageUrl={`https://euc.li/${ensName}`}>
								{ensName && <Image src={`https://euc.li/${ensName}`} alt="ENS Avatar" width={100} height={100} />}
								<p>{ensName ? ensName : address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null}</p>
							</PlayerBox>
							<AddressBox>
								<p>
									({address?.substring(0, 6)}...{address?.substring(address?.length - 4)})
								</p>
								<Tooltip
									title={copied ? 'Copied!' : 'Copy Address'}
									placement="bottom"
									disableInteractive
									enterTouchDelay={100}
									TransitionComponent={Fade}
									TransitionProps={{ timeout: 600 }}
								>
									<p onClick={handleCopyAddress} style={{ cursor: 'pointer' }}>
										<ContentCopy style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
									</p>
								</Tooltip>
								<Tooltip
									title="View On Explorer"
									placement="bottom"
									disableInteractive
									enterTouchDelay={100}
									TransitionComponent={Fade}
									TransitionProps={{ timeout: 600 }}
								>
									<a href={`https://etherscan.io/address/${address}#multichain-portfolio`} target="_blank" style={{ cursor: 'pointer' }}>
										<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
									</a>
								</Tooltip>
							</AddressBox>
							<PlayerStatistics playerData={playerData} checksumAddress={address} />
						</StyledLeftSectionBox>
					</StyledSection>
					<PlayerDares recipientAddress={address} recipientENS={ensName} error={error} />

					{!error && (
						<CreateTaskBox>
							{account && checksumAccount !== address && <CreateAtPlayer recipientAddress={address} recipientENS={ensName} />}
						</CreateTaskBox>
					)}
				</StyledBox>
			)}
		</>
	);
}
