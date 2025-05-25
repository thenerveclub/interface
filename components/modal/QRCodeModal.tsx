'use client';

import { useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import QRCode from 'react-qr-code';
import PortalModal from '../PortalModal';

interface QRCodeModalProps {
	open: boolean;
	handleClose: () => void;
	qrCodeUrl: string;
}

export default function QRCodeModal({ open, handleClose, qrCodeUrl }: QRCodeModalProps) {
	const qrRef = useRef<SVGSVGElement | null>(null);

	const handleDownload = () => {
		if (!qrRef.current) return;

		const svg = qrRef.current;
		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d')!;
		const img = new Image();

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const png = canvas.toDataURL('image/png');

			const link = document.createElement('a');
			link.href = png;
			link.download = 'qr-code.png';
			link.click();
		};

		img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
	};

	return (
		<PortalModal isOpen={open} onClose={handleClose}>
			<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col relative">
				{/* Header */}
				<h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">QR Code</h2>

				{/* QR Code box with styling */}
				<div className="rounded-2xl border-8 border-accent p-4 shadow-xl dark:border-accent">
					<QRCode value={qrCodeUrl} size={150} fgColor="#000000" bgColor="#ffffff" ref={qrRef} />
				</div>

				{/* Download button */}
				<button
					onClick={handleDownload}
					className="mt-6 w-full px-6 py-3 rounded-md bg-accent text-white font-semibold hover:bg-accent/90 transition text-sm"
				>
					Download QR Code
				</button>

				{/* Close Button */}
				<div className="absolute md:hidden bottom-5 mb-10 left-0 right-0 flex justify-center">
					<button onClick={handleClose} className="px-4 py-3 bg-accent text-white rounded-md transition font-semibold">
						Close
					</button>
				</div>
			</div>
		</PortalModal>
	);
}
