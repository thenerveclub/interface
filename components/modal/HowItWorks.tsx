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
			image: '/images/step1.png',
		},
		{
			title: 'Step 1: Join a Dare',
			description: 'Find a dare, join it before the deadline, and commit to the challenge.',
			image: '/images/step2.png',
		},
		{
			title: 'Step 2: Prove It',
			description: 'Record your proof, upload it on-chain, and await peer validation.',
			image: '/images/step3.png',
		},
		{
			title: 'Step 3: Earn & Vote',
			description: 'Get rewards if accepted. Or vote and decide others’ fate if you’re a voter.',
			image: '/images/step4.png',
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
			<button onClick={handleModalToggle} className="py-1 bg-transparent hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg">
				<div className="flex items-center justify-center">
					<IoSchoolOutline size={20} className="text-accent animate-[pulse_1.5s_ease-in-out_infinite]" />
				</div>
			</button>

			<PortalModal isOpen={open} onClose={handleModalToggle}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col relative">
					{/* Image with fade */}
					<div className="relative w-full h-48 md:h-56 mb-6">
						<Image src={steps[step].image} alt={steps[step].title} fill className="object-contain fade-bottom pointer-events-none" priority />
						<div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
					</div>

					<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">{steps[step].title}</h2>
					<p className="text-center text-base text-gray-600 dark:text-gray-300 mb-6">{steps[step].description}</p>

					{/* Progress Dots */}
					<div className="flex space-x-2 mb-6">
						{steps.map((_, i) => (
							<span key={i} className={`h-2 w-2 rounded-full ${i === step ? 'bg-accent' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
						))}
					</div>

					{/* Next Button */}
					<button onClick={handleNext} className="px-4 py-2 bg-accent text-white rounded-md transition font-semibold w-full">
						{isLastStep ? 'Got it' : 'Next'}
					</button>

					{/* Close Button for Mobile */}
					<div className="absolute md:hidden bottom-0 mb-10 left-0 right-0 flex justify-center">
						<button onClick={handleModalToggle} className="px-4 py-3 bg-accent text-white rounded-md transition font-semibold">
							Close
						</button>
					</div>
				</div>
			</PortalModal>
		</>
	);
}
