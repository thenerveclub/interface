'use client';

import React, { useEffect, useState } from 'react';

interface TimerCardProps {
	dareData: any;
}

const TimerCard: React.FC<TimerCardProps> = ({ dareData }) => {
	const [countdown, setCountdown] = useState('');

	const unixTimestamp = Number(dareData?.[0]?.task.endTask);

	const getFormattedCountdown = (endTimeUnix: number) => {
		const taskEndTime = new Date(endTimeUnix * 1000);
		const now = new Date();
		const timeLeft = taskEndTime.getTime() - now.getTime();

		if (timeLeft < 0) {
			return 'Task has ended';
		}

		const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
			.toString()
			.padStart(2, '0');
		const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			.toString()
			.padStart(2, '0');
		const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
			.toString()
			.padStart(2, '0');

		return `${days}d ${hours}h ${minutes}m ${seconds}s`;
	};

	useEffect(() => {
		const updateCountdown = () => setCountdown(getFormattedCountdown(unixTimestamp));
		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, [unixTimestamp]);

	if (!dareData) return null;

	return (
		<div className="flex flex-col w-full md:w-[95%] mx-auto bg-background border border-secondary rounded-xl backdrop-blur-md">
			{/* Header */}
			<div className="flex flex-col">
				<div className="flex flex-row justify-end items-center gap-4 w-full h-12 pr-4">
					<p className="text-base pl-4 pr-auto">Timer</p>
				</div>
				<hr className="border-b border-secondary w-full" />
			</div>

			{/* Countdown Display */}
			<div className="flex justify-center items-center h-20 text-lg">{countdown}</div>
		</div>
	);
};

export default TimerCard;
