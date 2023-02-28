import { useEffect, useState } from 'react';

const useTwitchLiveStatus = (twitchChannelName: string) => {
	const [isTwitchLive, setIsTwitchLive] = useState(false);

	useEffect(() => {
		if (!twitchChannelName) {
			return;
		}

		const fetchLiveStatus = async () => {
			try {
				const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${twitchChannelName}`, {
					headers: {
						'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_BEARER_TOKEN}`,
					},
				});

				const data = await response.json();
				setIsTwitchLive(!!data.data?.length);
			} catch (error) {
				console.error(error);
			}
		};

		// Call the function on first page load
		fetchLiveStatus();

		// Refresh the data when channelName changes
	}, [twitchChannelName]);

	return isTwitchLive;
};

export default useTwitchLiveStatus;

// Get Authorization Token
// const clientId = `'process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID'`;
// const clientSecret = `'process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET'`;
// const grantType = 'client_credentials';

// fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}`, {
// 	method: 'POST',
// })
// 	.then((response) => response.json())
// 	.then((data) => {
// 		const accessToken = data.access_token;
// 		console.log(`Access token: ${accessToken}`);
// 	})
// 	.catch((error) => console.error(error));
