'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalModalProps {
	isOpen: boolean;
	children: React.ReactNode;
	onClose?: () => void;
}

export default function PortalModal({ isOpen, children, onClose }: PortalModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen || !mounted) return null;

	return createPortal(
		<div
			className={`fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
				isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full h-screen md:h-auto md:max-h-[90vh] md:w-[400px] flex items-center justify-center overflow-y-auto"
			>
				{children}
			</div>
		</div>,
		document.body
	);
}
