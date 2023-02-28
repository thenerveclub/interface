// import { useEffect, useState } from 'react';

// const useYouTubeLiveStatus = (youTubeChannelName: string) => {
// 	const [ID, setID] = useState(null);
// 	console.log('ID', ID);
// 	const [isYouTubeLive, setIsYouTubeLive] = useState(false);

// 	useEffect(() => {
// 		const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

// 		const fetchChannelId = async () => {
// 			try {
// 				const response = await fetch(
// 					`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${youTubeChannelName}&key=${apiKey}`
// 				);
// 				const data = await response.json();
// 				console.log('YOUTUBE DATA', data);
// 				const channelId = data.items[0].id;
// 				setID(channelId);
// 			} catch (error) {
// 				console.error(error);
// 			}
// 		};

// 		fetchChannelId();

// 		const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${ID}&part=id&eventType=live&type=video`;

// 		const fetchLiveStatus = async () => {
// 			try {
// 				const response = await fetch(apiUrl);
// 				const data = await response.json();
// 				setIsYouTubeLive(data.items.length > 0);
// 			} catch (error) {
// 				console.error(error);
// 			}
// 		};

// 		fetchLiveStatus();
// 	}, [youTubeChannelName]);

// 	return isYouTubeLive;
// };

// export default useYouTubeLiveStatus;
