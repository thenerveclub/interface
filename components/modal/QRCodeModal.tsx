'use client';

import { useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import QRCode from 'react-qr-code';
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

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
			<div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
				{/* Close Button */}
				<button onClick={handleClose} className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-800 dark:hover:text-white">
					<IoCloseOutline className="h-5 w-5" />
				</button>

				{/* QR Code */}
				<div className="flex flex-col items-center text-center">
					<div className="rounded-2xl border-8 border-blue-600 p-4 shadow-lg dark:border-blue-500">
						<QRCode value={qrCodeUrl} size={150} fgColor="#000000" bgColor="#ffffff" ref={qrRef} />
					</div>

					<button onClick={handleDownload} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
						Download QR Code
					</button>
				</div>
			</div>
		</div>
	);
}
