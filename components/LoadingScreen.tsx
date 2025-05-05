'use client';

import localFont from 'next/font/local';
import React from 'react';

// Load TrueLies font
const trueLies = localFont({
	src: '../public/fonts/TrueLies.woff2',
	display: 'swap',
	variable: '--font-true-lies',
});

const LoadingScreen: React.FC = () => {
	return (
		<section
			className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden
				bg-background dark:bg-black text-secondary dark:text-white animate-pulse text-[3rem] font-normal ${trueLies.className}`}
		>
			NERVE
		</section>
	);
};

export default LoadingScreen;
