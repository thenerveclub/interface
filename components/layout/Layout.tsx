'use client';

import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import Header from './Header';

type Props = {
	children?: ReactNode;
};

const Layout = ({ children }: Props) => {
	const pathname = usePathname();
	const is404 = pathname === '/404';

	// Redux state for theme
	const { currentTheme, prefersSystemSetting } = useSelector((state: any) => state.theme);

	// Dynamic height handling for responsive layouts
	const [dynamicHeight, setDynamicHeight] = useState<number>(0);

	// Handle dynamic height and window resizing
	useEffect(() => {
		const updateHeight = () => setDynamicHeight(window.innerHeight);
		updateHeight();
		window.addEventListener('resize', updateHeight);
		return () => window.removeEventListener('resize', updateHeight);
	}, []);

	// Manage theme (light/dark/system)
	useEffect(() => {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		if (prefersSystemSetting) {
			// Use system preference for dark mode
			document.documentElement.classList.toggle('dark', prefersDark);
		} else {
			// Use user preference for dark/light mode
			if (currentTheme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}, [currentTheme, prefersSystemSetting]);

	return (
		<div className="min-h-screen bg-background text-text flex flex-col">
			<Header />
			<main className={`flex-grow ${is404 ? 'justify-center' : ''}`} style={{ minHeight: dynamicHeight }}>
				{children}
			</main>
			{!pathname.includes('/map') && <Footer />}
		</div>
	);
};

export default Layout;
