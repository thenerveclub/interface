'use client';

import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import QRCode from 'qrcode.react';
import QRCodeComponent from 'react-qr-code';

const ModalContainer = styled(Dialog)`
	.MuiBackdrop-root {
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(8px);
	}
`;

const ModalHeader = styled(Box)`
	display: flex;
	justify-content: flex-end;
	padding: 0.5rem;
`;

const QRCodeBox = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	text-align: center;

	canvas {
		border: 8px solid ${({ theme }) => theme.palette.primary.main};
		border-radius: 16px;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	}
`;

const DownloadButton = styled(Button)<{ theme: any }>`
	margin-top: 1rem;
	background-color: ${({ theme }) => theme.palette.primary.main};
	color: ${({ theme }) => theme.palette.primary.contrastText};
	text-transform: none;

	&:hover {
		background-color: ${({ theme }) => theme.palette.primary.dark};
	}
`;

interface QRCodeModalProps {
	open: boolean;
	handleClose: () => void;
	qrCodeUrl: string;
}

export default function QRCodeModal({ open, handleClose, qrCodeUrl }: QRCodeModalProps) {
	const theme = useTheme();

	const handleDownload = () => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		if (canvas) {
			const link = document.createElement('a');
			link.href = canvas.toDataURL();
			link.download = 'qr-code.png';
			link.click();
		}
	};

	return (
		<ModalContainer open={open} onClose={handleClose}>
			<DialogContent>
				<ModalHeader>
					<IconButton onClick={handleClose}>
						<Close />
					</IconButton>
				</ModalHeader>
				<QRCodeBox theme={theme}>
					{/* <QRCode
						value={qrCodeUrl}
						size={200}
						fgColor={theme.palette.text.primary}
						bgColor={theme.palette.background.default}
						imageSettings={{
							src: '/instagram-like-logo.png', // Add your custom center image/logo path
							height: 40,
							width: 40,
							excavate: true,
						      }}
					/> */}
					<QRCodeComponent value={qrCodeUrl} size={150} fgColor={theme.palette.text.primary} bgColor={theme.palette.background.default} />
					<DownloadButton theme={theme} onClick={handleDownload}>
						Download QR Code
					</DownloadButton>
				</QRCodeBox>
			</DialogContent>
		</ModalContainer>
	);
}
