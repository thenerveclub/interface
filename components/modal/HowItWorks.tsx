'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IoSchoolOutline } from 'react-icons/io5';
import PortalModal from '../PortalModal';

export default function HowItWorksModal() {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(0);

	const steps = [
		{
			title: 'Welcome to Nerve!',
			description: 'Earn money, fame, and glory by completing bold dares on the blockchain.',
			image: '/img/1.png',
		},
		{
			title: 'Step 1: Join a Dare',
			description: 'Find a dare, join it before the deadline, and commit to the challenge.',
			image: '/img/2.png',
		},
		{
			title: 'Step 2: Prove It',
			description: 'Record your proof, upload it on-chain, and await peer validation.',
			image: '/img/3.png',
		},
		{
			title: 'Step 3: Earn & Vote',
			description: 'Get rewards if accepted. Or vote and decide others’ fate if you’re a voter.',
			image: '/img/4.png',
		},
	];

	const handleModalToggle = () => {
		setOpen(!open);
		setStep(0);
	};

	const handleNext = () => {
		if (step < steps.length - 1) {
			setStep(step + 1);
		} else {
			setOpen(false);
		}
	};

	const isLastStep = step === steps.length - 1;

	return (
		<>
			<button
				onClick={handleModalToggle}
				className="py-1 mr-2 bg-transparent hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg"
			>
				<style>
					{`
          .custom-ping {
            animation: customPing 2.5s ease-in-out infinite;
          }
          @keyframes customPing {
            0%, 100% {
              color: #ff0000; /* Matches text-accent (red) */
              transform: scale(1);
            }
            50% {
              color: rgba(0, 0, 0, 0); /* Lighter red */
              transform: scale(1); /* Subtle scale */
            }
          }
        `}
				</style>
				<div className="flex items-center justify-center">
					<IoSchoolOutline size={22} className="text-accent custom-ping hidden md:block" />
					<IoSchoolOutline size={24} className="text-accent custom-ping block md:hidden" />
				</div>
			</button>

			<PortalModal isOpen={open} onClose={handleModalToggle}>
				<div className="bg-background rounded-lg shadow-lg w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col relative">
					{/* Image with fade */}
					<div className="relative w-full h-[60vh] md:h-96">
						<Image src={steps[step].image} alt={steps[step].title} fill className="object-cover fade-bottom pointer-events-none" priority />
						<div className="absolute inset-x-0 bottom-0 h-0 dark:h-64 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent pointer-events-none" />
					</div>

					<div className="flex flex-col items-center justify-center px-6 pb-6 pt-4">
						<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">{steps[step].title}</h2>
						<p className="text-center text-base text-gray-600 dark:text-gray-300 mb-6">{steps[step].description}</p>

						{/* Progress Dots */}
						<div className="flex space-x-2 mb-6">
							{steps.map((_, i) => (
								<span key={i} className={`h-2 w-2 rounded-full ${i === step ? 'bg-accent' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
							))}
						</div>

						{/* Next Button */}
						<button onClick={handleNext} className="py-2 px-4 bg-accent text-white rounded-md transition font-semibold w-full">
							{isLastStep ? 'Got it' : 'Next'}
						</button>
					</div>

					{/* Close Button for Mobile */}
					<div className="absolute md:hidden bottom-0 mb-10 left-0 right-0 flex justify-center">
						<button onClick={handleModalToggle} className="py-2 px-4 bg-accent text-white rounded-md transition font-semibold">
							Close
						</button>
					</div>
				</div>
			</PortalModal>
		</>
	);
}
