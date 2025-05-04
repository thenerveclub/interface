'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function PortalModal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
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
		<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/50">{children}</div>,
		document.body
	);
}
