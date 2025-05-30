'use client';

import React from 'react';
import { FaDiscord, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
	return (
		<footer className="w-full py-8 bg-background text-text border-t border-gray-400 dark:border-secondary mb-24 md:mb-0">
			<div className="container mx-auto flex flex-col items-center space-y-6 sm:flex-row sm:justify-between sm:space-y-0">
				{/* Left Section (Optional for future use) */}
				<div className="flex-1 text-left hidden sm:block"></div>

				{/* Social Links */}
				<div className="flex space-x-6">
					<a target="_blank" rel="noreferrer" href="https://twitter.com/thenerveclub" className="group">
						<FaXTwitter className="w-6 h-6 fill-primary transition-transform group-hover:scale-110 group-hover:fill-accent" />
					</a>
					<a target="_blank" rel="noreferrer" href="https://www.instagram.com/thenerveclub" className="group">
						<FaInstagram className="w-6 h-6 fill-primary transition-transform group-hover:scale-110 group-hover:fill-accent" />
					</a>
					<a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@thenerveclub" className="group">
						<FaTiktok className="w-6 h-6 fill-primary transition-transform group-hover:scale-110 group-hover:fill-accent" />
					</a>
					<a target="_blank" rel="noreferrer" href="https://discord.gg/Xuh5enTNB6" className="group">
						<FaDiscord className="w-6 h-6 fill-primary transition-transform group-hover:scale-110 group-hover:fill-accent" />
					</a>
				</div>

				{/* Right Section (Optional for future use) */}
				<div className="flex-1 text-right hidden sm:block"></div>
			</div>

			{/* Bottom Section */}
			<div className="mt-8 text-[0.725rem] text-gray-500 dark:text-gray-400 text-center">
				© {new Date().getFullYear()} Nerve Global. All rights reserved.
			</div>
		</footer>
	);
}
