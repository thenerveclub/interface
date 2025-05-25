'use client';

interface ProofCardProps {
	dareData: any;
}

const ProofCard: React.FC<ProofCardProps> = ({ dareData }) => {
	if (!dareData) return null;

	const getEmbedContent = (url: string) => {
		if (!url) return null;

		if (url.includes('twitch')) {
			const clipId = url.split('/').pop();
			const embedUrl = `https://clips.twitch.tv/embed?clip=${clipId}&parent=app.nerveglobal.com&parent=localhost`;
			return <iframe src={embedUrl} height="100%" width="100%" allowFullScreen frameBorder="0" scrolling="no" title="Twitch Clip" />;
		}

		if (url.includes('youtube')) {
			const videoId = url.split('v=')[1]?.split('&')[0];
			const embedUrl = `https://www.youtube.com/embed/${videoId}`;
			return <iframe src={embedUrl} height="100%" width="100%" allowFullScreen frameBorder="0" title="YouTube Video" />;
		}

		if (url.includes('instagram')) {
			return (
				<a href={url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
					View on Instagram
				</a>
			);
		}

		if (url.includes('tiktok')) {
			return (
				<a href={url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
					View on TikTok
				</a>
			);
		}

		return (
			<a href={url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
				{url}
			</a>
		);
	};

	const embedContent = getEmbedContent(dareData[0]?.task.proofLink);

	return (
		<div className="flex flex-col w-[70%] max-w-full mx-auto bg-background border border-secondary rounded-t-xl backdrop-blur-md md:w-[95%]">
			{/* Header */}
			<div className="flex flex-col">
				<div className="text-base font-medium px-4 py-3">Proof</div>
				<hr className="border-b border-secondary w-full" />
			</div>

			{/* Embed Container */}
			<div className="flex w-full max-w-full h-auto min-h-[500px] max-h-[500px] overflow-auto md:min-h-[auto] md:max-h-[300px]">{embedContent}</div>
		</div>
	);
};

export default ProofCard;
